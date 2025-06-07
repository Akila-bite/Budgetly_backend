const express = require("express");
const asyncHandler = require("express-async-handler");
const Transaction = require("../models/Transaction");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// CREATE: Add a new transaction
// POST /api/transaction
router.post(
  "/",
  protect,
  asyncHandler(async (req, res) => {
    const { amount, type, category, description, date } = req.body;

    if (!amount || !type || !category) {
      res.status(400);
      throw new Error("Amount, type, and category are required");
    }

    const transaction = await Transaction.create({
      user: req.user._id,
      amount,
      type,
      category,
      description,
      date,
    });

    res.status(201).json(transaction);
  })
);

// READ: Get all transactions for the logged-in user
// GET /api/transaction
router.get(
  "/",
  protect,
  asyncHandler(async (req, res) => {
    const transactions = await Transaction.find({ user: req.user._id }).sort({ date: -1 });
    res.status(200).json(transactions);
  })
);

// READ: Get a specific transaction by ID
// GET /api/transaction/:id
router.get(
  "/:id",
  protect,
  asyncHandler(async (req, res) => {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      res.status(404);
      throw new Error("Transaction not found");
    }

    if (transaction.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Not authorized to view this transaction");
    }

    res.status(200).json(transaction);
  })
);

// UPDATE: Update a transaction
// PUT /api/transaction/:id
router.put(
  "/:id",
  protect,
  asyncHandler(async (req, res) => {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      res.status(404);
      throw new Error("Transaction not found");
    }

    if (transaction.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Not authorized to update this transaction");
    }

    const { amount, type, category, description, date } = req.body;

    transaction.amount = amount ?? transaction.amount;
    transaction.type = type ?? transaction.type;
    transaction.category = category ?? transaction.category;
    transaction.description = description ?? transaction.description;
    transaction.date = date ?? transaction.date;

    const updated = await transaction.save();
    res.status(200).json(updated);
  })
);

// DELETE: Delete a transaction
// DELETE /api/transaction/:id
router.delete(
  "/:id",
  protect,
  asyncHandler(async (req, res) => {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      res.status(404);
      throw new Error("Transaction not found");
    }

    if (transaction.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Not authorized to delete this transaction");
    }

    await transaction.remove();
    res.status(200).json({ message: "Transaction deleted" });
  })
);

module.exports = router;
