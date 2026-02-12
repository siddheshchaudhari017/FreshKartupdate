const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

// Middleware to load product by ID and attach to request
const loadProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    req.resource = product; // Standard field for RBAC
    req.product = product;  // Specific field for controllers if needed
    next();
});

module.exports = {
    loadProduct
};
