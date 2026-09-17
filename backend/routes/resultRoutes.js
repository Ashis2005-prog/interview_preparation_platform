const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  saveResult,
  getMyResults,
  getResultById,
  deleteResult,
} = require("../controllers/resultController");

router.use(protect);

router.post("/", saveResult);

router.get("/", getMyResults);

router.get("/:id", getResultById);

router.delete("/:id", deleteResult);

module.exports = router;
