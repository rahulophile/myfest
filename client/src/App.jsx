import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Spinner from './components/Spinner';
import ScrollToTop from './components/ScrollToTop';

// All pages
import Home from './pages/Home';
import Events from './pages/Events';
import EventDetail from './pages/EventDetail';
import Team from './pages/Team';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Sponsors from './pages/Sponsors';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

// All background components
import TechBackground from './components/TechBackground';
import EventBackground from './components/EventBackground';
import TeamBackground from './components/TeamBackground';
import GalleryBackground from './components/GalleryBackground';
import ContactBackground from './components/ContactBackground';
import DashboardBackground from './components/DashboardBackground';

// Developer Credit components
import DeveloperCredit from './components/DeveloperCredit';
import DeveloperModal from './components/DeveloperModal';

// Protected Route Components
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  return user ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const { admin, loading } = useAuth();
  if (loading) return <Spinner />;
  return admin ? children : <Navigate to="/admin/login" replace />;
};

// This component decides which background to show
const AppBackground = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute) return null; // No background for admin pages

  // Select background based on route
  if (location.pathname.startsWith('/events')) return <EventBackground />;
  if (location.pathname === '/team') return <TeamBackground />;
  if (location.pathname === '/gallery') return <GalleryBackground />;
  if (location.pathname === '/contact') return <ContactBackground />;
  if (location.pathname === '/dashboard') return <DashboardBackground />;
  
  // Default background for Home, Login, Signup, etc.
  return <TechBackground />;
};

// This component manages the main layout
const AppLayout = () => {
  const { loading } = useAuth();
  const location = useLocation();
  const [isDevModalOpen, setDevModalOpen] = useState(false);
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="relative z-10 flex flex-col min-h-screen">
      {!isAdminRoute && <Header />}
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:eventId" element={<EventDetail />} />
          <Route path="/team" element={<Team />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/sponsors" element={<Sponsors />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      
      {/* Conditionally render Footer and Developer Credit */}
      {!isAdminRoute && (
        <>
          <Footer />
          <DeveloperCredit onClick={() => setDevModalOpen(true)} />
          <DeveloperModal isOpen={isDevModalOpen} onClose={() => setDevModalOpen(false)} />
        </>
      )}
    </div>
  );
};

// The main App component that ties everything together
function App() {
  return (
    <Router>
      <AuthProvider>
        <ScrollToTop /> {/* This will reset scroll on every page change */}
        <div className="min-h-screen bg-gray-900">
          <AppBackground /> {/* Background Layer */}
          <AppLayout />     {/* Content Layer (Header, Pages, Footer) */}
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;