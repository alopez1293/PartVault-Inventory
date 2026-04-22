require("dotenv").config();
const fs = require("fs/promises");
const path = require("path");
const mysql = require("mysql2/promise");
const config = require("../config/config");

async function initializeDatabase() {
  // Connect WITHOUT selecting a database first
  const connection = await mysql.createConnection({
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
    multipleStatements: true,
  });

  try {
    const schemaPath = path.join(__dirname, "schema.sql");
    const sql = await fs.readFile(schemaPath, "utf8");

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${config.db.name}\`;`);
    await connection.query(`USE \`${config.db.name}\`;`);

    await connection.query(sql);

    console.log("✅ Database schema initialized successfully");
  } catch (err) {
    console.error("❌ Error initializing database schema:", err.message);
    process.exitCode = 1;
  } finally {
    await connection.end();
  }
}

initializeDatabase();
