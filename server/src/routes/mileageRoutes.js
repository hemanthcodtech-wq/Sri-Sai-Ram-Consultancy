const express = require('express');
const router = express.Router();
const {
  getMileageRecords,
  createMileageRecord,
  updateMileageRecord,
  deleteMileageRecord,
} = require('../controllers/mileageController');

// All routes are private and meant for admin
router.route('/')
  .get(getMileageRecords)
  .post(createMileageRecord);

router.route('/:id')
  .put(updateMileageRecord)
  .delete(deleteMileageRecord);

module.exports = router;
