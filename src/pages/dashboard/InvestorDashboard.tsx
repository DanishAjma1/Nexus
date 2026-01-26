import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Users, PieChart, Filter, Search, PlusCircle, ChevronDown, X, Check } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Badge } from "../../components/ui/Badge";
import { EntrepreneurCard } from "../../components/entrepreneur/EntrepreneurCard";
import { useAuth } from "../../context/AuthContext";
import { getRequestsFromInvestor } from "../../data/collaborationRequests";
import { getEnterprenuerFromDb } from "../../data/users";
import { CollaborationRequest, Entrepreneur } from "../../types";
import axios from "axios";

export const InvestorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [entrepreneurs, setEnterprenuers] = useState<Entrepreneur[]>([]);
  const [sentRequests, setSentRequests] = useState<CollaborationRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [industries, setIndustries] = useState<string[]>([]);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [filterQuery, setFilterQuery] = useState("");
  if (!user) return null;

  // Get collaboration requests sent by this investor

  // const requestedEntrepreneurIds = sentRequests.map(req => req.entrepreneurId);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const entrepreneurs = await getEnterprenuerFromDb();
        setEnterprenuers(entrepreneurs);
      }
    };
    fetchData();
  }, []);

  // Fetch industries from backend (all available in DB)
  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/industry/get-all`);
        const names = Array.isArray(res.data) ? res.data.map((i: any) => i.name) : [];
        // Deduplicate and sort
        setIndustries(Array.from(new Set(names)).sort((a, b) => a.localeCompare(b)));
      } catch (error) {
        console.error("Failed to fetch industries", error);
      }
    };
    fetchIndustries();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const requests = await getRequestsFromInvestor(user?.userId);
      setSentRequests(requests);
    };
    fetchData();
  }, [user.userId]);

  // Filter entrepreneurs based on search and industry filters
  const filteredEntrepreneurs = entrepreneurs.filter((entrepreneur) => {
    const indList = Array.isArray(entrepreneur?.industry)
      ? (entrepreneur.industry as string[])
      : (typeof entrepreneur?.industry === "string" && entrepreneur.industry
          ? [entrepreneur.industry as string]
          : []);

    // Search filter
    const matchesSearch =
      searchQuery === "" ||
      entrepreneur?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entrepreneur?.startupName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      indList.some((ind) => ind.toLowerCase().includes(searchQuery.toLowerCase())) ||
      entrepreneur?.pitchSummary
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());

    // Industry filter
    const matchesIndustry =
      selectedIndustries.length === 0 ||
      indList.some((ind) => selectedIndustries.includes(ind));

    return matchesSearch && matchesIndustry;
  });

  // Get unique industries for filter

  // Toggle industry selection
  const toggleIndustry = (industry: string) => {
    setSelectedIndustries((prevSelected) =>
      prevSelected.includes(industry)
        ? prevSelected.filter((i) => i !== industry)
        : [...prevSelected, industry]
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Discover Startups
          </h1>
          <p className="text-gray-600">
            Find and connect with promising entrepreneurs
          </p>
        </div>

        <Link to="/entrepreneurs">
          <Button leftIcon={<PlusCircle size={18} />}>View All Startups</Button>
        </Link>
      </div>

      {/* Filters and search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="w-full md:w-2/3">
          <Input
            placeholder="Search startups, industries, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            fullWidth
            startAdornment={<Search size={18} />}
          />
        </div>

        <div className="w-full md:w-1/3">
          <div className="relative">
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filter by:</span>
              <button
                type="button"
                onClick={() => setShowFilterDropdown((s) => !s)}
                className="ml-auto inline-flex items-center justify-between gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:border-blue-500 focus:ring-2 focus:ring-blue-500"
              >
                <span className="flex items-center gap-2">
                  Industries
                  {selectedIndustries.length > 0 && (
                    <span className="inline-flex items-center px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700">
                      {selectedIndustries.length} selected
                    </span>
                  )}
                </span>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showFilterDropdown ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Selected preview chips */}
            {selectedIndustries.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedIndustries.map((ind) => (
                  <span key={ind} className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium border border-blue-200">
                    {ind}
                    <button
                      type="button"
                      onClick={() => toggleIndustry(ind)}
                      className="ml-1 hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                      aria-label={`Remove ${ind}`}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
                <button
                  type="button"
                  onClick={() => setSelectedIndustries([])}
                  className="text-xs text-gray-600 hover:text-gray-800 underline"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Dropdown popover */}
            {showFilterDropdown && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-lg z-50 p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Search size={16} className="text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search industries..."
                    value={filterQuery}
                    onChange={(e) => setFilterQuery(e.target.value)}
                    className="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="max-h-56 overflow-y-auto">
                  {industries
                    .filter((name) => name.toLowerCase().includes(filterQuery.toLowerCase()))
                    .map((name) => {
                      const isSelected = selectedIndustries.includes(name);
                      return (
                        <button
                          key={name}
                          type="button"
                          onClick={() => toggleIndustry(name)}
                          className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between hover:bg-gray-50 ${isSelected ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}
                        >
                          <span>{name}</span>
                          {isSelected && <Check className="w-4 h-4" />}
                        </button>
                      );
                    })}
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setSelectedIndustries(industries)}
                    className="text-xs text-gray-600 hover:text-gray-800 underline"
                  >
                    Select all
                  </button>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="text-xs px-3 py-1"
                      onClick={() => setSelectedIndustries([])}
                    >
                      Clear
                    </Button>
                    <Button
                      className="text-xs px-3 py-1"
                      onClick={() => setShowFilterDropdown(false)}
                    >
                      Done
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-primary-50 border border-primary-100">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-primary-100 rounded-full mr-4">
                <Users size={20} className="text-primary-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-primary-700">
                  Total Startups
                </p>
                <h3 className="text-xl font-semibold text-primary-900">
                  {entrepreneurs && entrepreneurs.length}
                </h3>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-secondary-50 border border-secondary-100">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-secondary-100 rounded-full mr-4">
                <PieChart size={20} className="text-secondary-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-secondary-700">
                  Industries
                </p>
                <h3 className="text-xl font-semibold text-secondary-900">
                  {industries.length}
                </h3>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-accent-50 border border-accent-100">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-accent-100 rounded-full mr-4">
                <Users size={20} className="text-accent-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-accent-700">
                  Your Connections
                </p>
                <h3 className="text-xl font-semibold text-accent-900">
                  {sentRequests &&
                    sentRequests.filter(
                      (req) => req.requestStatus === "accepted"
                    ).length}
                </h3>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Entrepreneurs grid */}
      <div>
        <Card>
          <CardHeader>
            <h2 className="text-lg font-medium text-gray-900">
              Featured Startups
            </h2>
          </CardHeader>

          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEntrepreneurs.length > 0 ? (
                filteredEntrepreneurs.map((entrepreneur) => (
                  <div key={entrepreneur._id}>
                    <EntrepreneurCard entrepreneur={entrepreneur} />
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">
                    No startups match your filters
                  </p>
                  <Button
                    variant="outline"
                    className="mt-2"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedIndustries([]);
                    }}
                  >
                    Clear filters
                  </Button>
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};