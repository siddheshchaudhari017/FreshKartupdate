const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { auditLogger } = require('../utils/auditLogger');
const crypto = require('crypto');

// Helper to get client IP
const getClientIP = (req) => {
    return req.headers['x-forwarded-for']?.split(',')[0] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.ip;
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = async (req, res) => {
    const { email, password } = req.body;
    const ip = getClientIP(req);
    const userAgent = req.headers['user-agent'];

    const user = await User.findOne({ email });

    if (!user) {
        auditLogger.loginFailure(email, ip, userAgent, 'User not found');
        res.status(401);
        throw new Error('Invalid email or password');
    }

    // Check if account is locked
    if (user.isLocked) {
        const lockTimeRemaining = Math.ceil((user.lockUntil - Date.now()) / 1000 / 60);
        auditLogger.loginFailure(email, ip, userAgent, 'Account locked');
        res.status(423);
        throw new Error(`Account is locked. Please try again in ${lockTimeRemaining} minutes`);
    }

    // Check if account is active
    if (!user.isActive) {
        auditLogger.loginFailure(email, ip, userAgent, 'Account inactive');
        res.status(403);
        throw new Error('Account has been deactivated. Please contact support');
    }

    // Check if email is verified (allow login but inform user)
    const emailVerifiedWarning = !user.emailVerified;

    // Verify password
    const isPasswordMatch = await user.matchPassword(password);

    if (!isPasswordMatch) {
        // Increment login attempts
        await user.incLoginAttempts();

        // Check if account is now locked
        const updatedUser = await User.findById(user._id);
        if (updatedUser.isLocked) {
            auditLogger.accountLocked(user._id, email, ip);
            res.status(423);
            throw new Error('Too many failed login attempts. Account locked for 15 minutes');
        }

        auditLogger.loginFailure(email, ip, userAgent, 'Invalid password');
        res.status(401);
        throw new Error('Invalid email or password');
    }

    // Successful login - reset attempts
    await user.resetLoginAttempts();

    // Update last login info
    user.lastLogin = Date.now();
    user.lastLoginIP = ip;
    await user.save();

    auditLogger.loginSuccess(user._id, email, ip, userAgent);

    res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
        isAdmin: user.isAdmin,
        emailVerified: user.emailVerified,
        emailVerifiedWarning,
        lastLogin: user.lastLogin,
        token: generateToken(user._id)
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;
    const ip = getClientIP(req);

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    // Set role (default to buyer if not specified or invalid)
    const userRole = (role === 'seller' || role === 'buyer') ? role : 'buyer';

    // Set permissions based on role
    let permissions = [];
    if (userRole === 'seller') {
        permissions = ['manage_products', 'manage_orders', 'view_analytics'];
    }

    const user = await User.create({
        name,
        email,
        password,
        role: userRole,
        permissions,
        accountStatus: 'pending_verification'
    });

    if (user) {
        // Generate email verification token
        const verificationToken = user.getEmailVerificationToken();
        await user.save({ validateBeforeSave: false });

        // Create verification URL
        const verificationUrl = `${req.protocol}://${req.get('host')}/verify-email/${verificationToken}`;

        // In production, send email here
        console.log('------------------------------------');
        console.log(`Email Verification URL: ${verificationUrl}`);
        console.log(`User: ${user.email}`);
        console.log('------------------------------------');

        auditLogger.registration(user._id, email, userRole, ip);

        res.status(201).json({
            success: true,
            message: 'Registration successful! Please check your email to verify your account.',
            userId: user._id
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
};

// @desc    Verify email
// @route   GET /api/auth/verify-email/:token
// @access  Public
const verifyEmail = async (req, res) => {
    // Get hashed token
    const emailVerificationToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await User.findOne({
        emailVerificationToken,
        emailVerificationExpire: { $gt: Date.now() }
    });

    if (!user) {
        res.status(400);
        throw new Error('Invalid or expired verification token');
    }

    // Update user
    user.emailVerified = true;
    user.accountStatus = 'active';
    user.emailVerificationToken = undefined;
    user.emailVerificationExpire = undefined;
    await user.save();

    auditLogger.emailVerified(user._id, user.email);

    res.json({
        success: true,
        message: 'Email verified successfully! You can now login.',
        token: generateToken(user._id)
    });
};

// @desc    Resend verification email
// @route   POST /api/auth/resend-verification
// @access  Public
const resendVerification = async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    if (user.emailVerified) {
        res.status(400);
        throw new Error('Email is already verified');
    }

    // Generate new verification token
    const verificationToken = user.getEmailVerificationToken();
    await user.save({ validateBeforeSave: false });

    // Create verification URL
    const verificationUrl = `${req.protocol}://${req.get('host')}/verify-email/${verificationToken}`;

    // In production, send email here
    console.log('------------------------------------');
    console.log(`Resent Email Verification URL: ${verificationUrl}`);
    console.log(`User: ${user.email}`);
    console.log('------------------------------------');

    res.json({
        success: true,
        message: 'Verification email sent successfully'
    });
};

// @desc    Forgot Password
// @route   POST /api/auth/forgotpassword
// @access  Public
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    const ip = getClientIP(req);

    const user = await User.findOne({ email });

    if (!user) {
        // Don't reveal if user exists or not
        res.status(200).json({
            success: true,
            message: 'If an account with that email exists, a password reset link has been sent.'
        });
        return;
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // Create reset url
    const resetUrl = `${req.protocol}://localhost:5173/reset-password/${resetToken}`;

    auditLogger.passwordResetRequest(email, ip);

    try {
        // In production, send email here
        console.log('------------------------------------');
        console.log(`Password Reset URL: ${resetUrl}`);
        console.log(`User: ${user.email}`);
        console.log('------------------------------------');

        res.status(200).json({
            success: true,
            message: 'If an account with that email exists, a password reset link has been sent.'
        });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        res.status(500);
        throw new Error('Email could not be sent');
    }
};

// @desc    Reset Password
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
const resetPassword = async (req, res) => {
    const ip = getClientIP(req);

    // Get hashed token
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.resettoken)
        .digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
        res.status(400);
        throw new Error('Invalid or expired reset token');
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    user.passwordChangedAt = Date.now();

    // Reset login attempts if account was locked
    if (user.isLocked) {
        user.loginAttempts = 0;
        user.lockUntil = undefined;
        user.accountStatus = user.emailVerified ? 'active' : 'pending_verification';
    }

    await user.save();

    auditLogger.passwordResetSuccess(user._id, user.email, ip);

    res.status(200).json({
        success: true,
        message: 'Password reset successful',
        token: generateToken(user._id)
    });
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const ip = getClientIP(req);

    const user = await User.findById(req.user._id);

    // Verify old password
    const isMatch = await user.matchPassword(oldPassword);
    if (!isMatch) {
        res.status(401);
        throw new Error('Current password is incorrect');
    }

    // Set new password
    user.password = newPassword;
    user.passwordChangedAt = Date.now();
    await user.save();

    auditLogger.passwordChange(user._id, user.email, ip);

    res.json({
        success: true,
        message: 'Password changed successfully',
        token: generateToken(user._id) // Issue new token
    });
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res) => {
    // In a more advanced implementation, add token to blacklist
    // For now, just return success (client will remove token)
    res.json({
        success: true,
        message: 'Logged out successfully'
    });
};

module.exports = {
    authUser,
    registerUser,
    verifyEmail,
    resendVerification,
    forgotPassword,
    resetPassword,
    changePassword,
    logout
};
