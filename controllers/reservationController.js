const db = require('../config/database');
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
    date.getUTCFullYear() === year
    && date.getUTCMonth() === month - 1
    && date.getUTCDate() === day
  );
}

function normalizeTime(value) {
  if (typeof value !== 'string') {
    return null;
  }

  const match = value.match(/^([01]\d|2[0-3]):([0-5]\d)(?::([0-5]\d))?$/);
  if (!match) {
    return null;
  }

  const [, hours, minutes, seconds] = match;
  return `${hours}:${minutes}:${seconds || '00'}`;
}

function validateReservationPayload(body) {
  const errors = [];
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
  const numberOfPeople = Number(body.number_of_people);
  const reservationDate = body.reservation_date;
  const reservationTime = normalizeTime(body.reservation_time);
  const note = typeof body.note === 'string' ? body.note.trim() : null;

  if (!name) {
    errors.push('name is required');
  }

  if (!phone) {
    errors.push('phone is required');
  }

  if (!Number.isInteger(numberOfPeople) || numberOfPeople <= 0) {
    errors.push('number_of_people must be a positive integer');
  }

  if (!isValidDate(reservationDate)) {
    errors.push('reservation_date must follow YYYY-MM-DD format');
  }

  if (!reservationTime) {
    errors.push('reservation_time must follow HH:MM or HH:MM:SS format');
  }

  return {
    errors,
    data: {
      name,
      phone,
      numberOfPeople,
      reservationDate,
      reservationTime,
      note
    }
  };
}

function parseReservationId(idParam) {
  const reservationId = Number(idParam);

  if (!reservationModel.isPositiveInteger(reservationId)) {
    return null;
  }

  return reservationId;
}

async function createReservation(req, res) {
  const validation = validateReservationPayload(req.body);

  if (validation.errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Invalid reservation payload',
      errors: validation.errors
    });
  }

  let connection;

  try {
    const { name, phone, numberOfPeople, reservationDate, reservationTime, note } = validation.data;

    connection = await db.getConnection();
    await connection.beginTransaction();

    const availableTables = await reservationModel.findAvailableTablesForSlot(
      connection,
      reservationDate,
      reservationTime
    );

    const totalSeats = reservationModel.getTotalSeats(availableTables);
    if (totalSeats < numberOfPeople) {
      await connection.rollback();
      return res.status(409).json({
        success: false,
        message: 'Not enough capacity for this date and time'
      });
    }

    const assignedTables = reservationModel.chooseBestTableCombination(
      availableTables,
      numberOfPeople
    );

    if (!assignedTables) {
      await connection.rollback();
      return res.status(409).json({
        success: false,
        message: 'No table combination can satisfy this reservation'
      });
    }

    const reservationId = await reservationModel.createReservation(connection, {
      userId: req.user.id,
      name,
      phone,
      numberOfPeople,
      reservationDate,
      reservationTime,
      note
    });

    await reservationModel.assignTablesToReservation(
      connection,
      reservationId,
      assignedTables.map((table) => table.id)
    );

    await connection.commit();

    return res.status(201).json({
      success: true,
      message: 'Reservation created successfully',
      data: {
        id: reservationId,
        user_id: req.user.id,
        name,
        phone,
        number_of_people: numberOfPeople,
        reservation_date: reservationDate,
        reservation_time: reservationTime,
        note,
        status: 'pending',
        tables: assignedTables
      }
    });
  } catch (error) {
    if (connection) {
      try {
        await connection.rollback();
      } catch (rollbackError) {
        console.error('Rollback failed:', rollbackError);
      }
    }

    console.error('Error creating reservation:', error);

    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

async function updateReservation(req, res) {
  const reservationId = parseReservationId(req.params.id);

  if (!reservationId) {
    return res.status(400).json({
      success: false,
      message: 'Reservation id must be a positive integer'
    });
  }

  const validation = validateReservationPayload(req.body);
  if (validation.errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Invalid reservation payload',
      errors: validation.errors
    });
  }

  let connection;

  try {
    const { name, phone, numberOfPeople, reservationDate, reservationTime, note } = validation.data;

    connection = await db.getConnection();
    await connection.beginTransaction();

    const existingReservation = await reservationModel.getReservationByIdAndUser(
      connection,
      reservationId,
      req.user.id,
      true
    );

    if (!existingReservation) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }

    if (existingReservation.status !== 'pending') {
      await connection.rollback();
      return res.status(409).json({
        success: false,
        message: 'Only pending reservations can be modified'
      });
    }

    const availableTables = await reservationModel.findAvailableTablesForSlot(
      connection,
      reservationDate,
      reservationTime,
      reservationId
    );

    const totalSeats = reservationModel.getTotalSeats(availableTables);
    if (totalSeats < numberOfPeople) {
      await connection.rollback();
      return res.status(409).json({
        success: false,
        message: 'Not enough capacity for this date and time'
      });
    }

    const assignedTables = reservationModel.chooseBestTableCombination(
      availableTables,
      numberOfPeople
    );

    if (!assignedTables) {
      await connection.rollback();
      return res.status(409).json({
        success: false,
        message: 'No table combination can satisfy this reservation'
      });
    }

    await reservationModel.updateReservation(connection, reservationId, {
      name,
      phone,
      numberOfPeople,
      reservationDate,
      reservationTime,
      note
    });

    await reservationModel.clearTablesForReservation(connection, reservationId);
    await reservationModel.assignTablesToReservation(
      connection,
      reservationId,
      assignedTables.map((table) => table.id)
    );

    await connection.commit();

    return res.status(200).json({
      success: true,
      message: 'Reservation updated successfully',
      data: {
        id: reservationId,
        user_id: req.user.id,
        name,
        phone,
        number_of_people: numberOfPeople,
        reservation_date: reservationDate,
        reservation_time: reservationTime,
        note,
        status: existingReservation.status,
        tables: assignedTables
      }
    });
  } catch (error) {
    if (connection) {
      try {
        await connection.rollback();
      } catch (rollbackError) {
        console.error('Rollback failed:', rollbackError);
      }
    }

    console.error('Error updating reservation:', error);

    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

async function cancelReservation(req, res) {
  const reservationId = parseReservationId(req.params.id);

  if (!reservationId) {
    return res.status(400).json({
      success: false,
      message: 'Reservation id must be a positive integer'
    });
  }

  let connection;

  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    const existingReservation = await reservationModel.getReservationByIdAndUser(
      connection,
      reservationId,
      req.user.id,
      true
    );

    if (!existingReservation) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }

    await reservationModel.cancelReservation(connection, reservationId);
    await connection.commit();

    return res.status(200).json({
      success: true,
      message: 'Reservation cancelled successfully',
      data: {
        id: reservationId,
        status: 'cancelled'
      }
    });
  } catch (error) {
    if (connection) {
      try {
        await connection.rollback();
      } catch (rollbackError) {
        console.error('Rollback failed:', rollbackError);
      }
    }

    console.error('Error cancelling reservation:', error);

    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

async function getMyReservations(req, res) {
  try {
    const reservations = await reservationModel.getReservationsByUserId(req.user.id);

    return res.status(200).json({
      success: true,
      count: reservations.length,
      data: reservations
    });
  } catch (error) {
    console.error('Error fetching user reservations:', error);

    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

module.exports = {
  createReservation,
  updateReservation,
  cancelReservation,
  getMyReservations
};
