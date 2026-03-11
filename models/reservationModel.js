const db = require('../config/database');

async function findAll() {
  const [rows] = await db.execute(
    `SELECT id, user_id, name, phone, number_of_people, reservation_date, reservation_time, note, status, created_at
     FROM reservations
     ORDER BY reservation_date ASC, reservation_time ASC`
  );

  return rows;
}

async function findById(id) {
  const [rows] = await db.execute(
    `SELECT id, user_id, name, phone, number_of_people, reservation_date, reservation_time, note, status, created_at
     FROM reservations
     WHERE id = ?
     LIMIT 1`,
    [id]
  );

  return rows[0] || null;
}

async function updateStatus(id, status) {
  const [result] = await db.execute(
    `UPDATE reservations
     SET status = ?
     WHERE id = ?`,
    [status, id]
  );

  return result;
}

module.exports = {
  findAll,
  findById,
  updateStatus,
};