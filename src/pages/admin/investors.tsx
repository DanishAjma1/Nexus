"use client";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export const Investors: React.FC = () => {
  const [investors, setInvestors] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch investors
  const fetchInvestors = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/admin/users`);
      const data = await res.json();

      // Filter only investor users
      const filtered = data.filter((u: User) => u.role === "investor");
      setInvestors(filtered);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load investors");
    } finally {
      setLoading(false);
    }
  };

  // Delete investor
  const deleteInvestor = async (id: string) => {
    if (!confirm("Are you sure you want to delete this investor?")) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/admin/user/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Investor deleted successfully");
      setInvestors((prev) => prev.filter((i) => i._id !== id));
    } catch (error) {
      toast.error("Error deleting investor");
    }
  };

  useEffect(() => {
    fetchInvestors();
  }, []);

  if (loading)
    return <p className="p-4 text-gray-600">Loading investors...</p>;

  if (investors.length === 0)
    return <p className="p-4 text-gray-600">No investors found.</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Investor Management</h1>
      <div className="overflow-x-auto bg-white rounded-lg shadow border">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 text-gray-800 uppercase text-xs font-semibold">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {investors.map((user) => (
              <tr key={user._id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2 capitalize">{user.role}</td>
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => deleteInvestor(user._id)}
                    className="text-red-600 hover:text-red-800 font-medium"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
