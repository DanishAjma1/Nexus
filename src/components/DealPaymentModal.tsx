import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import axios from 'axios';
import toast from "react-hot-toast";
import { Button } from './ui/Button';
import { useAuth } from '../context/AuthContext';
import { X } from 'lucide-react';

interface DealPaymentModalProps {
    deal: any;
    onClose: () => void;
    onSuccess: () => void;
}

export const DealPaymentModal: React.FC<DealPaymentModalProps> = ({
    deal,
    onClose,
    onSuccess,
}) => {
    const stripe = useStripe();
    const elements = useElements();
    const { user } = useAuth();
    const [isProcessing, setIsProcessing] = useState(false);
    const [amount, setAmount] = useState<number>(deal.investmentAmount || 0);

    const URL = import.meta.env.VITE_BACKEND_URL;

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        if (amount < deal.investmentAmount) {
            toast.error(`Amount cannot be less than the agreed investment of $${deal.investmentAmount}`);
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            toast.error("You must be logged in to pay");
            return;
        }

        setIsProcessing(true);

        try {
            // 1. Create Payment Intent
            const { data: { clientSecret } } = await axios.post(
                `${URL}/payment/create-deal-payment-intent`,
                { dealId: deal._id, amount },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // 2. Confirm Card Payment
            const cardElement = elements.getElement(CardElement);
            if (!cardElement) return;

            const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement,
                    billing_details: {
                        name: user?.name,
                        email: user?.email,
                    }
                },
            });

            if (error) {
                toast.error(error.message || 'Payment failed');
                setIsProcessing(false);
                return;
            }

            if (paymentIntent.status === 'succeeded') {
                // 3. Confirm on Backend
                await axios.post(
                    `${URL}/payment/confirm-deal-payment`,
                    { paymentIntentId: paymentIntent.id, dealId: deal._id },
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                toast.success('Investment payment successful! Waiting for admin approval.');
                onSuccess();
                onClose();
            }
        } catch (err: any) {
            console.error('Payment Error:', err);
            toast.error(err.response?.data?.message || 'Something went wrong with the payment');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex justify-center items-center z-[9999] px-4">
            <div className="bg-white rounded-xl w-full max-w-md relative shadow-2xl">
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-xl font-bold text-gray-900">Secure Payment</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Investment Amount ($)
                        </label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            min={deal.investmentAmount}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Minimum allowed: ${deal.investmentAmount?.toLocaleString()}
                        </p>
                    </div>

                    {/* Test Mode Helper */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
                        <p className="font-semibold mb-1">Test Mode Enabled</p>
                        <p>Use this test card to simulate a successful payment:</p>
                        <div className="flex items-center gap-2 mt-2 font-mono bg-white px-2 py-1 rounded border border-blue-100 w-fit">
                            <span>4242 4242 4242 4242</span>
                        </div>
                        <div className="flex gap-4 mt-1 text-xs text-blue-600">
                            <span>MM/YY: Any future (e.g., 12/34)</span>
                            <span>CVC: Any (e.g., 123)</span>
                            <span>Zip: Any (e.g., 12345)</span>
                        </div>
                    </div>

                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                        <div className="mb-2 flex justify-between text-sm text-gray-600">
                            <span>Card Details</span>
                            <div className="flex gap-1">
                                {/* Icons could go here */}
                            </div>
                        </div>
                        <CardElement
                            options={{
                                style: {
                                    base: {
                                        fontSize: '16px',
                                        color: '#424770',
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

                    <div className="space-y-3">
                        <Button
                            type="submit"
                            disabled={!stripe || isProcessing}
                            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all"
                        >
                            {isProcessing ? 'Processing...' : `Pay $${amount.toLocaleString()}`}
                        </Button>
                        <p className="text-xs text-center text-gray-500">
                            Funds will be held securely until admin approval.
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};
