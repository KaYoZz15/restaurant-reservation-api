const express = require('express');
const reservationController = require('../controllers/reservationController');
const { authenticate } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/reservations', authenticate, reservationController.createReservation);
router.put('/reservations/:id', authenticate, reservationController.updateReservation);
router.delete('/reservations/:id', authenticate, reservationController.cancelReservation);
router.get('/my-reservations', authenticate, reservationController.getMyReservations);

module.exports = router;
