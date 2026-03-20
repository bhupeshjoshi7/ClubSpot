import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/multer.js";
import { createEvent, getEventsByCompany, deleteEvent, getAllEventsFeed, toggleLikeEvent, addCommentEvent } from "../controllers/event.controller.js";

const router = express.Router();
router.route("/feed").get(getAllEventsFeed);
router.route("/create").post(isAuthenticated, singleUpload, createEvent);
router.route("/company/:id").get(getEventsByCompany);
router.route("/delete/:id").delete(isAuthenticated, deleteEvent);
router.route("/:id/like").post(isAuthenticated, toggleLikeEvent);
router.route("/:id/comment").post(isAuthenticated, addCommentEvent);

export default router;
