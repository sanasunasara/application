const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  method: { type: String, enum: ["Credit Card", "Debit Card", "UPI", "PayPal"], required: true },
  status: { type: String, enum: ["Pending", "Completed", "Failed"], default: "Pending" },
  transactionId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Payment", PaymentSchema);
