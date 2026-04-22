const express = require("express");
const router = express.Router();

// Public pages
router.get("/", (req, res) => {
  res.render("pages/index", {
    title: "Home - PartVault Inventory",
    page: "home"
  });
});

router.get("/about", (req, res) => {
  res.render("pages/about", {
    title: "About - PartVault Inventory",
    page: "about"
  });
});

router.get("/login", (req, res) => {
  res.render("pages/auth/login", {
    title: "Login - PartVault Inventory",
    page: "login"
  });
});

router.get("/register", (req, res) => {
  res.render("pages/auth/register", {
    title: "Register - PartVault Inventory",
    page: "register"
  });
});

router.get("/reset-password", (req, res) => {
  res.render("pages/auth/reset-password", {
    title: "Reset Password - PartVault Inventory",
    page: "reset-password"
  });
});

router.get("/403", (req, res) => {
  res.status(403).render("pages/errors/403", {
    title: "403 Forbidden - PartVault Inventory",
    page: "403"
  });
});

router.get("/404", (req, res) => {
  res.status(404).render("pages/errors/404", {
    title: "404 Not Found - PartVault Inventory",
    page: "404"
  });
});

// User pages
router.get("/dashboard", (req, res) => {
  res.render("pages/user/dashboard", {
    title: "Dashboard - PartVault Inventory",
    page: "dashboard"
  });
});

router.get("/parts-list", (req, res) => {
  res.render("pages/user/parts-list", {
    title: "Parts List - PartVault Inventory",
    page: "parts-list"
  });
});

router.get("/checkouts", (req, res) => {
  res.render("pages/user/checkouts", {
    title: "Checkouts - PartVault Inventory",
    page: "checkouts"
  });
});

router.get("/checkouts/create", (req, res) => {
  res.render("pages/user/create-checkout", {
    title: "Create Checkout - PartVault Inventory",
    page: "create-checkout"
  });
});

router.get("/profile", (req, res) => {
  res.render("pages/user/profile", {
    title: "Profile - PartVault Inventory",
    page: "profile"
  });
});

router.get("/transactions-log", (req, res) => {
  res.render("pages/user/transactions-log", {
    title: "Transactions Log - PartVault Inventory",
    page: "transactions-log"
  });
});

router.get("/reports", (req, res) => {
  res.render("pages/user/reports", {
    title: "Reports - PartVault Inventory",
    page: "reports"
  });
});

// Admin pages
router.get("/admin/dashboard", (req, res) => {
  res.render("pages/admin/dashboard", {
    title: "Admin Dashboard - PartVault Inventory",
    page: "admin-dashboard"
  });
});

router.get("/admin/users", (req, res) => {
  res.render("pages/admin/users", {
    title: "User Management - PartVault Inventory",
    page: "admin-users"
  });
});

router.get("/admin/roles", (req, res) => {
  res.render("pages/admin/roles", {
    title: "Role Management - PartVault Inventory",
    page: "admin-roles"
  });
});

router.get("/admin/permissions", (req, res) => {
  res.render("pages/admin/permissions", {
    title: "Permission Assignment - PartVault Inventory",
    page: "admin-permissions"
  });
});

module.exports = router;
