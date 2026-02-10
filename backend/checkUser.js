const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const checkUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const user = await User.findOne({ email: 'siddheshchaudhari33@gmail.com' });
        if (user) {
            console.log('User found:');
            console.log(JSON.stringify({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isAdmin: user.isAdmin,
                emailVerified: user.emailVerified,
                isLocked: user.isLocked,
                loginAttempts: user.loginAttempts,
                lockUntil: user.lockUntil,
                isActive: user.isActive,
                accountStatus: user.accountStatus
            }, null, 2));
        } else {
            console.log('User not found');
        }

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkUser();
