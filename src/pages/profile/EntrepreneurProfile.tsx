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
  Check,
  X,
  Clock,
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
import { AmountMeasureWithTags, getEnterpreneurById, updateEntrepreneurData } from "../../data/users";
import { suspendUser, blockUser, unsuspendUser, unblockUser } from "../../data/admin"; // Import admin actions
import { DealForm } from "../../components/DealForm";

type Props = {
  userId?: string | undefined;
};
export const EntrepreneurProfile: React.FC<Props> = ({ userId }) => {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser } = useAuth();
  const [entrepreneur, setEnterpreneur] = useState<Entrepreneur>();
  const [requestStatus, setRequestStatus] = useState<
    "pending" | "accepted" | "rejected" | null
  >(null);
  const [isDealModalOpen, setIsDealModalOpen] = useState(false);

  const [isSuspendModalOpen, setIsSuspendModalOpen] = useState(false);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [suspendReason, setSuspendReason] = useState("");
  const [suspendDays, setSuspendDays] = useState(7);
  const [blockReason, setBlockReason] = useState("");

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



  // Removed legacy auto-calculation of valuation that was overwriting backend data.
  // Valuation and Status are now managed by backend events (e.g. Fund Release).
  useEffect(() => {
    if (entrepreneur) {
      setValuation(entrepreneur.valuation);
    }
  }, [entrepreneur]);

  useEffect(() => {
    const checkInvestor = async () => {
      if (currentUser?.userId && id) {
        const request = await checkRequestsFromInvestor(currentUser.userId, id);
        console.log(request);
        // The endpoint returns the status string directly or 'pending' if error/not found?
        // Let's assume it returns the request object or status string as per `checkRequestsFromInvestor` implementation
        // The data helper returns: return request.requestStatus;
        setRequestStatus(request as any);
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
  console.log("CurrentUser:", currentUser?.userId);
  console.log("EntrepreneurUser:", entrepreneur?.userId);
  console.log("IsCurrentUser:", isCurrentUser);

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
      setRequestStatus("pending");
    }
  };

  const handleSuspend = async () => {
    if (!entrepreneur?.userId) return;
    try {
      await suspendUser(entrepreneur.userId, suspendReason, suspendDays);
      setIsSuspendModalOpen(false);
      // Refresh data
      const updated = await getEnterpreneurById(entrepreneur.userId);
      setEnterpreneur(updated);
    } catch (error) {
      console.error(error);
    }
  };

  const handleBlock = async () => {
    if (!entrepreneur?.userId) return;
    try {
      await blockUser(entrepreneur.userId, blockReason);
      setIsBlockModalOpen(false);
      navigate("/dashboard"); // Redirect after block as user is now hidden
    } catch (error) {
      console.error(error);
    }
  };

  const handleUnsuspend = async () => {
    if (!entrepreneur?.userId) return;
    if (confirm("Are you sure you want to unsuspend this user?")) {
      await unsuspendUser(entrepreneur.userId);
      const updated = await getEnterpreneurById(entrepreneur.userId);
      setEnterpreneur(updated);
    }
  };

  const handleUnblock = async () => {
    if (!entrepreneur?.userId) return;
    if (confirm("Are you sure you want to unblock this user?")) {
      await unblockUser(entrepreneur.userId);
      const updated = await getEnterpreneurById(entrepreneur.userId);
      setEnterpreneur(updated);
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
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                {entrepreneur.name}
                {entrepreneur.isSuspended && (
                  <span className="inline-flex items-center font-medium rounded text-sm px-2.5 py-0.5 bg-red-100 text-red-800">
                    Suspended
                  </span>
                )}
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
                  {(!isInvestor || requestStatus === "accepted") && (
                    <Link to={`/chat/${entrepreneur.userId}`}>
                      <Button
                        variant="outline"
                        leftIcon={<MessageCircle size={18} />}
                      >
                        Message
                      </Button>
                    </Link>
                  )}

                  {isInvestor && (
                    <Button
                      leftIcon={
                        requestStatus === "pending" ? (
                          <Clock size={18} />
                        ) : requestStatus === "accepted" ? (
                          <Check size={18} />
                        ) : (
                          <Send size={18} />
                        )
                      }
                      disabled={requestStatus === "pending" || requestStatus === "accepted"}
                      onClick={handleSendRequest}
                    >
                      {requestStatus === "pending"
                        ? "Request Sent"
                        : requestStatus === "accepted"
                          ? "Request Accepted"
                          : "Request Collaboration"}
                    </Button>
                  )}
                </>
              )
            ) : (
              // Admin Actions ... (omitted for brevity, assume unchanged context)
              <div className="flex flex-col gap-2">
                {/* ... admin buttons ... */}
                {entrepreneur.isSuspended ? (
                  <Button
                    variant="outline"
                    className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                    onClick={handleUnsuspend}
                  >
                    Unsuspend User
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100"
                    onClick={() => setIsSuspendModalOpen(true)}
                  >
                    Suspend User
                  </Button>
                )}

                {entrepreneur.isBlocked ? (
                  <Button
                    variant="outline"
                    className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                    onClick={handleUnblock}
                  >
                    Unblock User
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                    onClick={() => setIsBlockModalOpen(true)}
                  >
                    Block User
                  </Button>
                )}
              </div>
            )}

            {isInvestor && requestStatus === "accepted" && (
              <Button
                className="ml-2 bg-blue-600 text-white hover:bg-blue-700"
                onClick={() => setIsDealModalOpen(true)}
              >
                Make a Deal
              </Button>
            )}
            {isDealModalOpen && entrepreneur && currentUser && (
              <DealForm
                entrepreneur={entrepreneur}
                investor={currentUser}
                valuation={valuation || 0}
                onClose={() => setIsDealModalOpen(false)}
              />
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

      {/* Suspend Modal */}
      {isSuspendModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-[9999]">
          <div className="bg-white rounded-lg w-96 p-6 relative shadow-lg">
            <h2 className="text-lg font-bold mb-4">Suspend User</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
              <textarea
                className="w-full border rounded p-2"
                rows={3}
                value={suspendReason}
                onChange={(e) => setSuspendReason(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration (days)</label>
              <input
                type="number"
                className="w-full border rounded p-2"
                value={suspendDays}
                onChange={(e) => setSuspendDays(parseInt(e.target.value))}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsSuspendModalOpen(false)}>Cancel</Button>
              <Button onClick={handleSuspend} className="bg-yellow-600 hover:bg-yellow-700 text-white">Suspend</Button>
            </div>
          </div>
        </div>
      )}

      {/* Block Modal */}
      {isBlockModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-[9999]">
          <div className="bg-white rounded-lg w-96 p-6 relative shadow-lg">
            <h2 className="text-lg font-bold mb-4 text-red-600">Block User</h2>
            <p className="text-sm text-gray-500 mb-4">Blocking a user will hide their profile and prevent them from accessing the platform. This action is severe.</p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
              <textarea
                className="w-full border rounded p-2"
                rows={3}
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsBlockModalOpen(false)}>Cancel</Button>
              <Button onClick={handleBlock} className="bg-red-600 hover:bg-red-700 text-white">Block User</Button>
            </div>
          </div>
        </div>
      )}

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
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  {entrepreneur.team?.length || 0} members
                </span>
                {isCurrentUser && (
                  <Link to="/dashboard/entrepreneur/team">
                    <Button variant="outline" size="sm" className="text-xs">
                      Manage Team
                    </Button>
                  </Link>
                )}
              </div>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {entrepreneur.team &&
                  entrepreneur.team.filter(member =>
                    !member.role.some(role => role.toLowerCase() === "member")
                  ).length > 0 ? (
                  entrepreneur.team
                    .filter(member =>
                      !member.role.some(role => role.toLowerCase() === "member")
                    )
                    .sort((a, b) => {
                      // Define role priority order
                      const rolePriority: { [key: string]: number } = {
                        "CEO": 1,
                        "Founder": 2,
                        "Co-Founder": 3,
                        "CTO": 4,
                        "CFO": 5,
                        "COO": 6,
                        "President": 7,
                        "VP": 8,
                        "Director": 9,
                        "Head": 10,
                        "Manager": 11,
                        "Lead": 12,
                        "Senior": 13
                      };

                      // Get the highest priority role for each member (lowest number = higher priority)
                      const getHighestPriority = (roles: string[]): number => {
                        let highestPriority = Infinity;
                        roles.forEach(role => {
                          // Check for exact matches first
                          if (rolePriority[role] && rolePriority[role] < highestPriority) {
                            highestPriority = rolePriority[role];
                          } else {
                            // Check for partial matches (e.g., "VP of Engineering" contains "VP")
                            for (const [key, priority] of Object.entries(rolePriority)) {
                              if (role.toLowerCase().includes(key.toLowerCase()) && priority < highestPriority) {
                                highestPriority = priority;
                              }
                            }
                          }
                        });
                        return highestPriority === Infinity ? 100 : highestPriority;
                      };

                      const priorityA = getHighestPriority(a.role);
                      const priorityB = getHighestPriority(b.role);

                      // Sort by priority (lower number = higher priority)
                      return priorityA - priorityB;
                    })
                    .slice(0, 4)
                    .map((member) => (
                      <div key={member._id} className="flex items-center p-3 border border-gray-200 rounded-md">
                        <Avatar
                          src={member.avatarUrl}
                          alt={member.name}
                          size="md"
                          className="mr-3"
                        />
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">
                            {member.name}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {member.role
                              .sort((roleA, roleB) => {
                                // Sort roles within member by priority too
                                const rolePriority: { [key: string]: number } = {
                                  "CEO": 1, "Founder": 2, "Co-Founder": 3, "CTO": 4,
                                  "CFO": 5, "COO": 6, "President": 7, "VP": 8,
                                  "Director": 9, "Head": 10, "Manager": 11, "Lead": 12,
                                  "Senior": 13
                                };

                                const getRolePriority = (role: string): number => {
                                  if (rolePriority[role]) return rolePriority[role];
                                  for (const [key, priority] of Object.entries(rolePriority)) {
                                    if (role.toLowerCase().includes(key.toLowerCase())) {
                                      return priority;
                                    }
                                  }
                                  return 100;
                                };

                                return getRolePriority(roleA) - getRolePriority(roleB);
                              })
                              .join(", ")}
                          </p>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="col-span-full text-center py-4 text-gray-500 text-sm">
                    No team members with specific roles listed.
                  </div>
                )}

                {entrepreneur.team &&
                  entrepreneur.team.filter(member =>
                    !member.role.some(role => role.toLowerCase() === "member")
                  ).length > 4 && (
                    <div className="flex items-center justify-center p-3 border border-dashed border-gray-200 rounded-md">
                      <p className="text-sm text-gray-500">
                        + {entrepreneur.team.filter(member =>
                          !member.role.some(role => role.toLowerCase() === "member")
                        ).length - 4} more team members with specific roles
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
                  {entrepreneur.fundingHistory && entrepreneur.fundingHistory.length > 0 ? (
                    <div className="space-y-1 mt-1">
                      {entrepreneur.fundingHistory.map((fund: any, index: number) => (
                        <p key={index} className="text-md font-medium text-gray-900">
                          ${AmountMeasureWithTags(fund.amount)} {fund.stage} ({fund.year})
                        </p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-md font-medium text-gray-900">
                      N/A
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-gray-100">
                  <span className="text-sm text-gray-500">
                    Funding Timeline
                  </span>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium">Pre-seed</span>
                      <span
                        className={`text-xs ${fundAmount > 100000
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
                        className={`text-xs  ${fundAmount > 2500000
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
                        className={`text-xs ${fundAmount > 20000000
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

              {/* Investors Section */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Investors</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {entrepreneur.investors && entrepreneur.investors.length > 0 ? (
                    entrepreneur.investors.map((inv, idx) => (
                      <Link to={`/profile/investor/${inv.userId}`} key={idx} className="flex items-center p-3 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
                        <Avatar src={inv.avatarUrl} alt={inv.name} size="md" className="mr-3" />
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">{inv.name}</h3>
                          <p className="text-xs text-primary-600 font-medium">Verified Investor</p>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 col-span-2">No investors yet.</p>
                  )}
                </div>
              </div>

              {!isCurrentUser && isInvestor && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-500">
                    Request access to detailed documents and financials by
                    sending a collaboration request.
                  </p>

                  {requestStatus !== "pending" && requestStatus !== "accepted" ? (
                    <Button className="mt-3 w-full" onClick={handleSendRequest}>
                      Request Collaboration
                    </Button>
                  ) : (
                    <Button className="mt-3 w-full" disabled>
                      {requestStatus === "accepted" ? "Access Granted" : "Request Sent"}
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
