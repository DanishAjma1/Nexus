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
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    startups: 0,
    investors: 0,
    supporters: 10,
    campaigns: 0,
    flagged: 0,
  });

  const [startupGrowthChartData, setStartupGrowthChartData] = useState<ChartData[]>([]);
  const [industryGrowthChartData, setIndustryGrowthChartData] = useState([]);
  const [fraudGrowthChartData, setFraudGrowthChartData] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/dashboard`);
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching admin stats:", err);
      }
    };

    const fetchStartupGrowth = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/admin/users/users-last-year`);
        const data = await res.json();
        setStartupGrowthChartData(data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchIndustryGrowth = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/admin/users/startup-by-industry`);
        const data = await res.json();
        setIndustryGrowthChartData(data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchFraudData = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/admin/risk-detection-flags`);
        const data = await res.json();
        setFraudGrowthChartData(data.finalData);
      } catch (err) {
        console.error(err);
      }
    };

    fetchStats();
    fetchStartupGrowth();
    fetchIndustryGrowth();
    fetchFraudData();
  }, []);

  if (!user) return null;

  return (
    <div className="space-y-6 animate-fade-in px-4 sm:px-6 lg:px-8 bg-black text-white min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-purple-300">Welcome, {user.name}</h1>
        <p className="text-gray-400">Admin overview — manage users, campaigns, and analytics</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Users */}
        <Card className="bg-purple-900 border border-purple-700 hover:shadow-lg transition-shadow">
          <CardBody className="flex items-center gap-4">
            <div className="p-3 bg-purple-800 rounded-full">
              <Users size={20} className="text-purple-300" />
            </div>
            <div>
              <p className="text-sm font-medium text-purple-300">Users</p>
              <h3 className="font-semibold text-white">{stats.investors}</h3>
            </div>
          </CardBody>
        </Card>

        {/* Supporters */}
        <Card className="bg-purple-800 border border-purple-700 hover:shadow-lg transition-shadow">
          <CardBody className="flex items-center gap-4">
            <div className="p-3 bg-purple-700 rounded-full">
              <Users size={20} className="text-purple-300" />
            </div>
            <div>
              <p className="text-sm font-medium text-purple-300">Supporters</p>
              <h3 className="font-semibold text-white">{stats.supporters}</h3>
            </div>
          </CardBody>
        </Card>

        {/* Campaigns */}
        <Card className="bg-purple-900 border border-purple-700 hover:shadow-lg transition-shadow">
          <CardBody className="flex items-center gap-4">
            <div className="p-3 bg-purple-800 rounded-full">
              <TrendingUp size={20} className="text-purple-300" />
            </div>
            <div>
              <p className="text-sm font-medium text-purple-300">Campaigns</p>
              <h3 className="font-semibold text-white">{stats.campaigns}</h3>
            </div>
          </CardBody>
        </Card>

        {/* Flagged */}
        <Card className="bg-red-900 border border-red-700 hover:shadow-lg transition-shadow">
          <CardBody className="flex items-center gap-4">
            <div className="p-3 bg-red-800 rounded-full">
              <AlertTriangle size={20} className="text-red-300" />
            </div>
            <div>
              <p className="text-sm font-medium text-red-300">Flagged</p>
              <h3 className="font-semibold text-white">{stats.flagged}</h3>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Analytics Charts */}
      <Card className="bg-gray-900 border border-gray-700">
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-purple-300">Analytics & Reports</h2>
          <Link to="/admin/all-users" className="text-sm font-medium text-purple-400 hover:text-purple-300">
            Manage
          </Link>
        </CardHeader>
        <div className="flex flex-col md:flex-row gap-4 py-5">
          <div className="w-full md:w-2/3 h-64 sm:h-80 md:h-96">
            <StartupGrowthChart data={startupGrowthChartData} />
            <h3 className="text-sm text-center underline text-purple-300">User Growth Chart</h3>
          </div>
          <div className="w-full md:w-1/3 h-64 sm:h-80 md:h-96">
            <StartupIndustryChart data={industryGrowthChartData} />
            <h3 className="text-sm text-center underline text-purple-300">Startup Industry GrowthRate</h3>
          </div>
        </div>
      </Card>

      {/* Campaign Oversight */}
      <Card className="bg-gray-900 border border-gray-700">
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-purple-300">Campaign Oversight</h2>
          <Badge variant="secondary">Crowdfunding</Badge>
        </CardHeader>
        <CardBody className="flex flex-col md:flex-row gap-4 pb-10">
          <div className="w-full md:w-2/5 flex flex-col justify-evenly">
            <p className="text-gray-400">
              Edit, approve, or remove user accounts. Monitor activity and handle reports of fraudulent behavior.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button leftIcon={<Shield size={16} />} className="bg-purple-700 text-white hover:bg-purple-600">View Reports</Button>
              <Button variant="outline" className="border-purple-600 text-purple-300 hover:bg-purple-700 hover:text-white">Take Action</Button>
            </div>
          </div>
          <div className="w-full md:w-3/5 h-64 sm:h-80 md:h-96">
            <FundingChart />
            <h3 className="text-sm text-center mt-2 underline text-purple-300">Fund GrowthRate</h3>
          </div>
        </CardBody>
      </Card>

      {/* Fraud Detection */}
      <Card className="bg-gray-900 border border-gray-700">
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-purple-300">Fraud & Risk Detection</h2>
          <Badge variant="warning">Security</Badge>
        </CardHeader>
        <CardBody className="flex flex-col md:flex-row gap-4 pb-10">
          <div className="w-full md:w-2/5 flex flex-col justify-evenly">
            <p className="text-gray-400">
              Monitor flagged behaviors and abnormal activities over the last 12 months.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button leftIcon={<Shield size={16} />} className="bg-purple-700 text-white hover:bg-purple-600">View Reports</Button>
              <Button variant="outline" className="border-purple-600 text-purple-300 hover:bg-purple-700 hover:text-white">Take Action</Button>
            </div>
          </div>
          <div className="w-full md:w-3/5 h-64 sm:h-80 md:h-96">
            <FraudAndRiskDetectionChart data={fraudGrowthChartData} />
            <h3 className="text-sm text-center mt-2 underline text-purple-300">Fraud and Risk Detection GrowthRate</h3>
          </div>
        </CardBody>
      </Card>

      {/* AI Assistant */}
      <Card className="bg-gray-900 border border-gray-700">
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-lg font-medium text-purple-300">AI Assistant Management</h2>
          <Badge variant="success">AI</Badge>
        </CardHeader>
        <CardBody>
          <p className="text-gray-400">
            Moderate AI-generated campaign suggestions and approve automated responses before users see them.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button leftIcon={<MessageSquare size={16} />} className="bg-purple-700 text-white hover:bg-purple-600" onClick={() => navigate("/admin/ai")}>
              Review Responses
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
