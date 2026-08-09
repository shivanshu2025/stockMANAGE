const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { addStock, outStock, getMovements } = require('../controllers/stockController');

router.use(protect);

router
  .route('/')
  .get(getProducts)
  .post(upload.single('image'), createProduct);

router
  .route('/:id')
  .get(getProductById)
  .put(upload.single('image'), updateProduct)
  .delete(deleteProduct);

router.post('/:id/add-stock', addStock);
router.post('/:id/out-stock', outStock);
router.get('/:id/movements', getMovements);

module.exports = router;
