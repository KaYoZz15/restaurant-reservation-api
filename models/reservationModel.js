const db = require('../config/database');

function isPositiveInteger(value) {
  return Number.isInteger(value) && value > 0;
}

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

async function findAvailableTablesForSlot(connection, reservationDate, reservationTime, excludedReservationId = null) {
  const executor = connection || db;

  const conflictConditions = [
    'r.reservation_date = ?',
    'r.reservation_time = ?',
    "r.status IN ('pending', 'confirmed')"
  ];

  const queryParams = [reservationDate, reservationTime];

  if (isPositiveInteger(excludedReservationId)) {
    conflictConditions.push('r.id <> ?');
    queryParams.push(excludedReservationId);
  }

  const sql = `
    SELECT rt.id, rt.table_number, rt.seats
    FROM restaurant_tables rt
    WHERE rt.is_active = TRUE
      AND NOT EXISTS (
        SELECT 1
        FROM reservation_tables rtb
        INNER JOIN reservations r ON r.id = rtb.reservation_id
        WHERE rtb.table_id = rt.id
          AND ${conflictConditions.join('\n          AND ')}
      )
    ORDER BY rt.seats ASC, rt.id ASC
    ${connection ? 'FOR UPDATE' : ''}
  `;

  const [rows] = await executor.query(sql, queryParams);

  return rows;
}

async function getReservationsForSlot(date, time) {
  const [rows] = await db.execute(
    `
      SELECT id, number_of_people, status
      FROM reservations
      WHERE reservation_date = ?
        AND reservation_time = ?
        AND status IN ('pending', 'confirmed')
    `,
    [date, time]
  );

  return rows;
}

function getTotalSeats(tables) {
  return tables.reduce((total, table) => total + table.seats, 0);
}

function chooseBestTableCombination(availableTables, requestedPeople) {
  const tables = [...availableTables].sort((a, b) => a.seats - b.seats || a.id - b.id);
  let best = null;

  function isBetterCandidate(candidate) {
    if (!best) {
      return true;
    }

    if (candidate.totalSeats !== best.totalSeats) {
      return candidate.totalSeats < best.totalSeats;
    }

    if (candidate.tables.length !== best.tables.length) {
      return candidate.tables.length < best.tables.length;
    }

    const candidateKey = candidate.tables.map((table) => table.id).join(',');
    const bestKey = best.tables.map((table) => table.id).join(',');
    return candidateKey < bestKey;
  }

  function backtrack(startIndex, selectedTables, selectedSeats) {
    if (selectedSeats >= requestedPeople) {
      const candidate = {
        tables: [...selectedTables],
        totalSeats: selectedSeats
      };

      if (isBetterCandidate(candidate)) {
        best = candidate;
      }

      return;
    }

    if (startIndex >= tables.length) {
      return;
    }

    let remainingSeats = 0;
    for (let index = startIndex; index < tables.length; index += 1) {
      remainingSeats += tables[index].seats;
    }

    if (selectedSeats + remainingSeats < requestedPeople) {
      return;
    }

    for (let index = startIndex; index < tables.length; index += 1) {
      selectedTables.push(tables[index]);
      backtrack(index + 1, selectedTables, selectedSeats + tables[index].seats);
      selectedTables.pop();
    }
  }

  backtrack(0, [], 0);

  return best ? best.tables : null;
}

async function createReservation(connection, reservationData) {
  const {
    userId,
    name,
    phone,
    numberOfPeople,
    reservationDate,
    reservationTime,
    note
  } = reservationData;

  const [result] = await connection.query(
    `
      INSERT INTO reservations (
        user_id,
        name,
        phone,
        number_of_people,
        reservation_date,
        reservation_time,
        note,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')
    `,
    [userId, name, phone, numberOfPeople, reservationDate, reservationTime, note || null]
  );

  return result.insertId;
}

async function assignTablesToReservation(connection, reservationId, tableIds) {
  if (!tableIds || tableIds.length === 0) {
    return;
  }

  const values = tableIds.map((tableId) => [reservationId, tableId]);
  await connection.query(
    'INSERT INTO reservation_tables (reservation_id, table_id) VALUES ?',
    [values]
  );
}

async function clearTablesForReservation(connection, reservationId) {
  await connection.query(
    'DELETE FROM reservation_tables WHERE reservation_id = ?',
    [reservationId]
  );
}

async function getReservationByIdAndUser(connection, reservationId, userId, lockForUpdate = false) {
  const [rows] = await connection.query(
    `
      SELECT
        id,
        user_id,
        name,
        phone,
        number_of_people,
        reservation_date,
        reservation_time,
        note,
        status,
        created_at
      FROM reservations
      WHERE id = ? AND user_id = ?
      LIMIT 1
      ${lockForUpdate ? 'FOR UPDATE' : ''}
    `,
    [reservationId, userId]
  );

  return rows[0] || null;
}

async function updateReservation(connection, reservationId, reservationData) {
  const {
    name,
    phone,
    numberOfPeople,
    reservationDate,
    reservationTime,
    note
  } = reservationData;

  await connection.query(
    `
      UPDATE reservations
      SET
        name = ?,
        phone = ?,
        number_of_people = ?,
        reservation_date = ?,
        reservation_time = ?,
        note = ?
      WHERE id = ?
    `,
    [name, phone, numberOfPeople, reservationDate, reservationTime, note || null, reservationId]
  );
}

async function cancelReservation(connection, reservationId) {
  await connection.query(
    `
      UPDATE reservations
      SET status = 'cancelled'
      WHERE id = ?
    `,
    [reservationId]
  );
}

async function getReservationsByUserId(userId) {
  const [reservations] = await db.query(
    `
      SELECT
        id,
        user_id,
        name,
        phone,
        number_of_people,
        reservation_date,
        reservation_time,
        note,
        status,
        created_at
      FROM reservations
      WHERE user_id = ?
      ORDER BY reservation_date DESC, reservation_time DESC, created_at DESC
    `,
    [userId]
  );

  if (reservations.length === 0) {
    return [];
  }

  const reservationIds = reservations.map((reservation) => reservation.id);
  const [tableLinks] = await db.query(
    `
      SELECT
        rtb.reservation_id,
        rt.id,
        rt.table_number,
        rt.seats
      FROM reservation_tables rtb
      INNER JOIN restaurant_tables rt ON rt.id = rtb.table_id
      WHERE rtb.reservation_id IN (?)
      ORDER BY rt.table_number ASC
    `,
    [reservationIds]
  );

  const tablesByReservationId = new Map();

  for (const link of tableLinks) {
    if (!tablesByReservationId.has(link.reservation_id)) {
      tablesByReservationId.set(link.reservation_id, []);
    }

    tablesByReservationId.get(link.reservation_id).push({
      id: link.id,
      table_number: link.table_number,
      seats: link.seats
    });
  }

  return reservations.map((reservation) => ({
    ...reservation,
    tables: tablesByReservationId.get(reservation.id) || []
  }));
}

module.exports = {
  isPositiveInteger,
  findAll,
  findById,
  getReservationsForSlot,
  updateStatus,
  findAvailableTablesForSlot,
  getTotalSeats,
  chooseBestTableCombination,
  createReservation,
  assignTablesToReservation,
  clearTablesForReservation,
  getReservationByIdAndUser,
  updateReservation,
  cancelReservation,
  getReservationsByUserId
};
