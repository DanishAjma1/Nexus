"use client";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export const Entrepreneurj: React.FC = () => {
  const [entrepreneurs, setEntrepreneurs] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch all users and filter by role 'entrepreneur'
  const fetchEntrepreneurs = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/admin/users`);
      const data = await res.json();

      const filtered = data.filter((u: User) => u.role === "entrepreneur");
      setEntrepreneurs(filtered);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load entrepreneurs");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete entrepreneur
  const deleteEntrepreneur = async (id: string) => {
    if (!confirm("Are you sure you want to delete this entrepreneur?")) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/admin/user/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Entrepreneur deleted successfully");
      setEntrepreneurs((prev) => prev.filter((u) => u._id !== id));
    } catch (error) {
      toast.error("Error deleting entrepreneur");
    }
  };

  useEffect(() => {
    fetchEntrepreneurs();
  }, []);

  if (loading)
    return <p className="p-4 text-gray-600">Loading entrepreneurs...</p>;

  if (entrepreneurs.length === 0)
    return <p className="p-4 text-gray-600">No entrepreneurs found.</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Entrepreneur Management</h1>
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
            {entrepreneurs.map((user) => (
              <tr key={user._id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2 capitalize">{user.role}</td>
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => deleteEntrepreneur(user._id)}
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
