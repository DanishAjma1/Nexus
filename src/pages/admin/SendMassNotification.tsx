import React, { useState, useEffect } from "react";
import { Send, Users, User, Building2, CircleDollarSign, Search, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";

type Target = "all" | "investors" | "entrepreneurs" | "specific";

interface UserInfo {
    _id: string;
    name: string;
    email: string;
    role: string;
}

const SendMassNotification: React.FC = () => {
    const { user } = useAuth();
    const [target, setTarget] = useState<Target>("all");
    const [message, setMessage] = useState("");
    const [specificUserId, setSpecificUserId] = useState("");
    const [userSearch, setUserSearch] = useState("");
    const [foundUsers, setFoundUsers] = useState<UserInfo[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const URL = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
        if (target === "specific" && userSearch.length > 2) {
            const delayDebounceFn = setTimeout(() => {
                searchUsers();
            }, 500);
            return () => clearTimeout(delayDebounceFn);
        } else {
            setFoundUsers([]);
        }
    }, [userSearch, target]);

    const searchUsers = async () => {
        setIsSearching(true);
        try {
            const token = localStorage.getItem("token");
            // Reusing existing admin endpoint to get users
            const res = await axios.get(`${URL}/admin/get-users`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const filtered = res.data.filter((u: UserInfo) =>
                u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
                u.email.toLowerCase().includes(userSearch.toLowerCase())
            );
            setFoundUsers(filtered.slice(0, 5));
        } catch (error) {
            console.error("Error searching users:", error);
        } finally {
            setIsSearching(false);
        }
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) {
            toast.error("Please enter a message");
            return;
        }
        if (target === "specific" && !specificUserId) {
            toast.error("Please select a user");
            return;
        }

        setIsSending(true);
        try {
            const token = localStorage.getItem("token");
            const res = await axios.post(`${URL}/admin/send-mass-notification`, {
                target,
                message,
                userId: target === "specific" ? specificUserId : undefined,
                senderId: user?.userId
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success(res.data.message);
            setMessage("");
            setSpecificUserId("");
            setUserSearch("");
            setFoundUsers([]);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to send notification");
        } finally {
            setIsSending(false);
        }
    };

    const targetOptions: { id: Target; label: string; icon: React.ReactNode; description: string }[] = [
        {
            id: "all",
            label: "All Users",
            icon: <Users size={20} />,
            description: "Send to all approved entrepreneurs and investors"
        },
        {
            id: "investors",
            label: "Investors Only",
            icon: <CircleDollarSign size={20} />,
            description: "Send only to approved investors"
        },
        {
            id: "entrepreneurs",
            label: "Entrepreneurs Only",
            icon: <Building2 size={20} />,
            description: "Send only to approved entrepreneurs"
        },
        {
            id: "specific",
            label: "Specific User",
            icon: <User size={20} />,
            description: "Send to a single specific user"
        },
    ];

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Send Global Notification</h1>
                <p className="text-gray-600 mt-1">
                    Compose and send messages to targeted groups of users. Messages will appear in their notification center.
                </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <form onSubmit={handleSend} className="p-6 space-y-8">
                    {/* Target Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-4">
                            Select Recipients
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {targetOptions.map((option) => (
                                <div
                                    key={option.id}
                                    onClick={() => setTarget(option.id)}
                                    className={`relative flex items-start p-4 cursor-pointer rounded-lg border-2 transition-all ${target === option.id
                                        ? "border-primary-500 bg-primary-50/30"
                                        : "border-gray-100 hover:border-gray-200"
                                        }`}
                                >
                                    <div className={`p-2 rounded-lg mr-4 ${target === option.id ? "bg-primary-100 text-primary-600" : "bg-gray-100 text-gray-500"
                                        }`}>
                                        {option.icon}
                                    </div>
                                    <div className="flex-1">
                                        <p className={`text-sm font-semibold ${target === option.id ? "text-primary-900" : "text-gray-900"
                                            }`}>
                                            {option.label}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            {option.description}
                                        </p>
                                    </div>
                                    <div className={`flex h-5 w-5 items-center justify-center rounded-full border ${target === option.id ? "border-primary-500 bg-primary-500" : "border-gray-300"
                                        }`}>
                                        {target === option.id && <div className="h-2 w-2 rounded-full bg-white" />}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Specific User Search */}
                    {target === "specific" && (
                        <div className="space-y-3 animate-fade-in">
                            <label className="block text-sm font-medium text-gray-700">
                                Find User
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <Search size={18} />
                                </span>
                                <input
                                    type="text"
                                    value={userSearch}
                                    onChange={(e) => setUserSearch(e.target.value)}
                                    placeholder="Search by name or email..."
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                />
                                {isSearching && (
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                        <div className="animate-spin h-4 w-4 border-2 border-primary-500 border-t-transparent rounded-full" />
                                    </div>
                                )}
                            </div>

                            {foundUsers.length > 0 && (
                                <div className="mt-2 border border-gray-100 rounded-lg divide-y divide-gray-50 bg-gray-50/50">
                                    {foundUsers.map((u) => (
                                        <div
                                            key={u._id}
                                            onClick={() => {
                                                setSpecificUserId(u._id);
                                                setUserSearch(u.name);
                                                setFoundUsers([]);
                                            }}
                                            className={`p-3 flex items-center justify-between cursor-pointer hover:bg-white transition-colors ${specificUserId === u._id ? "bg-white ring-2 ring-inset ring-primary-500" : ""
                                                }`}
                                        >
                                            <div className="flex items-center">
                                                <div className="h-8 w-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold mr-3">
                                                    {u.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">{u.name}</p>
                                                    <p className="text-xs text-gray-500">{u.email} • <span className="capitalize">{u.role}</span></p>
                                                </div>
                                            </div>
                                            {specificUserId === u._id && (
                                                <CheckCircle size={18} className="text-primary-500" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Message Area */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Message
                        </label>
                        <textarea
                            rows={5}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Enter the notification message here..."
                            className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        />
                        <div className="mt-2 flex items-center text-xs text-gray-500">
                            <AlertCircle size={14} className="mr-1.5" />
                            Approved users will receive this message in their notification center.
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="pt-4 flex justify-end">
                        <Button
                            type="submit"
                            isLoading={isSending}
                            disabled={!message.trim() || (target === "specific" && !specificUserId)}
                            leftIcon={<Send size={18} />}
                            className="w-full md:w-auto px-12"
                        >
                            Send Notification
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SendMassNotification;
