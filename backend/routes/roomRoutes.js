const express = require("express");
const Room = require("../models/Room");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Rooms
 *   description: API endpoints for room management
 */

/**
 * @swagger
 * /api/rooms:
 *   post:
 *     summary: Add a new room
 *     tags: [Rooms]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               capacity:
 *                 type: number
 *               amenities:
 *                 type: array
 *                 items:
 *                   type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *               availability:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Room added successfully
 *       400:
 *         description: Invalid input data
 */
router.post("/", async (req, res) => {
  try {
    const room = new Room(req.body);
    await room.save();
    res.status(201).json(room);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/rooms:
 *   get:
 *     summary: Fetch all available rooms
 *     tags: [Rooms]
 *     responses:
 *       200:
 *         description: List of rooms
 */
router.get("/", async (req, res) => {
  try {
    const rooms = await Room.find({}, "_id name price"); // Fetch room ID, name, price
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
