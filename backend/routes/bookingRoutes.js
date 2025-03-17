const express = require("express");
const Booking = require("../models/Booking");
const Room = require("../models/Room");
const User = require("../models/User");
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

    // Validate User
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // Validate Room
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found!" });
    }

    // Check Room Availability
    const existingBooking = await Booking.findOne({
      roomId,
      $or: [
        { checkInDate: { $lte: checkOutDate }, checkOutDate: { $gte: checkInDate } },
      ],
    });

    if (existingBooking) {
      return res.status(400).json({ message: "Room already booked for selected dates!" });
    }

    // Save Booking
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

/**
 * @swagger
 * /api/bookings:
 *   get:
 *     summary: Fetch all bookings
 *     tags: [Bookings]
 *     responses:
 *       200:
 *         description: Successfully fetched all bookings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   userId:
 *                     type: string
 *                   roomId:
 *                     type: string
 *                   checkInDate:
 *                     type: string
 *                     format: date
 *                   checkOutDate:
 *                     type: string
 *                     format: date
 *                   guests:
 *                     type: number
 *                   totalPrice:
 *                     type: number
 *       500:
 *         description: Server error
 */
router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find().populate("userId").populate("roomId");
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

/**
 * @swagger
 * /api/bookings/{id}:
 *   put:
 *     summary: Update a booking
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
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
 *       200:
 *         description: Booking updated successfully
 *       404:
 *         description: Booking not found
 *       400:
 *         description: Invalid request
 */
router.put("/:id", async (req, res) => {
  try {
    const { checkInDate, checkOutDate, guests, totalPrice } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found!" });
    }

    // Update booking details
    booking.checkInDate = checkInDate || booking.checkInDate;
    booking.checkOutDate = checkOutDate || booking.checkOutDate;
    booking.guests = guests || booking.guests;
    booking.totalPrice = totalPrice || booking.totalPrice;

    await booking.save();
    res.status(200).json({ message: "Booking updated successfully!", booking });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/bookings/{id}:
 *   delete:
 *     summary: Delete a booking
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Booking deleted successfully
 *       404:
 *         description: Booking not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found!" });
    }

    res.status(200).json({ message: "Booking deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
