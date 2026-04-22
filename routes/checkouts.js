const express = require("express");
const router = express.Router();
const { requireAuth, requirePermission } = require("../auth/auth");

// Create Checkout Request (POST /api/checkouts) -> 201 (checkout.add)
router.post("/", requireAuth, requirePermission("checkout.add"), (req, res) => {
  res.status(201).json({
    success: true,
    message: "POST /api/checkouts - Route working",
    note: "Stub: will create checkout + items later",
    received: req.body,
  });
});

// List Checkouts (GET /api/checkouts) -> 200 (checkout.read.own)
router.get("/", requireAuth, requirePermission("checkout.read.own"), (req, res) => {
  res.status(200).json({
    success: true,
    message: "GET /api/checkouts - Route working",
    note: "Stub: requester sees own checkouts later",
    data: [],
  });
});

// Get Checkout Details (GET /api/checkouts/:id) -> 200 (Owner OR checkout.read.all)
router.get("/:id", requireAuth, (req, res) => {
  res.status(200).json({
    success: true,
    message: `GET /api/checkouts/${req.params.id} - Route working`,
    note: "Stub: will enforce Owner OR checkout.read.all later",
    data: { checkout_id: req.params.id, items: [] },
  });
});

// Update Checkout Request (PATCH /api/checkouts/:id) -> 200 (Owner or Admin)
router.patch("/:id", requireAuth, (req, res) => {
  res.status(200).json({
    success: true,
    message: `PATCH /api/checkouts/${req.params.id} - Route working`,
    note: "Stub: will enforce not fulfilled/closed + Owner/Admin later",
    received: req.body,
  });
});

// Cancel Checkout Request (DELETE /api/checkouts/:id) -> 204 (Owner or Admin)
router.delete("/:id", requireAuth, (req, res) => {
  res.sendStatus(204);
});

// Fulfill Checkout (POST /api/checkouts/:id/fulfill) -> 200 (checkout.fulfill)
router.post("/:id/fulfill", requireAuth, requirePermission("checkout.fulfill"), (req, res) => {
  res.status(200).json({
    success: true,
    message: `POST /api/checkouts/${req.params.id}/fulfill - Route working`,
    note: "Stub: will issue parts + decrease inventory later",
    received: req.body,
  });
});

// Return Checkout Items (POST /api/checkouts/:id/return) -> 200 (checkout.return)
router.post("/:id/return", requireAuth, requirePermission("checkout.return"), (req, res) => {
  res.status(200).json({
    success: true,
    message: `POST /api/checkouts/${req.params.id}/return - Route working`,
    note: "Stub: will process returns + increase inventory later",
    received: req.body,
  });
});

module.exports = router;
