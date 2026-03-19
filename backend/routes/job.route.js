import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { postJob, getAdminJobs, getAllJobs, getJobById, getJobsByCompany, toggleJobStatus } from "../controllers/job.controller.js";

const router = express.Router();
router.route("/post").post(isAuthenticated, postJob);
router.route("/get").get(isAuthenticated, getAdminJobs);
router.route("/getAllJobs").get(getAllJobs);
router.route("/get/:id").get(getJobById);
router.route("/company/:id").get(getJobsByCompany);
router.route("/toggle/:id").post(isAuthenticated, toggleJobStatus);

export default router;
