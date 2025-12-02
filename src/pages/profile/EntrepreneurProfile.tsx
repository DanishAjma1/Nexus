import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  MessageCircle,
  Users,
  Calendar,
  Building2,
  MapPin,
  UserCircle,
  FileText,
  DollarSign,
  Send,
} from "lucide-react";
import { Avatar } from "../../components/ui/Avatar";
import { Button } from "../../components/ui/Button";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { useAuth } from "../../context/AuthContext";
import {
  checkRequestsFromInvestor,
  createCollaborationRequest,
} from "../../data/collaborationRequests";
import { Entrepreneur } from "../../types";
import { AmountMeasureWithTags, getEnterpreneurById } from "../../data/users";

type Props = {
  userId?: string | undefined;
};

export const EntrepreneurProfile: React.FC<Props> = ({ userId }) => {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser } = useAuth();
  const [entrepreneur, setEnterpreneur] = useState<Entrepreneur>();
  const [hasRequestedCollaboration, setHasRequestedCollaboration] =
    useState<boolean>();
  const [isDealModalOpen, setIsDealModalOpen] = useState(false);

  const navigate = useNavigate();
  const [valuation, setValuation] = useState<number | undefined>(0);

  useEffect(() => {
    const fetchEntrepreneur = async () => {
      if (id) {
        const entrepreneur = await getEnterpreneurById(id);
        setEnterpreneur(entrepreneur);
      } else {
        const entrepreneur = await getEnterpreneurById(userId);
        setEnterpreneur(entrepreneur);
      }
    };
    fetchEntrepreneur();
  }, [id, userId]);

  useEffect(() => {
    const calculateValuation = () => {
      if (entrepreneur?.growthRate && entrepreneur?.profitMargin)
        return (
          5 *
          (1 +
            entrepreneur?.growthRate / 100 +
            entrepreneur?.profitMargin / 100)
        );
    };
    const nichevalue = calculateValuation();
    const base = nichevalue ?? 1;
    const revenue = entrepreneur?.revenue ?? 0;
    setValuation(base * revenue);
  }, [entrepreneur]);

  useEffect(() => {
    const checkInvestor = async () => {
      if (currentUser?.userId && id) {
        const request = await checkRequestsFromInvestor(currentUser.userId, id);
        setHasRequestedCollaboration(Boolean(request));
      }
    };
    checkInvestor();
  }, [currentUser?.userId, id]);

  if (!currentUser) return null;
  if (!entrepreneur || entrepreneur.role !== "entrepreneur") {
    return (
      <div className="text-center py-12 bg-black text-white min-h-screen">
        <h2 className="text-2xl font-bold">Entrepreneur not found</h2>
        <p className="mt-2 text-gray-300">
          The entrepreneur profile you're looking for doesn't exist or has been
          removed.
        </p>
        <Link to="/dashboard/investor">
          <Button variant="outline" className="mt-4 text-purple-400 border-purple-600 hover:bg-purple-800">
            Back to Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  const isCurrentUser = currentUser?.userId === entrepreneur?.userId;
  const isInvestor = currentUser?.role === "investor";
  const isAdmin = currentUser?.role === "admin";

  const handleSendRequest = async () => {
    if (isInvestor && currentUser && id) {
      createCollaborationRequest(
        currentUser.userId,
        id,
        `I'm interested in learning more about ${entrepreneur.startupName} and would like to explore potential investment opportunities.`
      );
      await setHasRequestedCollaboration(true);
    }
  };

  const fundAmount = valuation ?? 0;

  return (
    <div className="space-y-6 animate-fade-in bg-black min-h-screen text-white p-4">
      {/* Profile header */}
      <Card className="bg-purple-900 text-white border-purple-700">
        <CardBody className="sm:flex sm:items-start sm:justify-between p-6">
          <div className="sm:flex sm:space-x-6">
            <Avatar
              src={entrepreneur.avatarUrl}
              alt={entrepreneur.name}
              size="xl"
              status={entrepreneur.isOnline ? "online" : "offline"}
              className="mx-auto sm:mx-0"
            />
            <div className="mt-4 sm:mt-0 text-center sm:text-left">
              <h1 className="text-2xl font-bold">{entrepreneur.name}</h1>
              <p className="text-gray-300 flex items-center justify-center sm:justify-start mt-1">
                <Building2 size={16} className="mr-1" />
                Founder at {entrepreneur.startupName || "--"}
              </p>

              <div className="flex flex-wrap gap-2 justify-center sm:justify-start mt-3">
                <Badge variant="primary">{entrepreneur.industry || "--"}</Badge>
                <Badge variant="gray">
                  <MapPin size={14} className="mr-1" />
                  {entrepreneur.location || "--"}
                </Badge>
                <Badge variant="accent">
                  <Calendar size={14} className="mr-1" />
                  Founded {entrepreneur.foundedYear || "--"}
                </Badge>
                <Badge variant="secondary">
                  <Users size={14} className="mr-1" />
                  {entrepreneur.teamSize || 0} members
                </Badge>
              </div>
            </div>
          </div>

          <div className="mt-6 sm:mt-0 flex flex-col sm:flex-row gap-2 justify-center sm:justify-end">
            {!isAdmin && !isCurrentUser && (
              <>
                <Link to={`/chat/${entrepreneur.userId}`}>
                  <Button
                    variant="outline"
                    leftIcon={<MessageCircle size={18} />}
                    className="border-purple-500 text-purple-300 hover:bg-purple-800"
                  >
                    Message
                  </Button>
                </Link>
                {isInvestor && (
                  <Button
                    leftIcon={<Send size={18} />}
                    disabled={hasRequestedCollaboration}
                    onClick={handleSendRequest}
                    className="bg-purple-700 hover:bg-purple-600 text-white disabled:bg-gray-700"
                  >
                    {hasRequestedCollaboration
                      ? "Request Sent"
                      : "Request Collaboration"}
                  </Button>
                )}
              </>
            )}

            {hasRequestedCollaboration && (
              <Button
                className="ml-2 bg-purple-800 text-white hover:bg-purple-700"
                onClick={() => setIsDealModalOpen(true)}
              >
                Make a Deal
              </Button>
            )}

            {isDealModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
                <div className="bg-purple-900 text-white rounded-lg w-96 p-6 shadow-lg">
                  <h2 className="text-lg font-bold mb-4">Make a Deal</h2>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      alert("Deal successfully submitted");
                      setIsDealModalOpen(false);
                    }}
                  >
                    <div className="mb-4">
                      <label className="block text-sm font-medium">Entrepreneur Name</label>
                      <input
                        type="text"
                        value={entrepreneur?.name || "Zain"}
                        readOnly
                        className="mt-1 block w-full border border-gray-700 rounded-md p-2 bg-gray-800 text-white"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium">Business Name</label>
                      <input
                        type="text"
                        value={entrepreneur?.startupName || "Abcdmedia Startup"}
                        readOnly
                        className="mt-1 block w-full border border-gray-700 rounded-md p-2 bg-gray-800 text-white"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium">Deal Details</label>
                      <textarea
                        required
                        defaultValue="We propose an initial investment of $100,000 for 10% equity."
                        className="mt-1 block w-full border border-gray-700 rounded-md p-2 bg-gray-800 text-white"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium">Investment Amount ($)</label>
                      <input
                        type="number"
                        defaultValue={50000}
                        className="mt-1 block w-full border border-gray-700 rounded-md p-2 bg-gray-800 text-white"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium">Requested Equity (%)</label>
                      <input
                        type="number"
                        defaultValue={5}
                        className="mt-1 block w-full border border-gray-700 rounded-md p-2 bg-gray-800 text-white"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        type="button"
                        onClick={() => setIsDealModalOpen(false)}
                        className="border-purple-500 text-purple-300 hover:bg-purple-800"
                      >
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-purple-700 hover:bg-purple-600 text-white">
                        Send Deal
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {isCurrentUser && (
              <Button
                variant="outline"
                leftIcon={<UserCircle size={18} />}
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/settings");
                }}
                className="border-purple-500 text-purple-300 hover:bg-purple-800"
              >
                Edit Profile
              </Button>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* About */}
          <Card className="bg-purple-900 border-purple-700 text-white">
            <CardHeader>
              <h2 className="text-lg font-medium">About</h2>
            </CardHeader>
            <CardBody>
              <p>{entrepreneur.bio || "Say about yours..?"}</p>
            </CardBody>
          </Card>

          {/* Startup Overview */}
          <Card className="bg-purple-900 border-purple-700 text-white">
            <CardHeader>
              <h2 className="text-lg font-medium">Startup Overview</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <div>
                <h3 className="text-md font-medium">Problem Statement</h3>
                <p className="mt-1">{entrepreneur?.pitchSummary?.split(".")[0] || "--"}.</p>
              </div>
              <div>
                <h3 className="text-md font-medium">Solution</h3>
                <p className="mt-1">{entrepreneur.pitchSummary || "--"}</p>
              </div>
              <div>
                <h3 className="text-md font-medium">Market Opportunity</h3>
                <p className="mt-1">{entrepreneur.marketOpportunity || "--"}</p>
              </div>
              <div>
                <h3 className="text-md font-medium">Competitive Advantage</h3>
                <p className="mt-1">{entrepreneur.advantage || "--"}</p>
              </div>
            </CardBody>
          </Card>

          {/* Team */}
          <Card className="bg-purple-900 border-purple-700 text-white">
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-lg font-medium">Team</h2>
              <span className="text-sm text-gray-300">{entrepreneur.teamSize || 0} members</span>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center p-3 border border-gray-700 rounded-md">
                  <Avatar src={entrepreneur.avatarUrl} alt={entrepreneur.name} size="md" className="mr-3" />
                  <div>
                    <h3 className="text-sm font-medium">{entrepreneur.name}</h3>
                    <p className="text-xs text-gray-300">Founder & CEO</p>
                  </div>
                </div>
                {/* Additional team members */}
                <div className="flex items-center p-3 border border-gray-700 rounded-md">
                  <Avatar src="https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg" alt="Team Member" size="md" className="mr-3" />
                  <div>
                    <h3 className="text-sm font-medium">Alex Johnson</h3>
                    <p className="text-xs text-gray-300">CTO</p>
                  </div>
                </div>
                <div className="flex items-center p-3 border border-gray-700 rounded-md">
                  <Avatar src="https://images.pexels.com/photos/773371/pexels-photo-773371.jpeg" alt="Team Member" size="md" className="mr-3" />
                  <div>
                    <h3 className="text-sm font-medium">Jessica Chen</h3>
                    <p className="text-xs text-gray-300">Head of Product</p>
                  </div>
                </div>
                {entrepreneur.teamSize && entrepreneur?.teamSize > 3 && (
                  <div className="flex items-center justify-center p-3 border border-dashed border-gray-700 rounded-md">
                    <p className="text-sm text-gray-300">+ {entrepreneur?.teamSize - 3} more team members</p>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Funding */}
          <Card className="bg-purple-900 border-purple-700 text-white">
            <CardHeader>
              <h2 className="text-lg font-medium">Funding</h2>
            </CardHeader>
            <CardBody className="space-y-4">
              <div>
                <span className="text-sm text-gray-300">Fund needed</span>
                <div className="flex items-center mt-1">
                  <DollarSign size={18} className="text-purple-400 mr-1" />
                  <p className="text-lg font-semibold">${AmountMeasureWithTags(entrepreneur.fundingNeeded ?? 0)}</p>
                </div>
              </div>
              <div>
                <span className="text-sm text-gray-300">Valuation</span>
                <p className="text-md font-medium">${AmountMeasureWithTags(valuation ?? 0)}</p>
              </div>
            </CardBody>
          </Card>

          {/* Documents */}
          <Card className="bg-purple-900 border-purple-700 text-white">
            <CardHeader>
              <h2 className="text-lg font-medium">Documents</h2>
            </CardHeader>
            <CardBody className="space-y-3">
              {["Pitch Deck", "Business Plan", "Financial Projections"].map((doc, i) => (
                <div key={i} className="flex items-center p-3 border border-gray-700 rounded-md hover:bg-purple-800 transition-colors">
                  <div className="p-2 bg-purple-800 rounded-md mr-3">
                    <FileText size={18} className="text-purple-300" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium">{doc}</h3>
                    <p className="text-xs text-gray-300">Updated recently</p>
                  </div>
                  <Button variant="outline" size="sm" className="border-purple-500 text-purple-300 hover:bg-purple-800">View</Button>
                </div>
              ))}

              {!isCurrentUser && isInvestor && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <p className="text-sm text-gray-300">
                    Request access to detailed documents and financials by sending a collaboration request.
                  </p>
                  {!hasRequestedCollaboration ? (
                    <Button className="mt-3 w-full bg-purple-700 hover:bg-purple-600 text-white" onClick={handleSendRequest}>
                      Request Collaboration
                    </Button>
                  ) : (
                    <Button className="mt-3 w-full bg-gray-700 text-gray-300" disabled>
                      Request Sent
                    </Button>
                  )}
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};
