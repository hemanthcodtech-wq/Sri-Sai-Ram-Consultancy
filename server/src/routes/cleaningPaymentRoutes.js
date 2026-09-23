const express = require('express');
const router = express.Router();
const {
  getCleaningPayments,
  createCleaningPayment,
  updateCleaningPayment,
  deleteCleaningPayment,
} = require('../controllers/cleaningPaymentController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getCleaningPayments).post(protect, createCleaningPayment);
router.route('/:id').put(protect, updateCleaningPayment).delete(protect, deleteCleaningPayment);

module.exports = router;
