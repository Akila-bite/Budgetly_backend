const express = require("express");
const router = express.Router();
const Goal = require("../models/Goal");

// Create a new goal
router.post("/", async (req, res) => {
  try {
    const { title, goalType, category, targetAmount, timeframe, dueDate, description } = req.body;
    const user = req.user.id;

    const goal = await Goal.create({
      user,
      title,
      goalType,
      category,
      targetAmount,
      timeframe,
      dueDate,
      description,
    });

    res.status(201).json(goal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all goals for the user
router.get("/", async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user.id });
    res.status(200).json(goals);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a goal
router.put("/:id", async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal || goal.user.toString() !== req.user.id) {
      return res.status(404).json({ message: "Goal not found or unauthorized" });
    }

    const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedGoal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a goal
router.delete("/:id", async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal || goal.user.toString() !== req.user.id) {
      return res.status(404).json({ message: "Goal not found or unauthorized" });
    }

    await goal.deleteOne();
    res.status(200).json({ message: "Goal deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
