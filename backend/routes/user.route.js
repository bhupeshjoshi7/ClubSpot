import express from "express";
import { login, register, logout, UpdateProfile, requestSignupOtp, requestPasswordResetOtp, resetPassword } from "../controllers/user.controller.js";
import { singleUpload } from "../middlewares/multer.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route("/request-otp").post(requestSignupOtp);
router.route("/register").post(singleUpload, register);
router.route("/forgot-password/request-otp").post(requestPasswordResetOtp);
router.route("/forgot-password/reset").post(resetPassword);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/profile/update").post(isAuthenticated, singleUpload, UpdateProfile);
export default router;