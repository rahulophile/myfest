import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { buildApiUrl, BACKEND_URL } from '../config/config';


const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const getPosterUrl = (posterPath) => {
    if (!posterPath || posterPath.includes('placeholder')) return null;
    if (posterPath.startsWith('http')) return posterPath;
    if (posterPath.startsWith('/')) return `${BACKEND_URL}${posterPath}`;
    return `${BACKEND_URL}/${posterPath}`;
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(buildApiUrl('/api/events'));
        const data = await response.json();
        if (data.success) {
          setEvents(data.data);
        }
      } catch (error) {
        console.error('❌ Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'TBD';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-400 mx-auto"></div>
          <p className="text-cyan-400 text-lg mt-4">Loading Events...</p>
        </div>
      </div>
    );
  }

  return (
    
      <div className="relative z-10">
        <div className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-white">Our </span>
              <span className="tech-outline">Events</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Explore a universe of challenges and workshops. Find your next project, compete with the best, and innovate.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {events.length === 0 ? (
            <div className="text-center pb-30 lg:pb-70">
              <p className="text-xl text-gray-400">No events available at the moment. Please check back later!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-15">
              {events.map((event) => (
                <div key={event._id} className="glass-card m-2 rounded-2xl overflow-hidden flex flex-col border border-cyan-400/20 hover:border-cyan-400/50 hover:-translate-y-2 transition-transform duration-300">
                  {/* Poster Area */}
                  <div className="aspect-video bg-gray-800 relative">
                    {getPosterUrl(event.poster) ? (
                      <img src={getPosterUrl(event.poster)} alt={`${event.title} Poster`} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                        <span className="text-white/50 text-xl font-bold text-center px-4">{event.title}</span>
                      </div>
                    )}
                    <div className="absolute top-3 right-3 px-2 py-1 bg-cyan-900/70 text-cyan-300 text-xs rounded font-medium">
                      {event.category}
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-white font-bold text-xl mb-2 line-clamp-2">{event.title}</h3>
                    <p className="text-white/80 text-sm line-clamp-3 mb-4 flex-grow">{event.description}</p>
                    
                    {/* Info Icons */}
                    <div className="flex items-center space-x-4 text-sm text-gray-300 mb-4">
                      <div className="flex items-center gap-2"><IconCalendar /> <span>{formatDate(event.date)}</span></div>
                      <div className="flex items-center gap-2"><IconLocation /> <span>{event.venue}</span></div>
                      <div className="flex items-center gap-2"><IconUsers /> <span>{event.teamSize.min}-{event.teamSize.max}</span></div>
                    </div>

                    {/* Team Spots Progress */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>Team Spots Filled</span>
                        <span>{event.currentTeams} / {event.maxTeams}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-cyan-500 h-2 rounded-full" style={{ width: `${(event.currentTeams / event.maxTeams) * 100}%` }}></div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-auto">
                      <Link to={`/events/${event._id}`} className="block text-center bg-cyan-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-cyan-700 transition">
                        View & Participate
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
   
  );
};

// Helper Icon Components
const IconCalendar = () => <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const IconLocation = () => <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const IconUsers = () => <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-5-4M9 20H4v-2a4 4 0 015-4m0 0a4 4 0 100-8 4 4 0 000 8z" /></svg>;

export default Events;