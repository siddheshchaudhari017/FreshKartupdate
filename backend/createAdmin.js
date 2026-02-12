const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const createAdmin = async () => {
    try {
        console.log('Connecting to:', process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const email = 'siddheshchaudhari33@gmail.com';
        console.log('Searching for user:', email);
        let user = await User.findOne({ email });

        if (user) {
            console.log('User found, promoting to admin...');
            user.role = 'admin';
            user.isAdmin = true;
            user.emailVerified = true;
            user.accountStatus = 'active';
            await user.save();
            console.log('User promoted to admin successfully.');
        } else {
            console.log('User not found, creating a new admin user...');
            user = await User.create({
                name: 'Admin User',
                email: email,
                password: 'password123',
                role: 'admin',
                isAdmin: true,
                emailVerified: true,
                accountStatus: 'active'
            });
            console.log('New admin user created successfully.');
        }

        console.log('Admin setup complete.');
        process.exit();
    } catch (err) {
        console.error('CRITICAL ERROR:', err);
        process.exit(1);
    }
};

createAdmin();
