import React, { useEffect, useState } from "react";
import {
  Users,
  TrendingUp,
  AlertTriangle,
  Shield,
  MessageSquare,
} from "lucide-react";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { useAuth } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FraudAndRiskDetectionChart } from "../../components/admin/FraudAndRiskDetectionChart";
import { StartupGrowthChart } from "../../components/admin/StartupGrowthChart";
import { StartupIndustryChart } from "../../components/admin/StartupIndustryChart";
import { FundingChart } from "../../components/admin/FundingChart";

type ChartData = {
  month: string;
  inv?: number;
  ent?: number;
};

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    startups: 0,
    investors: 0,
    supporters: 10,
    campaigns: 0,
    flagged: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${URL}/admin/dashboard`);
        setStats(res.data);
      } catch (error) {
        console.error("Error fetching admin stats:", error);
      }
    };

    fetchData();
  }, []);

  const [startupGrowthChartData, setStartupGrowthChartData] = useState<
    ChartData[]
  >([]);
  const [industryGrowthChartData, setIndustryGrowthChartData] = useState([]);
  const [fraudGrowthChartData, setFraudGrowthChartData] = useState([]);

  const fetchStartupGrowthChartData = async () => {
    const res = await fetch(
      "http://localhost:5000/admin/users/users-last-year"
    );
    const data = await res.json();
    setStartupGrowthChartData(data);
  };
  // const fetchFundingChartData = async () => {
  //   const res = await fetch(
  //     "http://localhost:5000/admin/users/users-last-year"
  //   );
  //   const data = await res.json();
  //   setStartupGrowthChartData(data);
  // };

  const fetchIndustryGrowthChartData = async () => {
    const res = await fetch(
      "http://localhost:5000/admin/users/startup-by-industry"
    );
    const data = await res.json();
    setIndustryGrowthChartData(data);
  };

  const fetchFraudGrowthChartData = async () => {
    const res = await fetch("http://localhost:5000/admin/risk-detection-flags");
    const data = await res.json();
    const { finalData } = data;
    setFraudGrowthChartData(finalData);
  };

  useEffect(() => {
    fetchStartupGrowthChartData();
    fetchIndustryGrowthChartData();
    fetchFraudGrowthChartData();
  }, []);

  if (!user) return null;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome, {user.name}
          </h1>
          <p className="text-gray-600">
            Admin overview — manage users, campaigns, and analytics
          </p>
        </div>
      </div>

      {/* Top summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-purple-50 border border-purple-100">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full mr-4">
                <Users size={20} className="text-purple-700" />
              </div>
              <div className="flex gap-2 items-center">
                <p className="text-sm font-medium text-purple-700">Users</p>
                <h3 className="font-semibold text-purple-900">
                  {stats.investors || 10}
                </h3>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-amber-50 border border-amber-100">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-amber-100 rounded-full mr-4">
                <Users size={20} className="text-amber-700" />
              </div>
              <div className="flex gap-2 items-center">
                <p className="text-sm font-medium text-amber-700">Supporters</p>
                <h3 className="font-semibold text-amber-900">
                  {stats.supporters || 10}
                </h3>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-green-50 border border-green-100">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full mr-4">
                <TrendingUp size={20} className="text-green-700" />
              </div>
              <div className="flex gap-2 items-center">
                <p className="text-sm font-medium text-green-700">Campaigns</p>
                <h3 className="font-semibold text-green-900">
                  {stats.campaigns || 10}
                </h3>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-red-50 border border-red-100">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-full mr-4">
                <AlertTriangle size={20} className="text-red-700" />
              </div>
              <div className="flex gap-2 items-center">
                <p className="text-sm font-medium text-red-700">Flagged</p>
                <h3 className="font-semibold text-red-900">
                  {stats.flagged || 10}
                </h3>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-900">
            Analytics & Reports
          </h2>
          <Link
            to="/admin/all-users"
            className="text-sm font-medium text-primary-600 hover:text-primary-500"
          >
            Manage
          </Link>
        </CardHeader>

        <div className="grid grid-flow-col font-medium grid-cols-3 h-[60vh] bg-white shadow-md py-10 px-5">
          <div className=" col-span-2">
            <StartupGrowthChart data={startupGrowthChartData} />
            <h3 className="mb-2 justify-center flex font-light text-sm underline text-blue-700">
              User Growth Chart
            </h3>
          </div>

          <div className="">
            <StartupIndustryChart data={industryGrowthChartData} />
            <h3 className="ml-10 mb-2 justify-center flex font-light text-sm underline text-blue-700">
              Startup industry growthRate
            </h3>
          </div>
        </div>
      </Card>

      {/* Management sections */}
      <div className="flex flex-col gap-6">
        {/* Campaign Oversight */}
        <Card className="col-span-2">
          <CardHeader className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">
              Campaign Oversight
            </h2>
            <Badge variant="secondary">Crowdfunding</Badge>
          </CardHeader>

          <CardBody className="flex flex-row pb-10 gap-5">
            <div className="w-2/5 flex flex-col justify-evenly">
              <p className="text-gray-600">
                Edit, approve, or remove user accounts. Monitor activity and
                handle reports of fraudulent behavior.The user catched by
                suspicious activity could be responsible for its own acts. the
                admin will always viewing your activities either you are
                approaching well and structured way or not .This info is just
                filling the blanks.
              </p>
              <div className="mt-4 flex gap-2">
                <Button leftIcon={<Shield size={16} />}>View Reports</Button>
                <Button variant="outline">Take Action</Button>
              </div>
            </div>
            <div className="h-[50vh] w-3/5">
              <FundingChart />
              <h3 className="ml-10 mb-2 justify-center flex font-light text-sm underline text-blue-700">
                Fund GrowthRate
              </h3>
            </div>
          </CardBody>
        </Card>

        {/* Fraud Detection */}
        <Card className="col-span-2">
          <CardHeader className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">
              Fraud & Risk Detection
            </h2>
            <Badge variant="warning">Security</Badge>
          </CardHeader>
          <CardBody className="flex flex-row pb-10 gap-5">
            <div className="w-2/5 flex flex-col justify-evenly">
              <p className="text-gray-600">
                Edit, approve, or remove user accounts. Monitor activity and
                handle reports of fraudulent behavior.The user catched by
                suspicious activity could be responsible for its own acts. the
                admin will always viewing your activities either you are
                approaching well and structured way or not .This info is just
                filling the blanks.
              </p>
              <div className="mt-4 flex gap-2">
                <Button leftIcon={<Shield size={16} />}>View Reports</Button>
                <Button variant="outline">Take Action</Button>
              </div>
            </div>
            <div className="h-[50vh] w-3/5">
              <FraudAndRiskDetectionChart data={fraudGrowthChartData} />

              <h3 className="ml-10 mb-1 justify-center flex font-light text-sm underline text-blue-700">
                Fraud and Risk Detection GrowthRate
              </h3>
            </div>
          </CardBody>
        </Card>

        {/* AI Assistant Moderation */}
        <Card>
          <CardHeader className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">
              AI Assistant Management
            </h2>
            <Badge variant="success">AI</Badge>
          </CardHeader>
          <CardBody>
            <p className="text-gray-600">
              Moderate AI-generated campaign suggestions and approve automated
              responses before they are shown to users.
            </p>
            <div className="mt-4 flex gap-2">
              <Button
                leftIcon={<MessageSquare size={16} />}
                onClick={() => {
                  navigate("/admin/ai");
                }}
              >
                Review Responses
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
