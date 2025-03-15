const mongoose = require("mongoose");

const WishlistSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
  addedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Wishlist", WishlistSchema);
