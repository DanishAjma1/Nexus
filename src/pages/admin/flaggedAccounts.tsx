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

  const [showDialog, setShowDialog] = useState(false);
  const [index, setIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
        setShowDialog(false);
        setIndex(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="p-5 bg-black min-h-screen text-white">
      <h1 className="text-xl font-bold mb-4 text-purple-400">
        Flagged / Blocked Accounts
      </h1>

      <div className="overflow-x-auto bg-purple-900/10 rounded-lg shadow border border-purple-700">
        <table className="min-w-full text-sm text-left text-white">
          <thead className="bg-purple-900 text-xs font-semibold uppercase text-purple-200">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Reason</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {flaggedUsers.map((user, idx) => (
              <tr
                key={idx}
                className="border-t border-purple-700 hover:bg-purple-800/50 group"
              >
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2 capitalize">{user.role}</td>
                <td className="px-4 py-2">{user.reason}</td>
                <td className="relative px-4 py-2 font-semibold">
                  <div className="flex items-center">
                    <span
                      className={`px-4 py-2 ${
                        user.status === "blocked"
                          ? "text-red-500"
                          : "text-yellow-400"
                      }`}
                    >
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
                      className={`absolute right-0 w-28 bg-purple-900 border border-purple-700 shadow-md rounded-md flex flex-col z-50
                        ${idx >= flaggedUsers.length - 2 ? "bottom-full mb-2" : "top-full mt-2"}
                      `}
                    >
                      {user.status === "blocked" && (
                        <Button
                          variant="ghost"
                          className="border-b text-xs hover:text-blue-400 focus:text-white focus:bg-blue-600"
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
                          className="border-b text-xs hover:text-yellow-400 focus:text-white focus:bg-yellow-600"
                          onClick={(e) => {
                            e.preventDefault();
                            setShowDialog(false);
                          }}
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
