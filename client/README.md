# Vision Fest 25 - Frontend

This is the React frontend for Vision Fest 25, built with Vite and Tailwind CSS.

## Backend Configuration

The frontend is configured to connect to a backend server. You can easily change the backend URL by following these steps:

### 1. Environment Variables

Create a `.env.local` file in the client directory with:

```bash
VITE_BACKEND_URL=http://localhost:8000
```

### 2. Change Backend URL

To change the backend URL (e.g., for production deployment), simply update the `.env.local` file:

```bash
# For production
VITE_BACKEND_URL=https://your-backend-domain.com

# For different local port
VITE_BACKEND_URL=http://localhost:3000
```

### 3. Configuration File

The backend URL is centrally managed in `src/config/config.js`. All API calls use this configuration, so you don't need to change URLs in individual components.

## Development

```bash
npm install
npm run dev
```

## Building for Production

```bash
npm run build
```

## Current Setup

- **Frontend**: React + Vite + Tailwind CSS
- **Backend URL**: Configurable via environment variables
- **API Endpoints**: All endpoints use the centralized config
- **Authentication**: JWT-based auth system

## File Structure

- `src/config/config.js` - Backend configuration and API endpoints
- `src/context/AuthContext.jsx` - Authentication context
- `src/pages/` - Page components
- `src/components/` - Reusable components
