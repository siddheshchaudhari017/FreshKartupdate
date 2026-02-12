const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const connectDB = require('./config/db');

dotenv.config();

const run = async () => {
    try {
        await connectDB();

        // Find the most recently created product
        const latestProduct = await Product.findOne().sort({ createdAt: -1 });

        if (latestProduct) {
            console.log('Latest Product Details:');
            console.log(`ID: ${latestProduct._id}`);
            console.log(`Name: ${latestProduct.name}`);
            console.log(`Farmer Name: '${latestProduct.farmerName}'`);
            console.log(`Farmer Phone: '${latestProduct.farmerPhone}'`);
            console.log(`Created At: ${latestProduct.createdAt}`);
            console.log(`Full Object:`, JSON.stringify(latestProduct.toJSON(), null, 2));
        } else {
            console.log('No products found.');
        }

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

run();
