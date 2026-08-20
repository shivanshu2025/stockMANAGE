const mongoose = require('mongoose');

const PRODUCT_TYPES = Array.from({ length: 18 }, (_, index) => `TYPES-${index + 1}`);

const productSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      minlength: [1, 'Product name cannot be empty'],
      maxlength: [120, 'Product name cannot exceed 120 characters'],
    },
    sku: {
      type: String,
      required: [true, 'SKU is required'],
      trim: true,
      unique: true,
      uppercase: true,
      index: true,
    },
    image: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      required: [true, 'Type is required'],
      enum: PRODUCT_TYPES,
    },
    size: {
      type: Number,
      default: null,
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Quantity cannot be negative'],
    },
    note: {
      type: String,
      trim: true,
      default: '',
      maxlength: [500, 'Note cannot exceed 500 characters'],
    },
  },
  { timestamps: true }
);

productSchema.methods.isLowStock = function () {
  return this.quantity > 0 && this.quantity <= 5;
};

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
module.exports.PRODUCT_TYPES = PRODUCT_TYPES;
