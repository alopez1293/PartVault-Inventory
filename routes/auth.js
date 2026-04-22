const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const { requireAuth, addTokenToDenylist } = require("../auth/auth");
const {
  findUserByEmail,
  findUserByUsername,
  createUser,
  findUserByLogin,
  getUserRoles,
} = require("../database/queries/users");

const router = express.Router();

// Register (POST /api/auth/register) -> 201
router.post("/register", async (req, res) => {
  try {
    let { username, email, password } = req.body;

    username = typeof username === "string" ? username.trim() : "";
    email = typeof email === "string" ? email.trim().toLowerCase() : "";
    password = typeof password === "string" ? password : "";

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        error: "Username, email, and password are required",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: "Valid email is required",
      });
    }

    // Simple password policy:
    // at least 8 chars, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        error:
          "Password must be at least 8 characters and include uppercase, lowercase, and a number",
      });
    }

    const existingEmail = await findUserByEmail(email);
    if (existingEmail) {
      return res.status(409).json({
        success: false,
        error: "Email already in use",
      });
    }

    const existingUsername = await findUserByUsername(username);
    if (existingUsername) {
      return res.status(409).json({
        success: false,
        error: "Username already in use",
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const newUser = await createUser({
      username,
      email,
      passwordHash,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: newUser,
    });
  } catch (err) {
    console.error("Register error:", err.message);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

// Login (POST /api/auth/login) -> 200
router.post("/login", async (req, res) => {
  try {
    let { login, password } = req.body;

    login = typeof login === "string" ? login.trim() : "";
    password = typeof password === "string" ? password : "";

    if (!login || !password) {
      return res.status(400).json({
        success: false,
        error: "Login and password are required",
      });
    }

    const user = await findUserByLogin(login);

    if (!user || !user.is_active) {
      console.warn(`Failed login attempt for: ${login}`);
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      console.warn(`Failed login attempt for: ${login}`);
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    const roles = await getUserRoles(user.user_id);

    const token = jwt.sign(
      {
        sub: user.user_id,
        username: user.username,
        email: user.email,
      },
      config.auth.jwtSecret,
      {
        expiresIn: config.auth.jwtExpiresIn,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        token_type: "Bearer",
        expires_in: config.auth.jwtExpiresIn,
        user: {
          user_id: user.user_id,
          username: user.username,
          email: user.email,
          roles,
        },
      },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

// Logout (POST /api/auth/logout) -> 200 (auth required)
router.post("/logout", requireAuth, (req, res) => {
  addTokenToDenylist(req.token);

  return res.status(200).json({
    success: true,
    message: "Logout successful",
  });
});

// Password Reset Request (POST /api/auth/password-reset/request) -> 200
router.post("/password-reset/request", (req, res) => {
  res.status(200).json({
    success: true,
    message: "POST /api/auth/password-reset/request - Route working",
    note: "Stub: will send reset link/code later",
    received: req.body,
  });
});

// Password Reset Confirm (POST /api/auth/password-reset/confirm) -> 200
router.post("/password-reset/confirm", (req, res) => {
  res.status(200).json({
    success: true,
    message: "POST /api/auth/password-reset/confirm - Route working",
    note: "Stub: will verify token + set password later",
    received: req.body,
  });
});

// Current User (GET /api/auth/me) -> 200 (auth required)
router.get("/me", requireAuth, async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Authenticated user retrieved successfully",
    data: req.user,
  });
});

module.exports = router;