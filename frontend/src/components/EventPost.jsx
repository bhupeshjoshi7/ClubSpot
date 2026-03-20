import React, { useState } from 'react';
import { Heart, MessageCircle, Send } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import axios from 'axios';
import { EVENT_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';

const EventPost = ({ event }) => {
    const { user } = useSelector(store => store.auth);
    const [likes, setLikes] = useState(event.likes || []);
    const [comments, setComments] = useState(event.comments || []);
    const [commentText, setCommentText] = useState("");
    const [showComments, setShowComments] = useState(false);

    const hasLiked = user ? likes.includes(user._id) : false;

    const likeHandler = async () => {
        if (!user) {
            toast.error("You must be logged in to like a post.");
            return;
        }
        try {
            const res = await axios.post(`${EVENT_API_END_POINT}/${event._id}/like`, {}, { withCredentials: true });
            if (res.data.success) {
                setLikes(res.data.likes);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to like event.");
        }
    };

    const commentSubmitHandler = async (e) => {
        e.preventDefault();
        if (!user) {
            toast.error("You must be logged in to comment.");
            return;
        }
        if (!commentText.trim()) return;

        try {
            const res = await axios.post(`${EVENT_API_END_POINT}/${event._id}/comment`, { text: commentText }, { withCredentials: true });
            if (res.data.success) {
                setComments(res.data.comments);
                setCommentText("");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to post comment.");
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden mb-6 flex flex-col">
            {/* Header: Club Info */}
            <div className="p-4 flex items-center gap-3">
                <Avatar className="h-10 w-10 border">
                    <AvatarImage src={event.company?.logo} alt={event.company?.name} className="object-cover" />
                    <AvatarFallback>{event.company?.name?.charAt(0) || "C"}</AvatarFallback>
                </Avatar>
                <div>
                    <h3 className="font-bold text-gray-900 leading-none">{event.company?.name}</h3>
                    <span className="text-xs text-gray-500">
                        {new Date(event.createdAt).toLocaleDateString()} at {new Date(event.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
            </div>

            {/* Poster Image */}
            {event.poster && (
                <div className="w-full max-h-96 md:max-h-[500px] overflow-hidden bg-gray-100 flex items-center justify-center">
                    <img src={event.poster} alt={event.title} className="w-full h-full object-contain" />
                </div>
            )}

            {/* Body: Event Details */}
            <div className="p-4">
                <h4 className="font-extrabold text-xl mb-2 text-gray-900">{event.title}</h4>
                <div className="inline-block bg-blue-50 text-blue-700 text-xs font-semibold px-2 py-1 rounded-md mb-3">
                    📅 Event Date: {new Date(event.date).toLocaleDateString()} {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <p className="text-gray-700 whitespace-pre-wrap mb-2">{event.description}</p>
                {event.link && (
                    <a href={event.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-medium hover:underline text-sm inline-block mb-2">
                        🔗 Event Link
                    </a>
                )}
            </div>

            {/* Interaction Bar */}
            <div className="px-4 py-3 border-t border-gray-100 flex items-center gap-6">
                <button onClick={likeHandler} className={`flex items-center gap-1.5 transition-colors ${hasLiked ? 'text-red-500 font-medium' : 'text-gray-500 hover:text-red-500'}`}>
                    <Heart className={`h-6 w-6 ${hasLiked ? 'fill-current' : ''}`} />
                    <span>{likes.length}</span>
                </button>
                <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-1.5 text-gray-500 hover:text-blue-500 transition-colors">
                    <MessageCircle className="h-6 w-6" />
                    <span>{comments.length}</span>
                </button>
            </div>

            {/* Comments Section */}
            {showComments && (
                <div className="px-4 pb-4 bg-gray-50">
                    <div className="space-y-4 pt-4 mb-4 max-h-60 overflow-y-auto pr-2">
                        {comments.length === 0 ? (
                            <p className="text-sm text-gray-400 text-center py-2">No comments yet. Be the first!</p>
                        ) : (
                            comments.map((comment, idx) => (
                                <div key={idx} className="flex gap-2">
                                    <Avatar className="h-8 w-8 shrink-0">
                                        <AvatarImage src={comment.user?.profile?.profilePhoto} className="object-cover" />
                                        <AvatarFallback>{comment.user?.fullname?.charAt(0) || "U"}</AvatarFallback>
                                    </Avatar>
                                    <div className="bg-white p-2.5 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 flex-1 text-sm">
                                        <p className="font-bold text-gray-800 mb-0.5 leading-tight">{comment.user?.fullname || "Unknown User"}</p>
                                        <p className="text-gray-700 whitespace-pre-wrap leading-snug">{comment.text}</p>
                                        <span className="text-[10px] text-gray-400 mt-1 block">
                                            {new Date(comment.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <form onSubmit={commentSubmitHandler} className="flex items-center gap-2 relative mt-4">
                        <Input
                            type="text"
                            placeholder="Add a comment..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            className="rounded-full pr-12 bg-white border-gray-300 focus-visible:ring-blue-100"
                        />
                        <button
                            type="submit"
                            disabled={!commentText.trim()}
                            className="absolute right-1 top-1 bottom-1 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-gray-300 transition-colors flex items-center justify-center aspect-square"
                        >
                            <Send className="h-4 w-4" />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default EventPost;
