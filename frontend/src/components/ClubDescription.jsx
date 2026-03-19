import React, { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useParams } from "react-router-dom";
import axios from "axios";
import { JOB_API_END_POINT, APPLICATION_API_END_POINT, CL_API_END_POINT, EVENT_API_END_POINT } from "@/utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Loader2, MapPin, Calendar, Users, Briefcase } from "lucide-react";
import { Navbar } from "./shared/Navbar";

const ClubDescription = () => {
  const params = useParams();
  const clubId = params.id;
  const { user } = useSelector(store => store.auth);

  const [club, setClub] = useState(null);
  const [openings, setOpenings] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const applyHandler = async (jobId) => {
    try {
      const res = await axios.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`, { withCredentials: true });
      if (res.data.success) {
        // Update the local state for that specific opening
        setOpenings(prev => prev.map(job =>
          job._id === jobId
            ? { ...job, applications: [...(job.applications || []), { applicant: user?._id }] }
            : job
        ));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to apply");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch Club Details
        const clubRes = await axios.get(`${CL_API_END_POINT}/get/${clubId}`, { withCredentials: true });
        if (clubRes.data.success) {
          setClub(clubRes.data.company);
        }

        // Fetch Openings for this Club
        const jobsRes = await axios.get(`${JOB_API_END_POINT}/company/${clubId}`, { withCredentials: true });
        if (jobsRes.data.success) {
          setOpenings(jobsRes.data.jobs);
        }

        // Fetch Events for this Club
        const eventsRes = await axios.get(`${EVENT_API_END_POINT}/company/${clubId}`, { withCredentials: true });
        if (eventsRes.data.success) {
          setEvents(eventsRes.data.events);
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch club information");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [clubId, user?._id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Loading Club Details...</p>
        </div>
      </div>
    );
  }

  if (!club) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-gray-800">Club not found</h1>
        <Button variant="link" onClick={() => window.history.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">

        {/* Club Header Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12 mb-8">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
            <div className="h-32 w-32 rounded-3xl overflow-hidden border-4 border-gray-50 shadow-md">
              <img src={club.logo} className="h-full w-full object-cover" alt={club.name} />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Official Club
                </span>
                <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Verified
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">{club.name}</h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-6 text-gray-500 font-medium">
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-blue-500" />
                  India
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-blue-500" />
                  Since {new Date(club.createdAt).getFullYear()}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About the Club</h2>
            <p className="text-gray-600 text-lg leading-relaxed max-w-4xl mb-6">
              {club.about || club.description || "Join this club to explore amazing opportunities and be part of a vibrant community."}
            </p>
            {club.pptLink && (
              <a href={club.pptLink} target="_blank" rel="noopener noreferrer">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-md">
                  View Club Presentation
                </Button>
              </a>
            )}
          </div>
        </div>

        {/* Recruitment Openings Section */}
        <div className="mt-12">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-8 flex items-center gap-3">
            <Briefcase className="text-blue-600" />
            Recruitment Openings
          </h2>

          {openings.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-gray-200">
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-700 mb-2">No active openings</h3>
              <p className="text-gray-500">This club currently has no active recruitment positions. Check back later!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {openings.map((job) => {
                const isApplied = job.applications?.some(app => app.applicant === user?._id);
                return (
                  <div key={job._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row justify-between items-center transition-all hover:shadow-md hover:border-blue-100 group">
                    <div className="flex-1 text-center md:text-left mb-6 md:mb-0">
                      <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{job.title}</h3>
                        <Badge variant="outline" className={`border-blue-100 ${job.isActive ? 'text-blue-600 bg-blue-50' : 'text-red-600 bg-red-50'}`}>
                          {job.isActive ? 'Active' : 'Closed'}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-4 line-clamp-1">{job.discription}</p>
                      <div className="flex flex-wrap justify-center md:justify-start gap-4">
                        <div className="flex items-center gap-1.5 text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-lg">
                          <Users size={14} className="text-blue-500" />
                          <span>{job.applications?.length || 0} applicants</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-lg">
                          <MapPin size={14} className="text-blue-500" />
                          <span>{job.location}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <div className="text-right hidden sm:block px-4">
                        <span className="block text-xs uppercase tracking-widest text-gray-400 font-bold mb-1">Salary</span>
                        <span className="text-lg font-bold text-gray-900">{job.salary}</span>
                      </div>
                      <Button
                        onClick={() => !isApplied && job.isActive && applyHandler(job._id)}
                        disabled={isApplied || !job.isActive}
                        className={`rounded-xl px-8 py-6 font-bold transition-all ${isApplied || !job.isActive
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-200"}`}
                      >
                        {isApplied ? "Applied" : !job.isActive ? "Closed" : "Apply Now"}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Club Events Section */}
        <div className="mt-12 bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12 mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-8 flex items-center gap-3">
            <Calendar className="text-blue-600" />
            Upcoming Events
          </h2>
          {events.length === 0 ? (
            <div className="text-center p-8 border-2 border-dashed border-gray-200 rounded-2xl">
              <Calendar className="h-10 w-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No upcoming events scheduled.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {events.map(event => (
                <div key={event._id} className="border border-gray-100 p-6 rounded-2xl hover:shadow-md transition-shadow bg-gray-50">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} className="text-blue-500" />
                      {new Date(event.date).toLocaleDateString()} {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-4">{event.description}</p>
                  {event.link && (
                    <a href={event.link} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                        Event Link
                      </Button>
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClubDescription;
