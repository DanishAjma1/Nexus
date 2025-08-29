import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
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
  createCollaborationRequest,
  getRequestsFromInvestor,
} from "../../data/collaborationRequests";
import { getEnterpreneurById, updateEntrepreneurData } from "../../data/users";
import { Entrepreneur } from "../../types";
import { Input } from "../../components/ui/Input";

export const EntrepreneurProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [entrepreneur, setEnterpreneur] = useState<Entrepreneur>();
  const initialData = {
    userId: id,
    startupName: entrepreneur?.startupName,
    pitchSummary: entrepreneur?.pitchSummary,
    fundingNeeded: entrepreneur?.fundingNeeded,
    industry: entrepreneur?.industry,
    foundedYear: entrepreneur?.foundedYear,
    teamSize: entrepreneur?.teamSize,
    minValuation: entrepreneur?.minValuation,
    maxValuation: entrepreneur?.maxValuation,
    marketOpportunity: entrepreneur?.marketOpportunity,
    advantage: entrepreneur?.advantage,
  };
  const [formData, setFormData] = useState(initialData);

  // Fetch entrepreneur data
  useEffect(() => {
    const fetchEntrepreneur = async () => {
      const entrepreneur = await getEnterpreneurById(id);
      setEnterpreneur(entrepreneur);
    };
    fetchEntrepreneur();
  }, []);

  useEffect(() => {
    setFormData(initialData);
  }, [entrepreneur]);

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
        <Link to="/dashboard/investor">
          <Button variant="outline" className="mt-4">
            Back to Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  const isCurrentUser =
    currentUser?.userId === (entrepreneur.userId || entrepreneur._id);
  const isInvestor = currentUser?.role === "investor";

  // Check if the current investor has already sent a request to this entrepreneur
  const hasRequestedCollaboration =
    isInvestor && id
      ? getRequestsFromInvestor(currentUser.userId).some(
          (req) => req.entrepreneurId === id
        )
      : false;

  const handleSendRequest = () => {
    if (isInvestor && currentUser && id) {
      createCollaborationRequest(
        currentUser.userId,
        id,
        `I'm interested in learning more about ${entrepreneur.startupName} and would like to explore potential investment opportunities.`
      );
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    updateEntrepreneurData(formData);
    const {
      startupName,
      pitchSummary,
      fundingNeeded,
      industry,
      foundedYear,
      teamSize,
      marketOpportunity,
      advantage,
      minValuation,
      maxValuation,
    } = formData;
    setEnterpreneur({
      ...entrepreneur,
      startupName,
      pitchSummary,
      fundingNeeded,
      industry,
      foundedYear,
      teamSize,
      marketOpportunity,
      advantage,
      minValuation,
      maxValuation,
    });
    setFormData(initialData);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {isEditing && (
        <div className="fixed inset-0 animate-slide-in animate-slide-out flex items-center justify-center bg-black/40 z-20">
          <div className="bg-white rounded-2xl shadow-lg p-6 max-h-3/6 overflow-y-scroll w-4/5 flex flex-col min-w-60 flex-shrink">
            <h2 className="text-xl font-medium my-5 underline underline-offset-4 flex justify-center">
              Profile Update
            </h2>
            <form
              onSubmit={handleSubmit}
              className="gap-5 flex flex-col text-sm justify-center items-center"
            >
              <div className="flex flex-row w-3/4 gap-5">
              <div className="flex gap-2 flex-col w-1/2">
                <Input
                  label="Your startup name..?"
                  name="startupName"
                  value={formData.startupName}
                  onChange={handleChange}
                />
                <Input
                  label="Summary about your company.."
                  name="pitchSummary"
                  value={formData.pitchSummary}
                  onChange={handleChange}
                />
                <Input
                  label="When you company founded..?"
                  name="foundedYear"
                  value={formData.foundedYear}
                  onChange={handleChange}
                />
              
                <Input
                  label="Team Size..?"
                  name="teamSize"
                  value={formData.teamSize}
                  onChange={handleChange}
                />
                <Input
                  label="Industry..?"
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                />
                </div>
              <div className="flex gap-2 flex-col w-1/2">
                <Input
                  label="How much fund you need..?"
                  name="fundingNeeded"
                  value={formData.fundingNeeded}
                  onChange={handleChange}
                />
                <Input
                  label="Market opporunity..?"
                  name="marketOpportunity"
                  value={formData.marketOpportunity}
                  onChange={handleChange}
                />
                <Input
                  label="Advantage..?"
                  name="advantage"
                  value={formData.advantage}
                  onChange={handleChange}
                />
                <Input
                  label="Minimum valuation..?"
                  name="minValuation"
                  value={formData.minValuation}
                  onChange={handleChange}
                />
                <Input
                  label="Maximum valuation..?"
                  name="maxValuation"
                  value={formData.maxValuation}
                  onChange={handleChange}
                />
              </div>
              </div>
              <div className="flex justify-end mt-4 gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsEditing(false);
                  }}
                >
                  Cancel
                </Button>
                <Button variant="outline" size="sm" type="submit">
                  Submit
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
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
                Founder at {entrepreneur.startupName}
              </p>

              <div className="flex flex-wrap gap-2 justify-center sm:justify-start mt-3">
                <Badge variant="primary">{entrepreneur.industry}</Badge>
                <Badge variant="gray">
                  <MapPin size={14} className="mr-1" />
                  {entrepreneur.location}
                </Badge>
                <Badge variant="accent">
                  <Calendar size={14} className="mr-1" />
                  Founded {entrepreneur.foundedYear}
                </Badge>
                <Badge variant="secondary">
                  <Users size={14} className="mr-1" />
                  {entrepreneur.teamSize} team members
                </Badge>
              </div>
            </div>
          </div>

          <div className="mt-6 sm:mt-0 flex flex-col sm:flex-row gap-2 justify-center sm:justify-end">
            {!isCurrentUser && (
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
            )}

            {isCurrentUser && (
              <Button
                variant="outline"
                leftIcon={<UserCircle size={18} />}
                onClick={(e) => {
                  e.preventDefault();
                  setIsEditing(true);
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
              <p className="text-gray-700">{entrepreneur.bio}</p>
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
                    {entrepreneur?.pitchSummary?.split(".")[0]}.
                  </p>
                </div>

                <div>
                  <h3 className="text-md font-medium text-gray-900">
                    Solution
                  </h3>
                  <p className="text-gray-700 mt-1">
                    {entrepreneur.pitchSummary}
                  </p>
                </div>

                <div>
                  <h3 className="text-md font-medium text-gray-900">
                    Market Opportunity
                  </h3>
                  <p className="text-gray-700 mt-1">
                    {entrepreneur.marketOpportunity}
                  </p>
                </div>

                <div>
                  <h3 className="text-md font-medium text-gray-900">
                    Competitive Advantage
                  </h3>
                  <p className="text-gray-700 mt-1">{entrepreneur.advantage}</p>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Team */}
          <Card>
            <CardHeader className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Team</h2>
              <span className="text-sm text-gray-500">
                {entrepreneur.teamSize} members
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

                {entrepreneur.teamSize > 3 && (
                  <div className="flex items-center justify-center p-3 border border-dashed border-gray-200 rounded-md">
                    <p className="text-sm text-gray-500">
                      + {entrepreneur.teamSize - 3} more team members
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
                  <span className="text-sm text-gray-500">Current Round</span>
                  <div className="flex items-center mt-1">
                    <DollarSign size={18} className="text-accent-600 mr-1" />
                    <p className="text-lg font-semibold text-gray-900">
                      {entrepreneur.fundingNeeded}
                    </p>
                  </div>
                </div>

                <div>
                  <span className="text-sm text-gray-500">Valuation</span>
                  <p className="text-md font-medium text-gray-900">
                    ${entrepreneur.minValuation} - ${entrepreneur.maxValuation}
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
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                        Completed
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium">Seed</span>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                        Completed
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium">Series A</span>
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                        In Progress
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
