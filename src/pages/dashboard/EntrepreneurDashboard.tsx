import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Bell,
  Calendar,
  TrendingUp,
  AlertCircle,
  PlusCircle,
} from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { CollaborationRequestCard } from "../../components/collaboration/CollaborationRequestCard";
import { InvestorCard } from "../../components/investor/InvestorCard";
import { useAuth } from "../../context/AuthContext";
import { CollaborationRequest } from "../../types";
import { getRequestsForEntrepreneur, updateRequestStatus } from "../../data/collaborationRequests";
import { getInvestorsFromDb } from "../../data/users";

export const EntrepreneurDashboard: React.FC = () => {
  const { user } = useAuth();
  const [collaborationRequests, setCollaborationRequests] = useState<CollaborationRequest[]>([]);
  const [recommendedInvestors, setRecommendedInvestors] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const investors = await getInvestorsFromDb();
        setRecommendedInvestors(investors);
      }
    };
    fetchData();
  }, [user]);

  useEffect(() => {
    const fetchRequests = async () => {
      if (user) {
        const requests = await getRequestsForEntrepreneur(user.userId);
        setCollaborationRequests(Array.isArray(requests) ? requests : []);
      }
    };
    fetchRequests();
  }, [user]);

  if (!user) return null;

  const pendingRequests = collaborationRequests.filter(req => req.requestStatus === "pending");

  const handleRequestStatusUpdate = (requestId: string, status: "accepted" | "rejected") => {
    setCollaborationRequests(prev =>
      prev.map(req => (req._id === requestId ? { ...req, requestStatus: status } : req))
    );
    updateRequestStatus(requestId, status);
  };

  return (
    <div className="space-y-6 animate-fade-in px-4 sm:px-6 lg:px-8 bg-black text-purple-200 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-purple-200">Welcome, {user.name}</h1>
          <p className="text-purple-400">Here's what's happening with your startup today</p>
        </div>
        <Link to="/investors" className="w-full sm:w-auto">
          <Button
            leftIcon={<PlusCircle size={18} />}
            className="w-full sm:w-auto bg-purple-900 text-purple-200 hover:bg-purple-800"
          >
            Find Investors
          </Button>
        </Link>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-purple-900 border border-purple-800">
          <CardBody className="flex items-center gap-4">
            <div className="p-3 bg-purple-800 rounded-full">
              <Bell size={20} className="text-purple-200" />
            </div>
            <div>
              <p className="text-sm font-medium text-purple-200">Pending Requests</p>
              <h3 className="text-xl font-semibold text-purple-100">{pendingRequests.length}</h3>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-purple-900 border border-purple-800">
          <CardBody className="flex items-center gap-4">
            <div className="p-3 bg-purple-800 rounded-full">
              <Users size={20} className="text-purple-200" />
            </div>
            <div>
              <p className="text-sm font-medium text-purple-200">Total Connections</p>
              <h3 className="text-xl font-semibold text-purple-100">
                {collaborationRequests.filter(req => req.requestStatus === "accepted").length}
              </h3>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-purple-900 border border-purple-800">
          <CardBody className="flex items-center gap-4">
            <div className="p-3 bg-purple-800 rounded-full">
              <Calendar size={20} className="text-purple-200" />
            </div>
            <div>
              <p className="text-sm font-medium text-purple-200">Upcoming Meetings</p>
              <h3 className="text-xl font-semibold text-purple-100">2</h3>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-purple-900 border border-purple-800">
          <CardBody className="flex items-center gap-4">
            <div className="p-3 bg-purple-800 rounded-full">
              <TrendingUp size={20} className="text-purple-200" />
            </div>
            <div>
              <p className="text-sm font-medium text-purple-200">Profile Views</p>
              <h3 className="text-xl font-semibold text-purple-100">24</h3>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Collaboration Requests & Recommended Investors */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Collaboration Requests */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="bg-purple-900 border border-purple-800">
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-purple-200">Collaboration Requests</h2>
              <Badge className="bg-purple-700 text-purple-200">{pendingRequests.length} pending</Badge>
            </CardHeader>
            <CardBody>
              {collaborationRequests.length > 0 ? (
                <div className="space-y-4">
                  {collaborationRequests.map(request => (
                    <CollaborationRequestCard
                      key={request._id}
                      request={request}
                      onStatusUpdate={handleRequestStatusUpdate}
                      darkMode
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-800 mb-4">
                    <AlertCircle size={24} className="text-purple-200" />
                  </div>
                  <p className="text-purple-400">No collaboration requests yet</p>
                  <p className="text-sm text-purple-500 mt-1">
                    When investors are interested in your startup, their requests will appear here
                  </p>
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Recommended Investors */}
        <div className="space-y-4">
          <Card className="bg-purple-900 border border-purple-800">
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-purple-200">Recommended Investors</h2>
              <Link
                to="/investors"
                className="text-sm font-medium text-purple-300 hover:text-purple-200"
              >
                View all
              </Link>
            </CardHeader>
            <CardBody className="space-y-4">
              {recommendedInvestors.length > 0 ? (
                recommendedInvestors.map((investor, i) => (
                  <InvestorCard key={i} investor={investor} darkMode />
                ))
              ) : (
                <div className="text-purple-500 text-center py-4">No investors found</div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};
