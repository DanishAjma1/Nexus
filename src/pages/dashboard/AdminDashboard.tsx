import React, { useEffect, useState } from "react";
import {
  Users,
  TrendingUp,
  AlertTriangle,
  BarChart3,
  Shield,
  Rocket,
  FileText,
  MessageSquare,
} from "lucide-react";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import axios from "axios";

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    startups: 0,
    investors: 0,
    supporters: 0,
    campaigns: 0,
    flagged: 0,
  });

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
        <Card className="bg-blue-50 border border-blue-100">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full mr-4">
                <Rocket size={20} className="text-blue-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-700">Startups</p>
                <h3 className="text-xl font-semibold text-blue-900">
                  {stats.startups}
                </h3>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-purple-50 border border-purple-100">
          <CardBody>
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full mr-4">
                <Users size={20} className="text-purple-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-purple-700">Investors</p>
                <h3 className="text-xl font-semibold text-purple-900">
                  {stats.investors}
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
              <div>
                <p className="text-sm font-medium text-amber-700">Supporters</p>
                <h3 className="text-xl font-semibold text-amber-900">
                  {stats.supporters}
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
              <div>
                <p className="text-sm font-medium text-green-700">Campaigns</p>
                <h3 className="text-xl font-semibold text-green-900">
                  {stats.campaigns}
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
              <div>
                <p className="text-sm font-medium text-red-700">Flagged</p>
                <h3 className="text-xl font-semibold text-red-900">
                  {stats.flagged}
                </h3>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Management sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Management */}
        <Card>
          <CardHeader className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">
              User Management
            </h2>
            <Link
              to="/admin/users"
              className="text-sm font-medium text-primary-600 hover:text-primary-500"
            >
              Manage
            </Link>
          </CardHeader>
          <CardBody>
            <p className="text-gray-600">
              Edit, approve, or remove user accounts. Monitor activity and
              handle reports of fraudulent behavior.
            </p>
            <div className="mt-4 flex gap-2">
              <Button>View Users</Button>
              <Button variant="outline">Activity Logs</Button>
            </div>
          </CardBody>
        </Card>

        {/* Campaign Oversight */}
        <Card>
          <CardHeader className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">
              Campaign Oversight
            </h2>
            <Badge variant="secondary">Crowdfunding</Badge>
          </CardHeader>
          <CardBody>
            <p className="text-gray-600">
              Review campaign submissions, approve or reject campaigns, and
              monitor funding progress.
            </p>
            <div className="mt-4 flex gap-2">
              <Button leftIcon={<FileText size={16} />}>
                Review Campaigns
              </Button>
              <Button variant="outline">Track Performance</Button>
            </div>
          </CardBody>
        </Card>

        {/* AI Assistant Moderation */}
        <Card>
          <CardHeader className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">
              AI Assistant Management
            </h2>
            <Badge variant="info">AI</Badge>
          </CardHeader>
          <CardBody>
            <p className="text-gray-600">
              Moderate AI-generated campaign suggestions and approve automated
              responses before they are shown to users.
            </p>
            <div className="mt-4 flex gap-2">
              <Button leftIcon={<MessageSquare size={16} />}>
                Review Responses
              </Button>
            </div>
          </CardBody>
        </Card>

        {/* Fraud Detection */}
        <Card>
          <CardHeader className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">
              Fraud & Risk Detection
            </h2>
            <Badge variant="destructive">Security</Badge>
          </CardHeader>
          <CardBody>
            <p className="text-gray-600">
              Monitor flagged activities and take corrective actions like
              freezing accounts or suspending suspicious campaigns.
            </p>
            <div className="mt-4 flex gap-2">
              <Button leftIcon={<Shield size={16} />}>View Reports</Button>
              <Button variant="outline">Take Action</Button>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Analytics Section */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-medium text-gray-900">
            Analytics & Reports
          </h2>
        </CardHeader>
        <CardBody>
          <p className="text-gray-600 mb-3">
            Generate insights on active startups, top investors, funding trends,
            and overall crowdfunding performance.
          </p>
          <Button leftIcon={<BarChart3 size={16} />}>View Reports</Button>
        </CardBody>
      </Card>
    </div>
  );
};
