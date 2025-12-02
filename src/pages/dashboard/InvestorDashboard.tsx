import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Users, PieChart, Filter, Search, PlusCircle } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Badge } from "../../components/ui/Badge";
import { EntrepreneurCard } from "../../components/entrepreneur/EntrepreneurCard";
import { useAuth } from "../../context/AuthContext";
import { getRequestsFromInvestor } from "../../data/collaborationRequests";
import { getEnterprenuerFromDb } from "../../data/users";
import { CollaborationRequest, Entrepreneur } from "../../types";

export const InvestorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [entrepreneurs, setEnterprenuers] = useState<Entrepreneur[]>([]);
  const [sentRequests, setSentRequests] = useState<CollaborationRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  if (!user) return null;

  const [industries, setIndustries] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const entrepreneursData = await getEnterprenuerFromDb();
        setEnterprenuers(entrepreneursData);
        const uniqueIndustries = [
          ...new Set(entrepreneursData.map((e) => e.industry)),
        ];
        setIndustries(uniqueIndustries);
      }
    };
    fetchData();
  }, [user]);

  useEffect(() => {
    const fetchRequests = async () => {
      const requests = await getRequestsFromInvestor(user.userId);
      setSentRequests(requests);
    };
    fetchRequests();
  }, [user.userId]);

  const filteredEntrepreneurs = entrepreneurs.filter((entrepreneur) => {
    const matchesSearch =
      searchQuery === "" ||
      entrepreneur?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entrepreneur?.startupName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      entrepreneur?.industry
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      entrepreneur?.pitchSummary
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesIndustry =
      selectedIndustries.length === 0 ||
      selectedIndustries.includes(entrepreneur?.industry);

    return matchesSearch && matchesIndustry;
  });

  const toggleIndustry = (industry: string) => {
    setSelectedIndustries((prevSelected) =>
      prevSelected.includes(industry)
        ? prevSelected.filter((i) => i !== industry)
        : [...prevSelected, industry]
    );
  };

  return (
    <div className="space-y-6 animate-fade-in px-4 sm:px-6 lg:px-8 bg-black text-purple-200 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-purple-200">Discover Startups</h1>
          <p className="text-purple-400">Find and connect with promising entrepreneurs</p>
        </div>
        <Link to="/entrepreneurs" className="w-full sm:w-auto">
          <Button
            leftIcon={<PlusCircle size={18} />}
            className="w-full sm:w-auto bg-purple-900 text-purple-200 hover:bg-purple-800"
          >
            View All Startups
          </Button>
        </Link>
      </div>

      {/* Filters and search */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="w-full md:w-2/3">
          <Input
            placeholder="Search startups, industries, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            fullWidth
            startAdornment={<Search size={18} className="text-purple-400" />}
            className="bg-purple-900 text-purple-200 placeholder-purple-400 border-purple-700"
          />
        </div>
        <div className="w-full md:w-1/3">
          <div className="flex flex-wrap items-center gap-2">
            <Filter size={18} className="text-purple-400" />
            <span className="text-sm font-medium text-purple-200">Filter by:</span>
            <div className="flex flex-wrap gap-2">
              {industries.map((industry) => (
                <Badge
                  key={industry}
                  variant={selectedIndustries.includes(industry) ? "primary" : "gray"}
                  className={`cursor-pointer ${
                    selectedIndustries.includes(industry)
                      ? "bg-purple-700 text-purple-200"
                      : "bg-purple-900 text-purple-400 hover:bg-purple-800 hover:text-purple-100"
                  }`}
                  onClick={() => toggleIndustry(industry)}
                >
                  {industry}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="bg-purple-900 border border-purple-800">
          <CardBody className="flex items-center gap-4">
            <div className="p-3 bg-purple-800 rounded-full">
              <Users size={20} className="text-purple-200" />
            </div>
            <div>
              <p className="text-sm font-medium text-purple-200">Total Startups</p>
              <h3 className="text-xl font-semibold text-purple-100">{entrepreneurs.length}</h3>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-purple-900 border border-purple-800">
          <CardBody className="flex items-center gap-4">
            <div className="p-3 bg-purple-800 rounded-full">
              <PieChart size={20} className="text-purple-200" />
            </div>
            <div>
              <p className="text-sm font-medium text-purple-200">Industries</p>
              <h3 className="text-xl font-semibold text-purple-100">{industries.length}</h3>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-purple-900 border border-purple-800">
          <CardBody className="flex items-center gap-4">
            <div className="p-3 bg-purple-800 rounded-full">
              <Users size={20} className="text-purple-200" />
            </div>
            <div>
              <p className="text-sm font-medium text-purple-200">Your Connections</p>
              <h3 className="text-xl font-semibold text-purple-100">
                {sentRequests.filter((req) => req.requestStatus === "accepted").length}
              </h3>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Entrepreneurs grid */}
      <div>
        <Card className="bg-purple-900 border border-purple-800">
          <CardHeader>
            <h2 className="text-lg font-medium text-purple-200">Featured Startups</h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEntrepreneurs.length > 0 ? (
                filteredEntrepreneurs.map((entrepreneur) => (
                  <EntrepreneurCard key={entrepreneur._id} entrepreneur={entrepreneur} darkMode />
                ))
              ) : (
                <div className="text-center py-8 col-span-full text-purple-200">
                  <p className="text-purple-400">No startups match your filters</p>
                  <Button
                    variant="outline"
                    className="mt-2 border-purple-700 text-purple-200 hover:bg-purple-800"
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
