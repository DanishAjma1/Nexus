import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { DealForm } from "../../components/DealForm";
import { NegotiationModal } from "../../components/NegotiationModal";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { DealPaymentModal } from "../../components/DealPaymentModal";
import { DealReceipt } from "../../components/DealReceipt";
import { useNavigate } from "react-router-dom";
import { FileText } from "lucide-react";

// Initialize Stripe outside component to avoid recreation
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const URL = import.meta.env.VITE_BACKEND_URL;

export const DealsPage: React.FC = () => {
  const { user } = useAuth();
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  // Modal states
  const [selectedDeal, setSelectedDeal] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isNegotiationModalOpen, setIsNegotiationModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isAdditionalInvestmentModal, setIsAdditionalInvestmentModal] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  useEffect(() => {
    fetchDeals();
  }, [user]);

  const fetchDeals = async () => {
    if (!user?.userId) return;
    try {
      setLoading(true);
      const res = await axios.get(`${URL}/deal/get-deals/${user.userId}`);
      setDeals(res.data);
    } catch (error) {
      console.error("Error fetching deals:", error);
      toast.error("Failed to load deals.");
    } finally {
      setLoading(false);
    }
  };

  const handleDealStatus = async (
    dealId: string,
    action: "accept" | "reject"
  ) => {
    try {
      await axios.put(`${URL}/deal/update-deal/${dealId}`, {
        action,
        role: "investor",
      });
      toast.success(`Deal ${action === 'accept' ? 'accepted' : 'rejected'}!`);
      fetchDeals(); // Refresh list
    } catch (error) {
      console.error(`Error ${action}ing deal:`, error);
      toast.error(`Failed to ${action} deal.`);
    }
  };


  const openViewModal = (deal: any) => {
    setSelectedDeal(deal);
    setIsViewModalOpen(true);
  };

  const openNegotiationModal = (deal: any) => {
    setSelectedDeal(deal);
    setIsNegotiationModalOpen(true);
  };

  const ensureKycVerified = () => {
    if (user?.kycStatus?.status !== "verified") {
      toast.error("Please complete and verify KYC before making a payment.");
      return false;
    }
    return true;
  };

  if (loading) return <div className="p-4">Loading deals...</div>;

  return (
    <div className="space-y-6 animate-fade-in p-4">
      <h1 className="text-2xl font-bold text-gray-900">Deals Status</h1>

      {deals.length === 0 ? (
        <p>No deals found yet.</p>
      ) : (
        <div className="space-y-4">
          {deals.map((deal) => (
            <Card key={deal._id}>
              <CardHeader className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {deal.entrepreneurId?.startupName || "Startup"}
                  </h3>
                  <p className="text-sm text-gray-500">{deal.entrepreneurId?.name}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Sent {new Date(deal.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`text-sm font-medium px-2 py-0.5 rounded-full ${deal.status === "pending"
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
              </CardHeader>
              <CardBody className="space-y-2">
                <p>
                  <strong>Investment Amount:</strong> ${deal.investmentAmount?.toLocaleString()}
                </p>
                <p>
                  <strong>Valuation (Post-Money):</strong> ${deal.postMoneyValuation?.toLocaleString()}
                </p>
                <p>
                  <strong>Equity Offered:</strong> {deal.equityOffered}%
                </p>

                <div className="flex flex-wrap gap-2 mt-4 pt-2 border-t">
                  <Button
                    variant="secondary"
                    onClick={() => openViewModal(deal)}
                  >
                    See Details
                  </Button>

                  {(deal.status === "negotiating" && deal.lastActionBy === 'entrepreneur') && (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => openNegotiationModal(deal)}
                      >
                        Review Counter Offer
                      </Button>
                      <Button
                        variant="outline"
                        className="border-green-600 text-green-600 hover:bg-green-50"
                        onClick={() => handleDealStatus(deal._id, "accept")}
                      >
                        Accept Offer
                      </Button>
                      <Button
                        variant="ghost"
                        className="text-red-600 hover:bg-red-50"
                        onClick={() => handleDealStatus(deal._id, "reject")}
                      >
                        Reject
                      </Button>
                    </>
                  )}

                  {deal.status === 'accepted' && (
                    <Button variant="outline" onClick={() => navigate(`/chat/${deal.entrepreneurId?._id}`)}>
                      Chat with Founder
                    </Button>
                  )}

                  {deal.status === 'accepted' && deal.paymentStatus !== 'paid' && deal.paymentStatus !== 'funds_released' && (
                    <Button
                      variant="primary"
                      size="sm"
                      className="w-full bg-green-600 hover:bg-green-700 mt-2"
                      onClick={() => {
                        if (!ensureKycVerified()) return;
                        setSelectedDeal(deal);
                        setIsPaymentModalOpen(true);
                      }}
                    >
                      Invest & Pay
                    </Button>
                  )}

                  {(deal.paymentStatus === 'paid' || deal.paymentStatus === 'funds_released') && (
                    <>
                      <div className="w-full text-center py-2 bg-green-50 text-green-700 font-medium rounded text-sm mt-2 border border-green-200">
                        {deal.paymentStatus === 'funds_released' 
                          ? '✓ Payment Released - Funds Received by Entrepreneur' 
                          : 'Payment Received - Pending Admin Approval'}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-indigo-600 text-indigo-600 hover:bg-indigo-50 mt-2 flex items-center justify-center gap-2"
                        onClick={() => {
                          setSelectedDeal(deal);
                          setIsReceiptModalOpen(true);
                        }}
                      >
                        <FileText size={16} />
                        View Receipt
                      </Button>
                      {deal.paymentStatus === 'funds_released' && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 mt-2"
                          onClick={() => {
                            if (!ensureKycVerified()) return;
                            setSelectedDeal(deal);
                            setIsAdditionalInvestmentModal(true);
                          }}
                        >
                          Invest More
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {/* View Modal (Read Only) */}
      {isViewModalOpen && selectedDeal && (
        <div className="fixed inset-0 z-[9999] bg-black/20 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-3xl">
            <DealForm
              entrepreneur={selectedDeal.entrepreneurId}
              investor={selectedDeal.investorId}
              valuation={selectedDeal.preMoneyValuation}
              onClose={() => setIsViewModalOpen(false)}
              readOnly={true}
              initialData={selectedDeal}
            />
          </div>
        </div>
      )}

      {/* Negotiation Modal */}
      {isNegotiationModalOpen && selectedDeal && (
        <NegotiationModal
          deal={selectedDeal}
          onClose={() => {
            setIsNegotiationModalOpen(false);
            fetchDeals();
          }}
          role="investor"
        />
      )}

      {isPaymentModalOpen && selectedDeal && (
        <Elements stripe={stripePromise}>
          <DealPaymentModal
            deal={selectedDeal}
            onClose={() => setIsPaymentModalOpen(false)}
            onSuccess={() => {
              fetchDeals();
            }}
          />
        </Elements>
      )}

      {isAdditionalInvestmentModal && selectedDeal && (
        <Elements stripe={stripePromise}>
          <DealPaymentModal
            deal={{ ...selectedDeal, investmentAmount: 0 }}
            onClose={() => setIsAdditionalInvestmentModal(false)}
            onSuccess={() => {
              fetchDeals();
            }}
            isAdditionalInvestment={true}
          />
        </Elements>
      )}

      {isReceiptModalOpen && selectedDeal && (
        <DealReceipt
          dealId={selectedDeal._id}
          onClose={() => setIsReceiptModalOpen(false)}
        />
      )}
    </div>
  );
};
