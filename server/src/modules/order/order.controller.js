const Order = require('./order.model');
const Product = require('../product/product.model');
const asyncHandler = require('../../utils/asyncHandler');

// @desc    Create new order
// @route   POST /api/v1/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    idempotencyKey,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    return res.status(400).json({ success: false, message: 'No order items' });
  }

  // 1. Validate Stock & Price consistency
  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    if (!product) {
      return res.status(404).json({ success: false, message: `Product ${item.product} not found` });
    }

    // Check variants stock if variantId is provided
    if (item.variantId) {
      const variant = product.variants.find(v => v._id.toString() === item.variantId);
      if (!variant || variant.stock < item.quantity) {
        return res.status(400).json({ success: false, message: `Insufficient stock for variant of ${product.name}` });
      }
    } else {
      if (product.inventory.totalStock < item.quantity) {
        return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}` });
      }
    }
  }

  // 2. Create Order
  const order = new Order({
    orderItems,
    user: req.user._id,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    idempotencyKey,
  });

  const createdOrder = await order.save();

  res.status(201).json({ success: true, order: createdOrder });
});

// @desc    Get order by ID
// @route   GET /api/v1/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  // Authorize check: only owner, seller of items, or admin
  const isOwner = order.user._id.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';
  const isSellerOfAnyItem = order.orderItems.some(item => item.seller.toString() === req.user._id.toString());

  if (!isOwner && !isAdmin && !isSellerOfAnyItem) {
    return res.status(401).json({ success: false, message: 'Not authorized to view this order' });
  }

  res.json({ success: true, order });
});

// @desc    Update order to paid
// @route   PUT /api/v1/orders/:id/pay
// @access  Private/Public (via Webhook)
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentResult = {
    id: req.body.id,
    status: req.body.status,
    update_time: req.body.update_time,
    email_address: req.body.email_address,
  };
  order.status = 'placed';

  // 3. Atomically Reduce Stock
  for (const item of order.orderItems) {
    const product = await Product.findById(item.product);
    if (item.variantId) {
      await Product.updateOne(
        { _id: item.product, "variants._id": item.variantId },
        { $inc: { "variants.$.stock": -item.quantity } }
      );
    } else {
      await Product.updateOne(
        { _id: item.product },
        { $inc: { "inventory.totalStock": -item.quantity } }
      );
    }
  }

  const updatedOrder = await order.save();

  res.json({ success: true, order: updatedOrder });
});

// @desc    Get logged in user orders
// @route   GET /api/v1/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
  res.json({ success: true, count: orders.length, orders });
});

// @desc    Get seller specific orders
// @route   GET /api/v1/orders/seller
// @access  Private (Seller only)
const getSellerOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({
    'orderItems.seller': req.user._id,
  }).sort('-createdAt');

  // Filter items that don't belong to this seller for UI convenience
  const formattedOrders = orders.map(order => {
    const sellerItems = order.orderItems.filter(item => item.seller.toString() === req.user._id.toString());
    return {
      ...order._doc,
      orderItems: sellerItems,
    };
  });

  res.json({ success: true, count: formattedOrders.length, orders: formattedOrders });
});

module.exports = {
  createOrder,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getSellerOrders,
};
