import { User } from "../model/user.model.js";
import { OTP } from "../model/otp.model.js";
import { sendEmail } from "../utils/sendEmail.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const requestSignupOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required.", success: false });

    if (!email.toLowerCase().endsWith("@pec.edu.in")) {
      return res.status(400).json({ message: "Only @pec.edu.in emails are allowed.", success: false });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists.", success: false });

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    await OTP.deleteMany({ email });
    await OTP.create({ email, otp: otpCode });

    const emailSent = await sendEmail(
      email,
      "ClubSpot Registration OTP",
      `Your OTP for ClubSpot registration is: ${otpCode}. It is valid for 5 minutes.`
    );

    if (!emailSent) {
      return res.status(500).json({ message: "Failed to send OTP email. Contact support.", success: false });
    }

    return res.status(200).json({ message: "OTP sent successfully to your email.", success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
}

export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, role, sid, otp } = req.body;

    if (!fullname || !email || !password || !role || !otp) {
      return res.status(400).json({ message: "Important fields or OTP missing", success: false });
    }

    if (!email.toLowerCase().endsWith("@pec.edu.in")) {
      return res.status(400).json({ message: "Only @pec.edu.in emails are allowed to register.", success: false });
    }

    if (role === 'student') {
      if (!sid) return res.status(400).json({ message: "Student ID (SID) is required for students.", success: false });
      if (!phoneNumber) return res.status(400).json({ message: "Phone number is required for students.", success: false });
    }

    const file = req.file;
    let cloudResponse = null;
    if (file) {
      const fileUri = getDataUri(file);
      cloudResponse = await cloudinary.uploader.upload(fileUri.content);
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "User already exist",
        success: false,
      });
    }

    const otpRecord = await OTP.findOne({ email, otp });
    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid or expired OTP.", success: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Clear the OTP to prevent reuse
    await OTP.deleteMany({ email });
    await User.create({
      fullname,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
      profile: {
        profilePhoto: cloudResponse ? cloudResponse.secure_url : "",
        SID: sid ? Number(sid) : undefined,
      }
    });
    return res.status(201).json({
      message: "Account created successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
        success: false,
      });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
        success: false,
      });
    }
    if (role != user.role) {
      return res.status(400).json({
        message: "Account does not exit with current role",
        success: false,
      });
    }
    const tokenData = {
      userId: user._id,
      role: user.role,
    };
    const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });
    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };
    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
      })
      .json({
        message: `Welcome back ${user.fullname}`,
        user,
        success: true,
      });
  } catch (error) {
    console.log("server issue");
  }
};
export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged OUt",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};
export const UpdateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, skills } = req.body;
    const userId = req.id; // Middleware authentication
    let user = await User.findById(userId); // Find user by ID

    // Check if user exists
    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        success: false
      });
    }

    // Update user fields
    if (fullname) user.fullname = fullname;
    // if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio) user.profile.bio = bio;
    if (skills) user.profile.skills = skills.split(",");

    // Save updated user data
    await user.save();

    // Prepare user response object
    const updatedUser = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile
    };

    return res.status(200).json({
      message: "Profile updated successfully.",
      user: updatedUser,
      success: true
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "An error occurred while updating the profile.",
      success: false
    });
  }
};

export const requestPasswordResetOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required.", success: false });

    const existingUser = await User.findOne({ email });
    if (!existingUser) return res.status(404).json({ message: "User not found.", success: false });

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    await OTP.deleteMany({ email });
    await OTP.create({ email, otp: otpCode });

    await sendEmail(
      email,
      "ClubSpot Password Reset OTP",
      `Your OTP to reset your ClubSpot password is: ${otpCode}. It is valid for 5 minutes.`
    );

    return res.status(200).json({ message: "Password reset OTP sent to your email.", success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
}

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "Important fields missing.", success: false });
    }

    const otpRecord = await OTP.findOne({ email, otp });
    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid or expired OTP.", success: false });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate({ email }, { password: hashedPassword });

    await OTP.deleteMany({ email });

    return res.status(200).json({ message: "Password reset successfully. You can now login.", success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
}
