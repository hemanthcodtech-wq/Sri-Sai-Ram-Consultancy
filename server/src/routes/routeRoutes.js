const express = require('express');
const router = express.Router();
const {
  getRoutes,
  getRouteById,
  createRoute,
  updateRoute,
  deleteRoute,
} = require('../controllers/routeController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getRoutes).post(protect, createRoute);
router.route('/:id').get(protect, getRouteById).put(protect, updateRoute).delete(protect, deleteRoute);

module.exports = router;
