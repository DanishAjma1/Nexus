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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [entrepreneurs, setEntrepreneurs] = useState<Entrepreneur[]>([]);
  const [sentRequests, setSentRequests] = useState<CollaborationRequest[]>([]);

  if (!user) return null;

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const entrepreneursData = await getEnterprenuerFromDb();
        setEntrepreneurs(entrepreneursData);
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

  const industries = [...new Set(entrepreneurs.map((e) => e.industry))];

  const filteredEntrepreneurs = entrepreneurs.filter((entrepreneur) => {
    const matchesSearch =
      searchQuery === "" ||
      entrepreneur.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entrepreneur.startupName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      entrepreneur.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entrepreneur.pitchSummary
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesIndustry =
      selectedIndustries.length === 0 ||
      selectedIndustries.includes(entrepreneur.industry);

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
    <div className="space-y-8 animate-fade-in bg-black min-h-screen text-yellow-100 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-yellow-700 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-yellow-400">Discover Startups</h1>
          <p className="text-yellow-600">
            Find and connect with promising entrepreneurs
          </p>
        </div>

        <Link to="/entrepreneurs">
          <Button className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded-full px-5 py-2 flex items-center space-x-2 transition">
            <PlusCircle size={18} />
            <span>View All Startups</span>
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Search Bar */}
        <div className="flex items-center w-full md:w-2/3 bg-neutral-900 border border-yellow-700 rounded-full px-4 py-2">
          <Search size={18} className="text-yellow-500 mr-3" />
          <Input
            placeholder="Search startups, industries, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-yellow-100 placeholder-yellow-600 focus:outline-none w-full"
          />
        </div>

        {/* Industry Filters */}
        <div className="flex flex-wrap gap-2 items-center md:w-1/3">
          <Filter size={18} className="text-yellow-500" />
          <span className="text-sm font-medium text-yellow-400">Filter by:</span>

          <div className="flex flex-wrap gap-2">
            {industries.map((industry) => (
              <Badge
                key={industry}
                className={`cursor-pointer border transition ${
                  selectedIndustries.includes(industry)
                    ? "bg-yellow-500 text-black border-yellow-500"
                    : "bg-neutral-900 text-yellow-400 border-yellow-700 hover:bg-yellow-600 hover:text-black"
                }`}
                onClick={() => toggleIndustry(industry)}
              >
                {industry}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            icon: Users,
            label: "Total Startups",
            value: entrepreneurs?.length || 0,
          },
          {
            icon: PieChart,
            label: "Industries",
            value: industries.length,
          },
          {
            icon: Users,
            label: "Your Connections",
            value:
              sentRequests?.filter((req) => req.requestStatus === "accepted")
                .length || 0,
          },
        ].map(({ icon: Icon, label, value }) => (
          <Card
            key={label}
            className="bg-neutral-900 border border-yellow-700 shadow-lg hover:shadow-yellow-700/30 hover:scale-[1.02] transition"
          >
            <CardBody>
              <div className="flex items-center">
                <div className="p-3 bg-yellow-500 rounded-full mr-4">
                  <Icon size={20} className="text-black" />
                </div>
                <div>
                  <p className="text-sm font-medium text-yellow-400">{label}</p>
                  <h3 className="text-xl font-bold text-yellow-300">{value}</h3>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Entrepreneurs Section */}
      <Card className="bg-neutral-900 border border-yellow-700 shadow-lg">
        <CardHeader className="border-b border-yellow-700 pb-3">
          <h2 className="text-lg font-semibold text-yellow-400">
            Featured Startups
          </h2>
        </CardHeader>

        <CardBody>
          {filteredEntrepreneurs && filteredEntrepreneurs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEntrepreneurs.map((entrepreneur) => (
                <div
                  key={entrepreneur._id}
                  className="hover:shadow-yellow-700/30 hover:scale-[1.02] transition"
                >
                  <EntrepreneurCard entrepreneur={entrepreneur} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-yellow-500 font-medium">
                No startups match your filters
              </p>
              <Button
                variant="outline"
                className="mt-3 border-yellow-600 text-yellow-400 hover:bg-yellow-600 hover:text-black transition"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedIndustries([]);
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};
