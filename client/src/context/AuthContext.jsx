import React, { createContext, useContext, useState, useEffect } from "react";
import { buildApiUrl } from "../config/config";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing tokens on app load (No Changes Here)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userToken = localStorage.getItem("userToken");
        const adminToken = localStorage.getItem("adminToken");

        console.log("🔐 Checking authentication...", {
          userToken: !!userToken,
          adminToken: !!adminToken,
        });

        if (userToken) {
          const response = await fetch(buildApiUrl("/api/users/profile"), {
            headers: { Authorization: `Bearer ${userToken}` },
          });
          if (response.ok) {
            const userData = await response.json();
            setUser(userData.data);
          } else {
            localStorage.removeItem("userToken");
            localStorage.removeItem("userRefreshToken");
          }
        }

        if (adminToken) {
          const response = await fetch(buildApiUrl("/api/admin/users"), {
            headers: { Authorization: `Bearer ${adminToken}` },
          });
          if (response.ok) {
            setAdmin({ token: adminToken });
          } else {
            localStorage.removeItem("adminToken");
          }
        }
      } catch (error) {
        console.error("Auth check error:", error);
        localStorage.removeItem("userToken");
        localStorage.removeItem("adminToken");
        localStorage.removeItem("userRefreshToken");
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  // --- EXISTING AUTH FUNCTIONS (No Changes Here) ---
  const loginUser = async (emailId, password) => {
    try {
      const response = await fetch(buildApiUrl("/api/users/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailId, password }),
      });
      const data = await response.json();
      if (data.success) {
        const { accessToken, refreshToken, ...userData } = data.data;
        localStorage.setItem("userToken", accessToken);
        localStorage.setItem("userRefreshToken", refreshToken);
        setUser(userData);
        return { success: true, data: userData };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      return { success: false, message: "Network error. Please try again." };
    }
  };

  const logoutUser = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userRefreshToken");
    setUser(null);
  };

  const loginAdmin = async (username, password) => {
    try {
      const response = await fetch(buildApiUrl("/api/admin/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (data.success) {
        const { token, ...adminData } = data.data;
        localStorage.setItem("adminToken", token);
        setAdmin({ ...adminData, token });
        return { success: true, data: adminData };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      return { success: false, message: "Network error. Please try again." };
    }
  };

  const logoutAdmin = () => {
    localStorage.removeItem("adminToken");
    setAdmin(null);
  };

  const getUserToken = () => localStorage.getItem("userToken");
  const getAdminToken = () => localStorage.getItem("adminToken");

  const forgotUserId = async (registrationNumber, emailId) => {
    try {
      const response = await fetch(buildApiUrl("/api/users/forgot-userid"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationNumber, emailId }),
      });
      return await response.json();
    } catch (error) {
      return { success: false, message: "Network error. Please try again." };
    }
  };

  const requestSignupOTP = async (userData) => {
    try {
      const response = await fetch(buildApiUrl("/api/users/signup-request"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      return await response.json();
    } catch (error) {
      return { success: false, message: "Network error. Please try again." };
    }
  };

  const verifySignupOTPAndCreateUser = async (userDataWithOtp) => {
    try {
      const response = await fetch(buildApiUrl("/api/users/signup-verify"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userDataWithOtp),
      });
      const data = await response.json();
      if (data.success) {
        const { accessToken, refreshToken, ...userInfo } = data.data;
        localStorage.setItem("userToken", accessToken);
        localStorage.setItem("userRefreshToken", refreshToken);
        setUser(userInfo);
      }
      return data;
    } catch (error) {
      return { success: false, message: "Network error. Please try again." };
    }
  };

  // --- FORGOT PASSWORD FUNCTIONS (YAHAN CHANGES HAIN) ---
  const requestForgotPasswordOTP = async (emailId) => {
    // Ab `userId` ki jagah `emailId` lega
    try {
      const response = await fetch(
        buildApiUrl("/api/users/forgot-password-request"),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ emailId }), // Backend ko `emailId` bhejega
        }
      );
      return await response.json();
    } catch (error) {
      return { success: false, message: "Network error. Please try again." };
    }
  };

  const verifyForgotPasswordOTPAndReset = async (emailId, otp, newPassword) => {
    // Ab `userId` ki jagah `emailId` lega
    try {
      const response = await fetch(
        buildApiUrl("/api/users/forgot-password-verify"),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ emailId, otp, newPassword }), // Backend ko `emailId` bhejega
        }
      );
      return await response.json();
    } catch (error) {
      return { success: false, message: "Network error. Please try again." };
    }
  };

  const value = {
    user,
    admin,
    loading,
    loginUser,
    logoutUser,
    loginAdmin,
    logoutAdmin,
    getUserToken,
    getAdminToken,
    forgotUserId,
    requestSignupOTP,
    verifySignupOTPAndCreateUser,
    requestForgotPasswordOTP,
    verifyForgotPasswordOTPAndReset,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
