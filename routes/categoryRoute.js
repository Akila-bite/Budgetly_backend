const express = require("express");
const router = express.Router();
const Category = require("../models/Category");

// @route   POST /api/categories
// @desc    Create a new category
// @access  Private
router.post("/", async (req, res) => {
  try {
    const { name, type } = req.body;

    // Get the logged-in user's ID from req.user (set by your auth middleware)
    const userId = req.user.id;

    const existing = await Category.findOne({ name, user: userId });
    if (existing) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const newCategory = await Category.create({ name, type, user: userId });
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   GET /api/categories
// @desc    Get all categories for the logged-in user
// @access  Private
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find({ user: req.user.id });
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   DELETE /api/categories/:id
// @desc    Delete a category
// @access  Private
router.delete("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Check if the category belongs to the logged-in user
    if (category.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await category.deleteOne();
    res.status(200).json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

