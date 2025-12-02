import React, { useEffect, useState } from "react";
import { Search, Filter, MapPin } from "lucide-react";
import { Input } from "../../components/ui/Input";
import { Card, CardHeader, CardBody } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { InvestorCard } from "../../components/investor/InvestorCard";
import { useAuth } from "../../context/AuthContext";
import { getInvestorsFromDb } from "../../data/users";
import { Investor } from "../../types";

export const InvestorsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStages, setSelectedStages] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [investors, setInvestors] = useState<Investor[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const investors = await getInvestorsFromDb();
        setInvestors(investors ? investors : []);
      }
    };
    fetchData();
  }, []);

  if (!user) return null;

  const allStages = Array.from(
    new Set(investors.flatMap((i) => i.investmentStage || ""))
  );
  const allInterests = Array.from(
    new Set(investors.flatMap((i) => i.investmentInterests || ""))
  );

  const filteredInvestors = investors.filter((investor) => {
    const matchesSearch =
      searchQuery === "" ||
      investor.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      investor.bio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      investor.investmentInterests?.some((interest) =>
        interest?.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesStages =
      selectedStages.length === 0 ||
      investor.investmentStage?.some((stage) => selectedStages.includes(stage));

    const matchesInterests =
      selectedInterests.length === 0 ||
      investor.investmentInterests?.some((interest) =>
        selectedInterests.includes(interest)
      );

    return matchesSearch && matchesStages && matchesInterests;
  });

  const toggleStage = (stage: string) => {
    setSelectedStages((prev) =>
      prev.includes(stage) ? prev.filter((s) => s !== stage) : [...prev, stage]
    );
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  return (
    <div className="space-y-6 animate-fade-in bg-black min-h-screen text-white px-4 py-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-purple-300">Find Investors</h1>
        <p className="text-gray-300 mt-1">
          Connect with investors who match your startup's needs
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="space-y-6">
          <Card className="bg-purple-900 border border-purple-700 text-white">
            <CardHeader>
              <h2 className="text-lg font-medium text-purple-300">Filters</h2>
            </CardHeader>
            <CardBody className="space-y-6">
              {/* Investment Stage */}
              <div>
                <h3 className="text-sm font-medium text-purple-200 mb-2">
                  Investment Stage
                </h3>
                <div className="space-y-2">
                  {allStages.map((stage) => (
                    <button
                      key={stage}
                      onClick={() => toggleStage(stage)}
                      className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        selectedStages.includes(stage)
                          ? "bg-purple-700 text-white"
                          : "text-purple-200 hover:bg-purple-800"
                      }`}
                    >
                      {stage}
                    </button>
                  ))}
                </div>
              </div>

              {/* Investment Interests */}
              <div>
                <h3 className="text-sm font-medium text-purple-200 mb-2">
                  Investment Interests
                </h3>
                <div className="flex flex-wrap gap-2">
                  {allInterests.map((interest) => (
                    <Badge
                      key={interest}
                      className={`cursor-pointer px-2 py-1 rounded ${
                        selectedInterests.includes(interest)
                          ? "bg-purple-700 text-white"
                          : "bg-gray-800 text-gray-300"
                      }`}
                      onClick={() => toggleInterest(interest)}
                    >
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div>
                <h3 className="text-sm font-medium text-purple-200 mb-2">
                  Location
                </h3>
                <div className="space-y-2">
                  {["San Francisco, CA", "New York, NY", "Boston, MA"].map(
                    (loc) => (
                      <button
                        key={loc}
                        className="flex items-center w-full text-left px-3 py-2 rounded-md text-sm text-purple-200 hover:bg-purple-800"
                      >
                        <MapPin size={16} className="mr-2 text-purple-300" />
                        {loc}
                      </button>
                    )
                  )}
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Dark Search Bar */}
          <div className="flex items-center gap-4">
            <div className="relative w-full">
              <Input
                placeholder="Search investors by name, interests, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                fullWidth
                className="bg-purple-900 border border-purple-700 text-black placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500 pl-10"
              />
              <Search
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter size={18} className="text-purple-300" />
              <span className="text-sm text-gray-300">
                {filteredInvestors.length} results
              </span>
            </div>
          </div>

          {/* Investors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredInvestors.map((investor) => (
              <InvestorCard key={investor.id} investor={investor} darkMode />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
