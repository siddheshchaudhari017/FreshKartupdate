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

        products.forEach(p => {
            const nameType = typeof p.farmerName;
            const phoneType = typeof p.farmerPhone;
            const nameVal = JSON.stringify(p.farmerName);
            const phoneVal = JSON.stringify(p.farmerPhone);

            // Check for suspicious values
            const suspicious =
                p.farmerName === undefined ||
                p.farmerName === null ||
                p.farmerName === 'undefined' ||
                p.farmerName === 'null' ||
                (typeof p.farmerName === 'string' && p.farmerName.trim() === '') ||
                p.farmerPhone === undefined ||
                p.farmerPhone === null;

            if (suspicious) {
                console.log(`[SUSPICIOUS] ID: ${p._id}`);
                console.log(`  Name: ${nameVal} (Type: ${nameType})`);
                console.log(`  Phone: ${phoneVal} (Type: ${phoneType})`);
            } else {
                // Log the first few good ones just to see
                // console.log(`[OK] ID: ${p._id} - ${p.farmerName}`);
            }
        });

        console.log('Inspection complete.');
        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

run();
