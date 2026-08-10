const path = require('path');
const fs = require('fs');
const asyncHandler = require('../utils/asyncHandler');
const generateSKU = require('../utils/generateSKU');
const Product = require('../models/Product');
const StockMovement = require('../models/StockMovement');

const deleteUploadedFile = (imagePath) => {
  if (!imagePath) return;
  const filename = imagePath.split('/').pop();
  if (!filename) return;
  const fullPath = path.join(__dirname, '..', 'uploads', filename);
  fs.unlink(fullPath, () => {});
};

const getProductStatus = (quantity) => {
  if (quantity === 0) return 'out-of-stock';
  if (quantity <= 5) return 'low-stock';
  return 'in-stock';
};

const serializeProduct = (doc) => {
  const product = doc.toObject ? doc.toObject() : doc;
  return {
    ...product,
    status: getProductStatus(product.quantity),
  };
};

const getProducts = asyncHandler(async (req, res) => {
  const { search, status, sort } = req.query;
  const query = { userId: req.user._id };

  if (search && String(search).trim()) {
    const term = String(search).trim();
    query.$or = [
      { name: { $regex: term, $options: 'i' } },
      { sku: { $regex: term, $options: 'i' } },
    ];
  }

  if (status === 'in-stock') {
    query.quantity = { $gt: 5 };
  } else if (status === 'low-stock') {
    query.quantity = { $gt: 0, $lte: 5 };
  } else if (status === 'out-of-stock') {
    query.quantity = 0;
  }

  let sortOptions = { createdAt: -1 };
  if (sort === 'name') sortOptions = { name: 1 };
  if (sort === 'quantity-asc') sortOptions = { quantity: 1 };
  if (sort === 'quantity-desc') sortOptions = { quantity: -1 };

  const products = await Product.find(query).sort(sortOptions);

  const summary = {
    total: 0,
    inStock: 0,
    lowStock: 0,
    outOfStock: 0,
  };

  const result = products.map((product) => {
    const status = getProductStatus(product.quantity);
    if (status === 'in-stock') summary.inStock += 1;
    if (status === 'low-stock') summary.lowStock += 1;
    if (status === 'out-of-stock') summary.outOfStock += 1;
    summary.total += 1;
    return serializeProduct(product);
  });

  res.json({ success: true, data: result, summary });
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id, userId: req.user._id });
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.json({ success: true, data: serializeProduct(product) });
});

const createProduct = asyncHandler(async (req, res) => {
  const { name, type, size, quantity, note } = req.body;

  if (!name || !String(name).trim()) {
    res.status(400);
    throw new Error('Product name is required');
  }
  if (!type) {
    res.status(400);
    throw new Error('Product type is required');
  }

  const parsedQuantity = Number(quantity);
  if (!Number.isInteger(parsedQuantity) || parsedQuantity < 0) {
    res.status(400);
    throw new Error('Quantity must be a non-negative whole number');
  }

  let sku = generateSKU();
  let attempts = 0;
  while (await Product.exists({ sku }) && attempts < 5) {
    sku = generateSKU();
    attempts += 1;
  }

  const image = req.file ? `/uploads/${req.file.filename}` : '';

  const product = await Product.create({
    userId: req.user._id,
    name: String(name).trim(),
    sku,
    image,
    type,
    size: size === undefined || size === null || size === '' ? null : Number(size),
    quantity: parsedQuantity,
    note: note ? String(note).trim() : '',
  });

  if (parsedQuantity > 0) {
    await StockMovement.create({
      userId: req.user._id,
      productId: product._id,
      type: 'IN',
      quantity: parsedQuantity,
      note: note ? String(note).trim() : 'Initial stock',
    });
  }

  res.status(201).json({ success: true, data: serializeProduct(product) });
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id, userId: req.user._id });
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const { name, type, size, note } = req.body;

  if (name !== undefined && !String(name).trim()) {
    res.status(400);
    throw new Error('Product name cannot be empty');
  }
  if (type !== undefined && !type) {
    res.status(400);
    throw new Error('Product type is required');
  }

  if (name !== undefined) product.name = String(name).trim();
  if (type !== undefined) product.type = type;
  if (size !== undefined) {
    product.size = size === null || size === '' ? null : Number(size);
  }
  if (note !== undefined) product.note = String(note).trim();

  if (req.file) {
    const oldImage = product.image;
    product.image = `/uploads/${req.file.filename}`;
    deleteUploadedFile(oldImage);
  }

  const updated = await product.save();
  res.json({ success: true, data: serializeProduct(updated) });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id, userId: req.user._id });
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  deleteUploadedFile(product.image);

  await Promise.all([
    product.deleteOne(),
    StockMovement.deleteMany({ productId: product._id, userId: req.user._id }),
  ]);

  res.json({ success: true, message: 'Product deleted successfully' });
});

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  serializeProduct,
};
