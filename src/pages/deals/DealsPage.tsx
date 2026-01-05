import React, { useState } from "react";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";

export const DealsPage: React.FC = () => {
  const [deals, setDeals] = useState([
    {
      _id: "1",
      investorName: "John Doe",
      investorEmail: "john@example.com",
      businessName: "Acme Startup",
      amount: 50000,
      equity: 5,
      message: "We want to invest in your startup.",
      status: "accepted",
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
                    {deal.investorName}
                  </h3>
                  <p className="text-sm text-gray-500">{deal.investorEmail}</p>
                </div>
                <span
                  className={`text-sm font-medium px-2 py-0.5 rounded-full ${
                    deal.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : deal.status === "accepted"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {deal.status}
                </span>
              </CardHeader>
              <CardBody className="space-y-2">
                <p>
                  <strong>Business:</strong> {deal.businessName}
                </p>
                <p>
                  <strong>Investment Amount:</strong> ${deal.amount}
                </p>
                <p>
                  <strong>Requested Equity:</strong> {deal.equity}%
                </p>
                <p>
                  <strong>Message:</strong> {deal.message}
                </p>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
