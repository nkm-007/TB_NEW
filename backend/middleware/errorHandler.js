// backend/middleware/errorHandler.js
// Create this file to handle JWT and other errors gracefully

export const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  // JWT Errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      msg: "Invalid token. Please login again.",
      error: "INVALID_TOKEN",
      requiresLogin: true,
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      msg: "Token expired. Please login again.",
      error: "TOKEN_EXPIRED",
      requiresLogin: true,
    });
  }

  // Mongoose Validation Errors
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      msg: "Validation failed",
      errors,
    });
  }

  // Mongoose Duplicate Key Error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json({
      msg: `${field} already exists`,
    });
  }

  // Default Error
  res.status(500).json({
    msg: err.message || "Server error",
  });
};

// JWT Verification Middleware
export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      msg: "No token provided. Please login.",
      requiresLogin: true,
    });
  }

  try {
    const jwt = require("jsonwebtoken");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({
        msg: "Invalid token. Please login again.",
        error: "INVALID_TOKEN",
        requiresLogin: true,
      });
    }
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        msg: "Token expired. Please login again.",
        error: "TOKEN_EXPIRED",
        requiresLogin: true,
      });
    }
    return res.status(500).json({ msg: "Token verification failed" });
  }
};
