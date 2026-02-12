const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const connectDB = require('./config/db');

dotenv.config();

const run = async () => {
    try {
        await connectDB();

        const products = await Product.find({});
        console.log(`Total Products: ${products.length}`);

        const missingDetails = products.filter(p => !p.farmerName || !p.farmerPhone || p.farmerName === 'Unknown Farmer' || p.farmerPhone === '0000000000');

        if (missingDetails.length > 0) {
            console.log('Products with missing details:');
            missingDetails.forEach(p => {
                console.log(`ID: ${p._id}, Name: ${p.name}, Farmer: '${p.farmerName}', Phone: '${p.farmerPhone}'`);
            });
        } else {
            console.log('All products have valid farmer details.');
        }

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

run();
