const mongoose = require('mongoose');
const dotenv = require('dotenv');
const products = require('./data/products');
const Product = require('./models/Product');
const User = require('./models/User');

dotenv.config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const importData = async () => {
    try {
        await connectDB();

        // We assume an admin user already exists. We need one to assign as the creator of the products.
        // Fetch the first admin user found.
        const adminUser = await User.findOne({ isAdmin: true });

        if (!adminUser) {
            console.error('Error: No admin user found. Cannot seed products without an admin owner.');
            process.exit(1);
        }

        const sampleProducts = products.map((product) => {
            return { ...product, user: adminUser._id };
        });

        // Optional: Clear existing products to prevent duplicates (careful with production!)
        // For development, this is often desired.
        await Product.deleteMany();
        console.log('Old products removed...');

        await Product.insertMany(sampleProducts);
        console.log('Data Imported!');

        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();
