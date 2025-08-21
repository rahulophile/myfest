import React, { useState, useEffect } from "react";
import { buildApiUrl } from "../config/config";


const Team = () => {
  const [facultyMembers, setFacultyMembers] = useState([]);
  const [studentTeam, setStudentTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTeamData();
  }, []);

  const fetchTeamData = async () => {
    try {
      setLoading(true);

      const facultyUrl = buildApiUrl("/api/faculty");
      const studentUrl = buildApiUrl("/api/student-team");

      // Fetch faculty members
      const facultyResponse = await fetch(facultyUrl);
      if (!facultyResponse.ok) {
        throw new Error("Failed to fetch faculty data");
      }
      const facultyData = await facultyResponse.json();

      // Fetch student team members
      const studentResponse = await fetch(studentUrl);
      if (!studentResponse.ok) {
        throw new Error("Failed to fetch student team data");
      }
      const studentData = await studentResponse.json();

      setFacultyMembers(facultyData);
      setStudentTeam(studentData);
      setError(null);
    } catch (err) {
      console.error("Error fetching team data:", err);
      setError("Failed to load team data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Function to determine year based on registration number
  const getYearFromReg = (regNumber) => {
    if (regNumber.startsWith("22")) return "3rd Year";
    if (regNumber.startsWith("23")) return "2nd Year";
    if (regNumber.startsWith("24") || regNumber.startsWith("25"))
      return "1st Year";
    return "Unknown Year";
  };

  const renderPhoto = (photo, name, size = "w-24 h-24") => {
    if (photo && photo !== "/api/placeholder/150/150") {
      // Convert relative photo path to full backend URL
      const photoUrl = photo.startsWith("http") ? photo : buildApiUrl(photo);
      return (
        <>
          <img
            src={photoUrl}
            alt={name}
            className={`${size} rounded-full object-cover border-2 border-cyan-400`}
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
          <div
            className={`${size} bg-gradient-to-br from-slate-700 via-gray-700 to-slate-700
 rounded-full flex items-center justify-center border-2 border-slate-400 hidden shadow-lg`}
          >
            <div className="text-center">
              <span className="text-white font-bold text-3xl block">
                {name.charAt(4)}
              </span>
              
            </div>
          </div>
        </>
      );
    }

    return (
      <div
        className={`${size} bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-700 rounded-full flex items-center justify-center border-2 border-cyan-400 shadow-lg`}
      >
        <div className="text-center">
          <span className="text-white font-bold text-3xl block">
            {name.charAt(0)}
          </span>
          <div className="w-2 h-2 bg-cyan-300 rounded-full mx-auto mt-1 animate-pulse"></div>
        </div>
      </div>
    );
  };

  const renderStudentPhoto = (photo, name, size = "w-16 h-16") => {
    if (photo && photo !== "/api/placeholder/150/150") {
      // Convert relative photo path to full backend URL
      const photoUrl = photo.startsWith("http") ? photo : buildApiUrl(photo);
      return (
        <>
          <img
            src={photoUrl}
            alt={name}
            className={`${size} rounded-full object-cover border-2 border-cyan-400`}
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
          <div
            className={`${size} bg-gradient-to-br from-cyan-800 via-blue-800 to-purple-800 rounded-full flex items-center justify-center border-2 border-cyan-700 hidden shadow-lg`}
          >
            <div className="text-center">
              <span className="text-white font-bold text-xl block">
                {name.charAt(0)}
              </span>
              
            </div>
          </div>
        </>
      );
    }

    return (
      <div
        className={`${size} bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-700 rounded-full flex items-center justify-center border-2 border-cyan-400 shadow-lg`}
      >
        <div className="text-center">
          <span className="text-white font-bold text-xl block">
            {name.charAt(0)}
          </span>
          <div className="w-1.5 h-1.5 bg-cyan-300 rounded-full mx-auto mt-0.5 animate-pulse"></div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-400 mx-auto"></div>
          <p className="text-white text-xl mt-4">Loading team information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-trasparent flex items-center justify-center">
        <div className="flex items-center justify-center flex-col text-center p-20">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <p className="text-white text-l lg:text-xl mb-4">{error}</p>
          <button
            onClick={fetchTeamData}
            className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    // CHANGE IS HERE: Removed bg-[#0a0f1a] and overflow-hidden.
    // The content itself is now relative to stack on top of the fixed background.
    <div className="relative"> 
      
      
      {/* The rest of your page content does not need to change */}
      <div className="relative z-10">
        {/* Header */}
        <div className=" py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              <span className="text-white">Meet our </span>
              <span className="tech-outline">Team</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              The dedicated faculty and talented students behind Vision Fest 25.
              Together, we're making innovation happen across 13 exciting events!
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Faculty Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                Faculty Incharge
              </h2>
              {/* <p className="text-gray-300 max-w-2xl mx-auto">
                Our experienced faculty members provide guidance and support to
                ensure Vision Fest 25 is a resounding success across all events.
              </p> */}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-15">
              {facultyMembers.map((member, index) => (
                <div
                  key={member._id || index}
                  className="footer-bg rounded-lg p-6 text-center hover:transform hover:scale-105 transition-transform duration-300 border border-red-200"
                >
                  <div className="flex justify-center mb-4">
                    {renderPhoto(member.photo, member.name)}
                  </div>

                  <h3 className="text-xl font-semibold text-white mb-2">
                    {member.name}
                  </h3>
                  <p className="text-cyan-400 font-medium mb-3">
                    {member.department}
                  </p>

                  {/* Assigned Events */}
                  {member.assignedEvents && member.assignedEvents.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-white font-medium text-sm mb-2">
                        Assigned Events
                      </h4>
                      <div className="flex flex-wrap gap-1 justify-center">
                        {member.assignedEvents.map((event, eventIndex) => (
                          <span
                            key={eventIndex}
                            className="px-2 py-1 bg-cyan-900 text-cyan-300 text-xs rounded"
                          >
                            {event}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Student Team Section */}
          <div>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                Student Coordinators
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Meet the passionate student coordinators who are working
                tirelessly to bring Vision Fest 25 to life with their creativity
                and technical skills across all 13 events.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-15">
              {studentTeam.map((member, index) => (
                <div
                  key={member._id || index}
                  className="footer-bg rounded-lg p-6 hover:transform hover:scale-105 transition-transform duration-300 border border-gray-700"
                >
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="relative">
                      {renderStudentPhoto(member.photo, member.name)}
                    </div>

                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {member.name}
                      </h3>
                      <p className="text-cyan-400 font-medium text-sm mb-1">
                        {getYearFromReg(member.regNumber)}
                      </p>
                      <p className="text-gray-400 text-xs mb-2">
                        Student Coordinator
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {/* Assigned Events */}
                    {member.assignedEvents &&
                      member.assignedEvents.length > 0 && (
                        <div>
                          <h4 className="text-white font-medium text-sm mb-2">
                            Assigned Events
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {member.assignedEvents.map((event, eventIndex) => (
                              <span
                                key={eventIndex}
                                className="px-2 py-1 bg-cyan-900 text-cyan-300 text-xs rounded"
                              >
                                {event}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                    <div className="pt-3 border-t border-gray-700">
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center space-x-2">
                          <svg
                            className="w-3 h-3 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            />
                          </svg>
                          <span className="text-gray-300">
                            {member.contactNumber}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Join Team Section */}
          <div className="mt-16 text-center">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-white mb-4">
                Want to Join Our Team?
              </h2>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                We're always looking for passionate students to join our team. If
                you're interested in event management, technical skills, or
                creative work, we'd love to hear from you!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/contact"
                  className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
                >
                  Contact Us
                </a>
                <a
                  href="/events"
                  className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-md font-medium transition-colors"
                >
                  Explore Events
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Team;