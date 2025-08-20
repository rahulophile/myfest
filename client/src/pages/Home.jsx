import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { buildApiUrl, BACKEND_URL } from '../config/config';
import SocialBar from '../components/SocialBar';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const facultyRef = useRef(null);
  const facultyRefMobile = useRef(null);
  const eventsRef = useRef(null);
  const teamRef = useRef(null);


  

  const faculty = [
    { name: 'Dr. Ravi Ranjan', dept: 'ECE', photo: '', role: 'Asst. Prof./HOD ECE' },
    { name: 'Mr. Vivek Raj', dept: 'CSE', photo: '', role: 'Asst. Prof. CSE' },
    { name: 'Mr. Kumar Abhinav', dept: 'EE', photo: '', role: 'Asst. Prof. EE' },
    { name: 'Mr. Suyash Vikram', dept: 'ME', photo: '', role: 'Asst. Prof. ME' },
    { name: 'Mr. Narayan Kumar', dept: 'ME', photo: '', role: 'Asst. Prof. ME' },
    { name: 'Mr. Kumar Vimal', dept: 'ECE', photo: '', role: 'Asst. Prof. ECE' },
    { name: 'Mrs. Nivedita Singh', dept: 'ECE', photo: '', role: 'Asst. Prof. ECE' },
    { name: 'Mrs. Supriya', dept: 'EE', photo: '', role: 'Asst. Prof. EE' },
    { name: 'Miss Priya Kumari', dept: 'EE', photo: '', role: 'Asst. Prof./HOD EE' },
    { name: 'Mr. Manoj Kumar Sah', dept: 'CSE', photo: '', role: 'Asst. Prof. CSE' },
    { name: 'Dr. Ganesh Kr. Thakur', dept: 'Humanities', photo: '', role: 'Asst. Prof. Humanities' },
    { name: 'Dr. Shivangi Saxena', dept: 'CE', photo: '', role: 'Asst. Prof. CE' }
  ];

  const teamMembers = [
    { name: 'Aryan Raj', role: 'Student Coordinator', dept: 'Line Follower', phone: '+91 9122487490' },
    { name: 'Prabal Kumar', role: 'Student Coordinator', dept: 'Line Follower', phone: '+91 8797312767' },
    { name: 'Masum Patel', role: 'Student Coordinator', dept: 'Line Follower', phone: '+91 9931928181' },
    { name: 'Vivek Kumar', role: 'Student Coordinator', dept: 'Maze Solver', phone: '+91 9905662436' },
    { name: 'Shivam Kr. Singh', role: 'Student Coordinator', dept: 'Maze Solver', phone: '+91 9508702491' },
    { name: 'Ashutosh Kant', role: 'Student Coordinator', dept: 'Robo Rush', phone: '+91 9525825072' },
    { name: 'Awneet Anmol', role: 'Student Coordinator', dept: 'Robo Rush', phone: '+91 6206334022' },
    { name: 'Rohan Kumar', role: 'Student Coordinator', dept: 'Hurdle Mania', phone: '+91 9123172253' },
    { name: 'Akash Mishra', role: 'Student Coordinator', dept: 'Tricky Circuit', phone: '+91 7857845665' },
    { name: 'Harsh Kumar', role: 'Student Coordinator', dept: 'Tricky Circuit', phone: '+91 8092181545' },
    { name: 'Ishank Raj', role: 'Student Coordinator', dept: 'AutoCAD Design', phone: '+91 8434671276' },
    { name: 'Abhijeet Narayan', role: 'Student Coordinator', dept: 'AutoCAD Design', phone: '+91 7544077538' },
    { name: 'Aman Kumar', role: 'Student Coordinator', dept: 'Web Wizard', phone: '+91 8271989003' },
    { name: 'Aroh Mishra', role: 'Student Coordinator', dept: 'Web Wizard', phone: '+91 7481892191' },
    { name: 'Krishna Kumar', role: 'Student Coordinator', dept: 'Coding Contest', phone: '+91 7541989339' },
    { name: 'Harshita Kumari', role: 'Student Coordinator', dept: 'Coding Contest', phone: '+91 9508180106' },
    { name: 'Sumit Kr. Sharma', role: 'Student Coordinator', dept: 'Open Hardware', phone: '+91 9006108744' },
    { name: 'Prarthana', role: 'Student Coordinator', dept: 'Truss Bridge', phone: '+91 9117598328' },
    { name: 'Sweta Kumari', role: 'Student Coordinator', dept: 'Truss Bridge', phone: '+91 8292358431' },
    { name: 'Vijaya Sriwastav', role: 'Student Coordinator', dept: 'Robo Soccer', phone: '+91 9431008968' },
    { name: 'Bittu Kumar', role: 'Student Coordinator', dept: 'E-Sports', phone: '+91 9263070180' },
    { name: 'Santosh Paswan', role: 'Student Coordinator', dept: 'E-Sports', phone: '+91 6375565171' },
    { name: 'Hrishika Ranjan', role: 'Student Coordinator', dept: 'Tech Quiz', phone: '+91 8789171363' },
    { name: 'Nisha Kumari', role: 'Student Coordinator', dept: 'Tech Quiz', phone: '+91 6207411621' }
  ];

  // Helper function to get poster URL
  const getPosterUrl = (posterPath) => {
    if (!posterPath) return '';
    if (posterPath.startsWith('http://') || posterPath.startsWith('https://')) return posterPath;
    if (posterPath.startsWith('/')) return `${BACKEND_URL}${posterPath}`;
    return `${BACKEND_URL}/${posterPath}`;
  };

  const isValidDate = (dateString) => { if (!dateString) return false; const d = new Date(dateString); return !isNaN(d.getTime()); };
  const formatDate = (dateString) => { if (!dateString) return 'Date not set'; const d = new Date(dateString); return isNaN(d.getTime()) ? 'Invalid Date' : d.toLocaleDateString(); };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(buildApiUrl('/api/events/upcoming/limit/12'));
        const data = await response.json();
        if (data.success) setEvents(data.data);
      } catch (e) { console.error('Error fetching events:', e); }
      finally { setLoading(false); }
    };
    fetchEvents();
  }, []);

  // Generic scroll functions for sliders
  const scrollByAmount = (ref, amount) => { 
    if (ref.current) {
      console.log('Scrolling by:', amount, 'ref:', ref.current);
      ref.current.scrollBy({ left: amount, behavior: 'smooth' });
    } else {
      console.log('Ref not found:', ref);
    }
  };

  return (
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
              Vaishali's Insight into Science, Innovation, and Novelty
            </p>
            <p className="mt-3 text-white/60 text-lg content-font">Join us for the most exciting technical fest of 2025!</p>
            <p className="mt-1 text-white/70 text-base tracking-widest">13 – 14 Sep 2025</p>
            
            {/* Techie Down Arrow */}
            <div className="mt-12  flex justify-center">
              <button 
                onClick={() => document.getElementById('about-section').scrollIntoView({ behavior: 'smooth' })}
                className="group relative cursor-pointer p-4 rounded-full hover:bg-gradient-to-r hover:from-cyan-500/20 hover:to-blue-500/20 transition-all duration-500 hover:scale-110"
              >
                {/* Outer ring with animation */}
                <div className="absolute inset-0 rounded-full border-2 border-cyan-400/50 animate-ping"></div>
                <div className="absolute inset-0 rounded-full border-2 border-blue-400/30 animate-pulse"></div>
                
                {/* Main arrow container */}
                <div className="relative bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full p-3 shadow-lg hover:shadow-cyan-500/25 transition-all duration-300">
                  <svg className="w-8 h-8 text-white group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
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
          <h2 className="text-5xl font-extrabold tracking-wider mb-4"><span className="text-white">AB</span><span className="tech-outline">OUT</span></h2>
            <div className="space-y-4 content-font text-white/85">
              <p>
                Vision Fest '25 is GEC Vaishali's flagship technical festival — a convergence of ingenuity, experimentation, and collaboration.
                Across five days, we host interdisciplinary challenges including robotics races, autonomous navigation, embedded systems, AI sprint builds,
                web and app hackathons, CAD and structural design challenges, hardware prototyping, and a 24‑hour coding marathon.
              </p>
              <p>
                Our mission is to cultivate a culture of hands‑on engineering and innovation. Participants compete in curated tracks, attend expert talks,
                and collaborate with creative minds from multiple domains — all within an atmosphere designed with immersive, future‑tech aesthetics.
              </p>
              <p>
                With cash prizes, recognition, mentorship, and networking opportunities, Vision Fest '25 is the ideal platform to showcase your skills and build something remarkable.
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
                <span className="text-white text-2xl font-bold">A</span>
              </div>
              <div className="flex-1">
                <h3 className="text-3xl font-bold text-white mb-1">Dr. Anant Kumar</h3>
                <div className="text-slate-300 mb-3 text-lg">Principal, GEC Vaishali</div>
                <p className="text-white/80 content-font text-lg leading-relaxed">
                  "Vision Fest embodies the spirit of engineering excellence and curiosity. We welcome everyone to innovate, participate, and inspire."
                </p>
              </div>
            </div>

            {/* Faculty Slider - PC */}
            <div className="relative">
              <div className="text-center mb-6">
                <h3 className="text-3xl font-bold text-white">Faculty Incharge</h3>
                <p className="text-slate-300 mt-2">Meet our dedicated faculty members</p>
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
                    style={{ scrollBehavior: 'smooth' }}
                  >
                    {faculty.map((f, idx) => (
                      <div key={idx} className="shrink-0 w-[190px] glass-card rounded-xl p-4 text-center hover:transform hover:scale-105 transition-all duration-300 border border-slate-600/30">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 mx-auto mb-3 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                          {f.name.charAt(0)}
                        </div>
                        <div className="text-white font-semibold text-sm mb-2">{f.name}</div>
                        <div className="text-slate-300 text-xs font-medium mb-1">{f.role}</div>
                        <div className="text-white/70 text-xs">{f.dept}</div>
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
                <span className="text-white text-3xl font-bold">A</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Dr. Anant Kumar</h3>
                <div className="text-slate-300 mb-3 text-lg">Principal, GEC Vaishali</div>
                <p className="text-white/80 content-font text-base leading-relaxed">
                  "Vision Fest embodies the spirit of engineering excellence and curiosity. We welcome everyone to innovate, participate, and inspire."
                </p>
              </div>
            </div>

            {/* Faculty Section - Mobile */}
            <div className="text-center mb-6 mt-20">
              <h3 className="text-2xl font-bold text-white">Faculty Incharge</h3>
              <p className="text-slate-300 mt-2">Meet our dedicated faculty members</p>
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
                  style={{ scrollBehavior: 'smooth' }}
                >
                  {faculty.map((f, idx) => (
                    <div key={idx} className="shrink-0 w-[240px] glass-card rounded-xl p-5 text-center hover:transform hover:scale-105 transition-all duration-300 border border-slate-600/30">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 mx-auto mb-3 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                        {f.name.charAt(0)}
                      </div>
                      <div className="text-white font-semibold text-lg mb-2">{f.name}</div>
                      <div className="text-slate-300 text-base font-medium mb-2">{f.role}</div>
                      <div className="text-white/70 text-sm">{f.dept}</div>
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
          <h2 className="text-4xl font-extrabold"><span className="text-white">Feat</span><span className="tech-outline">ured Eve</span><span className="text-white">nts</span></h2>
          </div>

          {loading ? (
            <div className="text-center text-white/70">Loading...</div>
          ) : (
            <div className="flex items-center justify-between lg:gap-10 gap-3">
              {/* Professional Left Arrow */}
              <button 
                onClick={() => scrollByAmount(eventsRef, -600)} 
                className="w-16 h-16 rounded-full bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 text-white text-3xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                ←
              </button>
              
              <div ref={eventsRef} className="flex gap-9 overflow-x-auto snap-x snap-mandatory no-scrollbar px-4" style={{ scrollBehavior: 'smooth' }}>
                {events.slice(0, 10).map((event, i) => (
                  <div key={event._id} className=" snap-start shrink-0 lg:w-85 w-60 ">
                    <div className={`glass-card rounded-xl overflow-hidden transition-transform duration-300 `}>
                      {/* Portrait layout: 60% poster (top), 40% info (bottom) */}
                      <div className="h-[25rem] lg:h-[30rem] flex flex-col">
                        <div className="h-[50%] bg-black/40">
                          {event.poster ? (
                            <img src={getPosterUrl(event.poster)} alt={`${event.title} Poster`} className="w-full h-full " onError={(e) => (e.currentTarget.style.display='none')} />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white/50">Poster Uploading Soon</div>
                          )}
                        </div>
                        <div className="h-[50%] p-4 flex flex-col">
                          
                          <h3 className="text-white font-bold text-base line-clamp-2 mb-2">{event.title}</h3>
                          <p className='text-white/80 text-sm'>{event.description}</p>
                          
                          
                          <div className="mt-auto">
                            <Link to={`/events/${event._id}`} className="block text-center border border-white/70 text-white px-4 py-1.5 rounded-md text-sm hover:bg-white hover:text-[#0a0f1a] transition">Participate</Link>
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
            <Link to="/events" className="text-white/80 hover:text-white text-lg font-medium underline underline-offset-9">View all events →</Link>
          </div>
        </div>
      </section>

      {/* Team Section - 4 cards center */}
      <section className="py-26">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-6">
          <h2 className="text-4xl font-extrabold"><span className="text-white">Our </span><span className="tech-outline">Team</span></h2>
          </div>
          
          <div className="flex items-center lg:gap-10 gap-3 justify-between">
            {/* Professional Left Arrow */}
            <button 
              onClick={() => scrollByAmount(teamRef, -320)} 
              className="w-16 h-16 rounded-full bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-500 hover:to-slate-600 text-white text-3xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              ←
            </button>
            
            <div ref={teamRef} className="flex gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar px-4" style={{ scrollBehavior: 'smooth' }}>
              {teamMembers.map((m, idx) => (
                <div key={idx} className="snap-start shrink-0 lg:w-64 w-61  glass-card rounded-xl p-5 text-center hover:transform hover:scale-105 transition-all duration-300 border border-slate-600/30">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 mx-auto mb-3 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {m.name.charAt(0)}
                  </div>
                  <div className="text-white font-semibold">{m.name}</div>
                  <div className="text-slate-300 text-sm">{m.role}</div>
                  <div className="text-white/70 text-sm">{m.dept}</div>
                  <div className="text-white/60 text-xs mt-2">{m.phone}</div>
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
            <Link to="/team" className="text-white/80 hover:text-white text-lg font-medium underline underline-offset-9">View all members →</Link>
          </div>
        </div>
      </section>
      

    </div>
  );
};

export default Home;