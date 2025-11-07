import React, { useEffect, useState } from "react";
import { Search, Filter, MapPin } from "lucide-react";
import { Input } from "../../components/ui/Input";
import { Card, CardHeader, CardBody } from "../../components/ui/Card";
import { EntrepreneurCard } from "../../components/entrepreneur/EntrepreneurCard";
import { useAuth } from "../../context/AuthContext";
import { getEnterprenuerFromDb } from "../../data/users";
import { Entrepreneur } from "../../types";

export const EntrepreneursPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedFundingRange, setSelectedFundingRange] = useState<string[]>([]);
  const { user } = useAuth();
  const [entrepreneurs, setEnterprenuers] = useState<Entrepreneur[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const entrepreneurs = await getEnterprenuerFromDb();
        setEnterprenuers(entrepreneurs);
      }
    };
    fetchData();
  }, [user]);

  const allIndustries = Array.from(new Set(entrepreneurs.map((e) => e.industry)));
  const fundingRanges = ["< $500K", "$500K - $1M", "$1M - $5M", "> $5M"];

  const filteredEntrepreneurs = entrepreneurs.filter((entrepreneur) => {
    const matchesSearch =
      searchQuery === "" ||
      entrepreneur.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entrepreneur.startupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entrepreneur.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entrepreneur.pitchSummary.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesIndustry =
      selectedIndustries.length === 0 || selectedIndustries.includes(entrepreneur.industry);

    const matchesFunding =
      selectedFundingRange.length === 0 ||
      selectedFundingRange.some((range) => {
        const amount = parseInt(entrepreneur.fundingNeeded.replace(/[^0-9]/g, ""));
        switch (range) {
          case "< $500K":
            return amount < 500;
          case "$500K - $1M":
            return amount >= 500 && amount <= 1000;
          case "$1M - $5M":
            return amount > 1000 && amount <= 5000;
          case "> $5M":
            return amount > 5000;
          default:
            return true;
        }
      });

    return matchesSearch && matchesIndustry && matchesFunding;
  });

  const toggleIndustry = (industry: string) => {
    setSelectedIndustries((prev) =>
      prev.includes(industry) ? prev.filter((i) => i !== industry) : [...prev, industry]
    );
  };

  const toggleFundingRange = (range: string) => {
    setSelectedFundingRange((prev) =>
      prev.includes(range) ? prev.filter((r) => r !== range) : [...prev, range]
    );
  };

  return (
    <div className="space-y-6 animate-fade-in bg-black min-h-screen p-6 text-gray-200">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-yellow-400">Find Startups</h1>
        <p className="text-gray-400">Discover promising startups looking for investment</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Filters */}
        <div className="space-y-6">
          <Card className="bg-neutral-900 border border-yellow-600 text-gray-200">
            <CardHeader>
              <h2 className="text-lg font-semibold text-yellow-400">Filters</h2>
            </CardHeader>
            <CardBody className="space-y-6">
              {/* Industry Filter */}
              <div>
                <h3 className="text-sm font-semibold text-yellow-300 mb-2">Industry</h3>
                <div className="space-y-2">
                  {allIndustries.map((industry) => (
                    <button
                      key={industry}
                      onClick={() => toggleIndustry(industry)}
                      className={`block w-full text-left px-3 py-2 rounded-md text-sm transition ${
                        selectedIndustries.includes(industry)
                          ? "bg-yellow-500 text-black font-semibold"
                          : "text-gray-300 hover:bg-yellow-500/20 hover:text-yellow-400"
                      }`}
                    >
                      {industry}
                    </button>
                  ))}
                </div>
              </div>

              {/* Funding Range Filter */}
              <div>
                <h3 className="text-sm font-semibold text-yellow-300 mb-2">Funding Range</h3>
                <div className="space-y-2">
                  {fundingRanges.map((range) => (
                    <button
                      key={range}
                      onClick={() => toggleFundingRange(range)}
                      className={`block w-full text-left px-3 py-2 rounded-md text-sm transition ${
                        selectedFundingRange.includes(range)
                          ? "bg-yellow-500 text-black font-semibold"
                          : "text-gray-300 hover:bg-yellow-500/20 hover:text-yellow-400"
                      }`}
                    >
                      {range}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location Filter */}
              <div>
                <h3 className="text-sm font-semibold text-yellow-300 mb-2">Location</h3>
                <div className="space-y-2">
                  {["San Francisco, CA", "New York, NY", "Boston, MA"].map((city) => (
                    <button
                      key={city}
                      className="flex items-center w-full text-left px-3 py-2 rounded-md text-sm text-gray-300 hover:bg-yellow-500/20 hover:text-yellow-400 transition"
                    >
                      <MapPin size={16} className="mr-2 text-yellow-500" />
                      {city}
                    </button>
                  ))}
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Search Bar */}
          <div className="flex items-center gap-4">
            <Input
              placeholder="Search startups by name, industry, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              startAdornment={<Search size={18} className="text-yellow-400" />}
              fullWidth
              className="bg-neutral-800 border border-yellow-600 text-yellow-200 placeholder-gray-500 focus:ring-yellow-500 focus:border-yellow-500"
            />

            <div className="flex items-center gap-2 text-yellow-400">
              <Filter size={18} />
              <span className="text-sm">{filteredEntrepreneurs.length} results</span>
            </div>
          </div>

          {/* Entrepreneur List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredEntrepreneurs.length > 0 ? (
              filteredEntrepreneurs.map((entrepreneur) => (
                <EntrepreneurCard key={entrepreneur._id} entrepreneur={entrepreneur} />
              ))
            ) : (
              <p className="text-gray-500">No startups match your filters.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
