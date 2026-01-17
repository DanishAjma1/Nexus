import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import axios from 'axios';
import toast from "react-hot-toast";
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

interface StripeDashboardPaymentFormProps {
    amount: number;
    paymentType?: 'verification' | 'subscription' | 'other';
    campaignId?: string;
    onSuccess: () => void;
    onCancel: () => void;
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

    const URL = import.meta.env.VITE_BACKEND_URL;

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        if (!user) {
            toast.error("Please log in to make a payment");
            return;
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
            // Note: Reusing create-payment-intent but without campaignId for dashboard payments
            // This might need a slightly different endpoint if specific logic is needed
            const { data: { clientSecret } } = await axios.post(
                `${URL}/payment/create-payment-intent`,
                payload,
                { headers }
            );

            // 2. Confirm payment on frontend
            const cardElement = elements.getElement(CardElement);
            if (!cardElement) return;

            const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement,
                    billing_details: {
                        name: user.name,
                        email: user.email
                    }
                },
            });

            if (error) {
                toast.error(error.message || 'Payment failed');
                setIsProcessing(false);
                return;
            }

            if (paymentIntent.status === 'succeeded') {
                // 3. Confirm and save on backend
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

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
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
