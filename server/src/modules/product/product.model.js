const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a product name'],
    trim: true,
    maxlength: [100, 'Name cannot more than 100 characters'],
  },
  description: {
    type: String,
    required: [true, 'Please provide a product description'],
    maxlength: [1000, 'Description cannot more than 1000 characters'],
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
    default: 0,
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    index: true,
  },
  brand: {
    type: String,
    required: [true, 'Please provide a brand'],
    index: true,
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  images: [
    {
      url: String,
      public_id: String,
    },
  ],
  variants: [
    {
      sku: String,
      size: String,
      color: String,
      price: Number,
      stock: Number,
    },
  ],
  inventory: {
    totalStock: {
      type: Number,
      default: 0,
    },
    lowStockThreshold: {
      type: Number,
      default: 10,
    },
  },
  ratings: {
    average: {
      type: Number,
      default: 0,
    },
    count: {
      type: Number,
      default: 0,
    },
  },
  isPublished: {
    type: Boolean,
    default: true,
  },
  tags: [String],
}, { timestamps: true });

// Text indices for search functionality
productSchema.index({ name: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Product', productSchema);
