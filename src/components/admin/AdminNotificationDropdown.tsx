import React, { useState, useEffect, useRef } from "react";
import { Bell, Check, Trash2, UserPlus, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";
import { formatNotificationMessage } from "../../utils/formatNotificationMessage";

export const AdminNotificationDropdown: React.FC = () => {
    const { user } = useAuth();
    const {
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        clearAll
    } = useNotification();

    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (user?.role !== 'admin') return null;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-full transition-colors"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-white">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-100 z-50 overflow-hidden transform origin-top-right transition-all animate-fade-in">
                    <div className="p-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                            Notifications
                            {unreadCount > 0 && (
                                <span className="bg-primary-100 text-primary-700 text-xs px-2 py-0.5 rounded-full">
                                    {unreadCount} new
                                </span>
                            )}
                        </h3>
                        <div className="flex gap-1">
                            {notifications.length > 0 && (
                                <>
                                    <button
                                        onClick={markAllAsRead}
                                        className="p-1.5 text-gray-500 hover:text-primary-600 hover:bg-white rounded-md transition-colors"
                                        title="Mark all as read"
                                    >
                                        <Check size={16} />
                                    </button>
                                    <button
                                        onClick={clearAll}
                                        className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-white rounded-md transition-colors"
                                        title="Clear all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="max-h-[400px] overflow-y-auto">
                        {notifications.length > 0 ? (
                            <div className="divide-y divide-gray-50">
                                {notifications.map((notification) => (
                                    <div
                                        key={notification._id}
                                        className={`p-4 hover:bg-gray-50 transition-colors relative group ${!notification.isRead ? 'bg-primary-50/30' : ''}`}
                                    >
                                        <div className="flex gap-3">
                                            <div className={`mt-1 flex-shrink-0 p-2 rounded-full ${notification.type === 'registration' ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                {notification.type === 'registration' ? <UserPlus size={14} /> : <Bell size={14} />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-sm ${!notification.isRead ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                                                    {formatNotificationMessage(notification.message)}
                                                </p>
                                                <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-400">
                                                    <Clock size={12} />
                                                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                                </div>
                                            </div>
                                            {!notification.isRead && (
                                                <button
                                                    onClick={() => markAsRead(notification._id)}
                                                    className="opacity-0 group-hover:opacity-100 p-1 text-primary-600 hover:bg-primary-50 rounded-md transition-all self-center"
                                                    title="Mark as read"
                                                >
                                                    <Check size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center bg-white">
                                <div className="mx-auto w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                                    <Bell size={20} className="text-gray-300" />
                                </div>
                                <p className="text-gray-500 text-sm">No notifications yet</p>
                                <p className="text-gray-400 text-xs mt-1">We'll alert you when something happens</p>
                            </div>
                        )}
                    </div>

                    {notifications.length > 0 && (
                        <div className="p-3 bg-gray-50 border-t border-gray-100 text-center">
                            <Link
                                to="/notifications"
                                onClick={() => setIsOpen(false)}
                                className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
                            >
                                View all activity
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
