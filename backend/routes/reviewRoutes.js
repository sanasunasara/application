const express = require("express");
const mongoose = require("mongoose");
const Review = require("../models/Review");
const Room = require("../models/Room");
const User = require("../models/User");

const router = express.Router();

/**
 * @swagger
 * /api/reviews:
 *   post:
 *     summary: Submit a review for a room
 *     tags: [Review & Ratings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: User's MongoDB ID
 *               roomId:
 *                 type: string
 *                 description: Room's MongoDB ID
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Review submitted successfully
 *       400:
 *         description: Invalid userId or roomId
 */
router.post("/", async (req, res) => {
  try {
    const { userId, roomId, rating, comment } = req.body;

    //  Validate userId & roomId
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(roomId)) {
      return res.status(400).json({ error: "Invalid userId or roomId format" });
    }

    //  Check if Room Exists
    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ error: "Room not found" });

    //  Save Review
    const review = new Review({ userId, roomId, rating, comment });
    await review.save();

    res.status(201).json({ msg: "Review submitted successfully", review });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/reviews/{roomId}:
 *   get:
 *     summary: Get reviews for a specific room
 *     tags: [Review & Ratings]
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *         description: Room's MongoDB ID
 *     responses:
 *       200:
 *         description: List of reviews for the room
 *       400:
 *         description: Invalid roomId format
 */
router.get("/:roomId", async (req, res) => {
  try {
    const { roomId } = req.params;

    // ✅ Validate roomId
    if (!mongoose.Types.ObjectId.isValid(roomId)) {
      return res.status(400).json({ error: "Invalid roomId format" });
    }

    // ✅ Fetch Reviews & Populate User Info
    const reviews = await Review.find({ roomId })
      .populate("userId", "name email") // Only get user name & email
      .sort({ createdAt: -1 });

    res.status(200).json({ reviews });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
