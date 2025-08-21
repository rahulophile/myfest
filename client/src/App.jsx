import React, { useState, useEffect } from "react";
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

// All pages
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

// All background components
import TechBackground from "./components/TechBackground";
import EventBackground from "./components/EventBackground";
import TeamBackground from "./components/TeamBackground";
import GalleryBackground from "./components/GalleryBackground";
import ContactBackground from "./components/ContactBackground";
import DashboardBackground from "./components/DashboardBackground";

// Developer Credit components
import DeveloperCredit from "./components/DeveloperCredit";
import DeveloperModal from "./components/DeveloperModal";

// Naya SplashScreen component import karein
import SplashScreen from "./components/SplashScreen";

// Protected Route Components (No change)
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

// AppBackground Component (No change)
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

// AppLayout Component (No change)
const AppLayout = () => {
  const { loading } = useAuth();
  const location = useLocation();
  const [isDevModalOpen, setDevModalOpen] = useState(false);
  const isAdminRoute = location.pathname.startsWith("/admin");

  useEffect(() => {
    const clickSound = new Audio("/click-sound.mp3");
    clickSound.volume = 0.2;
    const playSound = (event) => {
      const target = event.target;
      if (
        target.closest(
          'a, button, input[type="checkbox"], input[type="radio"], select'
        )
      ) {
        clickSound.currentTime = 0;
        clickSound
          .play()
          .catch((error) => console.error("Sound play error:", error));
      }
    };
    document.addEventListener("click", playSound);
    return () => {
      document.removeEventListener("click", playSound);
    };
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="relative z-10 flex flex-col min-h-screen">
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
          <Footer />
          <DeveloperCredit onClick={() => setDevModalOpen(true)} />
          <DeveloperModal
            isOpen={isDevModalOpen}
            onClose={() => setDevModalOpen(false)}
          />
        </>
      )}
    </div>
  );
};

// The main App component that ties everything together
function App() {
  const [isIntroPlaying, setIsIntroPlaying] = useState(true);

  useEffect(() => {
    // Session storage check karega taaki animation sirf ek baar chale
    const hasSeenIntro = sessionStorage.getItem("hasSeenIntro");
    if (hasSeenIntro) {
      setIsIntroPlaying(false);
    } else {
      sessionStorage.setItem("hasSeenIntro", "true");
    }
  }, []);

  // Jab tak intro chal raha hai, sirf SplashScreen dikhayega
  if (isIntroPlaying) {
    return <SplashScreen onFinished={() => setIsIntroPlaying(false)} />;
  }

  // Intro khatam hone ke baad poori website dikhayega
  return (
    <Router>
      <AuthProvider>
        <ScrollToTop />
        <div className="min-h-screen bg-gray-900">
          <AppBackground />
          <AppLayout />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
