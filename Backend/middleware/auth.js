const jwt = require("jsonwebtoken");
const User = require("../models/users");

const authMiddleware = async (req, res, next) => {
  try {
    const tokenFromCookie =
      req.cookies?.auth_token ||
      req.cookies?.token ||
      req.cookies?.["__Secure-token"] ||
      req.cookies?.["__Host-token"];

    const tokenFromHeader =
      req.headers.authorization && req.headers.authorization.split(" ")[1];

    const token = tokenFromCookie || tokenFromHeader;

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
