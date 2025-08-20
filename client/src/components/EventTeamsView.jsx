import React, { useState, useEffect } from 'react';
import { buildApiUrl } from '../config/config';
import { useAuth } from '../context/AuthContext';

const EventTeamsView = ({ eventId, onClose }) => {
  const { getAdminToken } = useAuth();
  const [teams, setTeams] = useState([]);
  const [eventTitle, setEventTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (eventId) {
      fetchTeams();
    }
  }, [eventId]);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const token = getAdminToken();
      
      console.log('Fetching teams for event ID:', eventId);
      console.log('Admin token:', token ? 'Present' : 'Missing');
      
      const response = await fetch(buildApiUrl(`/api/admin/events/${eventId}/teams`), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (response.ok) {
        const data = await response.json();
        console.log('Response data:', data);
        
        if (data.success) {
          setTeams(data.data.teams);
          setEventTitle(data.data.eventTitle);
        } else {
          setError(data.message || 'Failed to fetch teams');
        }
      } else {
        const errorText = await response.text();
        console.error('Response error text:', errorText);
        setError(`Failed to fetch teams: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error fetching teams:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const exportToCSV = () => {
    if (teams.length === 0) return;

    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Header
    csvContent += "Team Name,Leader College,Leader Name,Leader User ID,Leader Registration Number,Leader Mobile,Leader Email,Member 1 Name,Member 1 User ID,Member 1 Registration Number,Member 1 Mobile,Member 1 Email,Member 2 Name,Member 2 User ID,Member 2 Registration Number,Member 2 Mobile,Member 2 Email,Member 3 Name,Member 3 User ID,Member 3 Registration Number,Member 3 Mobile,Member 3 Email,Registration Date\n";
    
    // Data rows
    teams.forEach(team => {
      const row = [
        team.teamName,
        team.leader?.collegeName || '',
        team.leader?.name || '',
        team.leader?.userId || '',
        team.leader?.registrationNumber || '',
        team.leader?.mobileNumber || '',
        team.leader?.emailId || '',
        team.members[0]?.name || '',
        team.members[0]?.userId || '',
        team.members[0]?.registrationNumber || '',
        team.members[0]?.mobileNumber || '',
        team.members[0]?.emailId || '',
        team.members[1]?.name || '',
        team.members[1]?.userId || '',
        team.members[1]?.registrationNumber || '',
        team.members[1]?.mobileNumber || '',
        team.members[1]?.emailId || '',
        team.members[2]?.name || '',
        team.members[2]?.userId || '',
        team.members[2]?.registrationNumber || '',
        team.members[2]?.mobileNumber || '',
        team.members[2]?.emailId || '',
        formatDate(team.registrationDate)
      ];
      
      csvContent += row.map(field => `"${field}"`).join(',') + '\n';
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${eventTitle}_Teams_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-400 mx-auto"></div>
          <p className="text-cyan-400 text-lg mt-4">Loading teams...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-gray-800 rounded-lg p-8 text-center max-w-md">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Error</h3>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-700 to-gray-800 px-6 py-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Event Teams</h2>
              <p className="text-gray-300">{eventTitle}</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={exportToCSV}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Export CSV
              </button>
              <button
                onClick={onClose}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Close
              </button>
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-400">
            Total Teams: {teams.length} | Total Participants: {teams.reduce((sum, team) => sum + team.totalMembers, 0)}
          </div>
        </div>

        {/* Teams List */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-6">
          {teams.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-300 mb-2">No Teams Found</h3>
              <p className="text-gray-400">No teams have registered for this event yet.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {teams.map((team, teamIndex) => (
                <div key={teamIndex} className="bg-gray-700 rounded-lg border border-gray-600 overflow-hidden">
                  {/* Team Header */}
                  <div className="bg-gradient-to-r from-cyan-600 to-blue-600 px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-white">{team.teamName}</h3>
                        <p className="text-cyan-100 text-sm">
                          {team.totalMembers} member{team.totalMembers !== 1 ? 's' : ''} • Registered on {formatDate(team.registrationDate)}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-white text-sm font-medium">
                          Team {teamIndex + 1}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Team Members */}
                  <div className="p-6">
                    {/* Leader Section */}
                    {team.leader && (
                      <div className="mb-6">
                        <div className="flex items-center mb-3">
                          <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center mr-3">
                            <span className="text-white text-sm font-bold">👑</span>
                          </div>
                          <h4 className="text-lg font-semibold text-yellow-400">Team Leader</h4>
                        </div>
                        
                        <div className="bg-gray-600 rounded-lg p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                              <p className="text-white font-medium">{team.leader.name}</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-1">User ID</label>
                              <p className="text-cyan-400 font-mono">{team.leader.userId}</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-1">Registration Number</label>
                              <p className="text-white">{team.leader.registrationNumber}</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-1">Mobile Number</label>
                              <p className="text-white">{team.leader.mobileNumber}</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                              <p className="text-white">{team.leader.emailId}</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-1">College</label>
                              <p className="text-white font-medium">{team.leader.collegeName}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Team Members Section */}
                    {team.members.length > 0 && (
                      <div>
                        <div className="flex items-center mb-3">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                            <span className="text-white text-sm font-bold">👥</span>
                          </div>
                          <h4 className="text-lg font-semibold text-blue-400">Team Members</h4>
                        </div>
                        
                        <div className="space-y-4">
                          {team.members.map((member, memberIndex) => (
                            <div key={memberIndex} className="bg-gray-600 rounded-lg p-4">
                              <div className="flex items-center mb-3">
                                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full mr-3">
                                  Member {memberIndex + 1}
                                </span>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                                  <p className="text-white font-medium">{member.name}</p>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-300 mb-1">User ID</label>
                                  <p className="text-cyan-400 font-mono">{member.userId}</p>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-300 mb-1">Registration Number</label>
                                  <p className="text-white">{member.registrationNumber}</p>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-300 mb-1">Mobile Number</label>
                                  <p className="text-white">{member.mobileNumber}</p>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                                  <p className="text-white">{member.emailId}</p>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-300 mb-1">College</label>
                                  <p className="text-white font-medium">{member.collegeName}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventTeamsView; 