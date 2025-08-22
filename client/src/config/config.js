// Backend configuration
export const BACKEND_URL = 'http://localhost:8000';
// hhello
// export const BACKEND_URL = 'https://myfest.onrender.com';

// API endpoints
export const API_ENDPOINTS = {
  EVENTS: `${BACKEND_URL}/api/events`,
  USERS: `${BACKEND_URL}/api/users`,
  ADMIN: `${BACKEND_URL}/api/admin`,
  AUTH: `${BACKEND_URL}/api/auth`,
};

// Helper function to build API URLs
export const buildApiUrl = (endpoint) => `${BACKEND_URL}${endpoint}`; 