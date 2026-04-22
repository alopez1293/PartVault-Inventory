// server.js
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const config = require("./config/config");
const { testConnection } = require("./database/connection");

// Route imports
const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/users");
const partsRoutes = require("./routes/parts");
const checkoutsRoutes = require("./routes/checkouts");
const adminRoutes = require("./routes/admin");
const locationsRoutes = require("./routes/locations");
const reportsRoutes = require("./routes/reports");
const inventoryTxRoutes = require("./routes/inventoryTransactions");
const pageRoutes = require("./routes/pages");


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(expressLayouts);
app.set("layout", "layouts/main");

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Simple health check
app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "API is running" });
});

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/parts", partsRoutes);
app.use("/api/checkouts", checkoutsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", locationsRoutes); // handles /api/locations and /api/bins style routes
app.use("/api/reports", reportsRoutes);
app.use("/api/inventory-transactions", inventoryTxRoutes);
app.use("/", pageRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
    path: req.originalUrl,
  });
});

// 500 handler
app.use((err, req, res, next) => {
  console.error(err.stack || err);
  res.status(500).json({
    success: false,
    error: "Internal server error",
  });
});

(async () => {
  
  // Show DB connection status on startup
  try {
    await testConnection();
  } catch (e) {
    console.log("⚠️ DB ping failed on startup (server will still run).");
  }

  app.listen(config.server.port, () => {
    console.log(`✅ Server running on http://localhost:${config.server.port}`);
  });
})();
