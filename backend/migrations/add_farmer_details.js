// Database migration script to add farmer details to existing products
// Run this script once to update all existing products with default farmer information

const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

const migrateProducts = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for migration...');

        // Find all products that don't have farmer details
        const productsToUpdate = await Product.find({
            $or: [
                { farmerName: { $exists: false } },
                { farmerPhone: { $exists: false } }
            ]
        });

        console.log(`Found ${productsToUpdate.length} products to update`);

        if (productsToUpdate.length === 0) {
            console.log('No products need migration. All products already have farmer details.');
            process.exit(0);
        }

        // Update products with default farmer information
        const result = await Product.updateMany(
            {
                $or: [
                    { farmerName: { $exists: false } },
                    { farmerPhone: { $exists: false } }
                ]
            },
            {
                $set: {
                    farmerName: 'Unknown Farmer',
                    farmerPhone: '0000000000'
                }
            }
        );

        console.log(`Migration completed successfully!`);
        console.log(`Updated ${result.modifiedCount} products`);
        console.log('\nDefault values set:');
        console.log('  - Farmer Name: "Unknown Farmer"');
        console.log('  - Farmer Phone: "0000000000"');
        console.log('\nPlease update these products with actual farmer information through the admin panel.');

        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

// Run migration
migrateProducts();
