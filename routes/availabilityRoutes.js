const express = require('express');
const router = express.Router();

const availabilityController = require('../controllers/availabilityController');
const { authMiddleware, requireRole } = require('../middlewares/authMiddleware');

/*
|--------------------------------------------------------------------------
| Public route
|--------------------------------------------------------------------------
*/

router.get('/availability', availabilityController.getAvailability);

/*
|--------------------------------------------------------------------------
| Admin routes
|--------------------------------------------------------------------------
*/

router.post(
  '/admin/opening-exceptions/close',
  authMiddleware,
  requireRole('admin'),
  availabilityController.closeDate
);

router.post(
  '/admin/opening-exceptions/slot',
  authMiddleware,
  requireRole('admin'),
  availabilityController.addExceptionalSlot
);

module.exports = router;