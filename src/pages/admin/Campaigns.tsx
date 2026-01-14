"use client";
import React, { useEffect, useState, useRef } from "react";
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
  startDate: string;
  endDate: string;
  images?: string[];
}

export const Campaigns: React.FC = () => {
  const URL = import.meta.env.VITE_BACKEND_URL;
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [filtered, setFiltered] = useState<Campaign[]>([]);
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | undefined>(undefined);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchCampaigns = async () => {
    try {
      const res = await axios.get(`${URL}/admin/campaigns`);
      setCampaigns(res.data);
      setFiltered(res.data);
    } catch {
      toast.error("Failed to fetch campaigns");
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await axios.put(`${URL}/admin/campaigns/${id}/status`, {
        status,
      });
      toast.success("Status updated!");
      fetchCampaigns();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = (id: string) => {
    setCampaignToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!campaignToDelete) return;
    try {
      await axios.delete(`${URL}/admin/campaigns/${campaignToDelete}`);
      toast.success("Campaign deleted");
      fetchCampaigns();
    } catch {
      toast.error("Failed to delete campaign");
    } finally {
      setDeleteModalOpen(false);
      setCampaignToDelete(null);
    }
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setCampaignToDelete(null);
  };

  const handleEdit = (c: Campaign) => {
    setEditingCampaign(c);
    setShowForm(true);
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
    <div className="p-4 relative">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manage Campaigns</h1>
        <button
          onClick={() => {
            setEditingCampaign(undefined);
            setShowForm(true);
          }}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-5 py-2.5 rounded-full shadow-lg hover:scale-105 hover:shadow-2xl transition-transform duration-300 font-semibold uppercase tracking-wide"
        >
          Add Campaign
        </button>
      </div>

      <div className="w-full flex justify-center mb-6">
        <form
          onSubmit={handleSearch}
          className="flex items-center gap-3 w-full max-w-2xl bg-white shadow-md rounded-full px-4 py-2 border border-gray-200"
        >
          <input
            type="text"
            placeholder="Search campaigns by title, description or category..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (e.target.value === "") setFiltered(campaigns);
            }}
            className="flex-grow px-4 py-2 bg-transparent focus:outline-none text-gray-700 placeholder-gray-400"
          />
          <button
            type="submit"
            className="flex items-center justify-center bg-gradient-to-r from-indigo-600 to-blue-500 
                       hover:from-blue-600 hover:to-indigo-600 text-white p-2.5 rounded-full 
                       shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"
              />
            </svg>
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow p-3 mb-6 flex justify-around text-center">
        <div>
          <p className="text-gray-500 text-sm">Total Campaigns</p>
          <p className="text-lg font-bold text-indigo-700">{total}</p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Active</p>
          <p className="text-lg font-bold text-green-500">{active}</p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Stopped</p>
          <p className="text-lg font-bold text-red-500">{stopped}</p>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[9999] p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-5xl relative my-4 max-h-[95vh] overflow-y-auto">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="p-4 sm:p-6">
              <CampForm
                onSuccess={() => {
                  fetchCampaigns();
                  setShowForm(false);
                  setEditingCampaign(undefined);
                }}
                initialData={editingCampaign}
              />
            </div>
          </div>
        </div>
      )}

      {filtered.length > 6 && (
        <div className="flex justify-between mb-2">
          <button
            onClick={scrollLeft}
            className="bg-gray-200 text-gray-700 px-3 py-2 rounded-full hover:bg-gray-300 transition-colors"
          >
            ←
          </button>
          <button
            onClick={scrollRight}
            className="bg-gray-200 text-gray-700 px-3 py-2 rounded-full hover:bg-gray-300 transition-colors"
          >
            →
          </button>
        </div>
      )}

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4"
      >
        {filtered.map((c) => (
          <div
            key={c._id}
            className="min-w-[250px] bg-gradient-to-br from-white/90 via-purple-50 to-white/90 
                       backdrop-blur-md rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 
                       p-4 flex flex-col snap-start"
          >
            {c.images && c.images.length > 0 && (
              <div className="flex overflow-x-auto gap-2 mb-3 pb-1">
                {c.images.map((img, i) => (
                  <img
                    key={i}
                    src={`${URL}${img}`}
                    alt={c.title}
                    className="w-20 h-20 object-cover rounded-lg shadow-sm flex-shrink-0 transition-transform duration-300 hover:scale-105"
                  />
                ))}
              </div>
            )}

            <h2 className="text-lg font-semibold text-green-700 mb-1 truncate">
              {c.title}
            </h2>
            <p className="text-gray-700 text-xs mb-2 line-clamp-3">
              {c.description}
            </p>

            <div className="flex justify-between items-center text-xs mb-3">
              <p>
                <span className="font-semibold text-teal-600">Goal:</span> $
                {c.goalAmount}
              </p>
              <p>
                <span className="font-semibold text-teal-600">Raised:</span> $
                {c.raisedAmount}
              </p>
            </div>

            <p className="text-xs mb-1">
              <span className="font-semibold text-purple-600">Category:</span>{" "}
              {c.category}
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
              <span
                className={`font-semibold ${c.status === "active" ? "text-green-500" : "text-red-500"
                  }`}
              >
                {c.status}
              </span>
            </p>

            <div className="flex gap-2 mt-auto">
              <button
                onClick={() => handleEdit(c)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-full shadow transition-colors"
                title="Edit"
              >
                ✏️
              </button>
              <button
                onClick={() => handleDelete(c._id)}
                className="bg-gray-500 hover:bg-gray-600 text-white p-2 rounded-full shadow transition-colors"
                title="Delete"
              >
                🗑️
              </button>
              <div className="flex-1 flex gap-2">
                {c.status === "active" ? (
                  <button
                    onClick={() => updateStatus(c._id, "stopped")}
                    className="flex-1 relative overflow-hidden py-2 rounded-full text-white font-semibold shadow-lg 
                             bg-red-500 transition-all duration-300 hover:shadow-red-400/50 hover:scale-110"
                  >
                    Stop
                  </button>
                ) : (
                  <button
                    onClick={() => updateStatus(c._id, "active")}
                    className="flex-1 relative overflow-hidden py-2 rounded-full text-white font-semibold shadow-lg 
                             bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300 
                             hover:scale-110 hover:shadow-indigo-400/50"
                  >
                    Run
                  </button>
                )}
              </div>
            </div>
          </div>

        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[9999]"
          onClick={cancelDelete}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="ml-4 flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Delete Campaign?
                </h3>
                <p className="text-sm text-gray-600">
                  Are you sure you want to delete this campaign? This action cannot be undone and all data will be permanently removed.
                </p>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={cancelDelete}
                className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
