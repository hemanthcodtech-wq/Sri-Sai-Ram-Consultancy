const express = require('express');
const router = express.Router();
const {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  payEmployee,
  deleteEmployeePayment,
  deleteEmployeeTaskSettlement,
} = require('../controllers/employeeController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getEmployees).post(protect, createEmployee);
router.route('/:id').get(protect, getEmployeeById).put(protect, updateEmployee).delete(protect, deleteEmployee);
router.route('/:id/pay').post(protect, payEmployee);
router.route('/:id/payments/:paymentId').delete(protect, deleteEmployeePayment);
router.route('/:id/task-settlements/:tripId').delete(protect, deleteEmployeeTaskSettlement);

module.exports = router;
