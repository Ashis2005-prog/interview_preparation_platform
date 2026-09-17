const jwt = require("jsonwebtoken");
const User = require("../models/User");

const createAccessToken = (user) => {
  return jwt.sign(
    { id: user._id.toString(), type: "access" },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "15m" },
  );
};

const createRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id.toString(), type: "refresh" },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d" },
  );
};

const sendAuthResponse = (res, user, statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    user: user.toSafeObject(),
    accessToken: createAccessToken(user),
    refreshToken: createRefreshToken(user),
  });
};

const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role = "user",
      experience = 0,
      preferredTopics = [],
    } = req.body;

    console.log("\n========== REGISTER DEBUG ==========");
    console.log("Received email:", email);

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    console.log("Normalized email:", normalizedEmail);

    // Check whether MongoDB actually finds this user
    const existingUser = await User.findOne({
      email: normalizedEmail,
    }).select("+password");

    console.log(
      "Existing user:",
      existingUser
        ? {
            id: existingUser._id,
            email: existingUser.email,
            name: existingUser.name,
          }
        : "NONE",
    );

    if (existingUser) {
      console.log("❌ DUPLICATE FOUND BY findOne()");
      console.log("=================================\n");

      return res.status(409).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    const safeRole = role === "admin" ? "user" : role;

    console.log("Creating new user...");

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: safeRole,
      experience: Number(experience) || 0,
      preferredTopics: Array.isArray(preferredTopics) ? preferredTopics : [],
    });

    console.log("✅ USER CREATED:", user._id);
    console.log("=================================\n");

    return sendAuthResponse(res, user, 201);
  } catch (error) {
    console.error("\n========== REGISTER ERROR ==========");
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);
    console.error("Error keyPattern:", error.keyPattern);
    console.error("Error keyValue:", error.keyValue);
    console.error("====================================\n");

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // password is select:false, so explicitly request it for comparison.
    const user = await User.findOne({ email: normalizedEmail }).select(
      "+password",
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const passwordMatches = await user.comparePassword(password);

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    return sendAuthResponse(res, user);
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};

const refreshToken = async (req, res) => {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Refresh token is required",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    if (decoded.type !== "refresh") {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists",
      });
    }

    return res.json({
      success: true,
      accessToken: createAccessToken(user),
      refreshToken: createRefreshToken(user),
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Refresh token is invalid or expired",
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.json({
      success: true,
      user: user.toSafeObject(),
    });
  } catch (error) {
    console.error("Profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Could not load profile",
    });
  }
};
// Update profile
const updateProfile = async (req, res) => {
  try {
    const {
      name,
      email,
      experience,
      preferredTopics,
      notifications,
      darkMode,
    } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (name !== undefined) {
      const trimmedName = name.trim();

      if (trimmedName.length < 2) {
        return res.status(400).json({
          success: false,
          message: "Name must be at least 2 characters",
        });
      }

      if (trimmedName.length > 50) {
        return res.status(400).json({
          success: false,
          message: "Name cannot exceed 50 characters",
        });
      }

      user.name = trimmedName;
    }

    if (email !== undefined) {
      const normalizedEmail = email.trim().toLowerCase();

      const existingUser = await User.findOne({
        email: normalizedEmail,
        _id: { $ne: user._id },
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "This email is already being used",
        });
      }

      user.email = normalizedEmail;
    }

    if (experience !== undefined) {
      const experienceValue = Number(experience);

      if (
        Number.isNaN(experienceValue) ||
        experienceValue < 0 ||
        experienceValue > 50
      ) {
        return res.status(400).json({
          success: false,
          message: "Experience must be between 0 and 50 years",
        });
      }

      user.experience = experienceValue;
    }

    if (preferredTopics !== undefined) {
      if (!Array.isArray(preferredTopics)) {
        return res.status(400).json({
          success: false,
          message: "Preferred topics must be an array",
        });
      }

      user.preferredTopics = preferredTopics;
    }

    if (notifications !== undefined) {
      user.notifications = Boolean(notifications);
    }

    if (darkMode !== undefined) {
      user.darkMode = Boolean(darkMode);
    }

    const updatedUser = await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser.toSafeObject(),
    });
  } catch (error) {
    console.error("Update profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};
// Change password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters",
      });
    }

    const user = await User.findById(req.user._id).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const passwordMatches = await user.comparePassword(currentPassword);

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    user.password = newPassword;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to change password",
    });
  }
};

module.exports = {
  register,
  login,
  refreshToken,
  getProfile,
  updateProfile,
  changePassword,
};
