import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Check,
  X,
  Trash2,
  Eye,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Mail,
  Calendar,
  Building2,
  Briefcase,
} from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Card, CardHeader } from "../../components/ui/Card";
import axios from "axios";

interface PendingUser {
  _id: string;
  name: string;
  email: string;
  role: "entrepreneur" | "investor";
  createdAt: string;
   approvalStatus?: string; 
  approvalDate?: string; 
  rejectionReason?: string; 
  details?: {
    startupName?: string;
    industry?: string;
    fundingNeeded?: number;
    pitchSummary?: string;
    investmentInterests?: string[];
    minimumInvestment?: string;
    maximumInvestment?: string;
    rejectionReason?: string; 
    rejectedAt?: string; 
  };
  previouslyRejected?: boolean;
  previousRejectionReason?: string | null;
  previousRejectionDate?: string | null;
}

interface ApprovalStats {
  pending: number;
  approved: number;
  rejected: number;
  total: number;
}

export const UserApprovals: React.FC = () => {
  const [pendingUsers, setPendingUsers] = useState({
    entrepreneurs: [] as PendingUser[],
    investors: [] as PendingUser[],
  });
  const [approvedUsers, setApprovedUsers] = useState<PendingUser[]>([]);
  const [rejectedUsers, setRejectedUsers] = useState<PendingUser[]>([]);
  const [stats, setStats] = useState<ApprovalStats>({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"pending" | "approved" | "rejected">(
    "pending"
  );
  const [rejectionReason, setRejectionReason] = useState<{ [key: string]: string }>({});
  const [showRejectModal, setShowRejectModal] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<PendingUser | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  // Add loading states for approval and rejection buttons
  const [approvingUsers, setApprovingUsers] = useState<{ [key: string]: boolean }>({});
  const [rejectingUsers, setRejectingUsers] = useState<{ [key: string]: boolean }>({});
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; userId: string | null }>({
    show: false,
    userId: null
  });
  const URL = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");

  // Fetch all approval data
  const fetchApprovalData = async () => {
    try {
      setLoading(true);
      const [pendingRes, approvedRes, rejectedRes, statsRes] = await Promise.all([
        axios.get(`${URL}/admin/pending-approvals`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${URL}/admin/approved-users`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${URL}/admin/rejected-users`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${URL}/admin/approval-stats`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setPendingUsers(pendingRes.data);
      setApprovedUsers(approvedRes.data.users || []);
      setRejectedUsers(rejectedRes.data.users || []);
      setStats(statsRes.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load approval data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovalData();
  }, []);

  // Approve user
  const handleApprove = async (userId: string) => {
    try {
      // Set loading state for this specific user
      setApprovingUsers(prev => ({ ...prev, [userId]: true }));

      await axios.post(`${URL}/admin/approve-user/${userId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("User approved successfully! Email sent to user.");
      fetchApprovalData();
    } catch (error) {
      console.error(error);
      toast.error("Failed to approve user");
    } finally {
      // Clear loading state for this user
      setApprovingUsers(prev => ({ ...prev, [userId]: false }));
    }
  };

  // Reject user
  const handleReject = async (userId: string, reason?: string) => {
    const r = reason ?? rejectionReason[userId];
    if (!r || r.trim() === "") {
      toast.error("Please provide a rejection reason");
      return;
    }

    try {
      // Set loading state for this specific user
      setRejectingUsers(prev => ({ ...prev, [userId]: true }));

      await axios.post(
        `${URL}/admin/reject-user/${userId}`,
        { rejectionReason: r },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("User rejected successfully! Email sent to user.");
      setShowRejectModal(null);
      setRejectionReason({ ...rejectionReason, [userId]: "" });
      fetchApprovalData();
    } catch (error) {
      console.error(error);
      toast.error("Failed to reject user");
    } finally {
      // Clear loading state for this user
      setRejectingUsers(prev => ({ ...prev, [userId]: false }));
    }
  };

  // Delete rejected user
  const handleDeleteRejected = (userId: string) => {
    setDeleteModal({ show: true, userId });
  };
  const confirmDelete = async () => {
    if (!deleteModal.userId) return;

    try {
      await axios.delete(`${URL}/admin/delete-rejected-user/${deleteModal.userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("User deleted successfully");
      fetchApprovalData();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete user");
    } finally {
      setDeleteModal({ show: false, userId: null });
    }
  };

  // Delete Modal Component
  const DeleteConfirmationModal = () => {
    if (!deleteModal.show) return null;

    return (
      <div
        className="fixed inset-0 z-[100]"
        onClick={() => setDeleteModal({ show: false, userId: null })}
      >
        <div
          className="absolute top-4 right-4 max-w-md w-full z-[101]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-6">
            <div className="flex items-start">
              <AlertCircle className="w-6 h-6 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-lg mb-2">Delete User</h3>
                <p className="text-gray-600 mb-4">
                  Are you sure you want to permanently delete this user? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteModal({ show: false, userId: null })}
                    className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Format date
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // User card component
  const UserCard = ({ user, showAction }: { user: PendingUser; showAction?: boolean }) => (
    <Card className="bg-white border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
              {user.previouslyRejected && (
                <span
                  title={user.previousRejectionReason || "Previously rejected"}
                  className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full"
                >
                  Previously Rejected
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 flex items-center mt-1">
              <Mail className="w-4 h-4 mr-2" />
              {user.email}
            </p>
            <p className="text-sm text-gray-500 flex items-center mt-1">
              <Calendar className="w-4 h-4 mr-2" />
              {formatDate(user.createdAt)}
            </p>
            {user.previouslyRejected && (
              <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded">
                <p className="text-xs text-red-600 font-medium">Previously Rejected</p>
                <p className="text-sm text-red-800 mt-1">
                  {user.previousRejectionReason || "No reason provided"}
                </p>
                {user.previousRejectionDate && (
                  <p className="text-xs text-red-500 mt-2">Rejected on {formatDate(user.previousRejectionDate as any)}</p>
                )}
              </div>
            )}
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${user.role === "entrepreneur"
                ? "bg-blue-100 text-green-700"
                : "bg-purple-100 text-purple-700"
              }`}
          >
            {user.role}
          </span>
        </div>

        {/* Profile Details */}
        {user.details && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg space-y-2">
            {user.role === "entrepreneur" && (
              <>
                {user.details.startupName && (
                  <div className="flex items-start">
                    <Building2 className="w-4 h-4 mr-2 text-gray-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Startup Name</p>
                      <p className="font-medium text-gray-900">{user.details.startupName}</p>
                    </div>
                  </div>
                )}
                {user.details.industry && (
                  <div>
                    <p className="text-xs text-gray-500">Industry</p>
                    <p className="font-medium text-gray-900">{user.details.industry}</p>
                  </div>
                )}
                {user.details.fundingNeeded && (
                  <div>
                    <p className="text-xs text-gray-500">Funding Needed</p>
                    <p className="font-medium text-gray-900">
                      ${user.details.fundingNeeded.toLocaleString()}
                    </p>
                  </div>
                )}
                {user.details.pitchSummary && (
                  <div>
                    <p className="text-xs text-gray-500">Pitch Summary</p>
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {user.details.pitchSummary}
                    </p>
                  </div>
                )}
              </>
            )}

            {user.role === "investor" && (
              <>
                {user.details.investmentInterests && (
                  <div className="flex items-start">
                    <Briefcase className="w-4 h-4 mr-2 text-gray-600 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Investment Interests</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {user.details.investmentInterests.slice(0, 3).map((interest) => (
                          <span
                            key={interest}
                            className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                {user.details.minimumInvestment && (
                  <div>
                    <p className="text-xs text-gray-500">Investment Range</p>
                    <p className="text-sm text-gray-700">
                      ${user.details.minimumInvestment} - ${user.details.maximumInvestment}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Action Buttons */}
        {showAction && activeTab === "pending" && (
          <div className="flex gap-2 pt-4 border-t border-gray-200">
            <Button
              onClick={() => handleApprove(user._id)}
              disabled={approvingUsers[user._id] || rejectingUsers[user._id]}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              {approvingUsers[user._id] ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Approving...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Approve
                </>
              )}
            </Button>
            <Button
              onClick={() => setShowRejectModal(user._id)}
              disabled={approvingUsers[user._id] || rejectingUsers[user._id]}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
              {rejectingUsers[user._id] ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Rejecting...
                </>
              ) : (
                <>
                  <X className="w-4 h-4 mr-2" />
                  Reject
                </>
              )}
            </Button>
          </div>
        )}

        {showAction && activeTab === "rejected" && (
          <div className="flex gap-2 pt-4 border-t border-gray-200">
            <Button
              onClick={() => {
                setSelectedUser(user);
                setShowDetailModal(true);
              }}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Reason
            </Button>
            <Button
              onClick={() => handleDeleteRejected(user._id)}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>
        )}
      </div>
    </Card>
  );

  // Rejection reason modal
  const RejectionModal = ({ userId }: { userId: string }) => (
    <RejectionModalInner userId={userId} />
  );

  // Separate component to keep local textarea state so typing doesn't cause focus loss
  const RejectionModalInner = ({ userId }: { userId: string }) => {
    const [localReason, setLocalReason] = React.useState(rejectionReason[userId] || "");

    useEffect(() => {
      setLocalReason(rejectionReason[userId] || "");
    }, [userId]);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-md bg-white">
          <CardHeader className="bg-red-50 border-b border-red-200">
            <h2 className="text-xl font-bold text-red-900 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              Reject User Application
            </h2>
          </CardHeader>
          <div className="p-6 space-y-4">
            <p className="text-gray-700">
              Please provide a reason for rejecting this user's application:
            </p>
            <textarea
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
              rows={4}
              placeholder="e.g., Business plan is incomplete, Investment criteria not met..."
              value={localReason}
              autoFocus
              onChange={(e) => setLocalReason(e.target.value)}
            />
            <div className="flex gap-3">
              <Button
                onClick={() => setShowRejectModal(null)}
                disabled={rejectingUsers[userId]}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900"
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleReject(userId, localReason)}
                disabled={rejectingUsers[userId]}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                {rejectingUsers[userId] ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Rejecting...
                  </>
                ) : (
                  <>
                    <X className="w-4 h-4 mr-2" />
                    Reject
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  //// Detail modal for rejection reason
const DetailModal = ({ user }: { user: PendingUser | null }) => {
  if (!user) return null;
  
  // Get the rejection reason - checking multiple possible locations
  const getRejectionReason = () => {
    // Check for rejectionReason in details object
    if (user.details?.rejectionReason) {
      return user.details.rejectionReason;
    }
    // Check for rejectionReason at root level
    if (user.rejectionReason) {
      return user.rejectionReason;
    }
    // Check for previousRejectionReason (for previously rejected users)
    if (user.previousRejectionReason) {
      return user.previousRejectionReason;
    }
    return "No reason provided";
  };

  // Get the rejection date
  const getRejectionDate = () => {
    // Check for rejectedAt in details
    if (user.details?.rejectedAt) {
      return formatDate(user.details.rejectedAt as string);
    }
    // Check for approvalDate (which is when the decision was made)
    if (user.approvalDate) {
      return formatDate(user.approvalDate);
    }
    // Check for previousRejectionDate
    if (user.previousRejectionDate) {
      return formatDate(user.previousRejectionDate);
    }
    return "Date not available";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-white">
        <CardHeader className="bg-red-50 border-b border-red-200">
          <h2 className="text-xl font-bold text-red-900 flex items-center">
            <XCircle className="w-5 h-5 mr-2" />
            Rejection Details
          </h2>
        </CardHeader>
        <div className="p-6 space-y-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">User</p>
            <p className="font-semibold text-gray-900">{user.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Email</p>
            <p className="font-semibold text-gray-900">{user.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Role</p>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                user.role === "entrepreneur"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-purple-100 text-purple-700"
              }`}
            >
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Rejection Date</p>
            <p className="font-semibold text-gray-900">{getRejectionDate()}</p>
          </div>
          <div className="p-3 bg-red-50 rounded-lg border border-red-200">
            <p className="text-sm text-gray-500 mb-2">Rejection Reason</p>
            <p className="text-gray-900 whitespace-pre-wrap">{getRejectionReason()}</p>
          </div>
          <Button
            onClick={() => setShowDetailModal(false)}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white"
          >
            Close
          </Button>
        </div>
      </Card>
    </div>
  );
};

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-600 text-sm font-medium">Pending</p>
                <p className="text-3xl font-bold text-yellow-900">{stats.pending}</p>
              </div>
              <Clock className="w-12 h-12 text-yellow-400 opacity-50" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">Approved</p>
                <p className="text-3xl font-bold text-green-900">{stats.approved}</p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-400 opacity-50" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-600 text-sm font-medium">Rejected</p>
                <p className="text-3xl font-bold text-red-900">{stats.rejected}</p>
              </div>
              <XCircle className="w-12 h-12 text-red-400 opacity-50" />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Total</p>
                <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
              </div>
              <Briefcase className="w-12 h-12 text-blue-400 opacity-50" />
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {["pending", "approved", "rejected"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-6 py-3 font-medium border-b-2 transition-colors ${activeTab === tab
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {tab === "pending" && ` (${pendingUsers.entrepreneurs.length + pendingUsers.investors.length})`}
            {tab === "approved" && ` (${approvedUsers.length})`}
            {tab === "rejected" && ` (${rejectedUsers.length})`}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-4">
        {activeTab === "pending" && (
          <>
            {pendingUsers.entrepreneurs.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <Building2 className="w-5 h-5 mr-2 text-blue-600" />
                  Pending Entrepreneurs
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pendingUsers.entrepreneurs.map((user) => (
                    <UserCard key={user._id} user={user} showAction={true} />
                  ))}
                </div>
              </div>
            )}

            {pendingUsers.investors.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <Briefcase className="w-5 h-5 mr-2 text-purple-600" />
                  Pending Investors
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pendingUsers.investors.map((user) => (
                    <UserCard key={user._id} user={user} showAction={true} />
                  ))}
                </div>
              </div>
            )}

            {pendingUsers.entrepreneurs.length === 0 && pendingUsers.investors.length === 0 && (
              <div className="text-center py-12">
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No pending approvals</p>
              </div>
            )}
          </>
        )}

        {activeTab === "approved" && (
          <>
            {approvedUsers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {approvedUsers.map((user) => (
                  <UserCard key={user._id} user={user} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No approved users</p>
              </div>
            )}
          </>
        )}

        {activeTab === "rejected" && (
          <>
            {rejectedUsers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rejectedUsers.map((user) => (
                  <UserCard key={user._id} user={user} showAction={true} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <XCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">No rejected users</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      {showRejectModal && <RejectionModal userId={showRejectModal} />}
      {showDetailModal && <DetailModal user={selectedUser} />}
      {deleteModal.show && <DeleteConfirmationModal />}
    </div>
  );
};

export default UserApprovals;