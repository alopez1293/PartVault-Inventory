const jwt = require("jsonwebtoken");
const config = require("../config/config");
const { getUserById, getUserPermissions } = require("../database/queries/users");

const tokenDenylist = new Set();

function addTokenToDenylist(token) {
  tokenDenylist.add(token);
}

function isTokenDenylisted(token) {
  return tokenDenylist.has(token);
}

function extractBearerToken(req) {
  const authHeader = req.headers.authorization;

  if (!authHeader) return null;

  const parts = authHeader.split(" ");
  if (parts.length !== 2) return null;

  const [scheme, token] = parts;

  if (scheme !== "Bearer" || !token) return null;

  return token;
}

async function requireAuth(req, res, next) {
  try {
    const token = extractBearerToken(req);

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Authentication required",
      });
    }

    if (isTokenDenylisted(token)) {
      return res.status(401).json({
        success: false,
        error: "Authentication required",
      });
    }

    const payload = jwt.verify(token, config.auth.jwtSecret);

    const user = await getUserById(payload.sub);

    if (!user || !user.is_active) {
      return res.status(401).json({
        success: false,
        error: "Authentication required",
      });
    }

    req.token = token;
    req.auth = payload;
    req.user = user;

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: "Authentication required",
    });
  }
}

function requirePermission(permission) {
  return async (req, res, next) => {
    try {
      if (!req.user || !req.user.user_id) {
        return res.status(401).json({
          success: false,
          error: "Authentication required",
        });
      }

      const permissions = await getUserPermissions(req.user.user_id);

      req.user.permissions = permissions;

      if (!permissions.includes(permission)) {
        return res.status(403).json({
          success: false,
          error: "Insufficient permissions",
        });
      }

      next();
    } catch (err) {
      console.error("Permission check error:", err.message);
      return res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  };
}

module.exports = {
  requireAuth,
  requirePermission,
  addTokenToDenylist,
  isTokenDenylisted,
};