const express = require('express');
const router = express.Router();
const {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  addProductUsage,
  updateProductUsage,
  deleteProductUsage,
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getProducts).post(protect, createProduct);
router.route('/:id').put(protect, updateProduct).delete(protect, deleteProduct);
router.route('/:id/usage').post(protect, addProductUsage);
router.route('/:id/usage/:usageId').put(protect, updateProductUsage).delete(protect, deleteProductUsage);

module.exports = router;
