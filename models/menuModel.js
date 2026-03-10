const db = require('../config/database');

async function getAllMenuItems() {
  const [rows] = await db.query(`
    SELECT id, name, description, price, category, image, is_available, created_at
    FROM menu_items
    WHERE is_available = TRUE
    ORDER BY category ASC, name ASC
  `);

  return rows;
}

module.exports = {
  getAllMenuItems
};