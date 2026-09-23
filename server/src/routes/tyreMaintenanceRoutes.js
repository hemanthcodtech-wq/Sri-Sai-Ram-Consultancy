const express = require('express');
const router = express.Router();
const {
  getTyreMaintenance,
  createTyreMaintenance,
  updateTyreMaintenance,
  deleteTyreMaintenance,
} = require('../controllers/tyreMaintenanceController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getTyreMaintenance).post(protect, createTyreMaintenance);
router.route('/:id').put(protect, updateTyreMaintenance).delete(protect, deleteTyreMaintenance);

module.exports = router;
