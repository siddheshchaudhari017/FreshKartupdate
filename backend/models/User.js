const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },

    // RBAC fields
    role: {
        type: String,
        enum: ['buyer', 'seller', 'admin', 'moderator'],
        default: 'buyer'
    },
    permissions: [{
        type: String,
        enum: ['manage_products', 'manage_orders', 'manage_users', 'view_analytics', 'manage_categories']
    }],

    // Legacy admin field (kept for backward compatibility)
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    },

    // Security fields
    loginAttempts: {
        type: Number,
        default: 0
    },
    lockUntil: {
        type: Date
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    emailVerificationToken: String,
    emailVerificationExpire: Date,

    // Password reset fields
    resetPasswordToken: String,
    resetPasswordExpire: Date,

    // Audit fields
    lastLogin: Date,
    lastLoginIP: String,
    passwordChangedAt: Date,

    // Account status
    isActive: {
        type: Boolean,
        default: true
    },
    accountStatus: {
        type: String,
        enum: ['active', 'suspended', 'locked', 'pending_verification'],
        default: 'pending_verification'
    }
}, {
    timestamps: true
});

// Virtual for checking if account is locked
userSchema.virtual('isLocked').get(function () {
    // Check if lockUntil exists and is in the future
    return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Method to compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Method to increment login attempts
userSchema.methods.incLoginAttempts = async function () {
    // If we have a previous lock that has expired, restart at 1
    if (this.lockUntil && this.lockUntil < Date.now()) {
        return await this.updateOne({
            $set: { loginAttempts: 1 },
            $unset: { lockUntil: 1 }
        });
    }

    // Otherwise increment
    const updates = { $inc: { loginAttempts: 1 } };

    // Lock the account after 5 failed attempts
    const maxAttempts = 5;
    const lockTime = 15 * 60 * 1000; // 15 minutes

    if (this.loginAttempts + 1 >= maxAttempts && !this.isLocked) {
        updates.$set = {
            lockUntil: Date.now() + lockTime,
            accountStatus: 'locked'
        };
    }

    return await this.updateOne(updates);
};

// Method to reset login attempts
userSchema.methods.resetLoginAttempts = async function () {
    return await this.updateOne({
        $set: {
            loginAttempts: 0,
            accountStatus: this.emailVerified ? 'active' : 'pending_verification'
        },
        $unset: { lockUntil: 1 }
    });
};

// Method to check if user has specific role
userSchema.methods.hasRole = function (role) {
    return this.role === role || (role === 'admin' && this.isAdmin);
};

// Method to check if user has specific permission
userSchema.methods.hasPermission = function (permission) {
    // Admin has all permissions
    if (this.role === 'admin' || this.isAdmin) {
        return true;
    }
    return this.permissions && this.permissions.includes(permission);
};

// Method to check if password was changed after JWT was issued
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return JWTTimestamp < changedTimestamp;
    }
    return false;
};

// Method to generate email verification token
userSchema.methods.getEmailVerificationToken = function () {
    const verificationToken = crypto.randomBytes(20).toString('hex');

    this.emailVerificationToken = crypto
        .createHash('sha256')
        .update(verificationToken)
        .digest('hex');

    this.emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    return verificationToken;
};

// Method to generate password reset token
userSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString('hex');

    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    return resetToken;
};

// Hash password before saving
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }

    // Set passwordChangedAt if password is being modified (but not on new document)
    if (this.isModified('password') && !this.isNew) {
        this.passwordChangedAt = Date.now() - 1000; // Subtract 1 second to ensure JWT is created after
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Sync isAdmin with role
userSchema.pre('save', function () {
    if (this.role === 'admin') {
        this.isAdmin = true;
    }
});

// Ensure virtual fields are included in JSON
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

const User = mongoose.model('User', userSchema);

module.exports = User;

