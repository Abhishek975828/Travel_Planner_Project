const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protects routes: verifies JWT and attaches the logged-in user to req.user
const protect = async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    try {
      token = authHeader.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user (without password) to the request object
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized, invalid token" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

module.exports = { protect };
