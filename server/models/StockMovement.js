const mongoose = require('mongoose');

const stockMovementSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      enum: ['IN', 'OUT'],
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1'],
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

stockMovementSchema.index({ productId: 1, createdAt: -1 });

const StockMovement = mongoose.model('StockMovement', stockMovementSchema);

module.exports = StockMovement;
