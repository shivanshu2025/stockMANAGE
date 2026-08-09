const asyncHandler = require('../utils/asyncHandler');
const Product = require('../models/Product');
const StockMovement = require('../models/StockMovement');
const { serializeProduct } = require('./productController');

const parsePositiveInteger = (value) => {
  const num = Number(value);
  if (!Number.isInteger(num) || num <= 0) return null;
  return num;
};

const addStock = asyncHandler(async (req, res) => {
  const { quantity, note } = req.body;
  const amount = parsePositiveInteger(quantity);

  if (amount === null) {
    res.status(400);
    throw new Error('Quantity must be a positive whole number');
  }

  const product = await Product.findOne({ _id: req.params.id, userId: req.user._id });
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  product.quantity += amount;
  product.quantity = Math.max(0, product.quantity);
  const updated = await product.save();

  await StockMovement.create({
    userId: req.user._id,
    productId: product._id,
    type: 'IN',
    quantity: amount,
    note: note ? String(note).trim() : '',
  });

  res.json({ success: true, data: serializeProduct(updated), message: 'Stock updated successfully' });
});

const outStock = asyncHandler(async (req, res) => {
  const { quantity, note } = req.body;
  const amount = parsePositiveInteger(quantity);

  if (amount === null) {
    res.status(400);
    throw new Error('Quantity must be a positive whole number');
  }

  const product = await Product.findOne({ _id: req.params.id, userId: req.user._id });
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const updated = await Product.findOneAndUpdate(
    { _id: product._id, userId: req.user._id, quantity: { $gte: amount } },
    { $inc: { quantity: -amount } },
    { new: true }
  );

  if (!updated) {
    res.status(400);
    throw new Error('Not enough stock available for this request');
  }

  await StockMovement.create({
    userId: req.user._id,
    productId: product._id,
    type: 'OUT',
    quantity: amount,
    note: note ? String(note).trim() : '',
  });

  res.json({ success: true, data: serializeProduct(updated), message: 'Stock updated successfully' });
});

const getMovements = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id, userId: req.user._id });
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const movements = await StockMovement.find({
    productId: product._id,
    userId: req.user._id,
  }).sort({ createdAt: -1 });

  res.json({ success: true, data: movements });
});

module.exports = { addStock, outStock, getMovements };
