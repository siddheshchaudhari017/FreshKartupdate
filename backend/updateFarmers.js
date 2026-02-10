const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const connectDB = require('./config/db');

dotenv.config();

// Connect to DB directly if connectDB doesn't work as expected in script
const run = async () => {
    try {
        await connectDB();
        console.log('MongoDB Connected for Seeder');

        const farmers = [
            { name: 'Ramesh Kumar', phone: '9876543210' },
            { name: 'Suresh Patel', phone: '9123456789' },
            { name: 'Kamala Devi', phone: '9988776655' },
            { name: 'Rajesh Singh', phone: '9876501234' },
            { name: 'Sunita Sharma', phone: '8765432109' },
            { name: 'Vikram Yadav', phone: '7654321098' },
            { name: 'Anita Gupta', phone: '9012345678' },
            { name: 'Manoj Verma', phone: '8901234567' },
            { name: 'Pooja Reddy', phone: '7890123456' },
            { name: 'Deepak Joshi', phone: '6789012345' }
        ];

        const products = await Product.find({});
        console.log(`Found ${products.length} products to update...`);

        let updatedCount = 0;

        for (let i = 0; i < products.length; i++) {
            const product = products[i];

            try {
                // Generate random farmer
                const randomFarmer = farmers[Math.floor(Math.random() * farmers.length)];

                // Set random farmer details
                product.farmerName = randomFarmer.name;
                product.farmerPhone = randomFarmer.phone;

                // Force update to ensure data is set even if only one field matched
                await product.save();
                updatedCount++;
                console.log(`Updated: ${product.name} -> ${product.farmerName} (${product.farmerPhone})`);
            } catch (err) {
                console.error(`Failed to update product ${product._id}:`, err.message);
            }
        }

        console.log(`Successfully updated ${updatedCount} products.`);
        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

run();
