import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { buildApiUrl } from '../config/config';
import DashboardBackground from '../components/DashboardBackground'; // Background component import karein

const Dashboard = () => {
  const { user, getUserToken, loading: authLoading } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (authLoading) return;
    if (user && user.participatedEvents) {
      setUserData(user);
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        const token = getUserToken();
        if (!token) {
          setError('No authentication token found. Please login again.');
          setLoading(false);
          return;
        }
        await new Promise(resolve => setTimeout(resolve, 500));
        const response = await fetch(buildApiUrl('/api/users/dashboard'), {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setUserData(data.data);
        } else if (response.status === 401) {
          setError('Authentication failed. Please login again.');
        } else if (response.status === 429) {
          setError('Too many requests. Please wait a moment and try again.');
        } else {
          setError('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Dashboard fetch error:', error);
        setError('Network error. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [getUserToken, authLoading, user]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getInitial = (name) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-400 mx-auto"></div>
          <p className="text-cyan-400 text-lg mt-4">{authLoading ? 'Authenticating...' : 'Loading Dashboard...'}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-center px-4">
        <div className="w-24 h-24 bg-red-900/50 border-2 border-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">Error Loading Dashboard</h3>
        <p className="text-gray-400 mb-4">{error}</p>
        <div className="flex justify-center space-x-2">
          <Link to="/login" className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-md">Login Again</Link>
          <button onClick={() => window.location.reload()} className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md">Try Again</button>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-gray-400">No user data available.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <DashboardBackground />
      <div className="relative z-10">
        {/* Header */}
        <div className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-gradient-to-br from-cyan-900 via-gray-800 to-gray-900 rounded-full flex items-center justify-center border-2 border-cyan-400/50 shadow-lg shadow-cyan-500/10">
                <span className="text-white font-bold text-3xl code-font" style={{ textShadow: '0 0 10px rgba(10, 236, 234, 0.7)' }}>
                  {getInitial(userData.name)}
                </span>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">Welcome, {userData.name}!</h1>
                <p className="text-xl text-gray-300">Your Vision Fest Dashboard</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div className="glass-card rounded-xl p-6 border border-cyan-400/20">
                <h2 className="text-2xl font-bold text-white mb-6">Profile Information</h2>
                <div className="space-y-4">
                  <InfoRow label="User ID" value={userData.userId} isMono onCopy={() => navigator.clipboard.writeText(userData.userId)} />
                  <InfoRow label="Name" value={userData.name} />
                  <InfoRow label="Registration No." value={userData.registrationNumber} />
                  <InfoRow label="Mobile" value={userData.mobileNumber} />
                  <InfoRow label="Email" value={userData.emailId} />
                  <InfoRow label="College" value={userData.isGECVaishaliStudent ? 'GEC Vaishali' : userData.collegeName} />
                  <InfoRow label="Member Since" value={formatDate(userData.createdAt)} />
                </div>
                <div className="mt-6 pt-6 border-t border-gray-700/50">
                  <Link to="/events" className="w-full bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2.5 rounded-md text-center block transition-colors font-semibold">
                    Explore More Events
                  </Link>
                </div>
              </div>
            </div>

            {/* Participated Events */}
            <div className="lg:col-span-2">
              <div className="glass-card rounded-xl p-6 border border-cyan-400/20">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">My Events</h2>
                  <span className="px-3 py-1 bg-cyan-900/70 text-cyan-300 text-sm rounded-full font-medium">
                    {userData.participatedEvents?.length || 0} Registered
                  </span>
                </div>
                {!userData.participatedEvents || userData.participatedEvents.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-gray-600">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" /></svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-300 mb-2">No Events Yet</h3>
                    <p className="text-gray-400 mb-4">Start your journey by participating in our exciting events!</p>
                    <Link to="/events" className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-md transition-colors">Browse Events</Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userData.participatedEvents.map((p, index) => <EventCard key={index} participation={p} currentUser={userData} />)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper component for Profile Info Rows
const InfoRow = ({ label, value, isMono, onCopy }) => (
  <div>
    <label className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
    <div className="flex items-center space-x-2">
      <p className={`text-white ${isMono ? 'font-mono' : ''}`}>{value}</p>
      {onCopy && (
        <button onClick={onCopy} className="text-gray-400 hover:text-cyan-400" title={`Copy ${label}`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
        </button>
      )}
    </div>
  </div>
);

// Helper component for Event Cards
const EventCard = ({ participation, currentUser }) => (
  <div className="bg-gray-700/50 rounded-lg p-4 border border-gray-600/50 hover:border-cyan-400/50 transition-colors">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mb-2">
          <h3 className="text-lg font-semibold text-white">{participation.eventId?.title || 'Event Title'}</h3>
          <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${participation.role === 'team_leader' ? 'bg-yellow-500/30 text-yellow-300' : 'bg-blue-500/30 text-blue-300'}`}>
            {participation.role === 'team_leader' ? 'Team Leader' : 'Member'}
          </span>
        </div>
        {participation.teamName && <p className="text-cyan-400 text-sm mb-2 font-medium">Team: {participation.teamName}</p>}
      </div>
      <Link to={`/events/${participation.eventId?._id}`} className="text-cyan-400 hover:text-cyan-300 text-sm font-medium ml-4">View Event →</Link>
    </div>
    <div className="mt-3 pt-3 border-t border-gray-600/50">
      <p className="text-gray-400 text-xs mb-2">Team Roster:</p>
      <div className="flex flex-wrap gap-2">
        {participation.role === 'team_leader' ? (
          <>
            <TeamMemberChip name={currentUser.name} userId={currentUser.userId} isLeader />
            {participation.teamMembers?.map(m => <TeamMemberChip key={m.userId} name={m.name} userId={m.userId} />)}
          </>
        ) : (
          <>
            {participation.teamLeader && <TeamMemberChip name={participation.teamLeader.name} userId={participation.teamLeader.userId} isLeader />}
            <TeamMemberChip name={currentUser.name} userId={currentUser.userId} />
            {participation.teamMembers?.map(m => <TeamMemberChip key={m.userId} name={m.name} userId={m.userId} />)}
          </>
        )}
      </div>
    </div>
  </div>
);

const TeamMemberChip = ({ name, userId, isLeader }) => (
  <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${isLeader ? 'bg-yellow-600/30 text-yellow-200' : 'bg-blue-600/30 text-blue-200'}`}>
    <span>{isLeader ? '👑' : '👤'}</span>
    <span>{name} ({userId})</span>
  </div>
);

export default Dashboard;