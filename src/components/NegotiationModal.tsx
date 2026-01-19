import React from "react";
import axios from "axios";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { DealForm } from "./DealForm";

const URL = import.meta.env.VITE_BACKEND_URL;

interface NegotiationModalProps {
    deal: any; // The current deal object
    onClose: () => void;
    role: "investor" | "entrepreneur";
}

export const NegotiationModal: React.FC<NegotiationModalProps> = ({
    deal,
    onClose,
    role,
}) => {
    const handleNegotiationSubmit = async (newTerms: any) => {
        try {
            await axios.put(`${URL}/deal/update-deal/${deal._id}`, {
                action: "negotiate",
                note: "Terms updated via negotiation.",
                updatedTerms: newTerms,
                role: role,
            });
            toast.success("Counter offer sent successfully!");
            onClose();
        } catch (error) {
            console.error("Error negotiating deal:", error);
            toast.error("Failed to send counter offer.");
        }
    };

    // Prepare investor/entrepreneur objects for DealForm props
    // We need to reconstruct them from the deal or pass them if available.
    // The DealForm expects 'investor' and 'entrepreneur' objects with at least userId, name, email.
    // deal object likely has populated investorId and entrepreneurId if fetched correctly.
    // If not populated, we might need to pass partials or fetch them.
    // Assuming deal has populated fields from backend:
    const investor = deal.investorId;
    const entrepreneur = deal.entrepreneurId;

    // Determine the "Counter Offer" starting point.
    // If there is negotiation history, the RIGHT side (Counter Offer) should probably 
    // show the LATEST proposal to be reviewed/edited.
    let latestProposal = deal;
    if (deal.negotiationHistory && deal.negotiationHistory.length > 0) {
        // If we are responding to a proposal, show that proposal as the starting point
        const lastItem = deal.negotiationHistory[deal.negotiationHistory.length - 1];
        if (lastItem && lastItem.proposedTerms) {
            latestProposal = { ...deal, ...lastItem.proposedTerms };
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex justify-center items-center z-[9999] overflow-y-auto py-10 px-4">
            <div className="bg-white rounded-xl w-full max-w-[95vw] h-[90vh] relative shadow-2xl flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b bg-gray-50 rounded-t-xl">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Negotiate Deal</h2>
                        <p className="text-sm text-gray-500">Compare current terms and propose changes.</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 bg-white p-2 rounded-full shadow-sm"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-hidden flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-200">
                    {/* Left: Current Deal (Read Only) */}
                    <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50">
                        <div className="max-w-xl mx-auto">
                            <h3 className="text-lg font-semibold text-gray-700 mb-4 sticky top-0 bg-gray-50/95 py-2 z-10 border-b">
                                Original / Currently Agreed Terms
                            </h3>
                            <DealForm
                                entrepreneur={entrepreneur}
                                investor={investor}
                                onClose={() => { }} // No-op
                                valuation={deal.preMoneyValuation}
                                readOnly={true}
                                initialData={deal} // Always show the base deal object here
                                isEmbedded={true}
                            />
                        </div>
                    </div>

                    {/* Right: Counter Offer (Editable) */}
                    <div className="flex-1 overflow-y-auto p-4 bg-white">
                        <div className="max-w-xl mx-auto">
                            <h3 className="text-lg font-semibold text-blue-800 mb-4 sticky top-0 bg-white/95 py-2 z-10 border-b">
                                {deal.negotiationHistory?.length > 0 ? "Latest Proposal / Counter Offer" : "Your Counter Offer"}
                            </h3>
                            <DealForm
                                entrepreneur={entrepreneur}
                                investor={investor}
                                onClose={onClose}
                                valuation={deal.preMoneyValuation}
                                readOnly={false}
                                initialData={latestProposal}
                                isEmbedded={true}
                                onSubmit={handleNegotiationSubmit}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
