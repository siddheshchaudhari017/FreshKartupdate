const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const verifyUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const email = 'siddheshchaudhari33@gmail.com';
        const updatedUser = await User.findOneAndUpdate(
            { email },
            {
                emailVerified: true,
                accountStatus: 'active',
                loginAttempts: 0,
                isLocked: false,
                lockUntil: null
            },
            { new: true }
        );

        if (updatedUser) {
            console.log(`User ${email} has been manually verified and unlocked.`);
        } else {
            console.log(`User ${email} not found.`);
        }

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

verifyUser();
