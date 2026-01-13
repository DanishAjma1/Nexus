import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

interface Notification {
    _id: string;
    message: string;
    type: string;
    isRead: boolean;
    createdAt: string;
    link?: string;
    sender?: {
        name: string;
        email: string;
        role: string;
    };
}

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    isLoading: boolean;
    fetchNotifications: () => Promise<void>;
    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    clearAll: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const URL = import.meta.env.VITE_BACKEND_URL;

    const fetchNotifications = useCallback(async () => {
        if (!user?.userId) {
            setNotifications([]);
            setIsLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`${URL}/admin/notifications/${user.userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(res.data);
        } catch (error) {
            console.error("Error fetching notifications:", error);
        } finally {
            setIsLoading(false);
        }
    }, [user?.userId, URL]);

    useEffect(() => {
        if (user) {
            fetchNotifications();
            const interval = setInterval(fetchNotifications, 30000);
            return () => clearInterval(interval);
        } else {
            setNotifications([]);
            setIsLoading(false);
        }
    }, [user, fetchNotifications]);

    const markAsRead = async (id: string) => {
        // Optimistic update
        setNotifications(prev =>
            prev.map(n => n._id === id ? { ...n, isRead: true } : n)
        );

        try {
            const token = localStorage.getItem("token");
            await axios.put(`${URL}/admin/notifications/${id}/read`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (error) {
            console.error("Error marking notification as read:", error);
            // Rollback if needed, but for isRead it's often okay to just stay "read" unless strictly critical
            // fetchNotifications(); // Re-fetch on error to be safe
        }
    };

    const markAllAsRead = async () => {
        if (!user?.userId) return;

        // Optimistic update
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));

        try {
            const token = localStorage.getItem("token");
            await axios.put(`${URL}/admin/notifications/read-all/${user.userId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (error) {
            console.error("Error marking all as read:", error);
            fetchNotifications();
        }
    };

    const clearAll = async () => {
        if (!user?.userId) return;

        const originalNotifications = [...notifications];
        // Optimistic update
        setNotifications([]);

        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${URL}/admin/notifications/${user.userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Notifications cleared");
        } catch (error) {
            console.error("Error clearing notifications:", error);
            setNotifications(originalNotifications);
            toast.error("Failed to clear notifications");
        }
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const value = {
        notifications,
        unreadCount,
        isLoading,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        clearAll,
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error("useNotification must be used within a NotificationProvider");
    }
    return context;
};
