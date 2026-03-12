const db = require('../config/database');
const availabilityModel = require('../models/availabilityModel');
const reservationModel = require('../models/reservationModel');

function isValidDate(value) {
  if (typeof value !== 'string') {
    return false;
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function normalizeTime(value) {
  if (typeof value !== 'string') {
    return null;
  }

  if (!/^\d{2}:\d{2}(:\d{2})?$/.test(value)) {
    return null;
  }

  return value.length === 5 ? `${value}:00` : value;
}

async function getAvailability(req, res) {
  try {
    const { date } = req.query;

    if (!isValidDate(date)) {
      return res.status(400).json({
        success: false,
        message: 'date must follow YYYY-MM-DD format'
      });
    }

    const openingData = await availabilityModel.getOpenSlotsForDate(date);

    if (openingData.isClosed) {
      return res.status(200).json({
        success: true,
        date,
        is_closed: true,
        reason: openingData.reason,
        slots: []
      });
    }

    const slots = [];

    for (const slot of openingData.slots) {
      const availableTables = await reservationModel.findAvailableTablesForSlot(
        null,
        date,
        slot
      );

      slots.push({
        time: slot,
        available: availableTables.length > 0,
        available_tables: availableTables.length
      });
    }

    return res.status(200).json({
      success: true,
      date,
      is_closed: false,
      slots
    });
  } catch (error) {
    console.error('getAvailability error:', error);

    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

async function closeDate(req, res) {
  try {
    const { date, reason } = req.body;

    if (!isValidDate(date)) {
      return res.status(400).json({
        success: false,
        message: 'date must follow YYYY-MM-DD format'
      });
    }

    await db.execute(
      `
        INSERT INTO opening_exceptions (exception_date, is_closed, reason)
        VALUES (?, TRUE, ?)
        ON DUPLICATE KEY UPDATE
          is_closed = VALUES(is_closed),
          reason = VALUES(reason)
      `,
      [date, reason || null]
    );

    return res.status(200).json({
      success: true,
      message: 'Closure exception saved successfully'
    });
  } catch (error) {
    console.error('closeDate error:', error);

    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

async function addExceptionalSlot(req, res) {
  try {
    const { date, slot_time } = req.body;

    if (!isValidDate(date)) {
      return res.status(400).json({
        success: false,
        message: 'date must follow YYYY-MM-DD format'
      });
    }

    const normalizedTime = normalizeTime(slot_time);

    if (!normalizedTime) {
      return res.status(400).json({
        success: false,
        message: 'slot_time must follow HH:MM or HH:MM:SS format'
      });
    }

    await db.execute(
      `
        INSERT INTO opening_slot_exceptions (exception_date, slot_time, is_active)
        VALUES (?, ?, TRUE)
        ON DUPLICATE KEY UPDATE
          is_active = TRUE
      `,
      [date, normalizedTime]
    );

    return res.status(200).json({
      success: true,
      message: 'Exceptional slot saved successfully'
    });
  } catch (error) {
    console.error('addExceptionalSlot error:', error);

    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

module.exports = {
  getAvailability,
  closeDate,
  addExceptionalSlot
};