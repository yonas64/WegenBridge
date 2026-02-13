const express = require("express");

const router = express.Router();

function normalizeIp(value, { allowLoopback = false } = {}) {
  if (!value) return null;
  const trimmed = String(value).trim();
  if (!trimmed || trimmed.toLowerCase() === "unknown") return null;
  const withoutMappedV4 = trimmed.startsWith("::ffff:") ? trimmed.slice(7) : trimmed;
  if (!allowLoopback) {
    if (withoutMappedV4 === "::1" || withoutMappedV4 === "127.0.0.1") return null;
    if (withoutMappedV4 === "0:0:0:0:0:0:0:1") return null;
  }
  return withoutMappedV4;
}

function extractClientIp(req) {
  const allowLoopback =
    String(process.env.TELEMETRY_ALLOW_LOOPBACK || "").toLowerCase() === "true" ||
    String(process.env.NODE_ENV || "").toLowerCase() !== "production";
  const headerCandidates = [
    req.headers["cf-connecting-ip"],
    req.headers["x-real-ip"],
    req.headers["x-forwarded-for"],
  ];

  for (const candidate of headerCandidates) {
    if (typeof candidate === "string" && candidate.length > 0) {
      const parts = candidate.split(",").map((part) => part.trim());
      for (const part of parts) {
        const normalized = normalizeIp(part, { allowLoopback });
        if (normalized) return normalized;
      }
    } else if (Array.isArray(candidate) && candidate.length > 0) {
      for (const part of candidate) {
        const normalized = normalizeIp(part, { allowLoopback });
        if (normalized) return normalized;
      }
    }
  }

  return (
    normalizeIp(req.ip, { allowLoopback }) ||
    normalizeIp(req.socket?.remoteAddress, { allowLoopback }) ||
    normalizeIp(req.connection?.remoteAddress, { allowLoopback }) ||
    null
  );
}

router.get("/ip", (req, res) => {
  const ip = extractClientIp(req);
  res.json({ ip });
});

module.exports = router;
