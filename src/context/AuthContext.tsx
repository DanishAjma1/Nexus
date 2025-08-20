import React, { createContext, useState, useContext, useEffect } from "react";
import { User, UserRole, AuthContextType } from "../types";
import { users } from "../data/users.js";
import toast from "react-hot-toast";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

// Create Auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Local storage keys
const USER_STORAGE_KEY = "business_nexus_user";
const RESET_TOKEN_KEY = "business_nexus_reset_token";
const URL = "http://localhost:5000";
interface TokenPayload {
  userId: string;
  email: string;
  name: string;
  exp: number;
  iat: number;
}
// Auth Provider Component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for stored user on initial load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<TokenPayload>(token);
        // check expiry
        if (decoded.exp * 1000 > Date.now()) {
          setUser({ id: decoded.userId, email: decoded.email, name: decoded.name });
        } else {
          localStorage.removeItem("token");
        }
      } catch (err) {
        console.log("Invalid token", err);
        localStorage.removeItem("token");
      }
    }
    setIsLoading(false);
  }, []);

  // Mock login function - in a real app, this would make an API call
  const login = async (
    email: string,
    password: string,
    role: UserRole
  ): Promise<void> => {
    setIsLoading(true);

    try {
      // Simulate API call delay
      const res = await axios.post(
        `${URL}/auth/login`,
        {
          email,
          password,
          role,
        },
        {
          withCredentials: true,
        }
      );
      const { token, user } = res.data;

      localStorage.setItem("token", token);
      setUser(user);
      toast.success("Successfully logged in!");
      
    } catch (error) {
      toast.error((error as Error).message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Mock register function - in a real app, this would make an API call
  const register = async (
    name: string,
    email: string,
    password: string,
    role: UserRole
  ): Promise<void> => {
    setIsLoading(true);

    try {
      // Simulate API call delay
      const res = await axios.post(
        `${URL}/auth/register`,
        {
          name,
          email,
          password,
          role,
        },
        {
          withCredentials: true,
        }
      );
      if (res.status === 201) {
        toast.success("Account created successfully!");
      }
    } catch (error) {
      toast.error((error as Error).message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Mock forgot password function
  const forgotPassword = async (email: string): Promise<void> => {
    try {
      // Generate reset token (in a real app, this would be a secure token)
      const resetToken = Math.random().toString(36).substring(2, 15);
      localStorage.setItem(RESET_TOKEN_KEY, resetToken);

      // In a real app, this would send an email
      const resetLink = `http://localhost:5173/reset-password?token=${resetToken}`;
      const message = `
          <p>To reset your password, please click the button below:</p>
          <a href="${resetLink}" 
            style="display:inline-block; padding:10px 20px; 
                    background-color:#4F46E5; color:white; 
                    text-decoration:none; border-radius:6px; 
                    font-weight:bold;">
            Reset Password
          </a>
          <p>If the button doesn’t work, copy and paste this link into your browser:</p>
          <p><a href="${resetLink}">${resetLink}</a></p>
        `;

      const sub = "Password reset instructions";
      const res = await axios.post(
        `${URL}/auth/send-mail`,
        { email, message, sub },
        {
          withCredentials: true,
        }
      );
      const {user} = res.data;
      localStorage.setItem("user",JSON.stringify(user));
      console.log(user);
      toast.success("Password reset instructions sent to your email");
    } catch (error) {
      toast.error((error as Error).message);
      throw error;
    }
  };

  // Mock reset password function
  const resetPassword = async (
    token: string,
    newPassword: string
  ): Promise<void> => {
    try {
      const storedToken = localStorage.getItem(RESET_TOKEN_KEY);
      if (token !== storedToken) {
        throw new Error("Invalid or expired reset token");
      }
      const user = JSON.parse(localStorage.getItem("user"));
      
      await axios.patch(
        `${URL}/auth/update-password/${user._id}`,
        { newPassword},
        { withCredentials: true }
      );

      // In a real app, this would update the user's password in the database
      localStorage.removeItem(RESET_TOKEN_KEY);
      localStorage.removeItem("user");
      toast.success("Password reset successfully");
    } catch (error) {
      toast.error((error as Error).message);
      throw error;
    }
  };

  // Logout function
  const logout = (): void => {
    setUser(null);
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
  };

  // Update user profile
  const updateProfile = async (
    userId: string,
    updates: Partial<User>
  ): Promise<void> => {
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update user in mock data
      const userIndex = users.findIndex((u) => u.id === userId);
      if (userIndex === -1) {
        throw new Error("User not found");
      }

      const updatedUser = { ...users[userIndex], ...updates };
      users[userIndex] = updatedUser;

      // Update current user if it's the same user
      if (user?.id === userId) {
        setUser(updatedUser);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser));
      }

      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error((error as Error).message);
      throw error;
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    updateProfile,
    isAuthenticated: !!user,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for using auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
