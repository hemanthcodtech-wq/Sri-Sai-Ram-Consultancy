const express = require('express');
const router = express.Router();
const {
  getOrganizers,
  getOrganizerById,
  createOrganizer,
  updateOrganizer,
  deleteOrganizer,
} = require('../controllers/organizerController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getOrganizers).post(protect, createOrganizer);
router.route('/:id').get(protect, getOrganizerById).put(protect, updateOrganizer).delete(protect, deleteOrganizer);

module.exports = router;
