"use client";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "../../components/ui/Button";
import { ThreeDotsButton } from "../../components/ui/ThreeDotsButton";

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

  type UserData = {
    userId: string;
    role: string;
  };

  const [showDialog, setShowDialog] = useState(false);
  const [index, setIndex] = useState<number | null>(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dialogRef.current && !dialogRef.current.contains(event.target)) {
        setShowDialog(false);
        setIndex(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

          <tbody className="">
            {flaggedUsers.map((user, idx) => (
              <tr key={idx} className="border-t hover:bg-gray-50 group">
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2 capitalize">{user.role}</td>
                <td className="px-4 py-2">{user.reason}</td>
                <td
                  className={`relative px-4 py-2 font-semibold ${
                    user.status === "blocked"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  <div className="flex items-center">
                    <span className="px-4 py-2">
                      {user.status.toUpperCase()}
                    </span>
                    <ThreeDotsButton
                      variant="ghost"
                      className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIndex(idx);
                        setShowDialog((prev) => !prev);
                      }}
                    />
                  </div>

                  {showDialog && idx === index && (
                    <div
                      ref={dialogRef}
                      className={`absolute right-0 w-28 bg-white shadow-md rounded-md border flex flex-col z-50
                      ${
                        idx >= flaggedUsers.length - 2
                          ? "bottom-full mb-2"
                          : "top-full mt-2"
                      }
                    `}
                    >
                      {user.status === "blocked" && (
                        <Button
                          variant="ghost"
                          className="border-b text-xs hover:text-blue-500 focus:text-white focus:bg-blue-500"
                          onClick={(e) => {
                            e.preventDefault();
                            setShowDialog(false);
                          }}
                        >
                          Unblock
                        </Button>
                      )}
                      {user.status === "suspended" && (
                        <Button
                          variant="ghost"
                          className="border-b text-xs hover:text-yellow-500 focus:text-white focus:bg-yellow-500"
                        >
                          UnSuspend
                        </Button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
