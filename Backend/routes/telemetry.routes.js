const express = require("express");

const router = express.Router();

function extractClientIp(req) {
  const forwardedFor = req.headers["x-forwarded-for"];
  if (typeof forwardedFor === "string" && forwardedFor.length > 0) {
    return forwardedFor.split(",")[0].trim();
  }
  if (Array.isArray(forwardedFor) && forwardedFor.length > 0) {
    return String(forwardedFor[0]).trim();
  }
  return req.ip || req.connection?.remoteAddress || null;
}

router.get("/ip", (req, res) => {
  const ip = extractClientIp(req);
  res.json({ ip });
});

module.exports = router;
