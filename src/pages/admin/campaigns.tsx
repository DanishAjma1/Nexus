import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import CampForm from "../../components/camp/CampForm";

interface Campaign {
  _id: string;
  title: string;
  description: string;
  goalAmount: number;
  raisedAmount: number;
  status: string;
  category: string;
  images?: string[];
}

export const Campaigns: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [showForm, setShowForm] = useState(false);

  const fetchCampaigns = async () => {
    try {
      const res = await axios.get("http://localhost:5000/admin/campaigns");
      setCampaigns(res.data);
    } catch {
      toast.error("Failed to fetch campaigns");
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await axios.put(`http://localhost:5000/admin/campaigns/${id}/status`, { status });

      toast.success("Status updated!");
      fetchCampaigns();
    } catch {
      toast.error("Failed to update status");
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Manage Campaigns</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          {showForm ? "Close Form" : "Add New Campaign"}
        </button>
      </div>

      {showForm && <CampForm onSuccess={fetchCampaigns} />}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {campaigns.map((c) => (
          <div key={c._id} className="bg-white rounded-xl shadow p-4">
            {c.images && c.images.length > 0 && (
              <div className="flex overflow-x-auto gap-2 mb-2">
                {c.images.map((img, i) => (
                  <img
                    key={i}
                    src={`http://localhost:5000${img}`}
                    alt={c.title}
                    className="w-24 h-24 object-cover rounded"
                  />
                ))}
              </div>
            )}
            <h2 className="text-lg font-semibold">{c.title}</h2>
            <p className="text-sm text-gray-600">{c.description}</p>
            <p className="mt-2 text-sm">
              Goal: <b>${c.goalAmount}</b> | Raised: <b>${c.raisedAmount}</b>
            </p>
            <p className="text-sm mt-1">Status: <b>{c.status}</b></p>

            <div className="flex gap-2 mt-3">
              {c.status === "active" ? (
                <button
                  onClick={() => updateStatus(c._id, "stopped")}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Stop
                </button>
              ) : (
                <button
                  onClick={() => updateStatus(c._id, "active")}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Run
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
