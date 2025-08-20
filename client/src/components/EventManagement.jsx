import React, { useState, useEffect } from 'react';
import { buildApiUrl } from '../config/config';
import { useAuth } from '../context/AuthContext';

const EventManagement = () => {
  const { admin, getAdminToken } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    poster: '',
    description: '',
    overview: '',
    category: 'Technical',
    date: '',
    venue: '',
    teamSize: { min: 1, max: 4 },
    coordinators: [{ name: '', contact: '', role: 'Faculty Coordinator' }],
    prizes: [
      { position: '1st', amount: '', description: '' },
      { position: '2nd', amount: '', description: '' },
      { position: '3rd', amount: '', description: '' }
    ],
    rules: [''],
    registrationDeadline: '',
    isActive: true,
    maxTeams: 25,
    currentTeams: 0
  });

  const [posterFile, setPosterFile] = useState(null);
  const [posterPreview, setPosterPreview] = useState('');
  const [uploadingPoster, setUploadingPoster] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const token = getAdminToken();
      
      if (!token) {
        console.error('No admin token found');
        setLoading(false);
        return;
      }
      
      const response = await fetch(buildApiUrl('/api/admin/events'), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setEvents(data.data);
      } else if (response.status === 401) {
        console.error('Unauthorized - admin token may be invalid');
        // Could redirect to login here
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePosterUpload = async (file) => {
    if (!file) return;

    try {
      setUploadingPoster(true);
      const formData = new FormData();
      formData.append('poster', file);

      const token = getAdminToken();
      const response = await fetch(buildApiUrl('/api/admin/upload-poster'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({
          ...prev,
          poster: data.data.url
        }));
        setPosterPreview(data.data.url);
        alert('Poster uploaded successfully!');
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to upload poster');
      }
    } catch (error) {
      console.error('Poster upload error:', error);
      alert('Error uploading poster');
    } finally {
      setUploadingPoster(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please select a valid image file (JPG, JPEG, PNG, WEBP, or GIF)');
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }

      setPosterFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPosterPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePoster = () => {
    setPosterFile(null);
    setPosterPreview('');
    setFormData(prev => ({
      ...prev,
      poster: ''
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleArrayChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => 
        i === index ? (typeof value === 'object' ? { ...item, ...value } : value) : item
      )
    }));
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'coordinators' 
        ? [...prev[field], { name: '', contact: '', role: 'Faculty Coordinator' }]
        : field === 'prizes'
        ? [...prev[field], { position: '', amount: '', description: '' }]
        : [...prev[field], '']
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = getAdminToken();
      
      if (!token) {
        alert('No admin token found. Please login again.');
        return;
      }
      
      const url = editingEvent 
        ? buildApiUrl(`/api/admin/events/${editingEvent._id}`)
        : buildApiUrl('/api/admin/events');
      
      const method = editingEvent ? 'PUT' : 'POST';
      
      // Prepare data for submission
      const submitData = {
        ...formData,
        date: new Date(formData.date).toISOString(),
        registrationDeadline: new Date(formData.registrationDeadline).toISOString(),
        // Filter out empty rules and coordinator entries
        rules: formData.rules.filter(rule => rule.trim() !== ''),
        coordinators: formData.coordinators.filter(coord => coord.name.trim() !== '' && coord.contact.trim() !== ''),
        prizes: formData.prizes.filter(prize => prize.amount.trim() !== '')
      };
      
      console.log('Submitting event data:', submitData);
      console.log('API URL:', url);
      console.log('Method:', method);
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(submitData)
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (response.ok) {
        const data = await response.json();
        alert(data.message);
        setShowForm(false);
        setEditingEvent(null);
        resetForm();
        fetchEvents();
      } else {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        let errorMessage = 'Failed to save event';
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          console.error('Could not parse error response:', e);
        }
        alert(errorMessage);
      }
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Network error. Please try again.');
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      overview: event.overview,
      category: event.category,
      date: event.date.split('T')[0],
      venue: event.venue,
      teamSize: event.teamSize,
      coordinators: event.coordinators,
      prizes: event.prizes,
      rules: event.rules,
      registrationDeadline: event.registrationDeadline.split('T')[0],
      isActive: event.isActive,
      maxTeams: event.maxTeams,
      currentTeams: event.currentTeams
    });
    setShowForm(true);
  };

  const handleDelete = async (eventId) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    
    try {
      const token = getAdminToken();
      const response = await fetch(buildApiUrl(`/api/admin/events/${eventId}`), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('Event deleted successfully');
        fetchEvents();
      } else {
        const error = await response.json();
        alert(error.message);
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Error deleting event');
    }
  };

  const toggleEventStatus = async (eventId, currentStatus) => {
    try {
      const token = getAdminToken();
      const response = await fetch(buildApiUrl(`/api/admin/events/${eventId}/toggle-status`), {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert(`Event ${currentStatus ? 'deactivated' : 'activated'} successfully`);
        fetchEvents();
      }
    } catch (error) {
      console.error('Error toggling event status:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      poster: '',
      description: '',
      overview: '',
      category: 'Technical',
      date: '',
      venue: '',
      teamSize: { min: 1, max: 4 },
      coordinators: [{ name: '', contact: '', role: 'Faculty Coordinator' }],
      prizes: [
        { position: '1st', amount: '', description: '' },
        { position: '2nd', amount: '', description: '' },
        { position: '3rd', amount: '', description: '' }
      ],
      rules: [''],
      registrationDeadline: '',
      isActive: true,
      maxTeams: 25,
      currentTeams: 0
    });
    setPosterFile(null);
    setPosterPreview('');
  };

  if (loading) {
    return <div className="text-center py-8">Loading events...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Event Management</h2>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingEvent(null);
            resetForm();
          }}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Add New Event
        </button>
      </div>

      {/* Event Form */}
      {showForm && (
        <div className="bg-gray-800 p-6 rounded-lg mb-6">
          <h3 className="text-xl font-semibold text-white mb-4">
            {editingEvent ? 'Edit Event' : 'Create New Event'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600"
                >
                  <option value="Technical">Technical</option>
                  <option value="Non-Technical">Non-Technical</option>
                  <option value="Cultural">Cultural</option>
                  <option value="Sports">Sports</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Gaming">Gaming</option>
                </select>
              </div>
            </div>

            {/* Poster Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Event Poster</label>
              <div className="space-y-3">
                {/* File Input */}
                <div className="flex items-center space-x-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="flex-1 bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-cyan-600 file:text-white hover:file:bg-cyan-700"
                  />
                  {posterFile && (
                    <button
                      type="button"
                      onClick={() => handlePosterUpload(posterFile)}
                      disabled={uploadingPoster}
                      className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-2 rounded text-sm"
                    >
                      {uploadingPoster ? 'Uploading...' : 'Upload'}
                    </button>
                  )}
                  {(posterFile || posterPreview) && (
                    <button
                      type="button"
                      onClick={removePoster}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>

                {/* Preview */}
                {posterPreview && (
                  <div className="relative">
                    <img
                      src={posterPreview}
                      alt="Poster Preview"
                      className="max-w-xs max-h-48 rounded-lg border border-gray-600"
                    />
                    {formData.poster && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                        Uploaded ✓
                      </div>
                    )}
                  </div>
                )}

                {/* Help Text */}
                <p className="text-xs text-gray-400">
                  Supported formats: JPG, JPEG, PNG, WEBP, GIF. Max size: 5MB.
                  {formData.poster && ' Poster will be displayed on event cards.'}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Overview</label>
              <textarea
                name="overview"
                value={formData.overview}
                onChange={handleInputChange}
                rows="3"
                className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600"
                placeholder="Detailed overview of the event"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Venue</label>
                <input
                  type="text"
                  name="venue"
                  value={formData.venue}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Min Team Size</label>
                <input
                  type="number"
                  name="teamSize.min"
                  value={formData.teamSize.min}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600"
                  min="1"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Max Team Size</label>
                <input
                  type="number"
                  name="teamSize.max"
                  value={formData.teamSize.max}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600"
                  min="1"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Max Teams</label>
                <input
                  type="number"
                  name="maxTeams"
                  value={formData.maxTeams}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600"
                  min="1"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Registration Deadline</label>
              <input
                type="date"
                name="registrationDeadline"
                value={formData.registrationDeadline}
                onChange={handleInputChange}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600"
                required
              />
            </div>

            {/* Coordinators */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Coordinators</label>
              {formData.coordinators.map((coordinator, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Name"
                    value={coordinator.name}
                    onChange={(e) => handleArrayChange('coordinators', index, { name: e.target.value })}
                    className="flex-1 bg-gray-700 text-white px-3 py-2 rounded border border-gray-600"
                  />
                  <input
                    type="email"
                    placeholder="Contact"
                    value={coordinator.contact}
                    onChange={(e) => handleArrayChange('coordinators', index, { contact: e.target.value })}
                    className="flex-1 bg-gray-700 text-white px-3 py-2 rounded border border-gray-600"
                  />
                  <select
                    value={coordinator.role}
                    onChange={(e) => handleArrayChange('coordinators', index, { role: e.target.value })}
                    className="bg-gray-700 text-white px-3 py-2 rounded border border-gray-600"
                  >
                    <option value="Faculty Coordinator">Faculty Coordinator</option>
                    <option value="Student Coordinator">Student Coordinator</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => removeArrayItem('coordinators', index)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('coordinators')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded"
              >
                Add Coordinator
              </button>
            </div>

            {/* Prizes */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Prizes</label>
              {formData.prizes.map((prize, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Position (e.g., 1st, 2nd, 3rd)"
                    value={prize.position}
                    onChange={(e) => handleArrayChange('prizes', index, { position: e.target.value })}
                    className="w-24 bg-gray-700 text-white px-3 py-2 rounded border border-gray-600"
                  />
                  <input
                    type="text"
                    placeholder="Amount (e.g., ₹5,000)"
                    value={prize.amount}
                    onChange={(e) => handleArrayChange('prizes', index, { amount: e.target.value })}
                    className="flex-1 bg-gray-700 text-white px-3 py-2 rounded border border-gray-600"
                  />
                  <input
                    type="text"
                    placeholder="Description (e.g., Cash Prize + Trophy)"
                    value={prize.description}
                    onChange={(e) => handleArrayChange('prizes', index, { description: e.target.value })}
                    className="flex-1 bg-gray-700 text-white px-3 py-2 rounded border border-gray-600"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem('prizes', index)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('prizes')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded"
              >
                Add Prize
              </button>
            </div>

            {/* Rules */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Rules</label>
              {formData.rules.map((rule, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={rule}
                    onChange={(e) => handleArrayChange('rules', index, e.target.value)}
                    className="flex-1 bg-gray-700 text-white px-3 py-2 rounded border border-gray-600"
                    placeholder="Rule description"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayItem('rules', index)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('rules')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded"
              >
                Add Rule
              </button>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
              >
                {editingEvent ? 'Update Event' : 'Create Event'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingEvent(null);
                  resetForm();
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Events List */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Event</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Teams</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {events.map((event) => (
              <tr key={event._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-white">{event.title}</div>
                    <div className="text-sm text-gray-400">{event.category}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {new Date(event.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    event.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {event.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {event.currentTeams}/{event.maxTeams}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => handleEdit(event)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => toggleEventStatus(event._id, event.isActive)}
                    className={`${event.isActive ? 'text-orange-600 hover:text-orange-900' : 'text-green-600 hover:text-green-900'}`}
                  >
                    {event.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleDelete(event._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EventManagement; 