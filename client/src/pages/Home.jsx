import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useAuth } from "../context/AuthContext";
import { buildApiUrl, BACKEND_URL } from "../config/config";
import SocialBar from "../components/SocialBar";
import { posterMap, defaultEventPoster } from "../config/posterMap";

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const facultyRef = useRef(null);
  const facultyRefMobile = useRef(null);
  const eventsRef = useRef(null);
  const teamRef = useRef(null);

  const faculty = [
    {
      name: "Dr.  Ravi Ranjan",
      dept: "Mentor",
      photo: "./images/profRavi.jpeg",
      role: "Asst. Prof./HOD ECE",
    },
    {
      name: "Mr.  Vivek Kumar",
      dept: "Faculty Incharge",
      photo: "./images/profVivekEE.png",
      role: "Asst. Prof. EE",
    },
    {
      name: "Dr.  Ganesh Kr. Thakur",
      dept: "Faculty Coordinator",
      photo: "./images/profGanesh.jpg",
      role: "Asst. Prof. Humanities",
    },
    {
      name: "Mr.  Manoj Kumar Sah",
      dept: "Faculty Coordinator",
      photo: "./images/profManoj.jpg",
      role: "Asst. Prof. CSE",
    },
    {
      name: "Mrs. Garima Yadav",
      dept: "Faculty Coordinator",
      photo: "./images/profGarima.jpeg",
      role: "Asst. Prof. CE",
    },
    {
      name: "Mrs. Nivedita Singh",
      dept: "Faculty Coordinator",
      photo: "./images/profNivedita.jpg",
      role: "Asst. Prof. ECE",
    },
    {
      name: "Mrs. Sunaina",
      dept: "Faculty Coordinator",
      photo: "./images/profSunaina.jpeg",
      role: "Asst. Prof. ECE",
    },
    {
      name: "Mr.  Kumar Abhinav",
      dept: "Faculty Coordinator",
      photo: "/images/profAbhinav.jpg",
      role: "Asst. Prof. EE",
    },
    {
      name: "Mr.  Anrudh Shandilya",
      dept: "Faculty Coordinator",
      photo: "./images/profSandilya.jpg",
      role: "Asst. Prof. ME",
    },
    {
      name: "Mr.  Narayan Kumar",
      dept: "Faculty Coordinator",
      photo: "./images/profNarayan.jpeg",
      role: "Asst. Prof. ME",
    },
  ];

  const teamMembers = [
    {
      name: "Sumit Kr. Sharma",
      role: "Student Coordinator",
      dept: "Secretary",
      phone: "+91 9006108744",
      photo: "./images/SumitMEM.webp",
    },
    {
      name: "Ishank Raj",
      role: "Student Coordinator",
      dept: "Join Secretary",
      phone: "+91 8434671276",
      photo: "./images/IshankMEM.webp",
    },
    {
      name: "Ashutosh Kant",
      role: "Student Coordinator",
      dept: "3D Printing Coordinator",
      phone: "+91 9525825072",
      photo: "./images/AshutoshMEM.webp",
    },
    {
      name: "Aman Kumar",
      role: "Student Coordinator",
      dept: "Software Coordinator",
      phone: "+91 8271989003",
      photo: "./images/AmanMEM.jpeg",
    },
    {
      name: "Aryan Raj",
      role: "Student Coordinator",
      dept: "Hardware Coordinator",
      phone: "+91 8271989003",
      photo: "./images/AryanMEM.webp",
    },
    {
      name: "Akash Mishra",
      role: "Student Coordinator",
      dept: "Research & Development Coordinator",
      phone: "+91 7857845665",
      photo: "./images/AkashMEM.webp",
    },

    {
      name: "Vivek Kumar",
      role: "Student Coordinator",
      dept: "Coordinator",
      phone: "+91 8434671276",
      photo: "./images/VivekMEM.jpeg",
    },
    {
      name: "Awneet Anmol",
      role: "Student Coordinator",
      dept: "Coordinator",
      phone: "+91 7544077538",
      photo: "./images/AvneetMEM.jpeg",
    },
  ];

  // Helper function to get poster URL
  // PURANE WALE KO ISSE REPLACE KAR DEIN
const getPosterUrl = (event) => {
  // Priority 1: Frontend ke posterMap se check karein
  if (event && event._id && posterMap[event._id]) {
    return posterMap[event._id];
  }
  
  // Priority 2: Backend se aaye hue path ko check karein (purana fallback)
  const posterPath = event?.poster;
  if (posterPath && !posterPath.includes('placeholder')) {
    if (posterPath.startsWith("http://") || posterPath.startsWith("https://")) return posterPath;
    if (posterPath.startsWith("/")) return `${BACKEND_URL}${posterPath}`;
    return `${BACKEND_URL}/${posterPath}`;
  }
  
  // Priority 3: Default poster
  return defaultEventPoster;
};

  const isValidDate = (dateString) => {
    if (!dateString) return false;
    const d = new Date(dateString);
    return !isNaN(d.getTime());
  };
  const formatDate = (dateString) => {
    if (!dateString) return "Date not set";
    const d = new Date(dateString);
    return isNaN(d.getTime()) ? "Invalid Date" : d.toLocaleDateString();
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(
          buildApiUrl("/api/events/upcoming/limit/12")
        );
        const data = await response.json();
        if (data.success) setEvents(data.data);
      } catch (e) {
        console.error("Error fetching events:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Generic scroll functions for sliders
  const scrollByAmount = (ref, amount) => {
    if (ref.current) {
      console.log("Scrolling by:", amount, "ref:", ref.current);
      ref.current.scrollBy({ left: amount, behavior: "smooth" });
    } else {
      console.log("Ref not found:", ref);
    }
  };

  return (
    <>
      <Helmet>
        <title>Vision'25 | GEC Vaishali's Annual Tech Fest</title>
        <meta
          name="description"
          content="Join Vision'25, the premier annual technical festival of GEC Vaishali. Explore exciting events like robotics, coding, web development, and more. Register now!"
        />
        <link rel="canonical" href="https://visiongecv.in/" />{" "}
        {/* Aapka main domain */}
        <meta
          property="og:title"
          content="Vision'25 | GEC Vaishali's Annual Tech Fest"
        />
        <meta
          property="og:description"
          content="Experience innovation, competition, and learning at Vision'25, the annual tech fest of GEC Vaishali."
        />
        <meta
          property="og:image"
          content="https://visiongecv.in/path/to/your/og-image.jpg"
        />{" "}
        {/* Ek accha sa image URL daalein */}
        <meta property="og:url" content="https://visiongecv.in/" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <div className="overflow-hidden">
        <SocialBar />

        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center ">
          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-[12vw] md:text-[8vw] leading-none font-extrabold mb-2">
                <span className="text-white">VI</span>
                <span className="tech-outline">SION</span>
                <span className="text-white">'25</span>
              </h1>
              <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto content-font">
                Vaishali's Insight into Science, Innovation and Novelty
              </p>
              <p className="mt-3 text-white/60 text-lg content-font">
                Join us for the most exciting technical fest of 2025!
              </p>
              <p className="mt-1 text-cyan-300 t text-base tracking-widest">
                <b>13 – 14 Sep 2025</b>
              </p>

              {/* Techie Down Arrow */}
              <div className="mt-25  flex justify-center">
                <button
                  onClick={() =>
                    document
                      .getElementById("about-section")
                      .scrollIntoView({ behavior: "smooth" })
                  }
                  className="group relative cursor-pointer p- rounded-full hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-blue-500/20 transition-all duration-500 hover:scale-110"
                >
                  {/* Outer ring with animation */}
                  <div className="absolute inset-0 rounded-full border-2 border-cyan-400/50 animate-ping"></div>
                  <div className="absolute inset-0 rounded-full border-2 border-blue-400/30 animate-pulse"></div>

                  {/* Main arrow container */}
                  <div className="relative bg-gradient-to-br from-cyan-500 to-cyan rounded-full p-3 shadow-lg hover:shadow-cyan-500/25 transition-all duration-300">
                    <svg
                      className="w-8 h-8 text-white group-hover:animate-bounce"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                      />
                    </svg>
                  </div>

                  {/* Glowing effect */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400/20 to-blue-500/20 blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about-section" className="relative py-16">
          <div className="max-w-6xl mx-auto px-4 mt-20">
            <div className="glass-card glass-accent rounded-2xl p-10">
              <h2 className="text-5xl font-extrabold tracking-wider mb-4">
                <span className="text-white">AB</span>
                <span className="tech-outline">OUT</span>
              </h2>
              <div className="space-y-4 content-font text-white/85">
                <p>
                  Vision Fest '25 is GEC Vaishali's flagship technical festival
                  — a convergence of ingenuity, experimentation, and
                  collaboration. Across five days, we host interdisciplinary
                  challenges including robotics races, autonomous navigation,
                  embedded systems, AI sprint builds, web and app hackathons,
                  CAD and structural design challenges, hardware prototyping,
                  and a 2‑hour coding contest.
                </p>
                <p>
                  Our mission is to cultivate a culture of hands‑on engineering
                  and innovation. Participants compete in curated tracks, attend
                  expert talks, and collaborate with creative minds from
                  multiple domains — all within an atmosphere designed with
                  immersive, future‑tech aesthetics.
                </p>
                <p>
                  With cash prizes, recognition, mentorship, and networking
                  opportunities, Vision Fest '25 is the ideal platform to
                  showcase your skills and build something remarkable.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Principal & Faculty Section - Side by side on PC, stacked on mobile */}
        <section className="relative py-16 mt-[100px]">
          <div className="max-w-7xl mx-auto px-4">
            {/* PC Layout - Side by side */}
            <div className="hidden md:grid md:grid-cols-2 gap-8">
              {/* Principal */}
              <div className="glass-card rounded-2xl p-8 flex items-start gap-5">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <img
                    src="./images/DrAnant.jpg"
                    alt="Dr Anant Kumar"
                    className=" rounded-full border-2 border-cyan-400"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-3xl font-bold text-white mb-1">
                    Dr. Anant Kumar
                  </h3>
                  <div className="text-slate-300 mb-3 text-lg">
                    Principal, GEC Vaishali
                  </div>
                  <p className="text-white/80 content-font text-lg leading-relaxed">
                    "Vision Fest embodies the spirit of engineering excellence
                    and curiosity. We welcome everyone to innovate, participate,
                    and inspire."
                  </p>
                </div>
              </div>

              {/* Faculty Slider - PC */}
              <div className="relative">
                <div className="text-center mb-6">
                  <h3 className="text-3xl font-bold text-white">
                    Faculty Incharge
                  </h3>
                  <p className="text-slate-300 mt-2">
                    Meet our dedicated faculty members
                  </p>
                </div>

                <div className="flex items-center justify-center gap-5 ">
                  {/* Bigger Professional Left Arrow - PC */}
                  <button
                    onClick={() => scrollByAmount(facultyRef, -360)}
                    className="w-10 h-15 rounded-full bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 text-white text-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    ←
                  </button>

                  {/* Faculty Cards Container - PC - Show exactly 2 cards */}
                  <div className="w-[450px]  overflow-hidden">
                    <div
                      ref={facultyRef}
                      className="flex gap-4  overflow-x-auto no-scrollbar"
                      style={{ scrollBehavior: "smooth" }}
                    >
                      {faculty.map((f, idx) => (
                        <div
                          key={idx}
                          className="shrink-0 w-[190px] glass-card rounded-xl p-4 text-center hover:transform hover:scale-105 transition-all duration-300 border border-slate-600/30"
                        >
                          <div className="w-14 h-14 rounded-full overflow-hidden bg-gradient-to-br from-slate-600 to-slate-700 mx-auto mb-3 flex items-center justify-center shadow-lg border-2  border-cyan-400">
                            {f.photo ? (
                              <img
                                src={f.photo}
                                alt={f.name}
                                className="w-full h-full object-cover "
                                onError={(e) =>
                                  (e.currentTarget.style.display = "none")
                                }
                              />
                            ) : (
                              <div className="text-white font-bold text-lg">
                                {f.name.charAt(0)}
                              </div>
                            )}
                          </div>

                          <div className="text-white font-semibold text-sm mb-2">
                            {f.name}
                          </div>
                          <div className="text-slate-300 text-xs font-medium mb-1">
                            {f.role}
                          </div>
                          <div className="text-cyan-400 text-xs">
                            <b>{f.dept}</b>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bigger Professional Right Arrow - PC */}
                  <button
                    onClick={() => scrollByAmount(facultyRef, 360)}
                    className="w-10 h-15 rounded-full bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 text-white text-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    →
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Layout - Stacked */}
            <div className="md:hidden space-y-8">
              {/* Principal - Centered on mobile */}
              <div className="glass-card rounded-2xl p-6 flex flex-col items-center text-center gap-4">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center flex-shrink-0 shadow-lg">
                  <img
                    src="./images/DrAnant.jpg"
                    alt="Dr Anant Kumar"
                    className=" rounded-full border-2 border-cyan-400"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Dr. Anant Kumar
                  </h3>
                  <div className="text-slate-300 mb-3 text-lg">
                    Principal, GEC Vaishali
                  </div>
                  <p className="text-white/80 content-font text-base leading-relaxed">
                    "Vision Fest embodies the spirit of engineering excellence
                    and curiosity. We welcome everyone to innovate, participate,
                    and inspire."
                  </p>
                </div>
              </div>

              {/* Faculty Section - Mobile */}
              <div className="text-center mb-6 mt-20">
                <h3 className="text-2xl font-bold text-white">
                  Faculty Incharge
                </h3>
                <p className="text-slate-300 mt-2">
                  Meet our dedicated faculty members
                </p>
              </div>

              <div className="flex items-center gap-2 justify-between">
                {/* Bigger Professional Left Arrow - Mobile */}
                <button
                  onClick={() => scrollByAmount(facultyRefMobile, -280)}
                  className="w-10 h-15 rounded-full bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 text-white text-3xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  ←
                </button>

                {/* Faculty Cards Container - Mobile - Show exactly 1 card */}
                <div className="w-[280px]  overflow-hidden">
                  <div
                    ref={facultyRefMobile}
                    className="flex gap-5 overflow-x-auto no-scrollbar"
                    style={{ scrollBehavior: "smooth" }}
                  >
                    {faculty.map((f, idx) => (
                      <div
                        key={idx}
                        className="shrink-0 w-[240px] glass-card rounded-xl p-5 text-center hover:transform hover:scale-105 transition-all duration-300 border border-slate-600/30"
                      >
                        <div className="w-14 h-14 rounded-full overflow-hidden bg-gradient-to-br from-slate-600 to-slate-700 mx-auto mb-3 flex items-center justify-center shadow-lg border-2  border-cyan-400">
                          {f.photo ? (
                            <img
                              src={f.photo}
                              alt={f.name}
                              className="w-full h-full object-cover "
                              onError={(e) =>
                                (e.currentTarget.style.display = "none")
                              }
                            />
                          ) : (
                            <div className="text-white font-bold text-lg">
                              {f.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="text-white font-semibold text-lg mb-2">
                          {f.name}
                        </div>
                        <div className="text-slate-300 text-base font-medium mb-2">
                          {f.role}
                        </div>
                        <div className="text-cyan-400 text-sm">
                          <b>{f.dept}</b>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bigger Professional Right Arrow - Mobile */}
                <button
                  onClick={() => scrollByAmount(facultyRefMobile, 280)}
                  className="w-10 h-15 rounded-full bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 text-white text-3xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  →
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Events Slider - 3 cards per view with tilt effect */}
        <section className="relative py-16 h-[100vh]">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-26">
              <h2 className="text-4xl font-extrabold">
                <span className="text-white">Feat</span>
                <span className="tech-outline">ured Eve</span>
                <span className="text-white">nts</span>
              </h2>
            </div>

            {loading ? (
              <div className="text-center flex items-center justify-center flex-col h-50">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-400 mx-auto"></div>
                <p className="text-cyan-400 text-lg mt-4">
                  <b>Loading Events...</b>
                </p>
              </div>
            ) : (
              <div className="flex items-center justify-between lg:gap-10 gap-3">
                {/* Professional Left Arrow */}
                <button
                  onClick={() => scrollByAmount(eventsRef, -600)}
                  className="w-16 h-16 rounded-full bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 text-white text-3xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  ←
                </button>

                <div
                  ref={eventsRef}
                  className="flex gap-9 overflow-x-auto snap-x snap-mandatory no-scrollbar px-4"
                  style={{ scrollBehavior: "smooth" }}
                >
                  {events.slice(0, 13).map((event, i) => (
                    <div
                      key={event._id}
                      className=" snap-start shrink-0 lg:w-85 w-60 "
                    >
                      <div
                        className={`glass-card rounded-xl overflow-hidden transition-transform duration-300 `}
                      >
                        {/* Portrait layout: 60% poster (top), 40% info (bottom) */}
                        <div className="h-[23rem] lg:h-[28rem] flex flex-col">
                          <div className="h-[40%] lg:h-[50%] bg-black/40">
                            {event.poster ? (
                              // Pehle aisa tha: src={getPosterUrl(event.poster)}
// Ab aisa hoga:
<img
  src={getPosterUrl(event)} // Pass the whole event object
  alt={`${event.title} Poster`}
  className="w-full h-full object-cover" // object-cover add kar dein agar nahi hai
  onError={(e) => { e.currentTarget.src = defaultEventPoster; }} // Error ke liye fallback
/>
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-white/50">
                                Poster Uploading Soon
                              </div>
                            )}
                          </div>
                          <div className="h-[60%] lg:h-[50%] p-4 flex flex-col">
                            <h3 className="text-white font-bold text-base line-clamp-2 mb-2">
                              {event.title}
                            </h3>
                            <p className="text-white/80 text-sm">
                              {event.description}
                            </p>
                            <div className="mt-2 lg:mt-5 flex justify-between text-xs text-gray-400 ">
                              <span className="text-cyan-400">
                                Team Spots Filled
                              </span>
                              <span className="text-cyan-400">
                                {event.currentTeams} / {event.maxTeams}
                              </span>
                            </div>

                            <div className="mt-auto">
                              <Link
                                to={`/events/${event._id}`}
                                className="block text-center border border-white/70 text-white px-4 py-1.5 rounded-md text-sm hover:bg-white hover:text-[#0a0f1a] transition"
                              >
                                Participate
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Professional Right Arrow */}
                <button
                  onClick={() => scrollByAmount(eventsRef, 600)}
                  className="w-16 h-16 rounded-full bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 text-white text-3xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  →
                </button>
              </div>
            )}

            {/* View All Link - Below Events */}
            <div className="text-center mt-14">
              <Link
                to="/events"
                className="text-white/80 hover:text-white text-lg font-medium underline underline-offset-9"
              >
                View all events →
              </Link>
            </div>
          </div>
        </section>

        {/* Team Section - 4 cards center */}
        <section className="py-26">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-6">
              <h2 className="text-4xl font-extrabold">
                <span className="text-white">Our </span>
                <span className="tech-outline">Team</span>
              </h2>
            </div>

            <div className="flex items-center lg:gap-10 gap-3 justify-between">
              {/* Professional Left Arrow */}
              <button
                onClick={() => scrollByAmount(teamRef, -320)}
                className="w-16 h-16 rounded-full bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 text-white text-3xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                ←
              </button>

              <div
                ref={teamRef}
                className="flex gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar px-4"
                style={{ scrollBehavior: "smooth" }}
              >
                {teamMembers.map((m, idx) => (
                  <div
                    key={idx}
                    className="snap-start shrink-0 lg:w-64 w-61  glass-card rounded-xl p-5 text-center hover:transform hover:scale-105 transition-all duration-300 border border-slate-600/30"
                  >
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-cyan-400 bg-gradient-to-br from-slate-600 to-slate-700 mx-auto mb-3 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {m.photo ? (
                              <img
                                src={m.photo}
                                alt={m.name}
                                className="w-full h-full object-cover "
                                onError={(e) =>
                                  (e.currentTarget.style.display = "none")
                                }
                              />
                            ) : (
                              <div className="text-white font-bold text-lg">
                                {m.name.charAt(0)}
                              </div>
                            )}
                    </div>
                    <div className="text-white font-semibold">{m.name}</div>
                    <div className="text-slate-300 text-sm">{m.role}</div>
                    <div className="text-cyan-400 text-sm pt-1">
                      <b>{m.dept}</b>
                    </div>
                  </div>
                ))}
              </div>

              {/* Professional Right Arrow */}
              <button
                onClick={() => scrollByAmount(teamRef, 320)}
                className="w-16 h-16 rounded-full bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 text-white text-3xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                →
              </button>
            </div>
            {/* View All Link - Below Events */}
            <div className="text-center mt-14">
              <Link
                to="/team"
                className="text-white/80 hover:text-white text-lg font-medium underline underline-offset-9"
              >
                View all members →
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
