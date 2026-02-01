// const jwt = require("jsonwebtoken");

// const JWT_SECRET = process.env.JWT_SECRET;

// module.exports = function authMiddleware(req, res, next) {
//   try {
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res.status(401).json({
//         success: false,
//         message: "No token provided",
//       });
//     }

//     // Extract token from "Bearer <token>"
//     const token = authHeader.split(" ")[1];

//     // Verify token
//     const decoded = jwt.verify(token, JWT_SECRET);

//     // Attach decoded info to request
//     req.user = decoded;

//     next();
//   } catch (error) {
//     console.error("JWT Error:", error.message);
//     return res.status(401).json({
//       success: false,
//       message: "Token is invalid or expired",
//     });
//   }
// };



const jwt = require("jsonwebtoken");
const User = require("../models/users");
//const logger = require("../utils/logger");

const authMiddleware = async (req, res, next) => {
  try {
    const token =
      req.cookies.token ||
      (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    req.user = user;
    next();

  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;


