const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  capacity: Number,
  amenities: [String],
  images: [String],
  availability: Boolean,
  // location: {
  //   city: String,
  //   state: String,
  //   country: String
  // },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Room", roomSchema);
