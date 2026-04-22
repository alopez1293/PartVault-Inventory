const express = require("express");
const router = express.Router();
const { requireAuth } = require("../auth/auth");

// List Locations (GET /api/locations) -> 200
router.get("/locations", requireAuth, (req, res) => {
  res.status(200).json({
    success: true,
    message: "GET /api/locations - Route working",
    data: [],
  });
});

// List Bins (GET /api/bins) -> 200
router.get("/bins", requireAuth, (req, res) => {
  res.status(200).json({
    success: true,
    message: "GET /api/bins - Route working",
    data: [],
  });
});

module.exports = router;
