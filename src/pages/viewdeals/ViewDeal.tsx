import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { DealForm } from "../../components/DealForm";
import { NegotiationModal } from "../../components/NegotiationModal";

const URL = import.meta.env.VITE_BACKEND_URL;

export const ViewDeals: React.FC = () => {
  const { user } = useAuth();
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [selectedDeal, setSelectedDeal] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isNegotiationModalOpen, setIsNegotiationModalOpen] = useState(false);

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
        role: "entrepreneur",
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

  if (loading) return <div className="p-4">Loading deals...</div>;

  return (
    <div className="space-y-6 animate-fade-in p-4">
      <h1 className="text-2xl font-bold text-gray-900">Investor Deals</h1>

      {deals.length === 0 ? (
        <p>No deals found yet.</p>
      ) : (
        <div className="space-y-4">
          {deals.map((deal) => (
            <Card key={deal._id}>
              <CardHeader className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {deal.investorId?.name || "Investor"}
                  </h3>
                  <p className="text-sm text-gray-500">{deal.investorId?.email}</p>
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
                {deal.paymentStatus === 'funds_released' && (
                  <span className="text-sm font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-800 ml-2 border border-green-200">
                    Payment Approved
                  </span>
                )}
              </CardHeader>
              <CardBody className="space-y-2">
                <p>
                  <strong>Startup:</strong> {deal.entrepreneurId?.startupName}
                </p>
                <p>
                  <strong>Investment Amount:</strong> ${deal.investmentAmount?.toLocaleString()}
                </p>
                <p>
                  <strong>Valuation (Post-Money):</strong> ${deal.postMoneyValuation?.toLocaleString()}
                </p>
                <p>
                  <strong>Equity Offered:</strong> {deal.equityOffered}%
                </p>
                <p>
                  <strong>Type:</strong> {deal.investmentType}
                </p>

                <div className="flex flex-wrap gap-2 mt-4 pt-2 border-t">
                  <Button
                    variant="secondary"
                    onClick={() => openViewModal(deal)}
                  >
                    See Full Deal
                  </Button>

                  {/* Only show actions if pending or negotiating (and last action wasn't us) */}
                  {(deal.status === "pending" || deal.status === "negotiating") && (
                    <>
                      {/* If negotiating and last action was US (entrepreneur), we act as 'waiting' */}
                      {deal.status === 'negotiating' && deal.lastActionBy === 'entrepreneur' ? (
                        <span className="text-sm text-gray-500 italic flex items-center">Waiting for investor response...</span>
                      ) : (
                        <>
                          <Button
                            variant="outline"
                            onClick={() => openNegotiationModal(deal)}
                          >
                            Negotiate
                          </Button>
                          <Button
                            variant="outline"
                            className="border-green-600 text-green-600 hover:bg-green-50"
                            onClick={() => handleDealStatus(deal._id, "accept")}
                          >
                            Accept
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
                    </>
                  )}

                  {deal.status === 'accepted' && (
                    <Button variant="outline" onClick={() => window.location.href = `/messages`}>
                      Chat with Investor
                    </Button>
                  )}
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

      {/* Negotiation Modal */}
      {isNegotiationModalOpen && selectedDeal && (
        <NegotiationModal
          deal={selectedDeal}
          onClose={() => {
            setIsNegotiationModalOpen(false);
            fetchDeals();
          }}
          role="entrepreneur"
        />
      )}
    </div>
  );
};
