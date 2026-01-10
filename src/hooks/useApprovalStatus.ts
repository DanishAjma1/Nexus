import { useState, useEffect } from 'react';
import axios from 'axios';

export interface ApprovalStatus {
  userId: string;
  name: string;
  email: string;
  role: string;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  approvalDate?: string;
  createdAt: string;
}

export const useApprovalStatus = (userId?: string) => {
  const [status, setStatus] = useState<ApprovalStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const URL = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!userId || !token) {
      setLoading(false);
      return;
    }

    const fetchApprovalStatus = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${URL}/admin/user-approval-status/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setStatus(response.data);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch approval status');
        setStatus(null);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovalStatus();
  }, [userId, token]);

  return { status, loading, error };
};

export const useApprovalStats = () => {
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const URL = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${URL}/admin/approval-stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(response.data);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  const refetch = async () => {
    try {
      const response = await axios.get(`${URL}/admin/approval-stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(response.data);
    } catch (err) {
      console.error('Failed to refetch stats');
    }
  };

  return { stats, loading, error, refetch };
};

export const useApproveUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const URL = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem('token');

  const approve = async (userId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post(
        `${URL}/admin/approve-user/${userId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setLoading(false);
      return response.data;
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Failed to approve user';
      setError(errMsg);
      setLoading(false);
      throw err;
    }
  };

  return { approve, loading, error };
};

export const useRejectUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const URL = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem('token');

  const reject = async (userId: string, rejectionReason: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post(
        `${URL}/admin/reject-user/${userId}`,
        { rejectionReason },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setLoading(false);
      return response.data;
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Failed to reject user';
      setError(errMsg);
      setLoading(false);
      throw err;
    }
  };

  return { reject, loading, error };
};

export const useDeleteRejectedUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const URL = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem('token');

  const deleteUser = async (userId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.delete(
        `${URL}/admin/delete-rejected-user/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setLoading(false);
      return response.data;
    } catch (err: any) {
      const errMsg = err.response?.data?.message || 'Failed to delete user';
      setError(errMsg);
      setLoading(false);
      throw err;
    }
  };

  return { deleteUser, loading, error };
};

// Component to display approval status badge
export const ApprovalStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getBadgeColor = () => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getBadgeColor()}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};
