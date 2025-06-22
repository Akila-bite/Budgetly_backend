const { protect } = require("../middleware/authMiddleware");
const express = require("express");
const bcryptjs = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const generateToken = require("../jwt/generateToken");

const router = express.Router();

// @route   GET /api/users
// @desc    Get all users
// @access  Public
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const users = await User.find();
    res.json(users);
  })
);



// @route   GET /api/users/me
// @desc    Get current logged-in user's profile
// @access  Private
router.get(
  "/me",
  protect,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    res.status(200).json(user);
  })
);



// @route   GET /api/users/:id
// @desc    Get a specific user by ID
// @access  Private
router.get(
  "/:id",
  protect,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    res.json(user);
  })
);

// @route   POST /api/users/register
// @desc    Register a new user
// @access  Public
router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      res.status(400);
      throw new Error("Please provide all required fields");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400);
      throw new Error("User already exists");
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    const token = generateToken(savedUser._id);

    res.status(201).json({
      message: "User registered successfully!",
      token,
    });
  })
);

// @route   POST /api/users/login
// @desc    Authenticate user & get token
// @access  Public
router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error("Please enter both email and password");
    }

    const user = await User.findOne({ email });

    if (user && (await bcryptjs.compare(password, user.password))) {
      res.status(200).json({
        message: "Login successful",
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
        },
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error("Invalid email or password");
    }
  })
);

// @route   PUT /api/users/:id
// @desc    Update user info
// @access  Private
router.put(
  "/:id",
  protect,
  asyncHandler(async (req, res) => {
    if (req.user._id.toString() !== req.params.id) {
      res.status(401);
      throw new Error("You can only update your own profile");
    }

    const user = await User.findById(req.params.id);

    if (user) {
      user.username = req.body.username || user.username;
      user.email = req.body.email || user.email;

      const updatedUser = await user.save();

      res.status(200).json({
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  })
);






module.exports = router;