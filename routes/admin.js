const express = require("express");
const router = express.Router();
const { requireAuth, requirePermission } = require("../auth/auth");

// Admin List Users (GET /api/admin/users) -> 200 (user.changerole)
router.get("/users", requireAuth, requirePermission("admin.users.read"), (req, res) => {
  res.status(200).json({
    success: true,
    message: "GET /api/admin/users - Route working",
    note: "Stub: will return paged users list later",
    data: [],
  });
});

// Admin Get User (GET /api/admin/users/:id) -> 200 (Admin)
router.get("/users/:id", requireAuth, requirePermission("admin.users.read"), (req, res) => {
  res.status(200).json({
    success: true,
    message: `GET /api/admin/users/${req.params.id} - Route working`,
    note: "Stub: will return user + roles later",
    data: { user_id: req.params.id, roles: [] },
  });
});

// Admin Change User Role (PATCH /api/admin/users/:id/role) -> 200 (user.changerole)
router.patch("/users/:id/role", requireAuth, requirePermission("admin.users.update"), (req, res) => {
  res.status(200).json({
    success: true,
    message: `PATCH /api/admin/users/${req.params.id}/role - Route working`,
    note: "Stub: will assign roles later",
    received: req.body,
  });
});

// Admin Deactivate User (PATCH /api/admin/users/:id/deactivate) -> 200 (Admin)
router.patch("/users/:id/deactivate", requireAuth, requirePermission("admin.users.update"), (req, res) => {
  res.status(200).json({
    success: true,
    message: `PATCH /api/admin/users/${req.params.id}/deactivate - Route working`,
    note: "Stub: will set is_active=false later",
    received: req.body,
  });
});

// Admin List Roles (GET /api/admin/roles) -> 200 (role.read)
router.get("/roles", requireAuth, requirePermission("role.read"), (req, res) => {
  res.status(200).json({
    success: true,
    message: "GET /api/admin/roles - Route working",
    data: [],
  });
});

// Admin Create Role (POST /api/admin/roles) -> 201 (role.add)
router.post("/roles", requireAuth, requirePermission("role.add"), (req, res) => {
  res.status(201).json({
    success: true,
    message: "POST /api/admin/roles - Route working",
    received: req.body,
  });
});

// Admin Update Role (PATCH /api/admin/roles/:id) -> 200 (role.edit)
router.patch("/roles/:id", requireAuth, requirePermission("role.edit"), (req, res) => {
  res.status(200).json({
    success: true,
    message: `PATCH /api/admin/roles/${req.params.id} - Route working`,
    received: req.body,
  });
});

// Admin Delete Role (DELETE /api/admin/roles/:id) -> 204 (role.delete)
router.delete("/roles/:id", requireAuth, requirePermission("role.delete"), (req, res) => {
  res.sendStatus(204);
});

// Admin List Permissions (GET /api/admin/permissions) -> 200 (role.read)
router.get("/permissions", requireAuth, requirePermission("role.read"), (req, res) => {
  res.status(200).json({
    success: true,
    message: "GET /api/admin/permissions - Route working",
    data: [],
  });
});

// Admin Replace Role Permissions (PUT /api/admin/roles/:id/permissions) -> 200 (role.edit)
router.put("/roles/:id/permissions", requireAuth, requirePermission("role.edit"), (req, res) => {
  res.status(200).json({
    success: true,
    message: `PUT /api/admin/roles/${req.params.id}/permissions - Route working`,
    received: req.body,
  });
});

module.exports = router;
