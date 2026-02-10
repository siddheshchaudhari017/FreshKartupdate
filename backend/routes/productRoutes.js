const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProductById,
    deleteProduct,
    updateProduct,
    createProduct,
    getTopProducts
} = require('../controllers/productController');
const { loadProduct } = require('../middleware/productMiddleware');
const { protect } = require('../middleware/authMiddleware');
const { requireRole, requireOwnership } = require('../middleware/rbacMiddleware');

router.route('/')
    .get(getProducts)
    .post(protect, requireRole(['admin', 'seller']), createProduct);

router.get('/top', getTopProducts);

router.route('/:id')
    .get(getProductById)
    .delete(protect, loadProduct, requireOwnership('user'), deleteProduct)
    .put(protect, loadProduct, requireOwnership('user'), updateProduct);

module.exports = router;
