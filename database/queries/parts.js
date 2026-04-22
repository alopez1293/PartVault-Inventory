// database/queries/parts.js
const { pool } = require("../connection");

async function getAllParts(limit = 25) {
  const [rows] = await pool.query(
    "SELECT part_id, part_number, part_name, unit, reorder_point, is_active FROM parts ORDER BY part_id DESC LIMIT ?",
    [Number(limit)]
  );
  return rows;
}

module.exports = { getAllParts };
