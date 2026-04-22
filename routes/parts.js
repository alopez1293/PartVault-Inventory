const express = require("express");
const router = express.Router();
const { requireAuth, requirePermission } = require("../auth/auth");

// Create Part (POST /api/parts) -> 201 (part.add)
router.post("/", requireAuth, requirePermission("part.add"), (req, res) => {
  res.status(201).json({
    success: true,
    message: "POST /api/parts - Route working",
    note: "Stub: will insert part into DB later",
    received: req.body,
  });
});

// List Parts (GET /api/parts) -> 200
router.get("/", requireAuth, (req, res) => {
  res.status(200).json({
    success: true,
    message: "GET /api/parts - Route working",
    note: "Stub: will return parts list from DB later",
    data: [],
  });
});

// Get Part (GET /api/parts/:id) -> 200
router.get("/:id", requireAuth, (req, res) => {
  res.status(200).json({
    success: true,
    message: `GET /api/parts/${req.params.id} - Route working`,
    note: "Stub: will return part by ID later",
    data: { part_id: req.params.id },
  });
});

// Update Part (PATCH /api/parts/:id) -> 200 (part.edit)
router.patch("/:id", requireAuth, requirePermission("part.edit"), (req, res) => {
  res.status(200).json({
    success: true,
    message: `PATCH /api/parts/${req.params.id} - Route working`,
    note: "Stub: will update part fields later",
    received: req.body,
  });
});

// Delete/Deactivate Part (DELETE /api/parts/:id) -> 204 (part.delete)
router.delete("/:id", requireAuth, requirePermission("part.delete"), (req, res) => {
  res.sendStatus(204);
});

module.exports = router;
