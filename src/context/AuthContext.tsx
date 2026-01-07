// import React, { createContext, useState, useContext, useEffect } from "react";
// import { User, UserRole, AuthContextType } from "../types";
// import toast from "react-hot-toast";
// import axios from "axios";

// // Create Auth Context
// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// // Local storage keys
// const USER_STORAGE_KEY = "business_nexus_user";
// const RESET_TOKEN_KEY = "business_nexus_reset_token";
// const URL = import.meta.env.VITE_BACKEND_URL;
// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
//   children,
// }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   // Check for stored user on initial load
//   useEffect(() => {
//     setIsLoading(true);
//     const token = localStorage.getItem("token");
//     if (token) {
//       axios
//         .get(URL + "/auth/verify", {
//           headers: { Authorization: `Bearer ${token}` },
//         })
//         .then((res) => {
//           const { user } = res.data;
//           if (!(user.exp * 1000 > Date.now())) {
//             localStorage.removeItem("token");
//           }
//         })
//         .catch(() => {
//           localStorage.removeItem("token");
//           setUser(null);
//         })
//         .finally(() => setIsLoading(false));
//     } else {
//       setIsLoading(false);
//     }
//   }, []);

//   // Mock login function - in a real app, this would make an API call
//   const login = async (
//     email: string,
//     password: string,
//     role: UserRole
//   ): Promise<void> => {
//     setIsLoading(true);

//     try {
//       // Simulate API call delay
//       const res = await axios.post(
//         `${URL}/auth/login`,
//         {
//           email,
//           password,
//           role,
//         },
//         {
//           withCredentials: true,
//         }
//       );
//       const { token, user } = res.data;

//       console.log(user);
//       localStorage.setItem("token", token);
//       setUser({ ...user, isOnline: true });
//       toast.success("Successfully logged in!");
//     } catch (error) {
//       toast.error((error as Error).message);
//       throw error;
//     } finally {
//       setIsLoading(false);
//     }
//   };
//   const loginWithOauth = async (
//     userToken: string,
//     role: UserRole
//   ): Promise<void> => {
//     setIsLoading(true);

//     console.log("hello");
//     try {
//       const res = await axios.post(
//         `${URL}/auth/login-with-oauth`,
//         {
//           userToken,
//           role,
//         },
//         {
//           headers: { "Content-Type": "application/json" },
//           withCredentials: true,
//         }
//       );
//       const { token, user } = res.data;

//       console.log(user);
//       localStorage.setItem("token", token);
//       setUser({ ...user, isOnline: true });
//       toast.success("Successfully logged in!");
//     } catch (error) {
//       toast.error((error as Error).message);
//       throw error;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Mock register function - in a real app, this would make an API call
//   const register = async (
//     name: string,
//     email: string,
//     password: string,
//     role: UserRole
//   ): Promise<string | null> => {
//     setIsLoading(true);

//     try {
//       // Simulate API call delay
//       const res = await axios.post(
//         `${URL}/auth/register`,
//         {
//           name,
//           email,
//           password,
//           role,
//         },
//         {
//           withCredentials: true,
//         }
//       );
//       if (res.status === 201) {
//         toast.success("Account created successfully!");
//         const { token, user } = res.data;
//         localStorage.setItem("token", token);
//         setUser(user);
//         return user.userId;
//       }
//       else
//         return null;
//     } catch (error) {
//       toast.error((error as Error).message);
//       return null;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Forgot password function
//   const forgotPassword = async (email: string, role: string): Promise<void> => {
//     try {
//       // Generate reset token (in a real app, this would be a secure token)
//       const resetToken = Math.random().toString(36).substring(2, 15);
//       localStorage.setItem(RESET_TOKEN_KEY, resetToken);

//       // This would send an email
//       const resetLink = `https://nexus-gso984fz0-danish-ajmals-projects.vercel.app/reset-password?token=${resetToken}`;
//       const message = `
//           <p>To reset your password, please click the button below:</p>
//           <a href="${resetLink}" 
//             style="display:inline-block; padding:10px 20px; 
//                     background-color:#4F46E5; color:white; 
//                     text-decoration:none; border-radius:6px; 
//                     font-weight:bold;">
//             Reset Password
//           </a>
//           <p>If the button doesn’t work, copy and paste this link into your browser:</p>
//           <p><a href="${resetLink}">${resetLink}</a></p>
//         `;

//       const sub = "Password reset instructions";
//       const res = await axios.post(
//         `${URL}/auth/send-mail`,
//         { email, message, sub, role },
//         {
//           withCredentials: true,
//         }
//       );
//       const { user } = res.data;

//       localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
//       toast.success("Password reset instructions sent to your email");
//     } catch (error) {
//       toast.error((error as Error).message);
//       throw error;
//     }
//   };

//   // Mock reset password function
//   const resetPassword = async (
//     token: string,
//     newPassword: string
//   ): Promise<void> => {
//     try {
//       const storedToken = localStorage.getItem(RESET_TOKEN_KEY);
//       if (token !== storedToken) {
//         throw new Error("Invalid or expired reset token");
//       }
//       const savedUser = localStorage.getItem(USER_STORAGE_KEY);

//       const res = await axios.patch(
//         `${URL}/auth/update-password/${savedUser?.userId}`,
//         { newPassword },
//         { withCredentials: true }
//       );
//       const { user } = res.data;
//       setUser(user);

//       // This would update the user's password in the database
//       localStorage.removeItem(RESET_TOKEN_KEY);
//       localStorage.removeItem("user");
//       toast.success("Password reset successfully");
//     } catch (error) {
//       toast.error((error as Error).message);
//       throw error;
//     }
//   };

//   // Logout function
//   const logout = (): void => {
//     setUser(null);
//     localStorage.removeItem("token");
//     toast.success("Logged out successfully");
//   };

//   // Update user profile
//   const updateProfile = async (
//     userId: string |undefined,
//     userData: User
//   ): Promise<void> => {
//     if (
//       userData.location === "" &&
//       userData.bio === "" &&
//       userData.avatarUrl === ""
//     ) {
//       alert("Make changes to update profile..");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("name", userData.name);
//     formData.append("location", userData.location);
//     formData.append("email", userData.email);
//     formData.append("bio", userData.bio);
//     formData.append("avatarUrl", userData.avatarUrl);

//     await axios
//       .post(`${URL}/user/update-profile/${userId}`, formData, {
//         withCredentials: true,
//       })
//       .then((res) => {
//         toast.success("profile updated successfully.");
//         const { user } = res.data;
//         setUser(user);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   };

//   const value = {
//     user,
//     login,
//     loginWithOauth,
//     register,
//     logout,
//     forgotPassword,
//     resetPassword,
//     updateProfile,
//     isAuthenticated: !!user,
//     isLoading,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// // Custom hook for using auth context
// export const useAuth = (): AuthContextType => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };


import React, { createContext, useState, useContext, useEffect } from "react";
import { User, UserRole, AuthContextType } from "../types";
import toast from "react-hot-toast";
import axios from "axios";

// Create Auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Local storage keys
const USER_STORAGE_KEY = "business_nexus_user";
const RESET_TOKEN_KEY = "business_nexus_reset_token";
const URL = import.meta.env.VITE_BACKEND_URL;
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [requires2FA, setRequires2FA] = useState(false);
  const [partialAuthData, setPartialAuthData] = useState<any>(null);

  // Check for stored user on initial load
  // Check for stored user on initial load
useEffect(() => {
  // Clear token and user on refresh
  localStorage.removeItem("token");
  setUser(null);

  const checkAuth = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("token"); // will be null after removal
    if (token) {
      try {
        const res = await axios.get(URL + "/auth/verify", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { user: userData } = res.data;

        if (userData.exp * 1000 > Date.now()) {
          setUser({
            ...userData,
            isOnline: true,
            userId: userData.userId || userData._id,
          });
        } else {
          localStorage.removeItem("token");
          setUser(null);
        }
      } catch (err) {
        console.error("Token verification failed:", err);
        localStorage.removeItem("token");
        setUser(null);
      }
    }
    setIsLoading(false);
  };

  checkAuth();
}, []);


  // Enhanced login function with 2FA support
  const login = async (
    email: string,
    password: string,
    role: UserRole
  ): Promise<any> => {
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
      
      const { token, user: userData, requires2FA: needs2FA, partialToken } = res.data;

      if (needs2FA && partialToken) {
        // 2FA required
        setRequires2FA(true);
        setPartialAuthData({
          partialToken,
          user: userData,
          email,
          role
        });
        return { requires2FA: true, partialToken, user: userData };
      }

      // No 2FA required or 2FA already verified
      localStorage.setItem("token", token);
      const fullUserData = {
        ...userData,
        isOnline: true,
        userId: userData.userId || userData._id
      };
      setUser(fullUserData);
      toast.success("Successfully logged in!");
      
      return { requires2FA: false, user: fullUserData, token };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message;
      toast.error(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Verify 2FA code
  const verify2FA = async (code: string, useBackupCode = false): Promise<any> => {
    if (!partialAuthData?.partialToken) {
      throw new Error("No pending 2FA verification");
    }

    setIsLoading(true);
    
    try {
      const response = await axios.post(
        `${URL}/auth/verify-2fa`,
        {
          partialToken: partialAuthData.partialToken,
          code,
          useBackupCode
        }
      );
      
      const { token, user: userData } = response.data;
      
      // Save token and set user
      localStorage.setItem("token", token);
      const fullUserData = {
        ...userData,
        isOnline: true,
        userId: userData.userId || userData._id
      };
      setUser(fullUserData);
      setRequires2FA(false);
      setPartialAuthData(null);
      
      toast.success("2FA verification successful!");
      return { user: fullUserData, token };
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Verification failed";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Cancel 2FA verification
  const cancel2FA = () => {
    setRequires2FA(false);
    setPartialAuthData(null);
  };

  // Rest of the functions remain the same...
  const loginWithOauth = async (
    userToken: string,
    role: UserRole
  ): Promise<void> => {
    setIsLoading(true);

    console.log("hello");
    try {
      const res = await axios.post(
        `${URL}/auth/login-with-oauth`,
        {
          userToken,
          role,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      const { token, user } = res.data;

      console.log(user);
      localStorage.setItem("token", token);
      const fullUserData = {
        ...user,
        isOnline: true,
        userId: user.userId || user._id
      };
      setUser(fullUserData);
      toast.success("Successfully logged in!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (
    name: string,
    email: string,
    password: string,
    role: UserRole
  ): Promise<string | null> => {
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
        const { token, user } = res.data;
        localStorage.setItem("token", token);
        const fullUserData = {
          ...user,
          isOnline: true,
          userId: user.userId || user._id
        };
        setUser(fullUserData);
        return user.userId;
      } else {
        return null;
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Forgot password function
  const forgotPassword = async (email: string, role: string): Promise<void> => {
    try {
      // Generate reset token (in a real app, this would be a secure token)
      const resetToken = Math.random().toString(36).substring(2, 15);
      localStorage.setItem(RESET_TOKEN_KEY, resetToken);

      // This would send an email
      const resetLink = `https://nexus-gso984fz0-danish-ajmals-projects.vercel.app/reset-password?token=${resetToken}`;
      const message = `
          <p>To reset your password, please click the button below:</p>
          <a href="${resetLink}" 
            style="display:inline-block; padding:10px 20px; 
                    background-color:#4F46E5; color:white; 
                    text-decoration:none; border-radius:6px; 
                    font-weight:bold;">
            Reset Password
          </a>
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p><a href="${resetLink}">${resetLink}</a></p>
        `;

      const sub = "Password reset instructions";
      const res = await axios.post(
        `${URL}/auth/send-mail`,
        { email, message, sub, role },
        {
          withCredentials: true,
        }
      );
      const { user: userData } = res.data;

      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      toast.success("Password reset instructions sent to your email");
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message);
      throw error;
    }
  };

  // Reset password function
  const resetPassword = async (
    token: string,
    newPassword: string
  ): Promise<void> => {
    try {
      const storedToken = localStorage.getItem(RESET_TOKEN_KEY);
      if (token !== storedToken) {
        throw new Error("Invalid or expired reset token");
      }
      
      const savedUserStr = localStorage.getItem(USER_STORAGE_KEY);
      if (!savedUserStr) {
        throw new Error("User data not found");
      }
      
      const savedUser = JSON.parse(savedUserStr);

      const res = await axios.patch(
        `${URL}/auth/update-password/${savedUser.userId}`,
        { newPassword },
        { withCredentials: true }
      );
      
      const { user: userData } = res.data;
      const fullUserData = {
        ...userData,
        isOnline: true,
        userId: userData.userId || userData._id
      };
      setUser(fullUserData);

      localStorage.removeItem(RESET_TOKEN_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
      toast.success("Password reset successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message);
      throw error;
    }
  };

  // Logout function
  const logout = (): void => {
    setUser(null);
    setRequires2FA(false);
    setPartialAuthData(null);
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
  };

  // Update user profile
  const updateProfile = async (
    userId: string | undefined,
    userData: User
  ): Promise<void> => {
    if (
      userData.location === "" &&
      userData.bio === "" &&
      userData.avatarUrl === ""
    ) {
      alert("Make changes to update profile..");
      return;
    }

    const formData = new FormData();
    formData.append("name", userData.name);
    formData.append("location", userData.location);
    formData.append("email", userData.email);
    formData.append("bio", userData.bio);
    formData.append("avatarUrl", userData.avatarUrl);

    try {
      const res = await axios.post(
        `${URL}/user/update-profile/${userId}`,
        formData,
        {
          withCredentials: true,
        }
      );
      
      toast.success("Profile updated successfully.");
      const { user: updatedUser } = res.data;
      const fullUserData = {
        ...updatedUser,
        isOnline: true,
        userId: updatedUser.userId || updatedUser._id
      };
      setUser(fullUserData);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update profile");
      console.error(error);
    }
  };

  const value = {
    user,
    login,
    loginWithOauth,
    register,
    logout,
    forgotPassword,
    resetPassword,
    updateProfile,
    verify2FA,
    cancel2FA,
    requires2FA,
    partialAuthData,
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
