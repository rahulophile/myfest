import React, { useState, useEffect, useRef } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Spinner from "./components/Spinner";
import ScrollToTop from "./components/ScrollToTop";

// All pages and components
import Home from "./pages/Home";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import Team from "./pages/Team";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Sponsors from "./pages/Sponsors";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import TechBackground from "./components/TechBackground";
import EventBackground from "./components/EventBackground";
import TeamBackground from "./components/TeamBackground";
import GalleryBackground from "./components/GalleryBackground";
import ContactBackground from "./components/ContactBackground";
import DashboardBackground from "./components/DashboardBackground";
import DeveloperCredit from "./components/DeveloperCredit";
import DeveloperModal from "./components/DeveloperModal";
import SplashScreen from "./components/SplashScreen";

// Protected Route and Admin Route components
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

// Main App Content component
const AppContent = () => {
  const location = useLocation();
  const { loading } = useAuth();
  const [isDevModalOpen, setDevModalOpen] = useState(false);
  const devIconRef = useRef(null);
  const isAdminRoute = location.pathname.startsWith("/admin");

  useEffect(() => {
    if (isAdminRoute) return;
    const clickSound = new Audio("/click-sound.mp3");
    clickSound.volume = 0.2;
    const playSound = (event) => {
      if (event.target.closest("a, button, input, select")) {
        clickSound.currentTime = 0;
        clickSound.play().catch(console.error);
      }
    };
    document.addEventListener("click", playSound);
    return () => document.removeEventListener("click", playSound);
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <AppBackground />
      <div className="relative z-10 flex flex-col min-h-screen">
        <ScrollToTop />
        {!isAdminRoute && <Header />}
        <main className="flex-grow">
          <Routes>
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
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        {!isAdminRoute && (
          <>
            <Footer onDeveloperClick={() => setDevModalOpen(true)} />
            <DeveloperCredit
              ref={devIconRef}
              onClick={() => setDevModalOpen(true)}
              isModalOpen={isDevModalOpen}
            />
            <DeveloperModal
              isOpen={isDevModalOpen}
              onClose={() => setDevModalOpen(false)}
              targetRef={devIconRef}
            />
          </>
        )}
      </div>
    </div>
  );
};

// Background Manager
const AppBackground = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  if (isAdminRoute) return null;
  if (location.pathname.startsWith("/events")) return <EventBackground />;
  if (location.pathname === "/team") return <TeamBackground />;
  if (location.pathname === "/gallery") return <GalleryBackground />;
  if (location.pathname === "/contact") return <ContactBackground />;
  if (location.pathname === "/dashboard") return <DashboardBackground />;
  return <TechBackground />;
};

// Final App component (ab yeh sabko wrap karega)
function App() {
  const [isIntroPlaying, setIsIntroPlaying] = useState(true);
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  useEffect(() => {
    if (isAdminRoute) {
      // admin routes pe intro mat dikhao
      setIsIntroPlaying(false);
      return;
    }
    const hasSeenIntro = sessionStorage.getItem("hasSeenIntro");
    if (hasSeenIntro) {
      setIsIntroPlaying(false);
    } else {
      sessionStorage.setItem("hasSeenIntro", "true");
    }
  }, [isAdminRoute]);

  return (
    
      <AuthProvider>
        {isIntroPlaying ? (
          <SplashScreen onFinished={() => setIsIntroPlaying(false)} />
        ) : (
          <AppContent />
        )}
      </AuthProvider>
    
  );
}

export default App;
