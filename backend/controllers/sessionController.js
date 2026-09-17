const Session = require("../models/Session");

// ==========================================
// CREATE SESSION
// POST /api/sessions
// ==========================================
const createSession = async (req, res) => {
  try {
    const {
      title,
      company,
      role,
      experience,
      difficulty,
      topics,
      description,
    } = req.body;

    if (!title || !company || !role) {
      return res.status(400).json({
        success: false,
        message: "Title, company and role are required",
      });
    }

    const session = await Session.create({
      title: title.trim(),
      company: company.trim(),
      role: role.trim(),
      experience: Number(experience) || 0,
      difficulty: difficulty || "Medium",
      topics: Array.isArray(topics) ? topics : [],
      description: description || "",
      createdBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Interview session created successfully",
      session,
    });
  } catch (error) {
    console.error("Create session error:", error);

    return res.status(500).json({
      success: false,
      message: "Could not create session",
      error: error.message,
    });
  }
};

// ==========================================
// GET ALL SESSIONS
// GET /api/sessions
// ==========================================
const getSessions = async (req, res) => {
  try {
    const sessions = await Session.find({
      createdBy: req.user._id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: sessions.length,
      sessions,
    });
  } catch (error) {
    console.error("Get sessions error:", error);

    return res.status(500).json({
      success: false,
      message: "Could not load sessions",
      error: error.message,
    });
  }
};

// ==========================================
// GET SINGLE SESSION
// GET /api/sessions/:id
// ==========================================
const getSession = async (req, res) => {
  try {
    const session = await Session.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    return res.status(200).json({
      success: true,
      session,
    });
  } catch (error) {
    console.error("Get session error:", error);

    return res.status(500).json({
      success: false,
      message: "Could not load session",
      error: error.message,
    });
  }
};

// ==========================================
// UPDATE SESSION
// PUT /api/sessions/:id
// ==========================================
const updateSession = async (req, res) => {
  try {
    const {
      title,
      company,
      role,
      experience,
      difficulty,
      topics,
      description,
    } = req.body;

    const session = await Session.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    if (title !== undefined) {
      session.title = title.trim();
    }

    if (company !== undefined) {
      session.company = company.trim();
    }

    if (role !== undefined) {
      session.role = role.trim();
    }

    if (experience !== undefined) {
      session.experience = Number(experience) || 0;
    }

    if (difficulty !== undefined) {
      session.difficulty = difficulty;
    }

    if (topics !== undefined) {
      session.topics = Array.isArray(topics) ? topics : [];
    }

    if (description !== undefined) {
      session.description = description;
    }

    await session.save();

    return res.status(200).json({
      success: true,
      message: "Session updated successfully",
      session,
    });
  } catch (error) {
    console.error("Update session error:", error);

    return res.status(500).json({
      success: false,
      message: "Could not update session",
      error: error.message,
    });
  }
};

// ==========================================
// DELETE SESSION
// DELETE /api/sessions/:id
// ==========================================
const deleteSession = async (req, res) => {
  try {
    const session = await Session.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    await session.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Session deleted successfully",
    });
  } catch (error) {
    console.error("Delete session error:", error);

    return res.status(500).json({
      success: false,
      message: "Could not delete session",
      error: error.message,
    });
  }
};

module.exports = {
  createSession,
  getSessions,
  getSession,
  updateSession,
  deleteSession,
};
