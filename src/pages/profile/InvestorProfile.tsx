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
  userId: string | undefined;
};
export const InvestorProfile: React.FC<Props> = ({ userId }) => {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser } = useAuth();
  const [investor, setInvestor] = useState<Investor>();
  const navigate = useNavigate();

  // Fetch investor data
  useEffect(() => {
    const fetchInvestors = async () => {
      if (id) {
        const investor = await getInvestorById(id);
        setInvestor(investor);
      } else {
        const investor = await getInvestorById(userId);
        setInvestor(investor);
      }
    };
    fetchInvestors();
  }, [id, userId]);

  if (!currentUser) return null;
  if (!investor || investor.role !== "investor") {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Investor not found</h2>
        <p className="text-gray-600 mt-2">
          The investor profile you're looking for doesn't exist or has been
          removed.
        </p>
        <Link to="/dashboard/investor">
          <Button variant="outline" className="mt-4">
            Back to Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  const isCurrentUser = currentUser?.userId === investor?.userId;
  const isAdmin = currentUser?.role === "admin";

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Profile header */}
      <Card>
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
              <h1 className="text-2xl font-bold text-gray-900">
                {investor.name}
              </h1>
              <p className="text-gray-600 flex items-center justify-center sm:justify-start mt-1">
                <Building2 size={16} className="mr-1" />
                Investor • {investor.totalInvestments || 0} investments
              </p>

              <div className="flex flex-wrap gap-2 justify-center sm:justify-start mt-3">
                <Badge variant="primary">
                  <MapPin size={14} className="mr-1" />
                  {investor?.location || "--"}
                </Badge>
                {investor.investmentStage &&
                  investor.investmentStage.map((stage, index) => (
                    <Badge key={index} variant="secondary" size="sm">
                      {stage}
                    </Badge>
                  ))}
              </div>
            </div>
          </div>

          <div className="mt-6 sm:mt-0 flex flex-col sm:flex-row gap-2 justify-center sm:justify-end">
            {!isAdmin ? (
              !isCurrentUser && (
                <Link to={`/chat/${investor.userId}`}>
                  <Button leftIcon={<MessageCircle size={18} />}>
                    Message
                  </Button>
                </Link>
              )
            ) : (
              <></>
            )}

            {isCurrentUser && (
              <Button
                variant="outline"
                leftIcon={<UserCircle size={18} />}
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
          <Card>
            <CardHeader>
              <h2 className="text-lg font-medium text-gray-900">About</h2>
            </CardHeader>
            <CardBody>
              <p className="text-gray-700">
                {investor.bio || "Say something about u..?"}
              </p>
            </CardBody>
          </Card>

          {/* Investment Interests */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-medium text-gray-900">
                Investment Interests
              </h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div>
                  <h3 className="text-md font-medium text-gray-900">
                    Industries
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {(investor.investmentInterests &&
                      investor.investmentInterests.map((interest, index) => (
                        <Badge key={index} variant="primary" size="md">
                          {interest}
                        </Badge>
                      ))) ||
                      "Add some industries..?"}
                  </div>
                </div>

                <div>
                  <h3 className="text-md font-medium text-gray-900">
                    Investment Stages
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {(investor.investmentStage &&
                      investor.investmentStage.map((stage, index) => (
                        <Badge key={index} variant="secondary" size="md">
                          {stage}
                        </Badge>
                      ))) ||
                      "Add investment stages..?"}
                  </div>
                </div>

                <div>
                  <h3 className="text-md font-medium text-gray-900">
                    Investment Criteria
                  </h3>
                  <ul className="mt-2 space-y-2 text-gray-700">
                    {investor.investmentCriteria?.map((ic, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="inline-block w-2 h-2 bg-primary-600 rounded-full mt-1.5 mr-2"></span>
                        {ic}
                      </li>
                    )) || "Set investment criteria..?"}
                  </ul>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Portfolio Companies */}
          <Card>
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">
                Portfolio Companies
              </h2>
              <span className="text-sm text-gray-500">
                {(investor.portfolioCompanies &&
                  investor.portfolioCompanies.length) ||
                  0}{" "}
                companies
              </span>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(investor.portfolioCompanies &&
                  investor.portfolioCompanies.map((company, index) => (
                    <div
                      key={index}
                      className="flex items-center p-3 border border-gray-200 rounded-md"
                    >
                      <div className="p-3 bg-primary-50 rounded-md mr-3">
                        <Briefcase size={18} className="text-primary-700" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">
                          {company}
                        </h3>
                        <p className="text-xs text-gray-500">
                          Invested in 2022
                        </p>
                      </div>
                    </div>
                  ))) ||
                  "You don't invest in any company yet.."}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Sidebar - right side */}
        <div className="space-y-6">
          {/* Investment Details */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-medium text-gray-900">
                Investment Details
              </h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div>
                  <span className="text-sm text-gray-500">
                    Investment Range
                  </span>
                  <p className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <DollarSign size={16} className="text-red-500" />
                    {(investor.minimumInvestment &&
                      investor.minimumInvestment) ||
                      0}{" "}
                    - {investor.maximumInvestment || 0}
                  </p>
                </div>

                <div>
                  <span className="text-sm text-gray-500">
                    Total Investments
                  </span>
                  <p className="text-md font-medium text-gray-900">
                    {investor.totalInvestments || 0} companies
                  </p>
                </div>

                <div>
                  <span className="text-sm text-gray-500">
                    Typical Investment Timeline
                  </span>
                  <p className="text-md font-medium text-gray-900">
                    {investor.minTimline || 0}-{investor.maxTimline || 0} years
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-100">
                  <span className="text-sm text-gray-500">
                    Investment Focus
                  </span>
                  <div className="mt-2 space-y-2">
                    {(investor.investmentInterests &&
                      investor.investmentInterests.map((interest, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center"
                        >
                          <span className="text-xs font-medium">
                            {interest}
                          </span>
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-primary-600 h-2 rounded-full"
                              style={{ width: "75%" }}
                            ></div>
                          </div>
                        </div>
                      ))) ||
                      "--"}
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Stats */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-medium text-gray-900">
                Investment Stats
              </h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                <div className="p-3 border border-gray-200 rounded-md bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        Successful Exits
                      </h3>
                      <p className="text-xl font-semibold text-primary-700 mt-1">
                        {investor.successfullExits || 0}
                      </p>
                    </div>
                    <BarChart3 size={24} className="text-primary-600" />
                  </div>
                </div>

                <div className="p-3 border border-gray-200 rounded-md bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        Avg. ROI
                      </h3>
                      <p className="text-xl font-semibold text-primary-700 mt-1">
                        3.2x
                      </p>
                    </div>
                    <BarChart3 size={24} className="text-primary-600" />
                  </div>
                </div>

                <div className="p-3 border border-gray-200 rounded-md bg-gray-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        Active Investments
                      </h3>
                      <p className="text-xl font-semibold text-primary-700 mt-1">
                        {(investor.portfolioCompanies &&
                          investor.portfolioCompanies.length) ||
                          0}
                      </p>
                    </div>
                    <BarChart3 size={24} className="text-primary-600" />
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};
