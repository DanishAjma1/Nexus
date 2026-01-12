import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../../components/ui/Button";
import { Card, CardHeader } from "../../components/ui/Card";
import { AlertTriangle, Clock, Ban, Trash2, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { ConfirmationModal } from "../../components/ui/ConfirmationModal";

interface SuspendedUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  isSuspended: boolean;
  suspensionReason: string;
  suspensionStartDate: string;
  suspensionEndDate: string;
  suspendedBy?: { name: string; email: string };
}

interface BlockedUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  isBlocked: boolean;
  blockReason: string;
  blockedAt: string;
  blockedBy?: { name: string; email: string };
}

export const SuspendedBlockedUsers: React.FC = () => {
  const [suspendedUsers, setSuspendedUsers] = useState<SuspendedUser[]>([]);
  const [blockedUsers, setBlockedUsers] = useState<BlockedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"suspended" | "blocked">("suspended");
  const [processing, setProcessing] = useState<{ [key: string]: boolean }>({});
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    variant: "danger" | "warning" | "success" | "primary";
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => { },
    variant: "primary",
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/admin/suspended-blocked-users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch data");

      const data = await res.json();
      setSuspendedUsers(data.suspended || []);
      setBlockedUsers(data.blocked || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load suspended/blocked users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const unsuspendUser = async (userId: string) => {
    setConfirmModal({
      isOpen: true,
      title: "Unsuspend User",
      message: "Are you sure you want to unsuspend this user?",
      variant: "success",
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        try {
          setProcessing((prev) => ({ ...prev, [userId]: true }));
          const token = localStorage.getItem("token");
          const res = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/admin/unsuspend-user/${userId}`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!res.ok) {
            const data = await res.json();
            throw new Error(data.message || "Failed to unsuspend user");
          }

          toast.success("User unsuspended successfully");
          fetchData();
        } catch (error: any) {
          toast.error(error.message || "Error unsuspending user");
        } finally {
          setProcessing((prev) => ({ ...prev, [userId]: false }));
        }
      },
    });
  };

  const unblockUser = async (userId: string) => {
    setConfirmModal({
      isOpen: true,
      title: "Unblock User",
      message: "Are you sure you want to unblock this user?",
      variant: "success",
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        try {
          setProcessing((prev) => ({ ...prev, [userId]: true }));
          const token = localStorage.getItem("token");
          const res = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/admin/unblock-user/${userId}`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!res.ok) {
            const data = await res.json();
            throw new Error(data.message || "Failed to unblock user");
          }

          toast.success("User unblocked successfully");
          fetchData();
        } catch (error: any) {
          toast.error(error.message || "Error unblocking user");
        } finally {
          setProcessing((prev) => ({ ...prev, [userId]: false }));
        }
      },
    });
  };

  const deleteUser = async (userId: string) => {
    setConfirmModal({
      isOpen: true,
      title: "Delete User",
      message: "Are you sure you want to delete this user? This action cannot be undone.",
      variant: "danger",
      onConfirm: async () => {
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        try {
          setProcessing((prev) => ({ ...prev, [userId]: true }));
          const token = localStorage.getItem("token");
          const res = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/admin/delete-user/${userId}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!res.ok) {
            const data = await res.json();
            throw new Error(data.message || "Failed to delete user");
          }

          toast.success("User deleted successfully");
          fetchData();
        } catch (error: any) {
          toast.error(error.message || "Error deleting user");
        } finally {
          setProcessing((prev) => ({ ...prev, [userId]: false }));
        }
      },
    });
  };

  if (loading) {
    return (
      <div className="p-4">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Suspended & Blocked Users
      </h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("suspended")}
          className={`px-4 py-2 font-medium transition-colors ${activeTab === "suspended"
            ? "text-yellow-600 border-b-2 border-yellow-600"
            : "text-gray-600 hover:text-gray-900"
            }`}
        >
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Suspended ({suspendedUsers.length})
          </div>
        </button>
        <button
          onClick={() => setActiveTab("blocked")}
          className={`px-4 py-2 font-medium transition-colors ${activeTab === "blocked"
            ? "text-red-600 border-b-2 border-red-600"
            : "text-gray-600 hover:text-gray-900"
            }`}
        >
          <div className="flex items-center gap-2">
            <Ban className="h-4 w-4" />
            Blocked ({blockedUsers.length})
          </div>
        </button>
      </div>

      {/* Suspended Users Tab */}
      {activeTab === "suspended" && (
        <div>
          {suspendedUsers.length === 0 ? (
            <Card>
              <div className="p-8 text-center">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No suspended users</p>
              </div>
            </Card>
          ) : (
            <div className="space-y-4">
              {suspendedUsers.map((user) => (
                <Card key={user._id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {user.name}
                        </h3>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          Role: {user.role}
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                        Suspended
                      </span>
                    </div>
                  </CardHeader>
                  <div className="p-6 space-y-4">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-sm font-medium text-yellow-900 mb-1">
                        Suspension Reason:
                      </p>
                      <p className="text-sm text-yellow-800">
                        {user.suspensionReason}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Suspension Start:</p>
                        <p className="font-medium">
                          {format(new Date(user.suspensionStartDate), "PPpp")}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Suspension End:</p>
                        <p className="font-medium">
                          {format(new Date(user.suspensionEndDate), "PPpp")}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3 pt-4 border-t">
                      <Button
                        variant="success"
                        onClick={() => unsuspendUser(user._id)}
                        disabled={processing[user._id]}
                        className="flex items-center gap-2"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Unsuspend
                      </Button>
                      <Button
                        variant="error"
                        onClick={() => deleteUser(user._id)}
                        disabled={processing[user._id]}
                        className="flex items-center gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Blocked Users Tab */}
      {activeTab === "blocked" && (
        <div>
          {blockedUsers.length === 0 ? (
            <Card>
              <div className="p-8 text-center">
                <Ban className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No blocked users</p>
              </div>
            </Card>
          ) : (
            <div className="space-y-4">
              {blockedUsers.map((user) => (
                <Card key={user._id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {user.name}
                        </h3>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          Role: {user.role}
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                        Blocked
                      </span>
                    </div>
                  </CardHeader>
                  <div className="p-6 space-y-4">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-sm font-medium text-red-900 mb-1">
                        Block Reason:
                      </p>
                      <p className="text-sm text-red-800">{user.blockReason}</p>
                    </div>
                    <div className="text-sm">
                      <p className="text-gray-500">Blocked At:</p>
                      <p className="font-medium">
                        {format(new Date(user.blockedAt), "PPpp")}
                      </p>
                    </div>
                    <div className="flex gap-3 pt-4 border-t">
                      <Button
                        variant="success"
                        onClick={() => unblockUser(user._id)}
                        disabled={processing[user._id]}
                        className="flex items-center gap-2"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Unblock
                      </Button>
                      <Button
                        variant="error"
                        onClick={() => deleteUser(user._id)}
                        disabled={processing[user._id]}
                        className="flex items-center gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        variant={confirmModal.variant}
        onConfirm={confirmModal.onConfirm}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};
