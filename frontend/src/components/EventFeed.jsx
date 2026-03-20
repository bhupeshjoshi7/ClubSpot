import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { EVENT_API_END_POINT } from '@/utils/constant';
import EventPost from './EventPost';
import { Loader2, Radio } from 'lucide-react';
import { toast } from 'sonner';

const EventFeed = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeed = async () => {
            try {
                const res = await axios.get(`${EVENT_API_END_POINT}/feed`, { withCredentials: true });
                if (res.data.success) {
                    setEvents(res.data.events);
                }
            } catch (error) {
                console.error("Failed to fetch event feed:", error);
                toast.error("Failed to load the event feed.");
            } finally {
                setLoading(false);
            }
        };
        fetchFeed();
    }, []);

    return (
        <div className="max-w-2xl mx-auto my-12 px-4">
            <div className="flex items-center gap-3 mb-8 pb-4 border-b">
                <div className="bg-blue-100 p-2 rounded-xl text-blue-600">
                    <Radio className="h-6 w-6" />
                </div>
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-900">Club Events</h2>
                    <p className="text-gray-500 font-medium text-sm">See what's happening around the clubs</p>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
            ) : events.length === 0 ? (
                <div className="bg-gray-50 rounded-2xl p-12 text-center border-2 border-dashed border-gray-200">
                    <p className="text-gray-500 font-medium">The feed is quiet. No events published yet!</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {events.map(event => (
                        <EventPost key={event._id} event={event} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default EventFeed;
