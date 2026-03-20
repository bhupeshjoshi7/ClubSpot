import { Event } from "../model/event.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const createEvent = async (req, res) => {
    try {
        const { title, description, date, link, companyId } = req.body;
        const userId = req.id;
        const file = req.file;

        if (!title || !description || !date || !companyId) {
            return res.status(400).json({
                message: "Missing required fields.",
                success: false
            });
        }

        if (req.role !== 'recruiter') {
            return res.status(403).json({
                message: "Only recruiters can create events.",
                success: false
            });
        }

        let posterUrl = "";
        if (file) {
            const fileUri = getDataUri(file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            posterUrl = cloudResponse.secure_url;
        }

        const event = await Event.create({
            title,
            description,
            date,
            link,
            poster: posterUrl,
            company: companyId,
            created_by: userId
        });

        return res.status(201).json({
            message: "Event created successfully.",
            event,
            success: true
        });
    } catch (error) {
        console.log("Error in createEvent:", error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};

export const getEventsByCompany = async (req, res) => {
    try {
        const companyId = req.params.id;
        const events = await Event.find({ company: companyId }).sort({ date: -1 });

        return res.status(200).json({
            events,
            success: true
        });
    } catch (error) {
        console.log("Error in getEventsByCompany:", error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};

export const deleteEvent = async (req, res) => {
    try {
        const eventId = req.params.id;
        const userId = req.id;

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({
                message: "Event not found.",
                success: false
            });
        }

        if (event.created_by.toString() !== userId) {
            return res.status(403).json({
                message: "You can only delete your own events.",
                success: false
            });
        }

        await Event.findByIdAndDelete(eventId);

        return res.status(200).json({
            message: "Event deleted successfully.",
            success: true
        });
    } catch (error) {
        console.log("Error in deleteEvent:", error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};

export const getAllEventsFeed = async (req, res) => {
    try {
        const events = await Event.find()
            .populate({ path: "company", select: "name logo" })
            .populate({ path: "comments.user", select: "fullname profile.profilePhoto" })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            events,
            success: true
        });
    } catch (error) {
        console.log("Error in getAllEventsFeed:", error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};

export const toggleLikeEvent = async (req, res) => {
    try {
        const eventId = req.params.id;
        const userId = req.id;

        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ message: "Event not found", success: false });

        if (event.likes.includes(userId)) {
            // Unlike
            event.likes = event.likes.filter(id => id.toString() !== userId.toString());
        } else {
            // Like
            event.likes.push(userId);
        }

        await event.save();

        return res.status(200).json({
            message: "Like status updated.",
            likes: event.likes,
            success: true
        });
    } catch (error) {
        console.log("Error in toggleLikeEvent:", error);
        return res.status(500).json({ message: "Internal server error.", success: false });
    }
};

export const addCommentEvent = async (req, res) => {
    try {
        const eventId = req.params.id;
        const userId = req.id;
        const { text } = req.body;

        if (!text) return res.status(400).json({ message: "Comment text is required.", success: false });

        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ message: "Event not found", success: false });

        const comment = { user: userId, text };
        event.comments.push(comment);

        await event.save();

        // Populate the new comment user to return to frontend
        await event.populate({ path: "comments.user", select: "fullname profile.profilePhoto" });

        return res.status(201).json({
            message: "Comment added.",
            comments: event.comments,
            success: true
        });
    } catch (error) {
        console.log("Error in addCommentEvent:", error);
        return res.status(500).json({ message: "Internal server error.", success: false });
    }
};
