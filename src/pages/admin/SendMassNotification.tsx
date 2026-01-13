import React, { useState, useEffect, useRef } from "react";
import { Send, Users, User, Building2, CircleDollarSign, Search, AlertCircle, CheckCircle, Bold, Italic, Type } from "lucide-react";
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
    status?: string;
    isBlocked?: boolean;
    approvalStatus?: string;
    accountStatus?: string;
}

const SendMassNotification: React.FC = () => {
    const { user } = useAuth();
    const [target, setTarget] = useState<Target>("all");
    const [message, setMessage] = useState("");
    const [specificUserId, setSpecificUserId] = useState("");
    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
    const [userSearch, setUserSearch] = useState("");
    const [foundUsers, setFoundUsers] = useState<UserInfo[]>([]);
    const [allApprovedUsers, setAllApprovedUsers] = useState<UserInfo[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [isLoadingUsers, setIsLoadingUsers] = useState(false);
    const [fontSize, setFontSize] = useState(14);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
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

    useEffect(() => {
        if (target === "specific") {
            fetchAllApprovedUsers();
        } else {
            setSelectedUserIds([]);
        }
    }, [target]);

    const fetchAllApprovedUsers = async () => {
        setIsLoadingUsers(true);
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`${URL}/admin/get-users`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            // Debug: Check what properties exist in the response
            console.log("API Response:", res.data);
            
            // Filter only approved users (handle different possible property names)
            const approved = res.data.filter((u: any) => {
                // Check if user has any approval/rejection status properties
                const isApproved = 
                    u.status === 'approved' || 
                    u.approvalStatus === 'approved' ||
                    u.isApproved === true ||
                    u.accountStatus === 'approved' ||
                    !u.status || // If no status field, assume approved
                    !u.approvalStatus; // If no approvalStatus field, assume approved
                
                const isNotBlocked = 
                    u.isBlocked === false || 
                    u.blocked === false ||
                    u.isBlocked === undefined || // If no isBlocked field, assume not blocked
                    !u.isBlocked;
                
                const isNotRejected = 
                    u.status !== 'rejected' && 
                    u.approvalStatus !== 'rejected';
                
                const isNotPending = 
                    u.status !== 'pending' && 
                    u.approvalStatus !== 'pending';
                
                return (isApproved && isNotBlocked && isNotRejected && isNotPending);
            });
            
            console.log("Filtered approved users:", approved);
            setAllApprovedUsers(approved);
            
        } catch (error) {
            console.error("Error fetching approved users:", error);
            toast.error("Failed to load users");
        } finally {
            setIsLoadingUsers(false);
        }
    };

    const searchUsers = async () => {
        setIsSearching(true);
        try {
            // Search within the already fetched approved users
            const filtered = allApprovedUsers.filter((u: UserInfo) =>
                u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
                u.email.toLowerCase().includes(userSearch.toLowerCase())
            );
            setFoundUsers(filtered.slice(0, 5));
        } catch (error) {
            console.error("Error searching users:", error);
            toast.error("Search failed");
        } finally {
            setIsSearching(false);
        }
    };

    const wrapText = (wrapper: string) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = message.substring(start, end);

        if (selectedText) {
            const before = message.substring(0, start);
            const after = message.substring(end);
            const newText = `${before}${wrapper}${selectedText}${wrapper}${after}`;
            setMessage(newText);

            // Restore focus and selection
            setTimeout(() => {
                textarea.focus();
                textarea.setSelectionRange(start + wrapper.length, end + wrapper.length);
            }, 0);
        } else {
            toast.error("Please select text to format");
        }
    };

    const applyBold = () => wrapText("**");
    const applyItalic = () => wrapText("*");

    const increaseFontSize = () => {
        if (fontSize < 24) setFontSize(fontSize + 2);
    };

    const decreaseFontSize = () => {
        if (fontSize > 10) setFontSize(fontSize - 2);
    };

    const toggleUserSelection = (userId: string) => {
        setSelectedUserIds(prev => {
            if (prev.includes(userId)) {
                return prev.filter(id => id !== userId);
            } else {
                return [...prev, userId];
            }
        });
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) {
            toast.error("Please enter a message");
            return;
        }
        if (target === "specific" && selectedUserIds.length === 0 && !specificUserId) {
            toast.error("Please select at least one user");
            return;
        }

        setIsSending(true);
        try {
            const token = localStorage.getItem("token");

            // If multiple users are selected, send to each
            if (target === "specific" && selectedUserIds.length > 0) {
                const promises = selectedUserIds.map(userId =>
                    axios.post(`${URL}/admin/send-mass-notification`, {
                        target,
                        message,
                        userId,
                        senderId: user?.userId
                    }, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                );
                await Promise.all(promises);
                toast.success(`Notification sent to ${selectedUserIds.length} user(s)`);
            } else {
                // Single user or other targets
                const res = await axios.post(`${URL}/admin/send-mass-notification`, {
                    target,
                    message,
                    userId: target === "specific" ? specificUserId : undefined,
                    senderId: user?.userId
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                toast.success(res.data.message);
            }

            setMessage("");
            setSpecificUserId("");
            setSelectedUserIds([]);
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

                            {/* All Approved Users Side Panel */}
                            <div className="mt-4">
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        All Approved Users {selectedUserIds.length > 0 && (
                                            <span className="text-primary-600">({selectedUserIds.length} selected)</span>
                                        )}
                                    </label>
                                    <div className="text-xs text-gray-500">
                                        Total: {allApprovedUsers.length} users
                                    </div>
                                </div>
                                
                                <div className="border border-gray-200 rounded-lg bg-white max-h-96 overflow-y-auto">
                                    {isLoadingUsers ? (
                                        <div className="flex justify-center items-center p-8">
                                            <div className="animate-spin h-6 w-6 border-2 border-primary-500 border-t-transparent rounded-full" />
                                        </div>
                                    ) : allApprovedUsers.length > 0 ? (
                                        <div className="divide-y divide-gray-100">
                                            {allApprovedUsers.map((u) => (
                                                <div
                                                    key={u._id}
                                                    onClick={() => toggleUserSelection(u._id)}
                                                    className={`p-3 flex items-center cursor-pointer hover:bg-gray-50 transition-colors ${
                                                        selectedUserIds.includes(u._id) ? "bg-primary-50/50" : ""
                                                    }`}
                                                >
                                                    <div className={`flex-shrink-0 w-5 h-5 rounded border-2 mr-3 flex items-center justify-center transition-colors ${
                                                        selectedUserIds.includes(u._id)
                                                            ? "bg-primary-500 border-primary-500"
                                                            : "border-gray-300 bg-white"
                                                    }`}>
                                                        {selectedUserIds.includes(u._id) && (
                                                            <CheckCircle size={14} className="text-white" />
                                                        )}
                                                    </div>
                                                    <div className="h-8 w-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold mr-3">
                                                        {u.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-gray-900 truncate">{u.name}</p>
                                                        <p className="text-xs text-gray-500 truncate">{u.email} • <span className="capitalize">{u.role}</span></p>
                                                    </div>
                                                    <div className="text-xs text-gray-400">
                                                        {u.status || u.approvalStatus || 'approved'}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-8 text-center text-gray-500 text-sm">
                                            No approved users found
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Message Area */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Message
                        </label>

                        {/* Formatting Toolbar */}
                        <div className="mb-2 flex items-center gap-2 p-2 bg-gray-50 border border-gray-200 rounded-lg">
                            <button
                                type="button"
                                onClick={applyBold}
                                className="p-2 hover:bg-gray-200 rounded transition-colors text-gray-700 hover:text-gray-900"
                                title="Bold (Select text first)"
                            >
                                <Bold size={18} />
                            </button>
                            <button
                                type="button"
                                onClick={applyItalic}
                                className="p-2 hover:bg-gray-200 rounded transition-colors text-gray-700 hover:text-gray-900"
                                title="Italic (Select text first)"
                            >
                                <Italic size={18} />
                            </button>
                            <div className="h-6 w-px bg-gray-300 mx-1"></div>
                            <div className="flex items-center gap-2">
                                <Type size={18} className="text-gray-600" />
                                <button
                                    type="button"
                                    onClick={decreaseFontSize}
                                    className="px-2 py-1 hover:bg-gray-200 rounded transition-colors text-gray-700 hover:text-gray-900 font-bold"
                                    title="Decrease font size"
                                >
                                    -
                                </button>
                                <span className="text-sm text-gray-600 min-w-[2rem] text-center">{fontSize}px</span>
                                <button
                                    type="button"
                                    onClick={increaseFontSize}
                                    className="px-2 py-1 hover:bg-gray-200 rounded transition-colors text-gray-700 hover:text-gray-900 font-bold"
                                    title="Increase font size"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <textarea
                            ref={textareaRef}
                            rows={5}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Enter the notification message here..."
                            style={{ fontSize: `${fontSize}px` }}
                            className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        />
                        <div className="mt-2 flex items-center text-xs text-gray-500">
                            <AlertCircle size={14} className="mr-1.5" />
                            Approved users will receive this message in their notification center. Use **text** for bold and *text* for italic.
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="pt-4 flex justify-end">
                        <Button
                            type="submit"
                            isLoading={isSending}
                            disabled={!message.trim() || (target === "specific" && selectedUserIds.length === 0 && !specificUserId)}
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