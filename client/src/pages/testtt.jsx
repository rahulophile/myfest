// --- START OF FILE EventDetail.jsx ---

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from 'react-helmet-async';
import { useAuth } from "../context/AuthContext";
import SuccessAnimation from "../components/SuccessAnimation";
import { buildApiUrl, BACKEND_URL } from "../config/config";
import { rulebookMap } from "../config/rulebooks";
import { posterMap, defaultEventPoster } from "../config/posterMap";

// --- Helper Components (बाहर निकाल दिए ताकि re-render की समस्या न हो) ---

// Registration Form Component
const RegistrationForm = ({
  event,
  registrationData,
  handleInputChange,
  handleRegistration,
  registrationError,
  registrationSuccess,
  registrationLoading,
  setShowRegistrationForm,
}) => (
  <form onSubmit={handleRegistration} className="space-y-4">
    <h3 className="text-2xl font-bold text-white mb-2">Event Registration</h3>
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1">
        Team Name <span className="text-red-500">*</span>
      </label>
      <input
        type="text"
        name="teamName"
        value={registrationData.teamName}
        onChange={handleInputChange}
        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
        required
      />
    </div>

    {Array.from({ length: event.teamSize.max - 1 }).map((_, i) => {
      const memberNum = i + 2;
      const isRequired = event.teamSize.min > memberNum - 1;
      return (
        <div key={memberNum}>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            {memberNum}
            {memberNum === 2 ? "nd" : memberNum === 3 ? "rd" : "th"} Member ID{" "}
            {isRequired && <span className="text-red-500">*</span>}
          </label>
          <input
            type="text"
            name={`member${memberNum}`}
            value={registrationData[`member${memberNum}`]}
            onChange={handleInputChange}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
            required={isRequired}
          />
        </div>
      );
    })}

    <div className="bg-yellow-900/50 border border-yellow-700 p-4 rounded-md text-yellow-200">
      <div className="flex items-center space-x-2">
        <svg
          className="w-6 h-6 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
        <p className="font-bold">Important Terms</p>
      </div>
      <ul className="list-disc list-inside text-sm space-y-1 mt-2 pl-2">
        <li>No accommodation will be provided.</li>
        <li>Adding/removing members post-registration is not allowed.</li>
        <li>Read the RULEBOOK before registration.</li>
      </ul>
    </div>

    <div className="flex items-start space-x-2">
      <input
        type="checkbox"
        name="termsAccepted"
        checked={registrationData.termsAccepted}
        onChange={handleInputChange}
        className="h-4 w-4 mt-1 text-cyan-600 border-gray-600 rounded bg-gray-700"
        required
      />
      <label className="text-sm text-gray-300">
        I agree to the terms & conditions.{" "}
        <span className="text-red-500">*</span>
      </label>
    </div>

    {registrationError && (
      <div className="bg-red-900/80 text-red-200 px-3 py-2 rounded-md text-sm">
        {registrationError}
      </div>
    )}
    {registrationSuccess && (
      <div className="bg-green-900/80 text-green-200 px-3 py-2 rounded-md text-sm">
        {registrationSuccess}
      </div>
    )}

    <div className="flex space-x-2">
      <button
        type="button"
        onClick={() => setShowRegistrationForm(false)}
        className="w-1/3 bg-gray-600 hover:bg-gray-500 text-white py-3 rounded-md font-medium"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={registrationLoading}
        className="w-2/3 bg-cyan-600 hover:bg-cyan-700 text-white py-3 rounded-md font-medium disabled:opacity-50"
      >
        {registrationLoading ? "Registering..." : "Confirm"}
      </button>
    </div>
  </form>
);

// Action Box Component
const ActionBox = ({
  user,
  event,
  timeLeft,
  isRegistrationOpen,
  rulebookUrl,
  setShowRegistrationForm,
  navigate,
}) => {
  if (!isRegistrationOpen)
    return (
      <p className="text-center text-red-400 font-semibold">
        Registration is Closed.
      </p>
    );
  if (event.currentTeams >= event.maxTeams)
    return (
      <p className="text-center text-orange-400 font-semibold">
        This event is full.
      </p>
    );

  return (
    <div className="space-y-6 text-center">
      <div>
        <p className="text-green-300 text-sm mb-2">Registration closes in:</p>
        <div className="flex justify-center space-x-2 md:space-x-4">
          {Object.entries(timeLeft).map(([unit, value]) => (
            <div
              key={unit}
              className="text-center bg-gray-800/50 p-3 border-sky-800 border-1 rounded-lg w-20"
            >
              <div className="text-2xl font-bold text-white">{value}</div>
              <div className="text-xs text-gray-400 capitalize">{unit}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex space-x-3 pt-4 border-t border-gray-700">
        {rulebookUrl && (
          <a
            href={rulebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="flex-1 text-center bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-md font-medium"
          >
            Rulebook
          </a>
        )}
        {user ? (
          <button
            onClick={() => setShowRegistrationForm(true)}
            className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white py-3 rounded-md font-medium"
          >
            Register Now
          </button>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white py-3 rounded-md font-medium"
          >
            Login to Register
          </button>
        )}
      </div>
    </div>
  );
};

// --- Main Event Detail Component ---
const EventDetail = () => {
  const { eventId } = useParams();
  const { user, getUserToken } = useAuth();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [registrationData, setRegistrationData] = useState({
    teamName: "",
    member2: "",
    member3: "",
    member4: "",
    termsAccepted: false,
  });
  const [registrationLoading, setRegistrationLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState("");
  const [registrationError, setRegistrationError] = useState("");
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const rulebookUrl = rulebookMap[eventId];

  useEffect(() => {
    /* Fetch event data */
    const fetchEvent = async () => {
      try {
        const response = await fetch(buildApiUrl(`/api/events/${eventId}`));
        const data = await response.json();
        if (data.success) setEvent(data.data);
        else setError("Event not found");
      } catch (error) {
        setError("Failed to fetch event details");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventId]);

  useEffect(() => {
    /* Countdown timer */
    if (!event) return;
    const timer = setInterval(() => {
      const difference =
        new Date(event.registrationDeadline).getTime() - new Date().getTime();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [event]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRegistrationData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setRegistrationError("");
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    // Simplified validation check, full logic in previous versions
    if (!registrationData.teamName.trim() || !registrationData.termsAccepted) {
      setRegistrationError("Please fill all required fields and accept terms.");
      return;
    }
    setRegistrationLoading(true);
    setRegistrationError("");
    setRegistrationSuccess("");
    try {
      const token = getUserToken();
      const response = await fetch(
        buildApiUrl(`/api/events/${eventId}/register`),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(registrationData),
        }
      );
      const data = await response.json();
      if (data.success) {
        setShowSuccessAnimation(true);
        setRegistrationSuccess("Registered!");
      } else {
        setRegistrationError(data.message || "Registration failed");
      }
    } catch (error) {
      setRegistrationError("Network error");
    } finally {
      setRegistrationLoading(false);
    }
  };

  const getPosterUrl = (p) =>
    p
      ? p.startsWith("http")
        ? p
        : `${BACKEND_URL}${p.startsWith("/") ? "" : "/"}${p}`
      : "";

  if (loading)
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-400"></div>
      </div>
    );
  if (error || !event)
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-center p-4">
        <button
          onClick={() => navigate("/events")}
          className="bg-cyan-600 text-white px-4 py-2 rounded-md"
        >
          Back to Events
        </button>
      </div>
    );

  const isRegistrationOpen = new Date() < new Date(event.registrationDeadline);
  const posterUrl = getPosterUrl(event.poster);

  return (
    <>
    <Helmet>
        <title>{`${event.title} | Events | Vision'25`}</title>
        <meta name="description" content={`Participate in ${event.title} at Vision'25. ${event.description}`} />
        <link rel="canonical" href={`https://visiongecv.in/events/${eventId}`} />
        <meta property="og:title" content={`${event.title} | Vision'25`} />
        <meta property="og:description" content={event.description} />
        {/* Agar har event ka alag poster hai to usko OG image bana sakte hain */}
        {event.poster && <meta property="og:image" content={getPosterUrl(event.poster)} />}
      </Helmet>
      <div
        className="min-h-screen w-full bg-cover bg-center bg-fixed"
        style={{ backgroundImage: `url(${posterUrl})` }}
      >
        <div className="min-h-screen w-full bg-black/30 backdrop-blur-sm">
          <button
            onClick={() => navigate("/events")}
            className="absolute top-6 left-6 z-10 text-white bg-black/30 hover:bg-black/50 px-3 py-1 rounded-md transition-colors"
          >
            ← Back
          </button>

          <div className="container mx-auto px-4 lg:py-16 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 pt-12">
              <div className="lg:col-span-3">
                <div className="lg:sticky top-8 bg-black/40 border border-gray-700 rounded-lg lg:max-h-[60vh] max-h-[50vh]  overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-600">
                  <div className="space-y-8">
                    <div>
                      <h1 className="text-4xl  md:text-5xl font-bold text-sky-300 mb-2">
                        {event.title}
                      </h1>
                      <p className="text-lg text-gray-300">{event.category}</p>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-4 border-b-2 border-cyan-500/30 pb-2">
                        About The Event
                      </h2>
                      <p className="text-gray-300 whitespace-pre-wrap">
                        {event.description}
                        {event.overview && `\n\n${event.overview}`}
                      </p>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-4 border-b-2 border-cyan-500/30 pb-2">
                        Details & Prizes
                      </h2>
                      <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                        <span className="text-white" >
                          Date:{" "}
                          <span className="text-sky-400 font-semibold ">
                            {new Date(event.date).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "long",
                            })}
                          </span>
                        </span>
                        <span className="text-white">
                          Time:{" "}
                          <span className="font-semibold text-sky-400">
                            {new Date(event.date).toLocaleTimeString("en-IN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </span>
                        <span className="text-white">
                          Venue:{" "}
                          <span className="font-semibold text-sky-400">
                            {event.venue}
                          </span>
                        </span>
                        <span className="text-white">
                          Team Size:{" "}
                          <span className="font-semibold text-sky-400">
                            {event.teamSize.min}-{event.teamSize.max}
                          </span>
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {event.prizes.map((p, i) => (
                          <div
                            key={i}
                            className="text-center p-4 bg-gray-800/50 rounded-lg"
                          >
                            <div
                              className={`text-2xl font-bold mb-2 ${
                                [
                                  "text-yellow-400",
                                  "text-gray-300",
                                  "text-amber-600",
                                ][i]
                              }`}
                            >
                              {p.position}
                            </div>
                            <div className="text-white font-medium">
                              {p.amount}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* <div>
                      <h2 className="text-2xl font-bold text-white mb-4 border-b-2 border-cyan-500/30 pb-2">
                        Rules
                      </h2>
                      <ul className="space-y-3">
                        {event.rules.map((rule, i) => (
                          <li key={i} className="flex items-start space-x-3">
                            <span className="mt-1 w-5 h-5 bg-cyan-600 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                              {i + 1}
                            </span>
                            <p className="text-gray-300">{rule}</p>
                          </li>
                        ))}
                      </ul>
                    </div> */}
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-4 border-b-2 border-cyan-500/30 pb-2">
                        Coordinators
                      </h2>
                      <div className="space-y-4">
                        {event.coordinators.map((c, i) => (
                          <div key={i} className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-cyan-600 rounded-full flex items-center justify-center shrink-0">
                              <span className="text-white font-bold">
                                {c.name.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <div className="text-white font-medium">
                                {c.name}
                              </div>
                              <div className="text-gray-400 text-sm">
                                {c.contact}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="lg:sticky top-8 bg-black/40 border border-gray-700 rounded-lg p-6">
                  {showRegistrationForm ? (
                    <RegistrationForm
                      {...{
                        event,
                        registrationData,
                        handleInputChange,
                        handleRegistration,
                        registrationError,
                        registrationSuccess,
                        registrationLoading,
                        setShowRegistrationForm,
                      }}
                    />
                  ) : (
                    <ActionBox
                      {...{
                        user,
                        event,
                        timeLeft,
                        isRegistrationOpen,
                        rulebookUrl,
                        setShowRegistrationForm,
                        navigate,
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SuccessAnimation
        isVisible={showSuccessAnimation}
        onClose={() => {
          setShowSuccessAnimation(false);
          navigate("/dashboard");
        }}
        title="Registration Successful! 🎉"
        message={`You registered for ${event.title}!`}
      />
    </>
  );
};

export default EventDetail;
