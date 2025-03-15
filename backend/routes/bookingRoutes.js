const express = require("express");
const Booking = require("../models/Booking");
const Room = require("../models/Room");
const User = require("../models/User"); // User model import karvo
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: API endpoints for room bookings
 */

/**
 * @swagger
 * /api/bookings:
 *   post:
 *     summary: Book a room
 *     tags: [Bookings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               roomId:
 *                 type: string
 *               checkInDate:
 *                 type: string
 *                 format: date
 *               checkOutDate:
 *                 type: string
 *                 format: date
 *               guests:
 *                 type: number
 *               totalPrice:
 *                 type: number
 *     responses:
 *       201:
 *         description: Room booked successfully
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: User or Room not found
 */
router.post("/", async (req, res) => {
  try {
    const { userId, roomId, checkInDate, checkOutDate, guests, totalPrice } = req.body;

    // **1️⃣ Validate User**
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // **2️⃣ Validate Room**
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found!" });
    }

    // **3️⃣ Check Room Availability**
    const existingBooking = await Booking.findOne({
      roomId,
      $or: [
        { checkInDate: { $lte: checkOutDate }, checkOutDate: { $gte: checkInDate } },
      ],
    });

    if (existingBooking) {
      return res.status(400).json({ message: "Room already booked for selected dates!" });
    }

    // **4️⃣ Save Booking if Everything is Valid**
    const booking = new Booking({
      userId,
      roomId,
      checkInDate,
      checkOutDate,
      guests,
      totalPrice,
    });

    await booking.save();
    res.status(201).json({ message: "Room booked successfully!", booking });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
