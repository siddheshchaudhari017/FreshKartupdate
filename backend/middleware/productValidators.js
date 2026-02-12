const { body, validationResult } = require('express-validator');

// Validation middleware for creating/updating products
const validateProduct = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Product name is required')
        .isLength({ min: 2, max: 200 })
        .withMessage('Product name must be between 2 and 200 characters'),

    body('price')
        .isFloat({ min: 0 })
        .withMessage('Price must be a positive number'),

    body('category')
        .trim()
        .notEmpty()
        .withMessage('Category is required'),

    body('description')
        .trim()
        .notEmpty()
        .withMessage('Description is required')
        .isLength({ min: 10, max: 2000 })
        .withMessage('Description must be between 10 and 2000 characters'),

    body('countInStock')
        .isInt({ min: 0 })
        .withMessage('Stock count must be a non-negative integer'),

    body('farmerName')
        .trim()
        .notEmpty()
        .withMessage('Farmer name is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Farmer name must be between 2 and 100 characters')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('Farmer name can only contain letters and spaces'),

    body('farmerPhone')
        .trim()
        .notEmpty()
        .withMessage('Farmer phone number is required')
        .matches(/^\d{10}$/)
        .withMessage('Phone number must be exactly 10 digits'),

    // Validation result handler
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array().map(err => err.msg).join(', ');
            res.status(400);
            throw new Error(errorMessages);
        }
        next();
    }
];

module.exports = {
    validateProduct
};
