const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const { evaluate } = require("../controllers/evaluationController");

router.post("/interview", protect, evaluate);

module.exports = router;
