const mongoose = require('mongoose');
const dotenv = require('dotenv');
const users = require('./data/users'); // Assuming I create this or just create admin
const products = require('./data/products');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
const connectDB = require('./config/db');
const bcrypt = require('bcryptjs');

dotenv.config();

connectDB();

const importData = async () => {
    try {
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();

        // Create Admin User
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash('123456', salt);

        const createdUsers = await User.create([
            {
                name: 'Admin User',
                email: 'admin@example.com',
                password: password, // pre-hashed manually or modify logic. 
                // Wait, logic above hashes it manually.
                // Or I can use the model pre-save hook but insertMany might bypass it? 
                // create() triggers save middleware.
                isAdmin: true
            },
            {
                name: 'John Doe',
                email: 'user@example.com',
                password: '123456', // model pre-save hook will hash this? Yes if I use create not insertMany
                isAdmin: false
            }
        ]);

        // Wait, if I pass already hashed password to create, the pre-save hook will hash it AGAIN if isModified('password') is true.
        // My User model says: if (!this.isModified('password')) next().
        // When creating, password IS modified.
        // So I should pass PLAIN TEXT password if using create().
        // Let's correct: pass plain text '123456'.

        // Actually, for the first user I manually hashed it. For second I didn't.
        // I should just use plain text for both and let the model handle hashing.

    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};
// Redoing the file content to be cleaner and safer
