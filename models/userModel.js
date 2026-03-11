const db = require('../config/database');

async function findByEmail(email) {
  const [rows] = await db.execute(
    `SELECT id, email, password_hash, fname, lname, phone, role, created_at, updated_at
     FROM users
     WHERE email = ?
     LIMIT 1`,
    [email]
  );

  return rows[0] || null;
}

async function findById(id) {
  const [rows] = await db.execute(
    `SELECT id, email, fname, lname, phone, role, created_at, updated_at
     FROM users
     WHERE id = ?
     LIMIT 1`,
    [id]
  );

  return rows[0] || null;
}

async function createUser({ email, passwordHash, fname, lname, phone, role = 'client' }) {
  const [result] = await db.execute(
    `INSERT INTO users (email, password_hash, fname, lname, phone, role)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [email, passwordHash, fname, lname, phone, role]
  );

  return findById(result.insertId);
}

module.exports = {
  findByEmail,
  findById,
  createUser,
};
