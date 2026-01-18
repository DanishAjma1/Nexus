import React, { useEffect, useRef, useState } from "react";
import { Input } from "../../components/ui/Input";
import { SearchIcon } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { ThreeDotsButton } from "../../components/ui/ThreeDotsButton";
import axios from "axios";
import toast from "react-hot-toast";

interface Supporter {
  id: string;
  name: string;
  email: string;
  phone: string;
  campaign: string;
  amount: number;
  date: string;
  type: string;
}

export const Supporters: React.FC = () => {
  const [supporters, setSupporters] = useState<Supporter[]>([]);
  const [searchedSupporters, setSearchedSupporters] = useState<Supporter[]>([]);
  const [query, setQuery] = useState<string>("");
  const [searched, setSearched] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  const URL = import.meta.env.VITE_BACKEND_URL;

  const fetchSupporters = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${URL}/payment/all-donations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSupporters(res.data);
    } catch (err: any) {
      console.error("Error fetching supporters:", err);
      toast.error("Failed to fetch supporters data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSupporters();
  }, []);

  const [showDialog, setShowDialog] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
        setShowDialog(false);
        setActiveIndex(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const TableRow = ({ sup, idx }: { sup: Supporter; idx: number }) => {
    return (
      <tr key={sup.id} className="border-t hover:bg-gray-50 relative group">
        <td className="px-4 py-3">{sup.name}</td>
        <td className="px-4 py-3">{sup.email}</td>
        <td className="px-4 py-3">{sup.phone}</td>
        <td className="px-4 py-3">{sup.campaign}</td>
        <td className="px-4 py-3 font-semibold text-green-700">
          ${sup.amount.toLocaleString()}
        </td>
        <td className="px-4 py-3 text-xs text-gray-500">
          {new Date(sup.date).toLocaleDateString()}
        </td>
        <td className="px-4 py-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${sup.type === "User" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"
            }`}>
            {sup.type}
          </span>
        </td>

        <td className="px-4 py-3 text-right relative">
          <ThreeDotsButton
            variant="ghost"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              setActiveIndex(idx);
              setShowDialog((prev) => !prev);
            }}
          />

          {showDialog && activeIndex === idx && (
            <div
              ref={dialogRef}
              className="absolute right-4 top-10 w-32 bg-white border shadow-lg rounded-md z-50 flex flex-col overflow-hidden"
            >
              <Button
                variant="ghost"
                className="justify-start px-4 py-2 text-xs hover:bg-gray-100 rounded-none h-auto"
                onClick={() => {
                  window.location.href = `mailto:${sup.email}`;
                  setShowDialog(false);
                }}
              >
                Send Email
              </Button>
            </div>
          )}
        </td>
      </tr>
    );
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(query);
    const filtered = supporters.filter((sup) =>
      sup.name.toLowerCase().includes(query.toLowerCase()) ||
      sup.email.toLowerCase().includes(query.toLowerCase()) ||
      sup.campaign.toLowerCase().includes(query.toLowerCase()) ||
      sup.phone.toLowerCase().includes(query.toLowerCase())
    );
    setSearchedSupporters(filtered);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-gray-900 underline underline-offset-8 decoration-blue-500">
          Campaign Supporters
        </h1>

        <div className="flex items-center gap-2">
          <form className="flex items-center gap-2" onSubmit={handleSearch}>
            <div className="relative">
              <Input
                type="text"
                placeholder="Search supporters..."
                className="w-64 pl-9"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  if (e.target.value === "") {
                    setSearchedSupporters([]);
                    setSearched("");
                  }
                }}
              />
              <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
            <button
              type="submit"
              className="bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
        <div>
          {searched ? (
            <p>Showing {searchedSupporters.length} results for <span className="font-semibold text-gray-900">"{searched}"</span></p>
          ) : (
            <p>Total Supporters: <span className="font-semibold text-gray-900">{supporters.length}</span></p>
          )}
        </div>
        <button
          onClick={fetchSupporters}
          className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          Refresh Data
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supporter</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-gray-500">
                    <div className="flex justify-center items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                      Loading supporters...
                    </div>
                  </td>
                </tr>
              ) : (searched ? searchedSupporters : supporters).length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-gray-500">
                    No supporters found.
                  </td>
                </tr>
              ) : (
                (searched ? searchedSupporters : supporters).map((sup, idx) => (
                  <TableRow key={sup.id} sup={sup} idx={idx} />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
