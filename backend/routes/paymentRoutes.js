const express = require("express");
const mongoose = require("mongoose");
const Payment = require("../models/payment");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Payment processing APIs
 */

/**
 * @swagger
 * /api/payments/methods:
 *   get:
 *     summary: Fetch available payment methods
 *     tags: [Payments]
 *     responses:
 *       200:
 *         description: List of payment methods
 */
router.get("/methods", async (req, res) => {
  try {
    const paymentMethods = ["Credit Card", "Debit Card", "UPI", "PayPal"];
    res.status(200).json(paymentMethods);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/payments:
 *   post:
 *     summary: Make a payment
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               amount:
 *                 type: number
 *               method:
 *                 type: string
 *               transactionId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Payment successful
 *       400:
 *         description: Payment failed
 */
router.post("/", async (req, res) => {
    try {
      const { userId, amount, method, transactionId } = req.body;
  
      //  Check if userId is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: "Invalid userId format" });
      }
  
      const payment = new Payment({
        userId: new mongoose.Types.ObjectId(userId), // Convert userId to ObjectId
        amount,
        method,
        transactionId,
        status: "Completed",
      });
  
      await payment.save();
      res.status(201).json({ msg: "Payment successful", payment });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
module.exports = router;
