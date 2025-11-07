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
        const investorsData = await getInvestorsFromDb();
        setInvestors(investorsData || []);
      }
    };
    fetchData();
  }, [user]);

  if (!user) return null;

  const allStages = Array.from(new Set(investors.flatMap((i) => i.investmentStage || "")));
  const allInterests = Array.from(new Set(investors.flatMap((i) => i.investmentInterests || "")));

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
    <div className="space-y-6 animate-fade-in bg-black min-h-screen p-6 text-gray-200">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-yellow-400">Find Investors</h1>
        <p className="text-gray-400">
          Connect with investors who match your startup's needs
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters sidebar */}
        <div className="space-y-6">
          <Card className="bg-neutral-900 border border-yellow-600 text-gray-200">
            <CardHeader>
              <h2 className="text-lg font-semibold text-yellow-400">Filters</h2>
            </CardHeader>
            <CardBody className="space-y-6">
              {/* Investment Stage */}
              <div>
                <h3 className="text-sm font-semibold text-yellow-300 mb-2">
                  Investment Stage
                </h3>
                <div className="space-y-2">
                  {allStages.map((stage) => (
                    <button
                      key={stage}
                      onClick={() => toggleStage(stage)}
                      className={`block w-full text-left px-3 py-2 rounded-md text-sm transition ${
                        selectedStages.includes(stage)
                          ? "bg-yellow-500 text-black font-semibold"
                          : "text-gray-300 hover:bg-yellow-500/20"
                      }`}
                    >
                      {stage}
                    </button>
                  ))}
                </div>
              </div>

              {/* Investment Interests */}
              <div>
                <h3 className="text-sm font-semibold text-yellow-300 mb-2">
                  Investment Interests
                </h3>
                <div className="flex flex-wrap gap-2">
                  {allInterests.map((interest) => (
                    <Badge
                      key={interest}
                      variant={
                        selectedInterests.includes(interest) ? "primary" : "gray"
                      }
                      className={`cursor-pointer px-3 py-1 rounded-full ${
                        selectedInterests.includes(interest)
                          ? "bg-yellow-500 text-black"
                          : "bg-neutral-800 text-yellow-300 hover:bg-yellow-500/30"
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
                <h3 className="text-sm font-semibold text-yellow-300 mb-2">
                  Location
                </h3>
                <div className="space-y-2">
                  {["San Francisco, CA", "New York, NY", "Boston, MA"].map(
                    (loc) => (
                      <button
                        key={loc}
                        className="flex items-center w-full text-left px-3 py-2 rounded-md text-sm text-gray-300 hover:bg-yellow-500/20 transition"
                      >
                        <MapPin size={16} className="mr-2 text-yellow-400" />
                        {loc}
                      </button>
                    )
                  )}
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Main content */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center gap-4">
            <Input
              placeholder="Search investors by name, interests, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              startAdornment={<Search size={18} className="text-yellow-400" />}
              fullWidth
              className="bg-neutral-900 border border-yellow-600 text-yellow-200 placeholder-gray-500 focus:ring-yellow-500 focus:border-yellow-500"
            />

            <div className="flex items-center gap-2">
              <Filter size={18} className="text-yellow-400" />
              <span className="text-sm text-yellow-300">
                {filteredInvestors.length} results
              </span>
            </div>
          </div>

          {/* Investor List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredInvestors.map((investor) => (
              <InvestorCard key={investor.id} investor={investor} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
