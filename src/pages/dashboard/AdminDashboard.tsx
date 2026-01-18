import React, { useEffect, useState } from "react";
import {
  Users,
  TrendingUp,
  AlertTriangle,
  Shield,
  MessageSquare,
  UserX,
  Ban,
  UserCheck
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
  const URL = import.meta.env.VITE_BACKEND_URL;
  const { user } = useAuth();
  const [stats, setStats] = useState({
    approvedUsers: 0,
    supporters: 10,
    campaigns: 0,
    suspendedUsers: 0,
    blockedUsers: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${URL}/admin/dashboard`);
        // Assuming the API returns total users, we'll need to calculate approved users
        // For now, let's set a placeholder. In reality, you might need an API endpoint
        // that specifically returns approved users count.

        // First, let's fetch all users to calculate counts
        const usersRes = await axios.get(`${URL}/admin/get-users`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });

        const allUsers = usersRes.data;

        // Calculate counts based on user status
        const approvedCount = allUsers.filter((u: any) => 
          u.status === 'approved' || 
          u.approvalStatus === 'approved' ||
          u.isApproved === true ||
          !(u.status !== 'pending' && u.status !== 'rejected')
        ).length;

        const suspendedCount = allUsers.filter((u: any) =>
          u.isSuspended === true ||
          u.suspended === true ||
          u.status === 'suspended'
        ).length;

        const blockedCount = allUsers.filter((u: any) =>
          u.isBlocked === true ||
          u.blocked === true ||
          u.status === 'blocked'
        ).length;

        // Update stats with calculated values
        setStats({
          approvedUsers: approvedCount,
          supporters: 10, // Keeping as static for now
          campaigns: res.data.campaigns || 0,
          suspendedUsers: suspendedCount,
          blockedUsers: blockedCount
        });

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
      `${URL}/admin/users/users-last-year`
    );
    const data = await res.json();
    setStartupGrowthChartData(data);
  };

  const fetchIndustryGrowthChartData = async () => {
    const res = await fetch(
      `${URL}/admin/users/startup-by-industry`
    );
    const data = await res.json();
    setIndustryGrowthChartData(data);
  };

  const fetchFraudGrowthChartData = async () => {
    const res = await fetch(`${URL}/admin/risk-detection-flags`);
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Approved Users Card */}
        <Card className="bg-green-50 border border-green-100">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full mr-4">
                <UserCheck size={20} className="text-green-700" />
              </div>
              <div className="flex flex-col">
                <p className="text-sm font-medium text-green-700">Users</p>
                <h3 className="text-lg font-semibold text-green-900">
                  {stats.approvedUsers}
                </h3>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Supporters Card */}
        <Card className="bg-amber-50 border border-amber-100">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-amber-100 rounded-full mr-4">
                <Users size={20} className="text-amber-700" />
              </div>
              <div className="flex flex-col">
                <p className="text-sm font-medium text-amber-700">Supporters</p>
                <h3 className="text-lg font-semibold text-amber-900">
                  {stats.supporters}
                </h3>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Campaigns Card */}
        <Card className="bg-blue-50 border border-blue-100">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full mr-4">
                <TrendingUp size={20} className="text-blue-700" />
              </div>
              <div className="flex flex-col">
                <p className="text-sm font-medium text-blue-700">Campaigns</p>
                <h3 className="text-lg font-semibold text-blue-900">
                  {stats.campaigns}
                </h3>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Suspended Users Card */}
        <Card className="bg-orange-50 border border-orange-100">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-full mr-4">
                <UserX size={20} className="text-orange-700" />
              </div>
              <div className="flex flex-col">
                <p className="text-sm font-medium text-orange-700">Suspended</p>
                <h3 className="text-lg font-semibold text-orange-900">
                  {stats.suspendedUsers}
                </h3>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Blocked Users Card */}
        <Card className="bg-red-50 border border-red-100">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-full mr-4">
                <Ban size={20} className="text-red-700" />
              </div>
              <div className="flex flex-col">
                <p className="text-sm font-medium text-red-700">Blocked</p>
                <h3 className="text-lg font-semibold text-red-900">
                  {stats.blockedUsers}
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

        <div className="grid grid-cols-1 lg:grid-cols-3 font-medium h-auto lg:h-[60vh] bg-white shadow-md py-6 md:py-10 px-4 md:px-5 gap-8">
          <div className="lg:col-span-2 h-[40vh] md:h-full">
            <StartupGrowthChart data={startupGrowthChartData} />
            <h3 className="mt-2 justify-center flex font-light text-sm underline text-blue-700">
              User Growth Chart
            </h3>
          </div>

          <div className="h-[40vh] md:h-full">
            <StartupIndustryChart data={industryGrowthChartData} />
            <h3 className="mt-2 lg:ml-10 justify-center flex font-light text-sm underline text-blue-700">
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

          <CardBody className="flex flex-col lg:flex-row pb-10 gap-8">
            <div className="w-full lg:w-2/5 flex flex-col justify-evenly">
              <p className="text-gray-600 text-sm md:text-base">
                Edit, approve, or remove user accounts. Monitor activity and
                handle reports of fraudulent behavior. The user caught by
                suspicious activity could be responsible for its own acts. the
                admin will always be viewing your activities whether you are
                approaching in a well and structured way or not.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <Button leftIcon={<Shield size={16} />}>View Reports</Button>
                <Button variant="outline">Take Action</Button>
              </div>
            </div>
            <div className="h-[40vh] md:h-[50vh] w-full lg:w-3/5">
              <FundingChart />
              <h3 className="mt-2 lg:ml-10 justify-center flex font-light text-sm underline text-blue-700">
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
          <CardBody className="flex flex-col lg:flex-row pb-10 gap-8">
            <div className="w-full lg:w-2/5 flex flex-col justify-evenly">
              <p className="text-gray-600 text-sm md:text-base">
                Monitor platform safety and identify high-risk behaviors. Our
                automated systems flag suspicious activities for manual review.
                Ensuring a secure environment for all entrepreneurs and
                investors is our top priority.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <Button leftIcon={<Shield size={16} />}>View Reports</Button>
                <Button variant="outline">Take Action</Button>
              </div>
            </div>
            <div className="h-[40vh] md:h-[50vh] w-full lg:w-3/5">
              <FraudAndRiskDetectionChart data={fraudGrowthChartData} />

              <h3 className="mt-2 lg:ml-10 justify-center flex font-light text-sm underline text-blue-700">
                Fraud and Risk Detection GrowthRate
              </h3>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};