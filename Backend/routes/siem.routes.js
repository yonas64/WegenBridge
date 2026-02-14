const express = require("express");
//const detector = require("../services/impossibleTravelDetector");

const router = express.Router();

router.post("/logs", async (req, res) => {
  try {
    const result = await detector.ingest(req.body);
    res.status(202).json({
      message: "Logs accepted",
      ...result,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to process SIEM logs",
      error: error.message,
    });
  }
});

router.get("/alerts", (req, res) => {
  const limit = req.query.limit;
  const alerts = detector.getAlerts(limit);
  res.json({
    count: alerts.length,
    alerts,
  });
});

module.exports = router;
