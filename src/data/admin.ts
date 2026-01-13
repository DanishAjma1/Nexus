import axios from "axios";
import toast from "react-hot-toast";

const URL = import.meta.env.VITE_BACKEND_URL;

export const suspendUser = async (userId: string, reason: string, suspensionDays: number) => {
    try {
        const res = await axios.post(
            `${URL}/admin/suspend-user/${userId}`,
            { reason, suspensionDays },
            { withCredentials: true }
        );
        toast.success("User suspended successfully");
        return res.data;
    } catch (err: any) {
        console.error(err);
        toast.error(err.response?.data?.message || "Failed to suspend user");
        throw err;
    }
};

export const blockUser = async (userId: string, reason: string) => {
    try {
        const res = await axios.post(
            `${URL}/admin/block-user/${userId}`,
            { reason },
            { withCredentials: true }
        );
        toast.success("User blocked successfully");
        return res.data;
    } catch (err: any) {
        console.error(err);
        toast.error(err.response?.data?.message || "Failed to block user");
        throw err;
    }
};

export const unsuspendUser = async (userId: string) => {
    try {
        const res = await axios.post(
            `${URL}/admin/unsuspend-user/${userId}`,
            {},
            { withCredentials: true }
        );
        toast.success("User unsuspended successfully");
        return res.data;
    } catch (err: any) {
        console.error(err);
        toast.error(err.response?.data?.message || "Failed to unsuspend user");
        throw err;
    }
};

export const unblockUser = async (userId: string) => {
    try {
        const res = await axios.post(
            `${URL}/admin/unblock-user/${userId}`,
            {},
            { withCredentials: true }
        );
        toast.success("User unblocked successfully");
        return res.data;
    } catch (err: any) {
        console.error(err);
        toast.error(err.response?.data?.message || "Failed to unblock user");
        throw err;
    }
};
