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
    // ensure we multiply two numbers: use a numeric default for nichevalue and revenue
    const base = nichevalue ?? 1;
    const revenue = entrepreneur?.revenue ?? 0;
    setValuation(base * revenue);
  }, [entrepreneur]);

  useEffect(() => {
    const checkInvestor = async () => {
      if (currentUser?.userId && id) {
        const request = await checkRequestsFromInvestor(currentUser.userId, id);
        console.log(request);
        setHasRequestedCollaboration(Boolean(request));
      }
    };
    checkInvestor();
  }, [currentUser?.userId, id]);

  if (!currentUser) return null;
  if (!entrepreneur || entrepreneur.role !== "entrepreneur") {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">
          Entrepreneur not found
        </h2>
        <p className="text-gray-600 mt-2">
          The entrepreneur profile you're looking for doesn't exist or has been
          removed.
        </p>
        s
        <Link to="/dashboard/investor">
          <Button variant="outline" className="mt-4">
            Back to Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  const isCurrentUser = currentUser?.userId === entrepreneur?.userId;
  const isInvestor = currentUser?.role === "investor";
  const isAdmin = currentUser?.role === "admin";
  // Check if the current investor has already sent a request to this entrepreneur

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
    <div className="space-y-6 animate-fade-in">
      {/* Profile header */}
      <Card>
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
              <h1 className="text-2xl font-bold text-gray-900">
                {entrepreneur.name}
              </h1>
              <p className="text-gray-600 flex items-center justify-center sm:justify-start mt-1">
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
                  {entrepreneur.teamSize || 0} team members
                </Badge>
              </div>
            </div>
          </div>

          <div className="mt-6 sm:mt-0 flex flex-col sm:flex-row gap-2 justify-center sm:justify-end">
            {!isAdmin ? (
              !isCurrentUser && (
                <>
                  <Link to={`/chat/${entrepreneur.userId}`}>
                    <Button
                      variant="outline"
                      leftIcon={<MessageCircle size={18} />}
                    >
                      Message
                    </Button>
                  </Link>

                  {isInvestor && (
                    <Button
                      leftIcon={<Send size={18} />}
                      disabled={hasRequestedCollaboration}
                      onClick={handleSendRequest}
                    >
                      {hasRequestedCollaboration
                        ? "Request Sent"
                        : "Request Collaboration"}
                    </Button>
                  )}
                </>
              )
            ) : (
              <></>
            )}

            {hasRequestedCollaboration && (
              <Button
                className="ml-2 bg-blue-600 text-white hover:bg-blue-700"
                onClick={() => setIsDealModalOpen(true)}
              >
                Make a Deal
              </Button>
            )}
            {isDealModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white rounded-lg w-96 p-6 relative shadow-lg">
                  <h2 className="text-lg font-bold mb-4">Make a Deal</h2>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      alert("Deal successfully submitted");

                      setIsDealModalOpen(false);
                    }}
                  >
                    {/* Entrepreneur Info */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Entrepreneur Name
                      </label>
                      <input
                        type="text"
                        value={entrepreneur?.name || "Zain"}
                        readOnly
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-gray-100"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Business Name
                      </label>
                      <input
                        type="text"
                        value={entrepreneur?.startupName || "Abcdmedia Startup"}
                        readOnly
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-gray-100"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Deal Details
                      </label>
                      <textarea
                        required
                        defaultValue="We propose an initial investment of $100,000 for 10% equity."
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                      />
                    </div>

                    {/* Investor Input Fields */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Investment Amount ($)
                      </label>
                      <input
                        type="number"
                        defaultValue={50000} // dummy amount
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Requested Equity (%)
                      </label>
                      <input
                        type="number"
                        defaultValue={5} // dummy equity
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                      />
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        type="button"
                        onClick={() => setIsDealModalOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">Send Deal</Button>
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
                {entrepreneur.bio || "Say about yours..?"}
              </p>
            </CardBody>
          </Card>

          {/* Startup Description */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-medium text-gray-900">
                Startup Overview
              </h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div>
                  <h3 className="text-md font-medium text-gray-900">
                    Problem Statement
                  </h3>
                  <p className="text-gray-700 mt-1">
                    {entrepreneur?.pitchSummary?.split(".")[0] || "--"}.
                  </p>
                </div>

                <div>
                  <h3 className="text-md font-medium text-gray-900">
                    Solution
                  </h3>
                  <p className="text-gray-700 mt-1">
                    {entrepreneur.pitchSummary || "--"}
                  </p>
                </div>

                <div>
                  <h3 className="text-md font-medium text-gray-900">
                    Market Opportunity
                  </h3>
                  <p className="text-gray-700 mt-1">
                    {entrepreneur.marketOpportunity || "--"}
                  </p>
                </div>

                <div>
                  <h3 className="text-md font-medium text-gray-900">
                    Competitive Advantage
                  </h3>
                  <p className="text-gray-700 mt-1">
                    {entrepreneur.advantage || "--"}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Team */}
          <Card>
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Team</h2>
              <span className="text-sm text-gray-500">
                {entrepreneur.teamSize || 0} members
              </span>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center p-3 border border-gray-200 rounded-md">
                  <Avatar
                    src={entrepreneur.avatarUrl}
                    alt={entrepreneur.name}
                    size="md"
                    className="mr-3"
                  />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      {entrepreneur.name}
                    </h3>
                    <p className="text-xs text-gray-500">Founder & CEO</p>
                  </div>
                </div>

                <div className="flex items-center p-3 border border-gray-200 rounded-md">
                  <Avatar
                    src="https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg"
                    alt="Team Member"
                    size="md"
                    className="mr-3"
                  />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      Alex Johnson
                    </h3>
                    <p className="text-xs text-gray-500">CTO</p>
                  </div>
                </div>

                <div className="flex items-center p-3 border border-gray-200 rounded-md">
                  <Avatar
                    src="https://images.pexels.com/photos/773371/pexels-photo-773371.jpeg"
                    alt="Team Member"
                    size="md"
                    className="mr-3"
                  />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      Jessica Chen
                    </h3>
                    <p className="text-xs text-gray-500">Head of Product</p>
                  </div>
                </div>

                {entrepreneur.teamSize && entrepreneur?.teamSize > 3 && (
                  <div className="flex items-center justify-center p-3 border border-dashed border-gray-200 rounded-md">
                    <p className="text-sm text-gray-500">
                      + {entrepreneur?.teamSize - 3} more team members
                    </p>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Sidebar - right side */}
        <div className="space-y-6">
          {/* Funding Details */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-medium text-gray-900">Funding</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div>
                  <span className="text-sm text-gray-500">Fund needed</span>
                  <div className="flex items-center mt-1">
                    <DollarSign size={18} className="text-accent-600 mr-1" />
                    <p className="text-lg font-semibold text-gray-900">
                      {AmountMeasureWithTags(entrepreneur.fundingNeeded ?? 0)}
                    </p>
                  </div>
                </div>

                <div>
                  <span className="text-sm text-gray-500">Valuation</span>
                  <p className="text-md font-medium text-gray-900">
                    ${AmountMeasureWithTags(valuation ?? 0)}
                  </p>
                </div>

                <div>
                  <span className="text-sm text-gray-500">
                    Previous Funding
                  </span>
                  <p className="text-md font-medium text-gray-900">
                    $750K Seed (2022)
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-100">
                  <span className="text-sm text-gray-500">
                    Funding Timeline
                  </span>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium">Pre-seed</span>
                      <span
                        className={`text-xs ${
                          fundAmount > 100000
                            ? " text-green-800 bg-green-100"
                            : "text-yellow-800 bg-yellow-100"
                        } px-2 py-0.5 rounded-full`}
                      >
                        {fundAmount > 100000 ? "Completed" : "In progress"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium">Seed</span>
                      <span
                        className={`text-xs  ${
                          fundAmount > 2500000
                            ? " text-green-800 bg-green-100"
                            : "text-yellow-800 bg-yellow-100"
                        } px-2 py-0.5 rounded-full`}
                      >
                        {fundAmount > 2500000 ? "Completed" : "In progress"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium">Series A</span>
                      <span
                        className={`text-xs ${
                          fundAmount > 20000000
                            ? " text-green-800 bg-green-100"
                            : "text-yellow-800 bg-yellow-100"
                        } px-2 py-0.5 rounded-full`}
                      >
                        {fundAmount > 20000000 ? "Completed" : "In progress"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Documents */}
          <Card>
            <CardHeader>
              <h2 className="text-lg font-medium text-gray-900">Documents</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                <div className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
                  <div className="p-2 bg-primary-50 rounded-md mr-3">
                    <FileText size={18} className="text-primary-700" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">
                      Pitch Deck
                    </h3>
                    <p className="text-xs text-gray-500">
                      Updated 2 months ago
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>

                <div className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
                  <div className="p-2 bg-primary-50 rounded-md mr-3">
                    <FileText size={18} className="text-primary-700" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">
                      Business Plan
                    </h3>
                    <p className="text-xs text-gray-500">Updated 1 month ago</p>
                  </div>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>

                <div className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
                  <div className="p-2 bg-primary-50 rounded-md mr-3">
                    <FileText size={18} className="text-primary-700" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">
                      Financial Projections
                    </h3>
                    <p className="text-xs text-gray-500">Updated 2 weeks ago</p>
                  </div>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
              </div>

              {!isCurrentUser && isInvestor && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-500">
                    Request access to detailed documents and financials by
                    sending a collaboration request.
                  </p>

                  {!hasRequestedCollaboration ? (
                    <Button className="mt-3 w-full" onClick={handleSendRequest}>
                      Request Collaboration
                    </Button>
                  ) : (
                    <Button className="mt-3 w-full" disabled>
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
