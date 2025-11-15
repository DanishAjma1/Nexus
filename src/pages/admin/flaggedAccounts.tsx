"use client";
import React from "react";

interface FlaggedUser {
  _id: string;
  name: string;
  email: string;
  role: "entrepreneur" | "investor";
  reason: string;
  status: "blocked" | "suspended";
}

export const FlaggedAccounts: React.FC = () => {
  // DUMMY BLOCKED USERS
  const flaggedUsers: FlaggedUser[] = [
    {
      _id: "1",
      name: "Ahmed Khan",
      email: "ahmed@example.com",
      role: "entrepreneur",
      reason: "Multiple failed verification attempts",
      status: "blocked",
    },
    {
      _id: "2",
      name: "Emily Parker",
      email: "emily@example.com",
      role: "investor",
      reason: "Suspicious investment activity",
      status: "suspended",
    },
    {
      _id: "3",
      name: "Farhan Ali",
      email: "farhan@example.com",
      role: "entrepreneur",
      reason: "Violation of platform policies",
      status: "blocked",
    },
  ];

  return (
    <div className="p-5">
      <h1 className="text-xl font-bold mb-4">Flagged / Blocked Accounts</h1>

      <div className="overflow-x-auto bg-white rounded-lg shadow border">
        <table className="min-w-full text-sm text-left text-gray-800">
          <thead className="bg-gray-100 uppercase text-xs font-semibold">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Reason</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {flaggedUsers.map((user) => (
              <tr key={user._id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2 capitalize">{user.role}</td>
                <td className="px-4 py-2">{user.reason}</td>
                <td
                  className={`px-4 py-2 font-semibold ${
                    user.status === "blocked"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {user.status.toUpperCase()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
