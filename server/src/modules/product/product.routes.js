const express = require('express');
const { getProducts, getProduct, createProduct, updateProduct, deleteProduct } = require('./product.controller');
const { protect, authorize } = require('../../middleware/auth.middleware');

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProduct);

// Protected routes (Seller/Admin only)
router.post('/', protect, authorize('seller', 'admin'), createProduct);
router.put('/:id', protect, authorize('seller', 'admin'), updateProduct);
router.delete('/:id', protect, authorize('seller', 'admin'), deleteProduct);

module.exports = router;
