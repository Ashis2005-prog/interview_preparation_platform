const express = require("express");

const {
  createSession,
  getSessions,
  getSession,
  updateSession,
  deleteSession,
} = require("../controllers/sessionController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.post("/", createSession);

router.get("/", getSessions);

router.get("/:id", getSession);

router.put("/:id", updateSession);

router.delete("/:id", deleteSession);

module.exports = router;
