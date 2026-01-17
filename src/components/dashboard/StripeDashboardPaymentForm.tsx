import React, { useState, useEffect, useRef } from 'react';
import { useStripe, useElements, CardElement, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import axios from 'axios';
import toast from "react-hot-toast";
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import { CreditCard } from 'lucide-react';

interface StripeDashboardPaymentFormProps {
    amount: number;
    paymentType?: 'verification' | 'subscription' | 'other';
    campaignId?: string;
    onSuccess: () => void;
    onCancel: () => void;
}

interface DefaultCard {
    id: string;
    cardNumber: string;
    cardholderName: string;
    expiryMonth: string;
    expiryYear: string;
    cvv: string;
}

export const StripeDashboardPaymentForm: React.FC<StripeDashboardPaymentFormProps> = ({
    amount,
    paymentType,
    campaignId,
    onSuccess,
    onCancel,
}) => {
    const stripe = useStripe();
    const elements = useElements();
    const { user } = useAuth();
    const [isProcessing, setIsProcessing] = useState(false);
    const [defaultCard, setDefaultCard] = useState<DefaultCard | null>(null);
    const [isLoadingCard, setIsLoadingCard] = useState(false);
    const [useDefaultCard, setUseDefaultCard] = useState(false);
    const [cvvError, setCvvError] = useState<string | null>(null);
    const cardNumberElementRef = useRef<any>(null);
    const cardExpiryElementRef = useRef<any>(null);

    const URL = import.meta.env.VITE_BACKEND_URL;

    // Fetch default card when component mounts (only for campaign contributions)
    useEffect(() => {
        const fetchDefaultCard = async () => {
            if (!campaignId || !user) return;
            
            // Only for entrepreneur or investor roles
            if (user.role !== 'entrepreneur' && user.role !== 'investor') return;

            try {
                setIsLoadingCard(true);
                const token = localStorage.getItem('token');
                const response = await axios.get(`${URL}/user/cards`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const cards = response.data.cards || [];
                const defaultCardData = cards.find((card: any) => card.isDefault);

                if (defaultCardData) {
                    // Fetch full card details
                    const cardResponse = await axios.get(`${URL}/user/cards/${defaultCardData.id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    const fullCard = cardResponse.data.card;
                    setDefaultCard({
                        id: fullCard.id,
                        cardNumber: fullCard.cardNumber,
                        cardholderName: fullCard.cardholderName,
                        expiryMonth: fullCard.expiryMonth,
                        expiryYear: fullCard.expiryYear,
                        cvv: '', // CVV is never stored
                    });
                    setUseDefaultCard(true);
                }
            } catch (error: any) {
                console.error('Error fetching default card:', error);
                // Silently fail - user can still use manual entry
            } finally {
                setIsLoadingCard(false);
            }
        };

        fetchDefaultCard();
    }, [campaignId, user, URL]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe) {
            return;
        }

        if (!user) {
            toast.error("Please log in to make a payment");
            return;
        }

        // Validate elements if using default card
        if (useDefaultCard && defaultCard) {
            if (!elements) {
                toast.error("Payment form not ready");
                return;
            }
            const cardNumberElement = elements.getElement(CardNumberElement);
            const cvcElement = elements.getElement(CardCvcElement);
            if (!cardNumberElement || !cvcElement) {
                toast.error("Card fields are not ready");
                return;
            }
        }

        const token = localStorage.getItem('token');
        setIsProcessing(true);

        try {
            const payload: any = {
                amount,
                paymentType: paymentType || (campaignId ? 'donation' : 'other'),
                campaignId,
                description: campaignId
                    ? `Donation for campaign ${campaignId}`
                    : `Dashboard ${paymentType || 'other'} payment`
            };
            const headers: any = { Authorization: `Bearer ${token}` };

            // 1. Create Payment Intent on backend
            const { data: { clientSecret } } = await axios.post(
                `${URL}/payment/create-payment-intent`,
                payload,
                { headers }
            );

            let paymentMethodId: string;

            // 2. Create payment method
            if (useDefaultCard && defaultCard) {
                // Use default card with Stripe Elements
                // When using split card elements, we pass CardNumberElement and Stripe
                // automatically finds CardExpiryElement and CardCvcElement on the same form
                const cardNumberElement = elements?.getElement(CardNumberElement);
                if (!cardNumberElement) {
                    toast.error("Card number field is not ready");
                    setIsProcessing(false);
                    return;
                }

                // Create payment method using Stripe Elements
                // Stripe will automatically use CardExpiryElement and CardCvcElement
                // from the same Elements provider
                const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
                    type: 'card',
                    card: cardNumberElement,
                    billing_details: {
                        name: defaultCard.cardholderName,
                        email: user.email
                    }
                });

                if (pmError || !paymentMethod) {
                    toast.error(pmError?.message || 'Failed to create payment method');
                    setIsProcessing(false);
                    return;
                }

                paymentMethodId = paymentMethod.id;
            } else {
                // Use CardElement for manual entry
                if (!elements) {
                    toast.error("Payment form not ready");
                    setIsProcessing(false);
                    return;
                }

                const cardElement = elements.getElement(CardElement);
                if (!cardElement) {
                    toast.error("Card element not found");
                    setIsProcessing(false);
                    return;
                }

                const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
                    type: 'card',
                    card: cardElement,
                    billing_details: {
                        name: user.name,
                        email: user.email
                    }
                });

                if (pmError || !paymentMethod) {
                    toast.error(pmError?.message || 'Failed to create payment method');
                    setIsProcessing(false);
                    return;
                }

                paymentMethodId = paymentMethod.id;
            }

            // 3. Confirm payment with payment method
            const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: paymentMethodId,
            });

            if (error) {
                toast.error(error.message || 'Payment failed');
                setIsProcessing(false);
                return;
            }

            if (paymentIntent.status === 'succeeded') {
                // 4. Confirm and save on backend
                const confirmPayload = {
                    ...payload,
                    paymentIntentId: paymentIntent.id
                };

                await axios.post(
                    `${URL}/payment/confirm-payment`,
                    confirmPayload,
                    { headers }
                );

                toast.success('Payment successful!');
                onSuccess();
            }
        } catch (err: any) {
            console.error('Payment Error:', err);
            toast.error(err.response?.data?.message || 'Something went wrong with the payment');
        } finally {
            setIsProcessing(false);
        }
    };

    // Format card number for display (mask all but last 4)
    const formatCardNumber = (cardNumber: string) => {
        const cleaned = cardNumber.replace(/\s/g, '');
        if (cleaned.length < 4) return cardNumber;
        const last4 = cleaned.slice(-4);
        return `•••• •••• •••• ${last4}`;
    };

    return (
    <form onSubmit={handleSubmit} className="space-y-6">
        {isLoadingCard ? (
            <div className="text-center py-4 text-gray-500">Loading card information...</div>
        ) : useDefaultCard && defaultCard ? (
            // Show default card with CVV input
            <div className="space-y-4">
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                            <CreditCard className="text-primary-600" size={20} />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Default Card</p>
                            <p className="text-sm font-bold text-gray-900">{defaultCard.cardholderName}</p>
                        </div>
                    </div>
                    
                    <div className="space-y-3">
                        {/* Display card info as read-only reference */}
                        <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
                            <p className="text-xs text-blue-700 font-semibold mb-2">Your Default Card</p>
                            <p className="text-sm font-mono text-gray-900">{formatCardNumber(defaultCard.cardNumber)}</p>
                            <p className="text-xs text-gray-600 mt-1">Expires: {defaultCard.expiryMonth}/{defaultCard.expiryYear}</p>
                        </div>
                        
                        {/* Stripe Elements for card details - user needs to enter to match displayed card */}
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                                    Card Number (Enter to verify)
                                </label>
                                <div className="p-3 bg-white border border-gray-200 rounded-lg">
                                    <CardNumberElement
                                        options={{
                                            style: {
                                                base: {
                                                    fontSize: '16px',
                                                    color: '#111827',
                                                    '::placeholder': {
                                                        color: '#9ca3af',
                                                    },
                                                },
                                                invalid: {
                                                    color: '#dc2626',
                                                },
                                            },
                                            placeholder: '1234 5678 9012 3456',
                                        }}
                                    />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                                        Expiry Date
                                    </label>
                                    <div className="p-3 bg-white border border-gray-200 rounded-lg">
                                        <CardExpiryElement
                                            options={{
                                                style: {
                                                    base: {
                                                        fontSize: '16px',
                                                        color: '#111827',
                                                        '::placeholder': {
                                                            color: '#9ca3af',
                                                        },
                                                    },
                                                    invalid: {
                                                        color: '#dc2626',
                                                    },
                                                },
                                                placeholder: 'MM/YY',
                                            }}
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                                        CVV
                                    </label>
                                    <div className="p-3 bg-white border border-gray-200 rounded-lg">
                                        <CardCvcElement
                                            options={{
                                                style: {
                                                    base: {
                                                        fontSize: '16px',
                                                        color: '#111827',
                                                        '::placeholder': {
                                                            color: '#9ca3af',
                                                        },
                                                    },
                                                    invalid: {
                                                        color: '#dc2626',
                                                    },
                                                },
                                                placeholder: '123',
                                            }}
                                            onChange={(e) => {
                                                setCvvError(e.error?.message || null);
                                            }}
                                        />
                                    </div>
                                    {cvvError && (
                                        <p className="mt-1 text-xs text-red-600">{cvvError}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                        
                        <p className="text-xs text-gray-500 italic">
                            Please enter your card details above to match your default card, or use browser autofill.
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => {
                        setUseDefaultCard(false);
                        setCvvError(null);
                    }}
                    className="text-sm text-primary-600 hover:text-primary-700 underline"
                >
                    Use a different card
                </button>
            </div>
        ) : (
            // Show manual card entry
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                <CardElement
                    options={{
                        style: {
                            base: {
                                fontSize: '16px',
                                color: '#111827',
                                '::placeholder': {
                                    color: '#9ca3af',
                                },
                            },
                            invalid: {
                                color: '#dc2626',
                            },
                        },
                    }}
                />
            </div>
        )}

        <div className="flex gap-4">
            <Button
                type="button"
                onClick={onCancel}
                variant="outline"
                className="flex-1 py-3"
                disabled={isProcessing}
            >
                Cancel
            </Button>
            <Button
                type="submit"
                disabled={!stripe || isProcessing}
                className="flex-1 py-3 bg-primary-600 text-white font-semibold"
            >
                {isProcessing ? 'Processing...' : `Pay $${amount}`}
            </Button>
        </div>

        <p className="text-xs text-center text-gray-500">
            Secure payment powered by Stripe
        </p>
    </form>
);
};
