import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { toast } from "react-hot-toast";
import { DealForm } from "../../components/DealForm";
import { X, Search } from "lucide-react";

const URL = import.meta.env.VITE_BACKEND_URL;

export const AdminDealsPage: React.FC = () => {
    const [deals, setDeals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [selectedDeal, setSelectedDeal] = useState<any>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);

    useEffect(() => {
        fetchDeals();
    }, []);

    const fetchDeals = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${URL}/deal/get-all-deals`);
            setDeals(res.data);
        } catch (error) {
            console.error("Error fetching deals:", error);
            toast.error("Failed to load deals.");
        } finally {
            setLoading(false);
        }
    };

    const openViewModal = (deal: any) => {
        setSelectedDeal(deal);
        setIsViewModalOpen(true);
    };

    const startDateObj = startDate ? new Date(startDate) : null;
    const endDateObj = endDate ? new Date(endDate) : null;
    if (endDateObj) endDateObj.setHours(23, 59, 59, 999);

    const filteredDeals = deals.filter((deal) => {
        const term = searchTerm.toLowerCase();
        const createdAt = deal.createdAt ? new Date(deal.createdAt) : null;

        const matchesDate = !createdAt
            ? !(startDateObj || endDateObj)
            : (!startDateObj || createdAt >= startDateObj) && (!endDateObj || createdAt <= endDateObj);

        return (
            (
                deal.investorId?.name?.toLowerCase().includes(term) ||
                deal.entrepreneurId?.name?.toLowerCase().includes(term) ||
                deal.entrepreneurId?.startupName?.toLowerCase().includes(term) ||
                deal.status?.toLowerCase().includes(term)
            ) && matchesDate
        );
    });

    if (loading) return <div className="p-4">Loading deals...</div>;

    return (
        <div className="space-y-6 animate-fade-in p-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">All Deal Records</h1>
                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search deals..."
                            className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <input
                        type="date"
                        className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        aria-label="Start date"
                    />
                    <input
                        type="date"
                        className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        aria-label="End date"
                    />
                </div>
            </div>

            {filteredDeals.length === 0 ? (
                <p>No deals found.</p>
            ) : (
                <div className="space-y-4">
                    {filteredDeals.map((deal) => (
                        <Card key={deal._id}>
                            <CardHeader className="flex justify-between items-center bg-gray-50/50">
                                <div className="flex gap-4 items-center">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide">Investor</p>
                                        <h3 className="text-sm font-semibold text-gray-900">
                                            {deal.investorId?.name || "Unknown"}
                                        </h3>
                                        <p className="text-xs text-gray-400">{deal.investorId?.email}</p>
                                    </div>
                                    <div className="h-8 w-px bg-gray-300"></div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide">Entrepreneur</p>
                                        <h3 className="text-sm font-semibold text-gray-900">
                                            {deal.entrepreneurId?.name || "Unknown"}
                                        </h3>
                                        <p className="text-xs text-gray-400">{deal.entrepreneurId?.startupName}</p>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <span
                                        className={`inline-block text-sm font-medium px-3 py-1 rounded-full mb-1 ${deal.status === "pending"
                                            ? "bg-yellow-100 text-yellow-800"
                                            : deal.status === "accepted"
                                                ? "bg-green-100 text-green-800"
                                                : deal.status === "negotiating"
                                                    ? "bg-blue-100 text-blue-800"
                                                    : "bg-red-100 text-red-800"
                                            }`}
                                    >
                                        {deal.status.charAt(0).toUpperCase() + deal.status.slice(1)}
                                    </span>
                                    {deal.paymentStatus === 'funds_released' && (
                                        <span className="inline-block text-sm font-medium px-3 py-1 rounded-full mb-1 ml-2 bg-green-100 text-green-800 border border-green-200 shadow-sm">
                                            Payment Approved
                                        </span>
                                    )}
                                    <p className="text-xs text-gray-400">Created: {new Date(deal.createdAt).toLocaleDateString()}</p>
                                </div>
                            </CardHeader>
                            <CardBody className="space-y-4">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div>
                                        <p className="text-xs text-gray-500">Amount</p>
                                        <p className="font-semibold">${deal.investmentAmount?.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Equity</p>
                                        <p className="font-semibold">{deal.equityOffered}%</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Valuation</p>
                                        <p className="font-semibold">${deal.postMoneyValuation?.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Type</p>
                                        <p className="font-semibold">{deal.investmentType}</p>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-2">
                                    {deal.negotiationHistory?.length > 0 && (
                                        <div className="mr-auto text-sm text-gray-500 italic flex items-center">
                                            <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-xs mr-2 font-semibold">Negotiated</span>
                                            {deal.negotiationHistory.length} round(s) of negotiation
                                        </div>
                                    )}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => openViewModal(deal)}
                                    >
                                        View Details
                                    </Button>
                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            )}

            {/* View Modal (Read Only) */}
            {isViewModalOpen && selectedDeal && (
                <DealForm
                    entrepreneur={selectedDeal.entrepreneurId}
                    investor={selectedDeal.investorId}
                    valuation={selectedDeal.preMoneyValuation}
                    onClose={() => setIsViewModalOpen(false)}
                    readOnly={true}
                    initialData={selectedDeal}
                />
            )}
        </div>
    );
};
