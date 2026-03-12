const express = require('express');
const reservationController = require('../controllers/reservationController');
const { authMiddleware, requireRole } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/reservations', authMiddleware, requireRole('admin'), reservationController.getAllReservations);
router.patch('/reservations/:id/validate', authMiddleware, requireRole('admin'), reservationController.validateReservation);

router.post('/reservations', authMiddleware, reservationController.createReservation);
router.put('/reservations/:id', authMiddleware, reservationController.updateReservation);
router.delete('/reservations/:id', authMiddleware, reservationController.cancelReservation);
router.get('/my-reservations', authMiddleware, reservationController.getMyReservations);

module.exports = router;
