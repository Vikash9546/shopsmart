const express = require('express');
const { createOrder, getOrderById, updateOrderToPaid, getMyOrders, getSellerOrders } = require('./order.controller');
const { protect, authorize } = require('../../middleware/auth.middleware');

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders);
router.get('/seller', protect, authorize('seller', 'admin'), getSellerOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/pay', protect, updateOrderToPaid);

module.exports = router;
