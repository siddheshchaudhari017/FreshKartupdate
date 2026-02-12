const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const User = require('./models/User');

dotenv.config();

const fixDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');

        const products = await Product.find({}).populate('user');
        console.log(`Found ${products.length} products`);

        let updatedCount = 0;
        for (const product of products) {
            let changed = false;

            if (!product.farmerName || product.farmerName === 'Unknown Farmer' || product.farmerName === 'undefined') {
                product.farmerName = product.user ? product.user.name : 'FreshKart Admin';
                changed = true;
            }

            if (!product.farmerPhone || product.farmerPhone === '0000000000' || product.farmerPhone === 'undefined' || !/^\d{10}$/.test(product.farmerPhone)) {
                product.farmerPhone = '9876543210';
                changed = true;
            }

            if (changed) {
                await product.save();
                updatedCount++;
            }
        }

        console.log(`Success! Updated ${updatedCount} products.`);
        process.exit();
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

fixDatabase();
