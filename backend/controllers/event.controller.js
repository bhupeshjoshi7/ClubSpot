import { Event } from "../model/event.model.js";

export const createEvent = async (req, res) => {
    try {
        const { title, description, date, link, companyId } = req.body;
        const userId = req.id;

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

        const event = await Event.create({
            title,
            description,
            date,
            link,
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
