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
import {
  getRequestsForEntrepreneur,
  updateRequestStatus,
} from "../../data/collaborationRequests";
import { getInvestorsFromDb } from "../../data/users";

export const EntrepreneurDashboard: React.FC = () => {
  const { user } = useAuth();
  const [collaborationRequests, setCollaborationRequests] = useState<
    CollaborationRequest[]
  >([]);
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
      if (user?.userId) {
        const requests = await getRequestsForEntrepreneur(user.userId);
        setCollaborationRequests(Array.isArray(requests) ? requests : []);
      }
    };
    fetchRequests();
  }, [user?.userId]);

  if (!user) return null;

  const pendingRequests =
    collaborationRequests?.filter((req) => req.requestStatus === "pending") || [];

  const handleRequestStatusUpdate = (
    requestId: string,
    status: "accepted" | "rejected"
  ) => {
    setCollaborationRequests((prevRequests) =>
      prevRequests.map((req) =>
        req._id === requestId ? { ...req, requestStatus: status } : req
      )
    );
    updateRequestStatus(requestId, status);
  };

  return (
    <div className="space-y-6 animate-fade-in bg-black min-h-screen text-yellow-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-yellow-700 pb-4">
        <div>
          <h1 className="text-3xl font-bold text-yellow-400">
            Welcome, {user.name}
          </h1>
          <p className="text-yellow-600">
            Here’s what’s happening with your startup today
          </p>
        </div>

        <Link to="/investors">
          <Button className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded-full px-5 py-2 flex items-center space-x-2 transition">
            <PlusCircle size={18} />
            <span>Find Investors</span>
          </Button>
        </Link>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          {
            icon: Bell,
            label: "Pending Requests",
            value: pendingRequests.length,
          },
          {
            icon: Users,
            label: "Total Connections",
            value: collaborationRequests.filter(
              (req) => req.requestStatus === "accepted"
            ).length,
          },
          { icon: Calendar, label: "Upcoming Meetings", value: 2 },
          { icon: TrendingUp, label: "Profile Views", value: 24 },
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

      {/* Main section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Collaboration requests */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="bg-neutral-900 border border-yellow-700 shadow-lg">
            <CardHeader className="flex justify-between items-center border-b border-yellow-700 pb-2">
              <h2 className="text-lg font-semibold text-yellow-400">
                Collaboration Requests
              </h2>
              <Badge className="bg-yellow-500 text-black font-semibold rounded-full px-3 py-1">
                {pendingRequests.length} pending
              </Badge>
            </CardHeader>

            <CardBody>
              {collaborationRequests.length > 0 ? (
                <div className="space-y-4">
                  {collaborationRequests.map((request) => (
                    <CollaborationRequestCard
                      key={request._id}
                      request={request}
                      onStatusUpdate={handleRequestStatusUpdate}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-900 mb-4">
                    <AlertCircle size={28} className="text-yellow-500" />
                  </div>
                  <p className="text-yellow-400 font-medium">
                    No collaboration requests yet
                  </p>
                  <p className="text-sm text-yellow-600 mt-1">
                    When investors are interested in your startup, their
                    requests will appear here.
                  </p>
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Recommended investors */}
        <div className="space-y-4">
          <Card className="bg-neutral-900 border border-yellow-700 shadow-lg">
            <CardHeader className="flex justify-between items-center border-b border-yellow-700 pb-2">
              <h2 className="text-lg font-semibold text-yellow-400">
                Recommended Investors
              </h2>
              <Link
                to="/investors"
                className="text-sm font-medium text-yellow-500 hover:text-yellow-400 transition"
              >
                View all
              </Link>
            </CardHeader>

            <CardBody className="space-y-4">
              {recommendedInvestors && recommendedInvestors.length > 0 ? (
                recommendedInvestors.map((investor, i) => (
                  <div key={i}>
                    <InvestorCard investor={investor} />
                  </div>
                ))
              ) : (
                <div className="text-yellow-600">No investors found</div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};
