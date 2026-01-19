import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "./ui/Button";
import { X } from "lucide-react";
import toast from "react-hot-toast";

const URL = import.meta.env.VITE_BACKEND_URL;

interface DealFormProps {
    entrepreneur: any;
    investor: any;
    onClose: () => void;
    valuation: number;
    readOnly?: boolean;
    initialData?: any;
    isEmbedded?: boolean;
    onSubmit?: (data: any) => void;
}

export const DealForm: React.FC<DealFormProps> = ({
    entrepreneur,
    investor,
    onClose,
    valuation,
    readOnly = false,
    initialData,
    isEmbedded = false,
    onSubmit,
}) => {
    const [formData, setFormData] = useState({
        investmentAmount: initialData?.investmentAmount || "",
        equityOffered: initialData?.equityOffered || "",
        preMoneyValuation: initialData?.preMoneyValuation || valuation || 0,
        postMoneyValuation: initialData?.postMoneyValuation || 0,
        investmentType: initialData?.investmentType || "Equity",
        boardSeat: initialData?.boardSeat || "No",
        votingRights: initialData?.votingRights || "None",
        dividends: initialData?.dividends || "On Exit Only",
        rofr: initialData?.rofr || "No",
        exitStrategy: initialData?.exitStrategy || "Acquisition",
        exitTimeline: initialData?.exitTimeline,
        additionalTerms: initialData?.additionalTerms || "",
        stage: initialData?.stage || "Seed", 
    });

    // Auto-calculate Post-Money Valuation
    useEffect(() => {
        const amount = Number(formData.investmentAmount) || 0;
        const preMoney = Number(formData.preMoneyValuation) || 0;
        setFormData((prev) => ({
            ...prev,
            postMoneyValuation: preMoney + amount,
        }));
    }, [formData.investmentAmount, formData.preMoneyValuation]);

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            investorId: investor.userId,
            entrepreneurId: entrepreneur.userId,
            ...formData,
            investmentAmount: Number(formData.investmentAmount),
            equityOffered: Number(formData.equityOffered),
            preMoneyValuation: Number(formData.preMoneyValuation),
            postMoneyValuation: Number(formData.postMoneyValuation),
        };

        if (onSubmit) {
            onSubmit(payload);
            return;
        }

        try {
            await axios.post(`${URL}/deal/create-deal`, payload, {
                withCredentials: true,
            });

            toast.success("Deal proposal sent successfully!");
            onClose();
        } catch (error) {
            console.error(error);
            toast.error("Failed to send deal proposal.");
        }
    };

    const content = (
        <div className={`${!isEmbedded ? "bg-white rounded-lg w-full max-w-2xl p-8 relative shadow-xl max-h-[90vh] overflow-y-auto" : ""}`}>
            {!isEmbedded && (
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                    <X size={24} />
                </button>
            )}
            <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-2">
                {readOnly ? (isEmbedded ? "Current Deal Terms" : "View Deal Proposal") : (isEmbedded ? "Proposed Counter Offer" : "Startup Investment Deal Form")}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* ... form content ... */}
                {/* Section 1: Investor Details */}
                <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="text-md font-semibold text-gray-800 mb-2">
                        Section 1: Investor Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                type="text"
                                value={investor?.name || ""}
                                readOnly
                                className="mt-1 w-full bg-gray-200 border-gray-300 rounded-md p-2 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                type="text"
                                value={investor?.email || ""}
                                readOnly
                                className="mt-1 w-full bg-gray-200 border-gray-300 rounded-md p-2 text-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Section 2: Entrepreneur Details */}
                <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="text-md font-semibold text-gray-800 mb-2">
                        Section 2: Entrepreneur Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Company Name</label>
                            <input
                                type="text"
                                value={entrepreneur?.startupName || ""}
                                readOnly
                                className="mt-1 w-full bg-gray-200 border-gray-300 rounded-md p-2 text-sm"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Founder Name</label>
                            <input
                                type="text"
                                value={entrepreneur?.name || ""}
                                readOnly
                                className="mt-1 w-full bg-gray-200 border-gray-300 rounded-md p-2 text-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Section 3: Investment Terms */}
                <div>
                    <h3 className="text-lg font-semibold text-blue-800 mb-3">
                        Section 3: Investment Terms
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Investment Amount ($) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                name="investmentAmount"
                                required
                                value={formData.investmentAmount}
                                onChange={handleChange}
                                readOnly={readOnly}
                                className={`mt-1 w-full border border-gray-300 rounded-md p-2 ${readOnly ? "bg-gray-100 cursor-not-allowed" : "focus:ring-blue-500 focus:border-blue-500"}`}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Equity Offered (%) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                name="equityOffered"
                                required
                                value={formData.equityOffered}
                                onChange={handleChange}
                                readOnly={readOnly}
                                className={`mt-1 w-full border border-gray-300 rounded-md p-2 ${readOnly ? "bg-gray-100 cursor-not-allowed" : "focus:ring-blue-500 focus:border-blue-500"}`}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Pre-Money Valuation ($)
                            </label>
                            <input
                                type="number"
                                name="preMoneyValuation"
                                value={formData.preMoneyValuation}
                                readOnly
                                className="mt-1 w-full bg-gray-100 border-gray-300 rounded-md p-2 text-gray-600 cursor-not-allowed"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Post-Money Valuation ($)
                            </label>
                            <input
                                type="number"
                                name="postMoneyValuation"
                                value={formData.postMoneyValuation}
                                readOnly
                                className="mt-1 w-full bg-gray-100 border-gray-300 rounded-md p-2 font-semibold text-blue-700"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Type of Investment
                            </label>
                            <select
                                name="investmentType"
                                value={formData.investmentType}
                                onChange={handleChange}
                                disabled={readOnly}
                                className={`mt-1 w-full border border-gray-300 rounded-md p-2 ${readOnly ? "bg-gray-100" : ""}`}
                            >
                                <option value="Equity">Equity</option>
                                <option value="Convertible Note">Convertible Note</option>
                                <option value="SAFE">SAFE</option>
                                <option value="Debt">Debt</option>
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Funding Stage
                            </label>
                            <select
                                name="stage"
                                value={formData.stage}
                                onChange={handleChange}
                                disabled={readOnly}
                                className={`mt-1 w-full border border-gray-300 rounded-md p-2 ${readOnly ? "bg-gray-100" : ""}`}
                            >
                                <option value="Pre-Seed">Pre-Seed</option>
                                <option value="Seed">Seed</option>
                                <option value="Series A">Series A</option>
                                <option value="Series B">Series B</option>
                                <option value="Late Stage">Late Stage</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Section 4: Investor Rights & Preferences */}
                <div>
                    <h3 className="text-lg font-semibold text-blue-800 mb-3">
                        Section 4: Investor Rights & Preferences
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Board Seat</label>
                            <select
                                name="boardSeat"
                                value={formData.boardSeat}
                                onChange={handleChange}
                                disabled={readOnly}
                                className={`mt-1 w-full border border-gray-300 rounded-md p-2 ${readOnly ? "bg-gray-100" : ""}`}
                            >
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Voting Rights</label>
                            <select
                                name="votingRights"
                                value={formData.votingRights}
                                onChange={handleChange}
                                disabled={readOnly}
                                className={`mt-1 w-full border border-gray-300 rounded-md p-2 ${readOnly ? "bg-gray-100" : ""}`}
                            >
                                <option value="Full">Full</option>
                                <option value="Limited">Limited</option>
                                <option value="None">None</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Dividends</label>
                            <select
                                name="dividends"
                                value={formData.dividends}
                                onChange={handleChange}
                                disabled={readOnly}
                                className={`mt-1 w-full border border-gray-300 rounded-md p-2 ${readOnly ? "bg-gray-100" : ""}`}
                            >
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                                <option value="On Exit Only">On Exit Only</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Right of First Refusal
                            </label>
                            <select
                                name="rofr"
                                value={formData.rofr}
                                onChange={handleChange}
                                disabled={readOnly}
                                className={`mt-1 w-full border border-gray-300 rounded-md p-2 ${readOnly ? "bg-gray-100" : ""}`}
                            >
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Section 5: Exit Strategy */}
                <div>
                    <h3 className="text-lg font-semibold text-blue-800 mb-3">
                        Section 5: Exit Strategy
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Expected Exit</label>
                            <select
                                name="exitStrategy"
                                value={formData.exitStrategy}
                                onChange={handleChange}
                                disabled={readOnly}
                                className={`mt-1 w-full border border-gray-300 rounded-md p-2 ${readOnly ? "bg-gray-100" : ""}`}
                            >
                                <option value="IPO">IPO</option>
                                <option value="Acquisition">Acquisition</option>
                                <option value="Buyback">Buyback</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Expected Timeline
                            </label>
                            <input
                                type="text"
                                name="exitTimeline"
                                value={formData.exitTimeline}
                                onChange={handleChange}
                                readOnly={readOnly}
                                placeholder="e.g., 3-5 years"
                                className={`mt-1 w-full border border-gray-300 rounded-md p-2 ${readOnly ? "bg-gray-100" : ""}`}
                            />
                        </div>
                    </div>
                </div>

                {/* Additional Terms */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Additional Terms / Notes (Optional)
                    </label>
                    <textarea
                        name="additionalTerms"
                        value={formData.additionalTerms}
                        onChange={handleChange}
                        readOnly={readOnly}
                        rows={3}
                        placeholder="Any special conditions..."
                        className={`mt-1 w-full border border-gray-300 rounded-md p-2 ${readOnly ? "bg-gray-100" : ""}`}
                    />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button variant="outline" type="button" onClick={onClose}>
                        {readOnly ? "Close" : "Cancel"}
                    </Button>
                    {!readOnly && (
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                            Send Proposal
                        </Button>
                    )}
                </div>
            </form>
        </div>
    );

    if (isEmbedded) return content;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-[9999] overflow-y-auto py-10">
            {content}
        </div>
    );
};
