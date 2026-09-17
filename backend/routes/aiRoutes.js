const express = require("express");

const { generateQuestions } = require("../controllers/aiController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.post("/generate", generateQuestions);

module.exports = router;
