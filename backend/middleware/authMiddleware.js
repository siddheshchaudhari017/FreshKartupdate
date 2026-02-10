const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from token
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                res.status(401);
                throw new Error('Not authorized, user not found');
            }

            // Check if user is active
            if (!req.user.isActive) {
                res.status(403);
                throw new Error('Account has been deactivated');
            }

            // Check if account is locked
            if (req.user.isLocked) {
                res.status(423);
                throw new Error('Account is locked');
            }

            // Check if user changed password after token was issued
            if (req.user.changedPasswordAfter(decoded.iat)) {
                res.status(401);
                throw new Error('Password was recently changed. Please login again');
            }

            next();
        } catch (error) {
            console.error(error);
            res.status(401);

            if (error.name === 'JsonWebTokenError') {
                throw new Error('Not authorized, invalid token');
            } else if (error.name === 'TokenExpiredError') {
                throw new Error('Not authorized, token expired');
            } else {
                throw new Error(error.message || 'Not authorized, token failed');
            }
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

const admin = (req, res, next) => {
    if (req.user && (req.user.isAdmin || req.user.role === 'admin')) {
        next();
    } else {
        res.status(403);
        throw new Error('Not authorized as an admin');
    }
};

module.exports = { protect, admin };

