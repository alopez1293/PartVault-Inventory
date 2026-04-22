const express = require("express");
const router = express.Router();
const { requireAuth, requirePermission } = require("../auth/auth");

// Low Stock Report (GET /api/reports/low-stock) -> 200 (report.read)
router.get("/low-stock", requireAuth, requirePermission("report.read"), (req, res) => {
  res.status(200).json({
    success: true,
    message: "GET /api/reports/low-stock - Route working",
    data: [],
  });
});

// Open Checkouts Report (GET /api/reports/open-checkouts) -> 200 (report.read)
router.get("/open-checkouts", requireAuth, requirePermission("report.read"), (req, res) => {
  res.status(200).json({
    success: true,
    message: "GET /api/reports/open-checkouts - Route working",
    data: [],
  });
});

module.exports = router;
