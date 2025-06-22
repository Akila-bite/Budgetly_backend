const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");

// Middleware to protect routes and verify JWT token
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract token from "Bearer <token>"
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user info to request object (excluding password)
      req.user = await User.findById(decoded.id).select("-password");

      return next(); // Exit middleware if everything is valid
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  // If no token is found
  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

module.exports = { protect };
