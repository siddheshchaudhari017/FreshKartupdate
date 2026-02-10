const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    images: [String],
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        default: 0
    },
    countInStock: {
        type: Number,
        required: true,
        default: 0
    },
    unit: {
        type: String, // kg, gm, piece
        required: true,
        default: 'kg'
    },
    rating: {
        type: Number,
        required: true,
        default: 0
    },
    numReviews: {
        type: Number,
        required: true,
        default: 0
    },
    farmerName: {
        type: String,
        required: [true, 'Farmer name is required'],
        trim: true,
        minlength: [2, 'Farmer name must be at least 2 characters'],
        maxlength: [100, 'Farmer name must not exceed 100 characters']
    },
    farmerPhone: {
        type: String,
        required: [true, 'Farmer phone number is required'],
        validate: {
            validator: function (v) {
                return /^\d{10}$/.test(v);
            },
            message: 'Phone number must be exactly 10 digits'
        }
    }
}, {
    timestamps: true
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
