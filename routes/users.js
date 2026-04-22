const express = require("express");
const router = express.Router();

router.get("/ping", (req, res) => {
  // Send a JSON response with HTTP status 200 (OK)
  res.status(200).json({ success: true, message: "GET /api/users/ping - working" });
});

module.exports = router;
