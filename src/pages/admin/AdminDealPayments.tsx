import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { toast } from "react-hot-toast";
import { CheckCircle, Clock, X } from "lucide-react";

const URL = import.meta.env.VITE_BACKEND_URL;

export const AdminDealPayments: React.FC = () => {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; transactionId: string | null }>({
        isOpen: false,
        transactionId: null,
    });

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${URL}/payment/admin/deal-transactions`);
            setTransactions(res.data);
        } catch (error) {
            console.error("Error fetching transactions:", error);
            toast.error("Failed to load transactions.");
        } finally {
            setLoading(false);
        }
    };

    const handleReleaseFunds = async (transactionId: string) => {
        setConfirmModal({ isOpen: true, transactionId });
    };

    const confirmReleaseFunds = async () => {
        if (!confirmModal.transactionId) return;

        try {
            await axios.post(`${URL}/payment/admin/release-funds`, { transactionId: confirmModal.transactionId });
            toast.success("Funds released successfully!");
            setConfirmModal({ isOpen: false, transactionId: null });
            fetchTransactions();
        } catch (error: any) {
            const msg = error.response?.data?.message || "Failed to release funds";
            const isKycBlock = error.response?.status === 400 && msg.toLowerCase().includes("kyc");

            if (isKycBlock) {
                toast.error("Entrepreneur KYC not verified. They were notified to complete it.");
            } else {
                toast.error(msg);
            }
            setConfirmModal({ isOpen: false, transactionId: null });
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Loading payment records...</div>;

    return (
        <div className="space-y-6 animate-fade-in p-4">
            <h1 className="text-2xl font-bold text-gray-900">Deal Payment Records</h1>

            {transactions.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <p className="text-gray-500">No deal payments recorded yet.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {transactions.map((tx) => (
                        <Card key={tx._id} className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                            <CardBody className="flex flex-col md:flex-row justify-between items-center gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-sm font-semibold text-gray-900">
                                            {tx.dealId?.investmentAmount ? `Deal Investment` : 'Deal Payment'}
                                        </span>
                                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${tx.status === 'released' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {tx.status === 'released' ? 'Funds Released' : 'Held in Escrow'}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900">
                                        ${tx.amount?.toLocaleString()}
                                    </h3>
                                    <div className="text-sm text-gray-500 mt-2 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
                                        <p>From: <span className="font-medium text-gray-700">{tx.investorId?.name}</span> ({tx.investorId?.email})</p>
                                        <p>To: <span className="font-medium text-gray-700">{tx.entrepreneurId?.name}</span> ({tx.entrepreneurId?.email})</p>
                                        <p className="col-span-full text-xs text-gray-400 mt-1">Payment ID: {tx.paymentIntentId}</p>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-2 min-w-[150px]">
                                    {tx.status === 'released' ? (
                                        <div className="flex items-center text-green-600 font-medium">
                                            <CheckCircle size={18} className="mr-1.5" />
                                            Released
                                        </div>
                                    ) : (
                                        <Button
                                            onClick={() => handleReleaseFunds(tx._id)}
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white w-full md:w-auto"
                                        >
                                            Release Funds
                                        </Button>
                                    )}
                                    <p className="text-xs text-gray-400">
                                        {new Date(tx.createdAt).toLocaleDateString()} {new Date(tx.createdAt).toLocaleTimeString()}
                                    </p>
                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            )}

            {/* Confirmation Modal */}
            {confirmModal.isOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50"
                    onClick={() => setConfirmModal({ isOpen: false, transactionId: null })}
                >
                    <div 
                        className="bg-white rounded-lg shadow-2xl p-6 max-w-md w-full mx-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-bold text-gray-900">Confirm Fund Release</h3>
                            <button
                                onClick={() => setConfirmModal({ isOpen: false, transactionId: null })}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to release these funds to the entrepreneur? This action cannot be undone.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <Button
                                variant="outline"
                                onClick={() => setConfirmModal({ isOpen: false, transactionId: null })}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={confirmReleaseFunds}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                            >
                                Confirm Release
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
