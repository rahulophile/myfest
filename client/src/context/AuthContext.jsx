import React, { createContext, useContext, useState, useEffect } from 'react';
import { buildApiUrl } from '../config/config';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing tokens on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userToken = localStorage.getItem('userToken');
        const adminToken = localStorage.getItem('adminToken');

        console.log('🔐 Checking authentication...', { userToken: !!userToken, adminToken: !!adminToken });

        if (userToken) {
          // Verify user token
          try {
            const response = await fetch(buildApiUrl('/api/users/profile'), {
              headers: {
                'Authorization': `Bearer ${userToken}`
              }
            });

            if (response.ok) {
              const userData = await response.json();
              console.log('✅ User token valid, setting user:', userData.data.name);
              setUser(userData.data);
            } else if (response.status === 429) {
              console.log('⚠️ Rate limited during auth check, will retry later');
              // Don't remove token for rate limiting, just log it
              // The token might still be valid, just rate limited
            } else {
              console.log('❌ User token invalid, removing from localStorage');
              localStorage.removeItem('userToken');
              localStorage.removeItem('userRefreshToken');
            }
          } catch (error) {
            console.error('Error verifying user token:', error);
            localStorage.removeItem('userToken');
            localStorage.removeItem('userRefreshToken');
          }
        }

        if (adminToken) {
          // Verify admin token
          try {
            const response = await fetch(buildApiUrl('/api/admin/users'), {
              headers: {
                'Authorization': `Bearer ${adminToken}`
              }
            });

            if (response.ok) {
              console.log('✅ Admin token valid, setting admin');
              setAdmin({ token: adminToken });
            } else if (response.status === 429) {
              console.log('⚠️ Rate limited during admin auth check, will retry later');
              // Don't remove token for rate limiting, just log it
            } else {
              console.log('❌ Admin token invalid, removing from localStorage');
              localStorage.removeItem('adminToken');
            }
          } catch (error) {
            console.error('Error verifying admin token:', error);
            localStorage.removeItem('adminToken');
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        localStorage.removeItem('userToken');
        localStorage.removeItem('adminToken');
        localStorage.removeItem('userRefreshToken');
      } finally {
        console.log('🔐 Auth check completed');
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // User authentication functions
  const loginUser = async (emailId, password) => {
    try {
      const response = await fetch(buildApiUrl('/api/users/login'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emailId, password }),
      });

      const data = await response.json();

      if (data.success) {
        const { accessToken, refreshToken, ...userData } = data.data;
        localStorage.setItem('userToken', accessToken);
        localStorage.setItem('userRefreshToken', refreshToken);
        setUser(userData);
        return { success: true, data: userData };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const signupUser = async (userData) => {
    try {
      const response = await fetch(buildApiUrl('/api/users/signup'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (data.success) {
        const { accessToken, refreshToken, ...userInfo } = data.data;
        localStorage.setItem('userToken', accessToken);
        localStorage.setItem('userRefreshToken', refreshToken);
        setUser(userInfo);
        return { success: true, data: userInfo };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const logoutUser = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userRefreshToken');
    setUser(null);
  };

  // Admin authentication functions
  const loginAdmin = async (username, password) => {
    try {
      const response = await fetch(buildApiUrl('/api/admin/login'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        const { token, ...adminData } = data.data;
        localStorage.setItem('adminToken', token);
        // Store admin data with token for easy access
        setAdmin({ ...adminData, token });
        return { success: true, data: adminData };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const logoutAdmin = () => {
    localStorage.removeItem('adminToken');
    setAdmin(null);
  };

  // Utility functions
  const getUserToken = () => {
    return localStorage.getItem('userToken');
  };

  const getAdminToken = () => {
    return localStorage.getItem('adminToken');
  };

  const forgotUserId = async (registrationNumber, emailId) => {
    try {
      const response = await fetch(buildApiUrl('/api/users/forgot-userid'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ registrationNumber, emailId }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const forgotPassword = async (userId) => {
    try {
      const response = await fetch(buildApiUrl('/api/users/forgot-password'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  const value = {
    user,
    admin,
    loading,
    loginUser,
    signupUser,
    logoutUser,
    loginAdmin,
    logoutAdmin,
    getUserToken,
    getAdminToken,
    forgotUserId,
    forgotPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 