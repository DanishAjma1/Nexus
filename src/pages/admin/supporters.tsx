"use client";
import React from "react";

interface Supporter {
  _id: string;
  name: string;
  email: string;
  campaign: string;
  amount: number;
}

export const Supporters: React.FC = () => {
  // DUMMY SUPPORTERS DATA
  const supporters: Supporter[] = [
    {
      _id: "1",
      name: "Ali Raza",
      email: "ali@example.com",
      campaign: "Eco-Friendly Water Bottles",
      amount: 5000,
    },
    {
      _id: "2",
      name: "Jessica Smith",
      email: "jessica@example.com",
      campaign: "AI Study Planner App",
      amount: 12000,
    },
    {
      _id: "3",
      name: "Hassan Khan",
      email: "hassan@example.com",
      campaign: "Organic Farming Project",
      amount: 3000,
    },
  ];

  return (
    <div className="p-5">
      <h1 className="text-xl font-bold mb-4">Crowdfund Supporters</h1>

      <div className="overflow-x-auto bg-white rounded-lg shadow border">
        <table className="min-w-full text-sm text-left text-gray-800">
          <thead className="bg-gray-100 uppercase text-xs font-semibold">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Campaign</th>
              <th className="px-4 py-3">Amount Invested</th>
            </tr>
          </thead>

          <tbody>
            {supporters.map((s) => (
              <tr key={s._id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{s.name}</td>
                <td className="px-4 py-2">{s.email}</td>
                <td className="px-4 py-2">{s.campaign}</td>
                <td className="px-4 py-2 font-semibold text-green-700">
                  ${s.amount.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
