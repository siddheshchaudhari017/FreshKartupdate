const Product = require('../models/Product');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    const keyword = req.query.keyword
        ? {
            name: {
                $regex: req.query.keyword,
                $options: 'i',
            },
        }
        : {};

    const products = await Product.find({ ...keyword });
    res.json(products);
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        res.json(product);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
    const product = await Product.findOneAndDelete({ _id: req.params.id });

    if (product) {
        res.json({ message: 'Product removed' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
    const { name, price, image, category, countInStock, description, unit, farmerName, farmerPhone } = req.body;

    const product = new Product({
        name: name || 'Sample Name',
        price: price || 0,
        user: req.user._id,
        image: image || '/images/sample.jpg',
        category: category || 'Sample category',
        countInStock: countInStock || 0,
        description: description || 'Sample description',
        unit: unit || 'kg',
        farmerName: farmerName || (req.user && req.user.name) || 'FreshKart Admin',
        farmerPhone: farmerPhone || '9876543210'
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
    const {
        name,
        price,
        description,
        image,
        category,
        countInStock,
        unit,
        farmerName,
        farmerPhone
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        product.name = name;
        product.price = price;
        product.description = description;
        product.image = image;
        product.category = category;
        product.countInStock = countInStock;
        product.unit = unit || product.unit;
        product.farmerName = farmerName || product.farmerName || 'FreshKart Admin';
        product.farmerPhone = farmerPhone || product.farmerPhone || '9876543210';

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
};

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = async (req, res) => {
    const products = await Product.find({}).sort({ rating: -1 }).limit(4);
    res.json(products);
};

module.exports = {
    getProducts,
    getProductById,
    deleteProduct,
    createProduct,
    updateProduct,
    getTopProducts
};
