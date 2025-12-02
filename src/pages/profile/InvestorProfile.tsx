import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  MessageCircle,
  Building2,
  MapPin,
  UserCircle,
  BarChart3,
  Briefcase,
  DollarSign,
} from "lucide-react";
import { Avatar } from "../../components/ui/Avatar";
import { Button } from "../../components/ui/Button";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { useAuth } from "../../context/AuthContext";
import { getInvestorById } from "../../data/users";
import { Investor } from "../../types";

type Props = {
  userId?: string | undefined;
};

export const InvestorProfile: React.FC<Props> = ({ userId }) => {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser } = useAuth();
  const [investor, setInvestor] = useState<Investor>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvestors = async () => {
      if (id) {
        const investor = await getInvestorById(id);
        setInvestor(investor);
      } else if (userId) {
        const investor = await getInvestorById(userId);
        setInvestor(investor);
      }
    };
    fetchInvestors();
  }, [id, userId]);

  if (!currentUser) return null;
  if (!investor || investor.role !== "investor") {
    return (
      <div className="text-center py-12 bg-black text-purple-200 min-h-screen">
        <h2 className="text-2xl font-bold text-purple-200">Investor not found</h2>
        <p className="text-purple-400 mt-2">
          The investor profile you're looking for doesn't exist or has been removed.
        </p>
        <Link to="/dashboard/investor">
          <Button variant="outline" className="mt-4 border-purple-700 text-purple-200 hover:bg-purple-900">
            Back to Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  const isCurrentUser = currentUser?.userId === investor?.userId;
  const isAdmin = currentUser?.role === "admin";

  return (
    <div className="space-y-6 animate-fade-in px-4 sm:px-6 lg:px-8 bg-black text-purple-200 min-h-screen">
      {/* Profile header */}
      <Card className="bg-purple-900 border border-purple-800">
        <CardBody className="sm:flex sm:items-start sm:justify-between p-6">
          <div className="sm:flex sm:space-x-6">
            <Avatar
              src={investor.avatarUrl}
              alt={investor.name}
              size="xl"
              status={investor.isOnline ? "online" : "offline"}
              className="mx-auto sm:mx-0"
            />

            <div className="mt-4 sm:mt-0 text-center sm:text-left">
              <h1 className="text-2xl font-bold text-purple-100">{investor.name}</h1>
              <p className="text-purple-400 flex items-center justify-center sm:justify-start mt-1">
                <Building2 size={16} className="mr-1 text-purple-200" />
                Investor • {investor.totalInvestments || 0} investments
              </p>

              <div className="flex flex-wrap gap-2 justify-center sm:justify-start mt-3">
                <Badge className="bg-purple-800 text-purple-200">
                  <MapPin size={14} className="mr-1" />
                  {investor?.location || "--"}
                </Badge>
                {investor.investmentStage?.map((stage, index) => (
                  <Badge key={index} className="bg-purple-700 text-purple-200" size="sm">
                    {stage}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 sm:mt-0 flex flex-col sm:flex-row gap-2 justify-center sm:justify-end">
            {!isAdmin && !isCurrentUser && (
              <Link to={`/chat/${investor.userId}`}>
                <Button leftIcon={<MessageCircle size={18} />} className="bg-purple-800 text-purple-200 hover:bg-purple-700">
                  Message
                </Button>
              </Link>
            )}

            {isCurrentUser && (
              <Button
                variant="outline"
                leftIcon={<UserCircle size={18} />}
                className="border-purple-700 text-purple-200 hover:bg-purple-900"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/settings");
                }}
              >
                Edit Profile
              </Button>
            )}
          </div>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content - left side */}
        <div className="lg:col-span-2 space-y-6">
          {/* About */}
          <Card className="bg-purple-900 border border-purple-800">
            <CardHeader>
              <h2 className="text-lg font-medium text-purple-200">About</h2>
            </CardHeader>
            <CardBody>
              <p className="text-purple-300">
                {investor.bio || "Say something about yourself..?"}
              </p>
            </CardBody>
          </Card>

          {/* Investment Interests */}
          <Card className="bg-purple-900 border border-purple-800">
            <CardHeader>
              <h2 className="text-lg font-medium text-purple-200">Investment Interests</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div>
                  <h3 className="text-md font-medium text-purple-200">Industries</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {investor.investmentInterests?.map((interest, idx) => (
                      <Badge key={idx} className="bg-purple-700 text-purple-200">{interest}</Badge>
                    )) || "Add some industries..?"}
                  </div>
                </div>

                <div>
                  <h3 className="text-md font-medium text-purple-200">Investment Stages</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {investor.investmentStage?.map((stage, idx) => (
                      <Badge key={idx} className="bg-purple-800 text-purple-200">{stage}</Badge>
                    )) || "Add investment stages..?"}
                  </div>
                </div>

                <div>
                  <h3 className="text-md font-medium text-purple-200">Investment Criteria</h3>
                  <ul className="mt-2 space-y-2 text-purple-300">
                    {investor.investmentCriteria?.map((ic, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="inline-block w-2 h-2 bg-purple-600 rounded-full mt-1.5 mr-2"></span>
                        {ic}
                      </li>
                    )) || "Set investment criteria..?"}
                  </ul>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Portfolio Companies */}
          <Card className="bg-purple-900 border border-purple-800">
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-purple-200">Portfolio Companies</h2>
              <span className="text-sm text-purple-400">
                {investor.portfolioCompanies?.length || 0} companies
              </span>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {investor.portfolioCompanies?.map((company, index) => (
                  <div key={index} className="flex items-center p-3 border border-purple-800 rounded-md bg-purple-800">
                    <div className="p-3 bg-purple-700 rounded-md mr-3">
                      <Briefcase size={18} className="text-purple-200" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-purple-200">{company}</h3>
                      <p className="text-xs text-purple-400">Invested in 2022</p>
                    </div>
                  </div>
                )) || "You don't invest in any company yet.."}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Sidebar - right side */}
        <div className="space-y-6">
          {/* Investment Details */}
          <Card className="bg-purple-900 border border-purple-800">
            <CardHeader>
              <h2 className="text-lg font-medium text-purple-200">Investment Details</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-4 text-purple-300">
                <div>
                  <span className="text-sm text-purple-400">Investment Range</span>
                  <p className="text-lg font-semibold text-purple-200 flex items-center gap-2">
                    <DollarSign size={16} className="text-red-500" />
                    {investor.minimumInvestment || 0} - {investor.maximumInvestment || 0}
                  </p>
                </div>

                <div>
                  <span className="text-sm text-purple-400">Total Investments</span>
                  <p className="text-md font-medium text-purple-200">{investor.totalInvestments || 0} companies</p>
                </div>

                <div>
                  <span className="text-sm text-purple-400">Typical Investment Timeline</span>
                  <p className="text-md font-medium text-purple-200">
                    {investor.minTimline || 0}-{investor.maxTimline || 0} years
                  </p>
                </div>

                <div className="pt-3 border-t border-purple-800">
                  <span className="text-sm text-purple-400">Investment Focus</span>
                  <div className="mt-2 space-y-2">
                    {investor.investmentInterests?.map((interest, idx) => (
                      <div key={idx} className="flex justify-between items-center">
                        <span className="text-xs font-medium text-purple-200">{interest}</span>
                        <div className="w-32 bg-purple-700 rounded-full h-2">
                          <div className="bg-purple-200 h-2 rounded-full" style={{ width: "75%" }}></div>
                        </div>
                      </div>
                    )) || "--"}
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Stats */}
          <Card className="bg-purple-900 border border-purple-800">
            <CardHeader>
              <h2 className="text-lg font-medium text-purple-200">Investment Stats</h2>
            </CardHeader>
            <CardBody className="space-y-3">
              {[
                { label: "Successful Exits", value: investor.successfullExits || 0 },
                { label: "Avg. ROI", value: "3.2x" },
                { label: "Active Investments", value: investor.portfolioCompanies?.length || 0 },
              ].map((stat, idx) => (
                <div key={idx} className="p-3 border border-purple-800 rounded-md bg-purple-800 flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-medium text-purple-200">{stat.label}</h3>
                    <p className="text-xl font-semibold text-purple-100 mt-1">{stat.value}</p>
                  </div>
                  <BarChart3 size={24} className="text-purple-200" />
                </div>
              ))}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};
