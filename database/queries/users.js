const { pool } = require("../connection");

async function getAllUsers(limit = 25) {
  const [rows] = await pool.query(
    "SELECT user_id, username, email, is_active FROM users ORDER BY user_id ASC LIMIT ?",
    [Number(limit)]
  );
  return rows;
}

async function getUserById(userId) {
  const [rows] = await pool.query(
    "SELECT user_id, username, email, is_active FROM users WHERE user_id = ?",
    [userId]
  );
  return rows[0] || null;
}

async function findUserByEmail(email) {
  const [rows] = await pool.query(
    "SELECT user_id, username, email, password_hash, is_active FROM users WHERE email = ?",
    [email]
  );
  return rows[0] || null;
}

async function findUserByUsername(username) {
  const [rows] = await pool.query(
    "SELECT user_id, username, email, password_hash, is_active FROM users WHERE username = ?",
    [username]
  );
  return rows[0] || null;
}

async function createUser({ username, email, passwordHash }) {
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    const [result] = await conn.query(
      `INSERT INTO users (username, email, password_hash, is_active)
       VALUES (?, ?, ?, TRUE)`,
      [username, email, passwordHash]
    );

    const userId = result.insertId;

    const [roleRows] = await conn.query(
      "SELECT role_id FROM roles WHERE role_name = ? LIMIT 1",
      ["user"]
    );

    if (roleRows.length === 0) {
      throw new Error("Default role 'user' not found");
    }

    const roleId = roleRows[0].role_id;

    await conn.query(
      "INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)",
      [userId, roleId]
    );

    await conn.commit();

    return {
      user_id: userId,
      username,
      email,
      is_active: true,
    };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

async function findUserByLogin(login) {
  const [rows] = await pool.query(
    `SELECT user_id, username, email, password_hash, is_active
     FROM users
     WHERE email = ? OR username = ?
     LIMIT 1`,
    [login, login]
  );
  return rows[0] || null;
}

async function getUserRoles(userId) {
  const [rows] = await pool.query(
    `SELECT r.role_name
     FROM user_roles ur
     INNER JOIN roles r ON ur.role_id = r.role_id
     WHERE ur.user_id = ?`,
    [userId]
  );
  return rows.map((row) => row.role_name);
}

async function getUserPermissions(userId) {
  const [rows] = await pool.query(
    `SELECT DISTINCT p.permission_name
     FROM user_roles ur
     INNER JOIN role_permissions rp ON ur.role_id = rp.role_id
     INNER JOIN permissions p ON rp.permission_id = p.permission_id
     WHERE ur.user_id = ?`,
    [userId]
  );

  return rows.map((row) => row.permission_name);
}

module.exports = {
  getAllUsers,
  getUserById,
  findUserByEmail,
  findUserByUsername,
  createUser,
  findUserByLogin,
  getUserRoles,
  getUserPermissions,
};