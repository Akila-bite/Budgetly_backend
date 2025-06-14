const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  goalType: {
    type: String,
    enum: ["saving", "spending"],
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  targetAmount: {
    type: Number,
    required: true,
  },
  currentAmount: {
    type: Number,
    default: 0,
  },
  timeframe: {
    type: String,
    enum: ["short-term", "monthly", "quarterly", "yearly", "long-term"],
    required: true,
  },
  dueDate: {
    type: Date,
  },
  description: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Goal", goalSchema);
