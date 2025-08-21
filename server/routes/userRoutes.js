const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Event = require("../models/Event");
const { authenticateUser } = require("../middleware/authMiddleware");
const { sendOTPEmail, sendWelcomeEmail } = require("../utils/emailService");

// Helper function to generate a 6-digit OTP
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// Generate JWT Token with better security
const generateToken = (userId, userType = "user") => {
  const payload = {
    userId,
    userType,
    iat: Math.floor(Date.now() / 1000),
    jti: Math.random().toString(36).substring(2) + Date.now().toString(36),
  };

  return jwt.sign(payload, process.env.JWT_SECRET || "vision-fest-25-secret", {
    algorithm: "HS256",
    expiresIn: "7d",
  });
};

// Generate refresh token
const generateRefreshToken = (userId) => {
  return jwt.sign(
    {
      userId,
      type: "refresh",
      iat: Math.floor(Date.now() / 1000),
      jti: Math.random().toString(36).substring(2) + Date.now().toString(36),
    },
    process.env.JWT_REFRESH_SECRET || "vision-fest-25-refresh-secret",
    {
      algorithm: "HS256",
      expiresIn: "30d",
    }
  );
};

// --- SIGNUP FLOW (UNCHANGED) ---
router.post("/signup-request", async (req, res) => {
  try {
    const { emailId, registrationNumber, password, name, mobileNumber } =
      req.body;

    if (
      !name ||
      !registrationNumber ||
      !mobileNumber ||
      !emailId ||
      !password
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required." });
    }
    if (
      password.length < 8 ||
      !/[!@#$%^&*(),.?":{}|<>]/.test(password) ||
      !/[A-Z]/.test(password) ||
      !/[0-9]/.test(password)
    ) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Password does not meet the requirements.",
        });
    }
    const existingUser = await User.findOne({
      $or: [{ emailId }, { registrationNumber }],
    });
    if (existingUser) {
      return res
        .status(400)
        .json({
          success: false,
          message:
            "User with this email or registration number already exists.",
        });
    }
    const otp = generateOTP();
    const emailSent = await sendOTPEmail(emailId, otp);
    if (!emailSent) {
      return res
        .status(500)
        .json({
          success: false,
          message: "Failed to send OTP email. Please try again.",
        });
    }
    res
      .status(200)
      .json({
        success: true,
        message: `An OTP has been sent to ${emailId}.`,
        otp,
      });
  } catch (error) {
    console.error("Signup Request Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error during signup request." });
  }
});

router.post("/signup-verify", async (req, res) => {
  const {
    name,
    registrationNumber,
    mobileNumber,
    emailId,
    isGECVaishaliStudent,
    collegeName,
    password,
  } = req.body;
  try {
    const userExists = await User.findOne({
      $or: [{ emailId }, { registrationNumber }],
    });
    if (userExists) {
      return res
        .status(400)
        .json({
          success: false,
          message: "User already registered during verification.",
        });
    }
    const user = new User({
      name,
      registrationNumber,
      mobileNumber,
      emailId,
      isGECVaishaliStudent,
      collegeName,
      password,
    });
    await user.save();
    await sendWelcomeEmail(emailId, user.userId);
    const accessToken = generateToken(user._id, "user");
    const refreshToken = generateRefreshToken(user._id);
    res.status(201).json({
      success: true,
      message: "User registered successfully!",
      data: {
        _id: user._id,
        name: user.name,
        userId: user.userId,
        emailId: user.emailId,
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.error("Signup Verify Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error during user creation." });
  }
});

// --- FORGOT PASSWORD FLOW (UPDATED TO USE EMAIL) ---
router.post("/forgot-password-request", async (req, res) => {
  try {
    const { emailId } = req.body; // Step 1: Use emailId instead of userId
    if (!emailId) {
      return res
        .status(400)
        .json({ success: false, message: "Email ID is required." });
    }
    const user = await User.findOne({ emailId: emailId.toLowerCase() }); // Find user by email

    if (!user) {
      return res
        .status(200)
        .json({
          success: true,
          message:
            "If an account with this email exists, an OTP has been sent.",
        });
    }
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();
    await sendOTPEmail(user.emailId, otp);
    res
      .status(200)
      .json({
        success: true,
        message: "An OTP has been sent to your registered email.",
      });
  } catch (error) {
    console.error("Forgot Password Request Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post("/forgot-password-verify", async (req, res) => {
  try {
    const { emailId, otp, newPassword } = req.body; // Step 2: Use emailId for verification
    if (!newPassword || newPassword.length < 8) {
      return res
        .status(400)
        .json({
          success: false,
          message: "New password must be at least 8 characters long.",
        });
    }
    const user = await User.findOne({
      emailId: emailId.toLowerCase(), // Find user by email
      otp,
      otpExpires: { $gt: Date.now() },
    });
    if (!user) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Invalid or expired OTP. Please request a new one.",
        });
    }
    user.password = newPassword;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();
    res
      .status(200)
      .json({
        success: true,
        message: "Password has been reset successfully. You can now log in.",
      });
  } catch (error) {
    console.error("Forgot Password Verify Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// --- LOGIN ROUTE (UNCHANGED) ---
router.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    if (!emailId || !password) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Email/UserID and password are required",
        });
    }
    const user = await User.findOne({
      $or: [
        { emailId: emailId.toLowerCase() },
        { userId: emailId.toUpperCase() },
      ],
    });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }
    const accessToken = generateToken(user._id, "user");
    const refreshToken = generateRefreshToken(user._id);
    res.json({
      success: true,
      message: "Login successful",
      data: {
        _id: user._id,
        userId: user.userId,
        name: user.name,
        emailId: user.emailId,
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Server error during login",
        error: error.message,
      });
  }
});

// --- OTHER EXISTING ROUTES (UNCHANGED) ---
router.post("/refresh-token", async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res
        .status(400)
        .json({ success: false, message: "Refresh token is required" });
    }
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || "vision-fest-25-refresh-secret"
    );
    if (decoded.type !== "refresh") {
      return res
        .status(401)
        .json({ success: false, message: "Invalid refresh token" });
    }
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }
    const newAccessToken = generateToken(user._id, "user");
    res.json({
      success: true,
      message: "Token refreshed successfully",
      data: { accessToken: newAccessToken },
    });
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res
        .status(401)
        .json({ success: false, message: "Invalid refresh token" });
    }
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({
          success: false,
          message: "Refresh token expired. Please login again.",
        });
    }
    console.error("Refresh token error:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Server error during token refresh",
        error: error.message,
      });
  }
});

router.post("/forgot-userid", async (req, res) => {
  try {
    const { registrationNumber, emailId } = req.body;
    const user = await User.findOne({ registrationNumber, emailId });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "No user found with these details" });
    }
    res.json({
      success: true,
      message: "User ID found",
      data: { userId: user.userId, name: user.name },
    });
  } catch (error) {
    console.error("Forgot User ID error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
});

router.get("/dashboard", authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("participatedEvents.eventId")
      .select("-password -otp -otpExpires");
    res.json({ success: true, data: user });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
});

router.get("/profile", authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("participatedEvents.eventId")
      .select("-password -otp -otpExpires");
    res.json({ success: true, data: user });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
});

router.put("/profile", authenticateUser, async (req, res) => {
  try {
    const updates = req.body;
    delete updates.password;
    delete updates.userId;
    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");
    res.json({
      success: true,
      message: "Profile updated successfully",
      data: user,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
});

module.exports = router;
