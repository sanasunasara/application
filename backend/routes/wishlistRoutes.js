const express = require("express");
const mongoose = require("mongoose");
const Wishlist = require("../models/Wishlist");
const Room = require("../models/Room"); // Import Room Model

const router = express.Router();

/**
 * @swagger
 * /api/wishlist:
 *   post:
 *     summary: Add a room to the user's wishlist
 *     tags: [User Preferences]
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
 *     responses:
 *       201:
 *         description: Room added to wishlist
 *       400:
 *         description: Invalid userId or roomId
 */
router.post("/", async (req, res) => {
  try {
    const { userId, roomId } = req.body;

    //  Validate userId & roomId
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(roomId)) {
      return res.status(400).json({ error: "Invalid userId or roomId format" });
    }

    //  Check if Room Exists
    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ error: "Room not found" });

    //  Save Wishlist Item
    const wishlistItem = new Wishlist({ userId, roomId });
    await wishlistItem.save();

    res.status(201).json({ msg: "Room added to wishlist", wishlistItem });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/wishlist/{userId}:
 *   get:
 *     summary: Get wishlist of a user
 *     tags: [User Preferences]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: User's MongoDB ID
 *     responses:
 *       200:
 *         description: User's wishlist fetched successfully
 *       400:
 *         description: Invalid userId
 */
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    //  Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid userId format" });
    }

    //  Fetch Wishlist & Populate Room Details
    const wishlist = await Wishlist.find({ userId }).populate("roomId");

    res.status(200).json({ wishlist });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
