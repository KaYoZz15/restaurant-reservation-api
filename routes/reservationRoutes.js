const express = require('express');
const { getAllReservations, validateReservation } = require('../controllers/reservationController');
const { authMiddleware, requireRole } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/reservations', authMiddleware, requireRole('admin'), getAllReservations);
router.patch('/reservations/:id/validate', authMiddleware, requireRole('admin'), validateReservation);

module.exports = router;