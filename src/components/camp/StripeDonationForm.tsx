import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import axios from 'axios';
import toast from "react-hot-toast";
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

interface StripeDonationFormProps {
    amount: number;
    campaignId: string;
    onSuccess: () => void;
    onCancel: () => void;
}

export const StripeDonationForm: React.FC<StripeDonationFormProps> = ({
    amount,
    campaignId,
    onSuccess,
    onCancel,
}) => {
    const stripe = useStripe();
    const elements = useElements();
    const { user } = useAuth(); // Check if user is logged in
    const [isProcessing, setIsProcessing] = useState(false);
    const [guestName, setGuestName] = useState("");
    const [guestPhone, setGuestPhone] = useState("");
    const [guestEmail, setGuestEmail] = useState("");

    const URL = import.meta.env.VITE_BACKEND_URL;

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        // Validation for guest
        if (!user && (!guestName.trim() || !guestPhone.trim() || !guestEmail.trim())) {
            toast.error("Please enter your name, phone number and email");
            return;
        }

        const token = localStorage.getItem('token');
        setIsProcessing(true);

        try {
            const payload: any = { amount, campaignId };
            const headers: any = {};

            if (token) {
                headers.Authorization = `Bearer ${token}`;
            } else {
                payload.guestName = guestName;
                payload.guestPhone = guestPhone;
                payload.guestEmail = guestEmail;
            }

            // 1. Create Payment Intent on backend
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
                        name: user ? user.name : guestName,
                        phone: user ? undefined : guestPhone,
                        email: user ? user.email : guestEmail
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

                toast.success('Donation successful! Thank you for your support.');
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

            {!user && (
                <div className="space-y-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Name
                        </label>
                        <input
                            type="text"
                            value={guestName}
                            onChange={(e) => setGuestName(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500 transition-colors"
                            placeholder="Enter your full name"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={guestEmail}
                            onChange={(e) => setGuestEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500 transition-colors"
                            placeholder="Enter your email address"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            value={guestPhone}
                            onChange={(e) => setGuestPhone(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-500 transition-colors"
                            placeholder="Enter your phone number"
                            required
                        />
                    </div>
                </div>
            )}

            <div className="p-4 bg-gray-900/50 border border-gray-700 rounded-lg">
                <CardElement
                    options={{
                        style: {
                            base: {
                                fontSize: '16px',
                                color: '#ffffff',
                                '::placeholder': {
                                    color: '#aab7c4',
                                },
                            },
                            invalid: {
                                color: '#9e2146',
                            },
                        },
                    }}
                />
            </div>

            <div className="flex gap-4">
                <Button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 py-3 bg-gray-800 text-white hover:bg-gray-700"
                    disabled={isProcessing}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={!stripe || isProcessing}
                    className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold"
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
