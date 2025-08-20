import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { buildApiUrl, BACKEND_URL } from '../config/config';
import TechBackground from '../components/TechBackground';
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
    { name: 'Dr. Ravi Ranjan', dept: 'ECE', role: 'Asst. Prof./HOD ECE' },
    { name: 'Mr. Vivek Raj', dept: 'CSE', role: 'Asst. Prof. CSE' },
    { name: 'Mr. Kumar Abhinav', dept: 'EE', role: 'Asst. Prof. EE' },
    { name: 'Mr. Suyash Vikram', dept: 'ME', role: 'Asst. Prof. ME' },
    { name: 'Mr. Narayan Kumar', dept: 'ME', role: 'Asst. Prof. ME' },
    { name: 'Mr. Kumar Vimal', dept: 'ECE', role: 'Asst. Prof. ECE' },
    { name: 'Mrs. Nivedita Singh', dept: 'ECE', role: 'Asst. Prof. ECE' },
    { name: 'Mrs. Supriya', dept: 'EE', role: 'Asst. Prof. EE' },
    { name: 'Miss Priya Kumari', dept: 'EE', role: 'Asst. Prof./HOD EE' },
    { name: 'Mr. Manoj Kumar Sah', dept: 'CSE', role: 'Asst. Prof. CSE' },
    { name: 'Dr. Ganesh Kr. Thakur', dept: 'Humanities', role: 'Asst. Prof. Humanities' },
    { name: 'Dr. Shivangi Saxena', dept: 'CE', role: 'Asst. Prof. CE' }
  ];

  const teamMembers = [
    { name: 'Aryan Raj', role: 'Student Coordinator', dept: 'Line Follower', phone: '+91 9122487490' },
    { name: 'Prabal Kumar', role: 'Student Coordinator', dept: 'Line Follower', phone: '+91 8797312767' },
    { name: 'Masum Patel', role: 'Student Coordinator', dept: 'Line Follower', phone: '+91 9931928181' },
    { name: 'Vivek Kumar', role: 'Student Coordinator', dept: 'Maze Solver', phone: '+91 9905662436' },
    { name: 'Shivam Kr. Singh', role: 'Student Coordinator', dept: 'Maze Solver', phone: '+91 9508702491' },
    { name: 'Ashutosh Kant', role: 'Student Coordinator', dept: 'Robo Rush', phone: '+91 9525825072' },
    { name: 'Awneet Anmol', role: 'Student Coordinator', dept: 'Robo Rush', phone: '+91 6206334022' },
  ];

  const getPosterUrl = (posterPath) => {
    if (!posterPath || posterPath.includes('placeholder')) return null;
    if (posterPath.startsWith('http')) return posterPath;
    if (posterPath.startsWith('/')) return `${BACKEND_URL}${posterPath}`;
    return `${BACKEND_URL}/${posterPath}`;
  };

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
  
  const getInitial = (name) => {
    if (!name) return '?';
    const titles = ['Dr.', 'Mr.', 'Mrs.', 'Miss'];
    const words = name.split(' ');
    if (titles.includes(words[0]) && words.length > 1) {
      return words[1].charAt(0).toUpperCase();
    }
    return words[0].charAt(0).toUpperCase();
  };

  const renderPlaceholder = (name, sizeClasses, textClasses) => (
    <div className={`${sizeClasses} rounded-full bg-gradient-to-br from-cyan-900 via-gray-800 to-gray-900 flex items-center justify-center border-2 border-cyan-400/50 shadow-lg shadow-cyan-500/10`}>
      <span className={`text-white font-bold ${textClasses} code-font`} style={{ textShadow: '0 0 10px rgba(10, 236, 234, 0.7)' }}>
        {getInitial(name)}
      </span>
    </div>
  );

  const scrollByAmount = (ref, amount) => {
    if (ref.current) {
      ref.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative">
      <TechBackground />
      <SocialBar />

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center">
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-[12vw] md:text-[8vw] leading-none font-extrabold mb-2">
            <span className="text-white">VI</span><span className="tech-outline">SION</span><span className="text-white">'25</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto content-font">Vaishali's Insight into Science, Innovation, and Novelty</p>
          <p className="mt-3 text-white/60 text-lg content-font">Join us for the most exciting technical fest of 2025!</p>
          <p className="mt-1 text-white/70 text-base tracking-widest">20 – 24 Sep 2025</p>
          <div className="mt-12 flex justify-center">
            <button onClick={() => document.getElementById('about-section').scrollIntoView({ behavior: 'smooth' })} className="group relative cursor-pointer p-4 rounded-full hover:scale-110 transition-transform duration-300">
              <div className="absolute inset-0 rounded-full border-2 border-cyan-400/50 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full p-3 shadow-lg group-hover:shadow-cyan-500/25 transition-shadow">
                <svg className="w-8 h-8 text-white group-hover:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about-section" className="relative py-16">
        <div className="max-w-6xl mx-auto px-4 mt-20">
          <div className="glass-card glass-accent rounded-2xl p-10">
            <h2 className="text-5xl font-extrabold tracking-wider mb-4"><span className="text-white">AB</span><span className="tech-outline">OUT</span></h2>
            <div className="space-y-4 content-font text-white/85">
              <p>Vision Fest '25 is GEC Vaishali's flagship technical festival — a convergence of ingenuity, experimentation, and collaboration. Across five days, we host challenges in robotics, AI, web development, CAD, and more.</p>
              <p>Our mission is to cultivate a culture of hands‑on engineering and innovation. Compete, attend expert talks, and collaborate with creative minds in an immersive, future‑tech atmosphere.</p>
              <p>With cash prizes, mentorship, and networking, Vision Fest '25 is the ideal platform to showcase your skills and build something remarkable.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Principal & Faculty Section */}
      <section className="relative py-16 mt-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass-card rounded-2xl p-6 flex flex-col md:flex-row items-center text-center md:text-left gap-6">
              {renderPlaceholder("Dr. Anant Kumar", "w-24 h-24 flex-shrink-0", "text-4xl")}
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">Dr. Anant Kumar</h3>
                <div className="text-cyan-300 mb-3">Principal, GEC Vaishali</div>
                <p className="text-white/80 content-font text-base leading-relaxed">"Vision Fest embodies engineering excellence. We welcome everyone to innovate, participate, and inspire."</p>
              </div>
            </div>
            <div className="glass-card rounded-2xl p-6">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white">Faculty Incharge</h3>
                <p className="text-slate-300 mt-1 text-sm">Our dedicated faculty mentors</p>
              </div>
              <div className="flex items-center justify-center gap-4">
                <SliderButton onClick={() => scrollByAmount(facultyRef, -222)} direction="left" />
                <div ref={facultyRef} className="flex-1 w-full overflow-hidden">
                  <div className="flex gap-4 overflow-x-auto no-scrollbar" style={{ scrollBehavior: 'smooth' }}>
                    {faculty.map((f, idx) => (
                      <div key={idx} className="shrink-0 w-[200px] bg-gray-800/50 rounded-xl p-4 text-center border border-gray-700">
                        <div className="mx-auto mb-3">{renderPlaceholder(f.name, "w-16 h-16", "text-2xl")}</div>
                        <div className="text-white font-semibold text-sm mb-1">{f.name}</div>
                        <div className="text-slate-300 text-xs">{f.role}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <SliderButton onClick={() => scrollByAmount(facultyRef, 222)} direction="right" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Events Slider */}
      <section className="relative py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold"><span className="text-white">Feat</span><span className="tech-outline">ured Eve</span><span className="text-white">nts</span></h2>
          </div>
          <div className="flex items-center justify-center gap-4">
            <SliderButton onClick={() => scrollByAmount(eventsRef, -360)} direction="left" />
            <div ref={eventsRef} className="flex-1 w-full overflow-hidden">
              <div className="flex gap-8 overflow-x-auto snap-x snap-mandatory no-scrollbar" style={{ scrollBehavior: 'smooth' }}>
                {(events.length > 0 ? events : Array(6).fill({})).slice(0, 10).map((event, i) => (
                  <div key={event._id || i} className="snap-center shrink-0 w-[320px]">
                    <div className="glass-card rounded-xl overflow-hidden h-[480px] flex flex-col border border-cyan-400/20 hover:border-cyan-400/50 transition-colors">
                      <div className="h-[55%] bg-gray-800">
                        {getPosterUrl(event.poster) ? (
                          <img src={getPosterUrl(event.poster)} alt={event.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900"><span className="text-white/50 text-xl font-bold text-center px-4">{event.title || 'Event'}</span></div>
                        )}
                      </div>
                      <div className="h-[45%] p-4 flex flex-col">
                        <h3 className="text-white font-bold text-lg line-clamp-1">{event.title || 'Coming Soon'}</h3>
                        <p className="text-white/70 text-sm line-clamp-3 flex-grow my-2">{event.description || 'Details will be updated shortly. Stay tuned for an exciting challenge!'}</p>
                        <Link to={event._id ? `/events/${event._id}` : '/events'} className="mt-auto block text-center bg-cyan-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-cyan-700 transition">View Details</Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <SliderButton onClick={() => scrollByAmount(eventsRef, 360)} direction="right" />
          </div>
          <div className="text-center mt-12"><Link to="/events" className="text-white/80 hover:text-white text-lg font-medium">View All Events →</Link></div>
        </div>
      </section>

      {/* Team Slider */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold"><span className="text-white">Our </span><span className="tech-outline">Team</span></h2>
          </div>
          <div className="flex items-center justify-center gap-4">
            <SliderButton onClick={() => scrollByAmount(teamRef, -280)} direction="left" />
            <div ref={teamRef} className="flex-1 w-full overflow-hidden">
              <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar" style={{ scrollBehavior: 'smooth' }}>
                {teamMembers.map((m, idx) => (
                  <div key={idx} className="snap-center shrink-0 w-64 glass-card rounded-xl p-5 text-center border border-cyan-400/20">
                    <div className="mx-auto mb-3">{renderPlaceholder(m.name, "w-20 h-20", "text-3xl")}</div>
                    <div className="text-white font-semibold">{m.name}</div>
                    <div className="text-cyan-400 text-sm">{m.dept}</div>
                    <div className="text-white/60 text-xs mt-2">{m.phone}</div>
                  </div>
                ))}
              </div>
            </div>
            <SliderButton onClick={() => scrollByAmount(teamRef, 280)} direction="right" />
          </div>
          <div className="text-center mt-12"><Link to="/team" className="text-white/80 hover:text-white text-lg font-medium">Meet All Members →</Link></div>
        </div>
      </section>
    </div>
  );
};

const SliderButton = ({ onClick, direction }) => (
  <button onClick={onClick} className="hidden md:flex w-14 h-14 rounded-full bg-white/5 hover:bg-white/10 text-white items-center justify-center shadow-lg transition-colors flex-shrink-0">
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      {direction === 'left' ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />}
    </svg>
  </button>
);

export default Home;