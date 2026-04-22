// database/connection.js
const mysql = require("mysql2/promise");
const config = require("../config/config");

const pool = mysql.createPool({
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  database: config.db.name,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function testConnection() {
  const conn = await pool.getConnection();
  try {
    await conn.ping();
    console.log("✅ Successfully connected to MySQL (pool ping ok)");
    return true;
  } finally {
    conn.release();
  }
}

module.exports = { pool, testConnection };
