import React, { useState, useEffect } from "react";
import { Navbar } from "../shared/Navbar";
import { Button } from "../ui/button";
import { ArrowLeft, Loader2, CalendarPlus, Trash2 } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { EVENT_API_END_POINT } from "@/utils/constant";

const AdminClubEvents = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    const [input, setInput] = useState({
        title: "",
        description: "",
        date: "",
        link: "",
    });

    const fetchEvents = async () => {
        try {
            const res = await axios.get(`${EVENT_API_END_POINT}/company/${params.id}`, { withCredentials: true });
            if (res.data.success) {
                setEvents(res.data.events);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, [params.id]);

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await axios.post(`${EVENT_API_END_POINT}/create`, {
                ...input,
                companyId: params.id
            }, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });

            if (res.data.success) {
                toast.success(res.data.message);
                setInput({ title: "", description: "", date: "", link: "" });
                fetchEvents();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create event");
        } finally {
            setLoading(false);
        }
    };

    const deleteHandler = async (eventId) => {
        try {
            const res = await axios.delete(`${EVENT_API_END_POINT}/delete/${eventId}`, { withCredentials: true });
            if (res.data.success) {
                toast.success(res.data.message);
                setEvents(events.filter(e => e._id !== eventId));
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete event");
        }
    };

    return (
        <div>
            <Navbar />
            <div className="max-w-4xl mx-auto my-10 p-8 bg-white shadow-lg rounded-lg">
                <div className="flex items-center gap-4 mb-8">
                    <Button onClick={() => navigate("/admin/companies")} variant="outline">
                        <ArrowLeft />
                    </Button>
                    <h1 className="text-3xl font-bold">Manage Club Events</h1>
                </div>

                {/* Create Event Form */}
                <form onSubmit={submitHandler} className="mb-10 bg-gray-50 p-6 rounded-lg">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <CalendarPlus className="w-5 h-5" /> Publish New Event
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label>Event Title</Label>
                            <Input type="text" name="title" value={input.title} onChange={changeEventHandler} required />
                        </div>
                        <div>
                            <Label>Date & Time</Label>
                            <Input type="datetime-local" name="date" value={input.date} onChange={changeEventHandler} required />
                        </div>
                        <div className="md:col-span-2">
                            <Label>Description</Label>
                            <Input type="text" name="description" value={input.description} onChange={changeEventHandler} required />
                        </div>
                        <div className="md:col-span-2">
                            <Label>Registration / Meeting Link (Optional)</Label>
                            <Input type="url" name="link" value={input.link} onChange={changeEventHandler} placeholder="https://..." />
                        </div>
                    </div>
                    <Button type="submit" className="mt-6 w-full md:w-auto" disabled={loading}>
                        {loading ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : "Publish Event"}
                    </Button>
                </form>

                {/* Existing Events */}
                <h2 className="text-xl font-bold mb-4 border-t pt-6">Published Events</h2>
                {fetching ? (
                    <div className="flex justify-center p-4">
                        <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
                    </div>
                ) : events.length === 0 ? (
                    <p className="text-gray-500 text-center py-4 bg-gray-50 rounded p-4">No events published yet.</p>
                ) : (
                    <div className="space-y-4">
                        {events.map(event => (
                            <div key={event._id} className="border p-4 rounded-lg flex justify-between items-start">
                                <div>
                                    <h3 className="font-semibold text-lg text-blue-700">{event.title}</h3>
                                    <p className="text-sm text-gray-500 mb-2">{new Date(event.date).toLocaleString()}</p>
                                    <p className="text-gray-700">{event.description}</p>
                                    {event.link && (
                                        <a href={event.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-sm mt-2 inline-block">
                                            Event Link
                                        </a>
                                    )}
                                </div>
                                <Button variant="destructive" size="icon" onClick={() => deleteHandler(event._id)}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminClubEvents;
