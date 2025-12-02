"use client";
import React, { useState } from "react";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { toast } from "react-hot-toast";

export const Deals: React.FC = () => {
  // Dummy static deals data
  const [deals, setDeals] = useState([
    {
      _id: "1",
      investorName: "John Doe",
      investorEmail: "john@example.com",
      businessName: "Acme Startup",
      amount: 50000,
      equity: 5,
      message: "We want to invest in your startup.",
      status: "pending",
    },
    {
      _id: "2",
      investorName: "Jane Smith",
      investorEmail: "jane@example.com",
      businessName: "Acme Startup",
      amount: 100000,
      equity: 10,
      message: "We are interested in funding your growth.",
      status: "pending",
    },
  ]);

  const handleDealStatus = (dealId: string, status: "accepted" | "rejected") => {
    setDeals(prev => prev.map(d => d._id === dealId ? { ...d, status } : d));
    toast.success(`Deal ${status}`);
  };

  return (
    <div className="space-y-6 animate-fade-in p-4 bg-black min-h-screen text-white">
      <h1 className="text-2xl font-bold text-purple-300">Investor Deals</h1>

      {deals.length === 0 ? (
        <p className="text-purple-400">No deals found yet.</p>
      ) : (
        <div className="space-y-4">
          {deals.map(deal => (
            <Card key={deal._id} className="bg-purple-900 border border-purple-800">
              <CardHeader className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium text-white">{deal.investorName}</h3>
                  <p className="text-sm text-purple-400">{deal.investorEmail}</p>
                </div>
                <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${
                  deal.status === "pending" 
                    ? "bg-yellow-800 text-yellow-200" 
                    : deal.status === "accepted" 
                      ? "bg-green-800 text-green-200" 
                      : "bg-red-800 text-red-200"
                }`}>
                  {deal.status}
                </span>
              </CardHeader>

              <CardBody className="space-y-2 text-purple-200">
                <p><strong>Business:</strong> {deal.businessName}</p>
                <p><strong>Investment Amount:</strong> ${deal.amount}</p>
                <p><strong>Requested Equity:</strong> {deal.equity}%</p>
                <p><strong>Message:</strong> {deal.message}</p>

                {deal.status === "pending" && (
                  <div className="flex gap-2 mt-2">
                    <Button
                      variant="outline"
                      className="border-purple-700 text-purple-200 hover:bg-purple-800"
                      onClick={() => handleDealStatus(deal._id, "accepted")}
                    >
                      Accept
                    </Button>
                    <Button
                      variant="destructive"
                      className="bg-red-700 hover:bg-red-600 text-white border-none"
                      onClick={() => handleDealStatus(deal._id, "rejected")}
                    >
                      Reject
                    </Button>
                  </div>
                )}
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
