const db = require('../config/database');

function getDayOfWeekFromDate(dateString) {
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCDay(); // 0 = dimanche, 1 = lundi...
}

async function isDateClosed(date) {
  const [rows] = await db.execute(
    `
      SELECT id, exception_date, is_closed, reason
      FROM opening_exceptions
      WHERE exception_date = ? AND is_closed = TRUE
      LIMIT 1
    `,
    [date]
  );

  return rows[0] || null;
}

async function getBaseSlotsForDate(date) {
  const dayOfWeek = getDayOfWeekFromDate(date);

  const [rows] = await db.execute(
    `
      SELECT slot_time
      FROM opening_slots
      WHERE day_of_week = ? AND is_active = TRUE
      ORDER BY slot_time ASC
    `,
    [dayOfWeek]
  );

  return rows.map((row) => row.slot_time);
}

async function getExceptionalSlotsForDate(date) {
  const [rows] = await db.execute(
    `
      SELECT slot_time
      FROM opening_slot_exceptions
      WHERE exception_date = ? AND is_active = TRUE
      ORDER BY slot_time ASC
    `,
    [date]
  );

  return rows.map((row) => row.slot_time);
}

function normalizeMysqlTime(value) {
  if (typeof value !== 'string') {
    return value;
  }

  return value.length === 8 ? value : `${value}:00`;
}

async function getOpenSlotsForDate(date) {
  const closed = await isDateClosed(date);
  if (closed) {
    return {
      isClosed: true,
      reason: closed.reason || null,
      slots: []
    };
  }

  const baseSlots = await getBaseSlotsForDate(date);
  const exceptionalSlots = await getExceptionalSlotsForDate(date);

  const merged = [...baseSlots, ...exceptionalSlots]
    .map(normalizeMysqlTime);

  const uniqueSorted = [...new Set(merged)].sort();

  return {
    isClosed: false,
    reason: null,
    slots: uniqueSorted
  };
}

module.exports = {
  getOpenSlotsForDate,
  isDateClosed
};