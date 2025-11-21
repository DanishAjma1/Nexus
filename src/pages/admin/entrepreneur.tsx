import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Entrepreneur {
  _id: string;
  name: string;
  email: string;
  role: string;
  startupName?: string;
  foundedYear?: string;
  location?: string;
  industry?: string;
}

export const Entrepreneurj: React.FC = () => {
  const [entrepreneurs, setEntrepreneurs] = useState<Entrepreneur[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEntrepreneurs = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/admin/users`);
      const data = await res.json();
      const filtered = data.filter((u: Entrepreneur) => u.role === "entrepreneur");
      setEntrepreneurs(filtered);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load entrepreneurs");
    } finally {
      setLoading(false);
    }
  };

  const deleteEntrepreneur = async (id: string) => {
    if (!confirm("Are you sure you want to delete this entrepreneur?")) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/admin/user/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Entrepreneur deleted successfully");
      setEntrepreneurs((prev) => prev.filter((u) => u._id !== id));
    } catch {
      toast.error("Error deleting entrepreneur");
    }
  };

  useEffect(() => {
    fetchEntrepreneurs();
  }, []);

  if (loading) return <p className="p-4 text-gray-600">Loading entrepreneurs...</p>;
  if (entrepreneurs.length === 0)
    return <p className="p-4 text-gray-600">No entrepreneurs found.</p>;

  return (
    <div className="p-4">
      {/* ✔️ Entrepreneurs Table */}
      <h1 className="text-xl font-bold mb-4">Entrepreneur Management</h1>

      <div className="overflow-x-auto bg-white rounded-lg shadow border">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 text-gray-800 uppercase text-xs font-semibold">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Startup Name</th>
              <th className="px-4 py-3">Founded Year</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Industry</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {entrepreneurs.map((user) => (
              <tr key={user._id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">{user.startupName}</td>
                <td className="px-4 py-2">{user.foundedYear}</td>
                <td className="px-4 py-2">{user.location}</td>
                <td className="px-4 py-2">{user.industry}</td>
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

      {/* ✔️ Pending Entrepreneurs Section */}
      <div className="mt-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Pending Entrepreneur Approvals
        </h2>

        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Name</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Business Name</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 text-sm text-gray-900">John Carter</td>
                <td className="px-6 py-4 text-sm text-gray-700">Carter Tech</td>
                <td className="px-6 py-4">
                  <button className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
                    Accept
                  </button>
                </td>
              </tr>

              <tr>
                <td className="px-6 py-4 text-sm text-gray-900">Sarah Khan</td>
                <td className="px-6 py-4 text-sm text-gray-700">SK Enterprises</td>
                <td className="px-6 py-4">
                  <button className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
                    Accept
                  </button>
                </td>
              </tr>

              <tr>
                <td className="px-6 py-4 text-sm text-gray-900">Alex Reed</td>
                <td className="px-6 py-4 text-sm text-gray-700">Reed Innovations</td>
                <td className="px-6 py-4">
                  <button className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
                    Accept
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
