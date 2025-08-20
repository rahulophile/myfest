import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import EventTeamsView from '../components/EventTeamsView';
import EventManagement from '../components/EventManagement';
import { buildApiUrl } from '../config/config';

const AdminDashboard = () => {
  const [registrations, setRegistrations] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showTeamsView, setShowTeamsView] = useState(false);
  const [selectedEventForTeams, setSelectedEventForTeams] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'events', 'teams'
  const { admin, logoutAdmin, getAdminToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!admin) {
      navigate('/admin/login');
      return;
    }
    fetchData();
  }, [admin, navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch events
      console.log('Fetching events...');
      const eventsResponse = await fetch(buildApiUrl('/api/events'));
      const eventsData = await eventsResponse.json();
      
      if (eventsData.success) {
        console.log('Events fetched:', eventsData.data.length);
        setEvents(eventsData.data);
      } else {
        console.error('Failed to fetch events:', eventsData);
      }

      // Fetch all registrations
      console.log('Fetching registrations...');
      const token = getAdminToken();
      console.log('Admin token present:', !!token);
      
      const registrationsResponse = await fetch(buildApiUrl('/api/admin/registrations'), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Registrations response status:', registrationsResponse.status);
      
      if (registrationsResponse.ok) {
        const registrationsData = await registrationsResponse.json();
        if (registrationsData.success) {
          console.log('Registrations fetched:', registrationsData.data.length);
          setRegistrations(registrationsData.data);
        } else {
          console.error('Failed to fetch registrations:', registrationsData);
        }
      } else {
        console.error('Registrations response not ok:', registrationsResponse.status);
        const errorText = await registrationsResponse.text();
        console.error('Error response:', errorText);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin/login');
  };

  const handleViewTeams = () => {
    if (selectedEvent === 'all') {
      alert('Please select a specific event to view teams');
      return;
    }
    
    const event = events.find(e => e.title === selectedEvent);
    if (event) {
      console.log('Selected event for teams:', event);
      setSelectedEventForTeams(event._id);
      setShowTeamsView(true);
    } else {
      console.error('Event not found for title:', selectedEvent);
      alert('Event not found. Please try refreshing the page.');
    }
  };

  const closeTeamsView = () => {
    setShowTeamsView(false);
    setSelectedEventForTeams(null);
  };

  const checkDatabaseState = async () => {
    try {
      const token = getAdminToken();
      const response = await fetch(buildApiUrl('/api/admin/debug/database-state'), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Database state:', data.data);
        alert(`Database State:\nEvents: ${data.data.events.total} (${data.data.events.withParticipants} with participants)\nUsers: ${data.data.users.total} (${data.data.users.withEvents} with events)`);
      } else {
        alert('Failed to check database state');
      }
    } catch (error) {
      console.error('Error checking database state:', error);
      alert('Error checking database state');
    }
  };

  const filteredRegistrations = registrations.filter(reg => {
    const matchesEvent = selectedEvent === 'all' || reg.eventId?.title === selectedEvent;
    const matchesSearch = searchQuery === '' || 
      reg.userId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.teamName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.userId?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesEvent && matchesSearch;
  });



  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-400 mx-auto"></div>
          <p className="text-cyan-400 text-lg mt-4">Loading admin data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Admin Header - No Navigation */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 py-6 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
              <p className="text-gray-300 text-sm">Vision Fest 25 - Event Management</p>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-cyan-400 text-sm">Admin: {admin?.username}</span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-gray-700">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'dashboard'
                  ? 'border-cyan-500 text-cyan-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'events'
                  ? 'border-cyan-500 text-cyan-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
              }`}
            >
              Event Management
            </button>
            <button
              onClick={() => setActiveTab('teams')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'teams'
                  ? 'border-cyan-500 text-cyan-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
              }`}
            >
              Team Management
            </button>
          </nav>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-400">Total Registrations</p>
                    <p className="text-2xl font-semibold text-white">{registrations.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-500 rounded-lg">
                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-400">Active Events</p>
                    <p className="text-2xl font-semibold text-white">{events.filter(e => e.isActive).length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-500 rounded-lg">
                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-400">Unique Users</p>
                    <p className="text-2xl font-semibold text-white">
                      {new Set(registrations.map(r => r.userId)).size}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-500 rounded-lg">
                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-400">Teams</p>
                    <p className="text-2xl font-semibold text-white">
                      {new Set(registrations.map(r => r.teamName)).size}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters and Controls */}
            <div className="bg-gray-800 rounded-lg p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Filter by Event</label>
                  <select
                    value={selectedEvent}
                    onChange={(e) => setSelectedEvent(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                  >
                    <option value="all">All Events</option>
                    {events.map((event) => (
                      <option key={event._id} value={event.title}>
                        {event.title}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Search</label>
                  <input
                    type="text"
                    placeholder="Search by User ID, Team Name, or User Name"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div className="flex items-end space-x-3">
                <button
                  onClick={handleViewTeams}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  View Teams
                </button>
                <button
                  onClick={fetchData}
                  className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Refresh Data
                </button>
                <button
                  onClick={checkDatabaseState}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Debug DB
                </button>
              </div>
            </div>

            {/* Registrations Table */}
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-700">
                <h3 className="text-lg font-medium text-white">Registration Details</h3>
                <p className="text-sm text-gray-400">Showing {filteredRegistrations.length} registrations</p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        User Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Event Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Team & College
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Registration Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Role
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {filteredRegistrations.map((registration, index) => (
                      <tr key={index} className="hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-white">
                              {registration.name || 'N/A'}
                            </div>
                            <div className="text-sm text-cyan-400 font-mono">
                              {registration.userId || 'N/A'}
                            </div>
                            <div className="text-xs text-gray-400">
                              {registration.registrationNumber || 'N/A'}
                            </div>
                            <div className="text-xs text-gray-500">
                              {registration.mobileNumber || 'N/A'}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-white">
                            {registration.eventId?.title || 'Unknown Event'}
                          </div>
                          <div className="text-xs text-gray-400">
                            {registration.eventId?.date ? formatDate(registration.eventId.date) : ''}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-white font-medium">
                            {registration.teamName || 'N/A'}
                          </div>
                          <div className="text-xs text-gray-400">
                            {registration.collegeName || 'N/A'}
                          </div>
                          <div className="text-xs text-gray-500 truncate max-w-xs">
                            {registration.emailId || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {formatDate(registration.registrationDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            registration.role === 'team_leader' 
                              ? 'bg-green-900 text-green-200' 
                              : 'bg-blue-900 text-blue-200'
                          }`}>
                            {registration.role === 'team_leader' ? 'Team Leader' : 'Member'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredRegistrations.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-lg">No registrations found</div>
                  <div className="text-gray-500 text-sm mt-2">
                    Try adjusting your filters or refresh the data
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Event Management Tab */}
        {activeTab === 'events' && (
          <EventManagement />
        )}

        {/* Team Management Tab */}
        {activeTab === 'teams' && (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-medium text-white mb-4">Team Management</h3>
              <p className="text-gray-400">Select an event to view teams and manage registrations.</p>
            </div>
            
            {/* Event Selection for Teams */}
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Select Event</label>
                  <select
                    value={selectedEvent}
                    onChange={(e) => setSelectedEvent(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                  >
                    <option value="all">All Events</option>
                    {events.map((event) => (
                      <option key={event._id} value={event.title}>
                        {event.title}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-end space-x-3">
                  <button
                    onClick={handleViewTeams}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    View Teams
                  </button>
                  <button
                    onClick={fetchData}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Refresh Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Event Teams View Modal */}
      {showTeamsView && selectedEventForTeams && (
        <EventTeamsView
          eventId={selectedEventForTeams}
          onClose={closeTeamsView}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
