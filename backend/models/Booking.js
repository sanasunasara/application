const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
  checkInDate: Date,
  checkOutDate: Date,
  guests: Number,
  totalPrice: Number,
  paymentStatus: { type: String, enum: ["Paid", "Pending"], default: "Pending" },
  bookingStatus: { type: String, enum: ["Confirmed", "Canceled", "Pending"], default: "Confirmed" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Booking", bookingSchema);
