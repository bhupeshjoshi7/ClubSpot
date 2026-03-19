import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { createEvent, getEventsByCompany, deleteEvent } from "../controllers/event.controller.js";

const router = express.Router();
router.route("/create").post(isAuthenticated, createEvent);
router.route("/company/:id").get(getEventsByCompany);
router.route("/delete/:id").delete(isAuthenticated, deleteEvent);

export default router;
