const reservationModel = require('../models/reservationModel');

async function getAllReservations(req, res) {
  try {
    const reservations = await reservationModel.findAll();

    return res.status(200).json({
      success: true,
      count: reservations.length,
      data: reservations,
    });
  } catch (error) {
    console.error('getAllReservations error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}

async function validateReservation(req, res) {
  try {
    const { id } = req.params;
    const reservation = await reservationModel.findById(id);

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found',
      });
    }

    if (reservation.status === 'confirmed') {
      return res.status(400).json({
        success: false,
        message: 'This reservation is already confirmed',
      });
    }

    if (reservation.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'A cancelled reservation cannot be confirmed',
      });
    }

    await reservationModel.updateStatus(id, 'confirmed');

    const updatedReservation = await reservationModel.findById(id);

    return res.status(200).json({
      success: true,
      message: 'Reservation validated successfully',
      data: updatedReservation,
    });
  } catch (error) {
    console.error('validateReservation error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}

module.exports = {
  getAllReservations,
  validateReservation,
};