const jwt = require("jsonwebtoken");

// Secret key for JWT (use environment variable in production)
const JWT_SECRET = process.env.JWT_SECRET;
module.exports = function (req, res, next) {
  // Get token from header
  const authHeader = req.headers["Authorization"];
  if (!authHeader) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  const token = authHeader.split(" ")[1]; // Bearer <token>
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // attach user info to request
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};
