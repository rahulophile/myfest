// src/App.jsx
import React, { useState, useEffect } from 'react'; // useState pehle se hai, good
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
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
import Spinner from './components/Spinner';
import TechBackground from './components/TechBackground';

// Developer Credit components import karein
import DeveloperCredit from './components/DeveloperCredit';
import DeveloperModal from './components/DeveloperModal';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <Spinner />;
  }
  
  return user ? children : <Navigate to="/login" replace />;
};

// Admin Protected Route Component
const AdminRoute = ({ children }) => {
  const { admin, loading } = useAuth();
  
  if (loading) {
    return <Spinner />;
  }
  
  return admin ? children : <Navigate to="/admin/login" replace />;
};

function AppContent() {
  const { loading } = useAuth();

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col relative">
      <TechBackground />
      <div className="relative z-10 flex flex-col flex-grow">
        <MainContent />
      </div>
    </div>
  );
}

function MainContent() {
  const location = useLocation();
  const { admin } = useAuth();
  
  // Check if current route is admin route
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  // Modal ke liye state
  const [isDevModalOpen, setDevModalOpen] = useState(false);

  return (
    <>
      {/* Only show Header and Footer for non-admin routes */}
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
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      
      {/* Footer and Developer Credit ko conditionally render karein */}
      {!isAdminRoute && (
        <>
          <Footer />
          <DeveloperCredit onClick={() => setDevModalOpen(true)} />
          <DeveloperModal isOpen={isDevModalOpen} onClose={() => setDevModalOpen(false)} />
        </>
      )}
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;