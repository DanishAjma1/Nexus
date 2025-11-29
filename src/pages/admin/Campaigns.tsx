import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import CampForm from "../../components/camp/CampForm";

const URL = import.meta.env.VITE_BACKEND_URL;
interface Campaign {
  _id: string;
  title: string;
  description: string;
  goalAmount: number;
  raisedAmount: number;
  status: string;
  category: string;
  startDate: string;
  endDate: string;
  images?: string[];
}

const Campaigns: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [filtered, setFiltered] = useState<Campaign[]>([]);
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchCampaigns = async () => {
    try {
      const res = await axios.get(`${URL}/admin/campaigns`);
      setCampaigns(res.data);
      setFiltered(res.data);
    } catch {
      toast.error("⚠️ Failed to fetch campaigns");
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await axios.put(`${URL}/admin/campaigns/${id}/status`, {
        status,
      });
      toast.success("✅ Status updated!");
      fetchCampaigns();
    } catch {
      toast.error("⚠️ Failed to update status");
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleSearch = (e: any) => {
    e.preventDefault();
    const q = query.toLowerCase();
    const result = campaigns.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
    );
    setFiltered(result);
  };

  const total = filtered.length;
  const active = filtered.filter((c) => c.status === "active").length;
  const stopped = filtered.filter((c) => c.status === "stopped").length;

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -500, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 500, behavior: "smooth" });
    }
  };

  return (
    <div className="p-6 relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gold">Manage Campaigns</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-yellow-500 to-yellow-700 text-black font-semibold px-4 py-2 rounded-xl hover:from-yellow-400 hover:to-yellow-600 transition"
        >
          + Add New Campaign
        </button>
      </div>

      {/* 🔹 Popup Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md flex justify-center items-center z-50"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-xl"
            >
              {/* ❌ Close Button */}
              <button
                onClick={() => setShowForm(false)}
                className="absolute top-6 right-3 text-yellow-400 text-3xl font-bold hover:text-yellow-300 transition"
              >
                ×
              </button>

              <CampForm
                onSuccess={() => {
                  fetchCampaigns();
                  setShowForm(false); 
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔹 Campaign List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {campaigns.map((c) => (
          <motion.div
            key={c._id}
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-lg p-4 border border-yellow-700/40"
          >
            {c.images && c.images.length > 0 && (
              <div className="flex overflow-x-auto gap-2 mb-3">
                {c.images.map((img, i) => (
                  <img
                    key={i}
                    src={`${URL}${img}`}
                    alt={c.title}
                    className="w-24 h-24 object-cover rounded-lg border border-yellow-600/40"
                  />
                ))}
              </div>
            )}
            <h2 className="text-lg font-semibold text-yellow-400 mb-1">
              {c.title}
            </h2>
            <p className="text-sm text-gray-300">{c.description}</p>
            <p className="mt-2 text-sm text-gray-200">
              🎯 Goal: <b>${c.goalAmount}</b> | 💰 Raised:{" "}
              <b>${c.raisedAmount}</b>
            </p>
            <p className="text-sm mt-1">
              Status:{" "}
              <b
                className={`${
                  c.status === "active" ? "text-green-400" : "text-red-400"
                }`}
              >
                {c.status}
              </b>
            </p>

            <div className="flex justify-between text-xs mb-3">
              <p>
                <span className="font-semibold text-purple-600">Start:</span>{" "}
                {new Date(c.startDate).toLocaleDateString()}
              </p>
              <p>
                <span className="font-semibold text-purple-600">End:</span>{" "}
                {new Date(c.endDate).toLocaleDateString()}
              </p>
            </div>

            <p className="text-xs mb-3">
              Status:{" "}
              <span className={`font-semibold ${c.status === "active" ? "text-green-500" : "text-red-500"}`}>
                {c.status}
              </span>
            </p>

            <div className="flex gap-2 mt-auto">
              {c.status === "active" ? (
                <button
                  onClick={() => updateStatus(c._id, "stopped")}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg transition"
                >
                  Stop
                </button>
              ) : (
                <button
                  onClick={() => updateStatus(c._id, "active")}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg transition"
                >
                  Run
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Campaigns;
