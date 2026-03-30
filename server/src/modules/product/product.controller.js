const Product = require('./product.model');
const asyncHandler = require('../../utils/asyncHandler');
const { z } = require('zod');

// Validation Schemas
const productSchema = z.object({
  name: z.string().min(5, 'Product name must be at least 5 characters'),
  description: z.string().min(20, 'Product description must be at least 20 characters'),
  price: z.number().min(0, 'Price must be positive'),
  category: z.string().min(2, 'Category is required'),
  brand: z.string().min(2, 'Brand is required'),
  variants: z.array(z.object({
    sku: z.string(),
    size: z.string().optional(),
    color: z.string().optional(),
    price: z.number().min(0),
    stock: z.number().int().min(0),
  })).optional(),
});

// @desc    Get all products (with filter/sort/pagination)
// @route   GET /api/v1/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  let query;

  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit', 'search'];
  removeFields.forEach((param) => delete reqQuery[param]);

  // Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`);

  // Finding resource
  query = Product.find(JSON.parse(queryStr));

  // Search feature
  if (req.query.search) {
    query = Product.find({
      $text: { $search: req.query.search },
    });
  }

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Product.countDocuments(JSON.parse(queryStr));

  query = query.skip(startIndex).limit(limit);

  // Executing query
  const products = await query;

  // Pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = { page: page + 1, limit };
  }

  if (startIndex > 0) {
    pagination.prev = { page: page - 1, limit };
  }

  res.json({
    success: true,
    count: products.length,
    total,
    pagination,
    products,
  });
});

// @desc    Get single product
// @route   GET /api/v1/products/:id
// @access  Public
const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate({
    path: 'sellerId',
    select: 'name email',
  });

  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  res.json({ success: true, product });
});

// @desc    Create new product
// @route   POST /api/v1/products
// @access  Private (Seller only)
const createProduct = asyncHandler(async (req, res) => {
  req.body.sellerId = req.user.id;

  const validation = productSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({ success: false, errors: validation.error.format() });
  }

  const product = await Product.create(req.body);

  res.status(201).json({ success: true, product });
});

// @desc    Update product
// @route   PUT /api/v1/products/:id
// @access  Private (Seller only)
const updateProduct = asyncHandler(async (req, res) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  // Ensure user is product owner (seller)
  if (product.sellerId.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(401).json({ success: false, message: 'User not authorized to update this product' });
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.json({ success: true, product });
});

// @desc    Delete product
// @route   DELETE /api/v1/products/:id
// @access  Private (Seller/Admin)
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  // Ensure user is product owner (seller)
  if (product.sellerId.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(401).json({ success: false, message: 'User not authorized to delete this product' });
  }

  await Product.findByIdAndDelete(req.params.id);

  res.json({ success: true, message: 'Product removed' });
});

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
