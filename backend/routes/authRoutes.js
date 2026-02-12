const express = require('express');
const router = express.Router();
const {
    authUser,
    registerUser,
    verifyEmail,
    resendVerification,
    forgotPassword,
    resetPassword,
    changePassword,
    logout
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const {
    validateRegistration,
    validateLogin,
    validatePasswordChange,
    validateForgotPassword,
    validateResetPassword,
    validateEmail
} = require('../middleware/validators');
const {
    loginRateLimiter,
    registerRateLimiter,
    passwordResetRateLimiter,
    resendVerificationRateLimiter
} = require('../middleware/rateLimiter');
const { verifyRecaptcha } = require('../middleware/captchaMiddleware');

// Public routes
router.post('/register', registerRateLimiter, verifyRecaptcha, validateRegistration, registerUser);
router.post('/login', loginRateLimiter, verifyRecaptcha, validateLogin, authUser);
router.get('/verify-email/:token', verifyEmail);
router.post('/resend-verification', resendVerificationRateLimiter, validateEmail, resendVerification);
router.post('/forgotpassword', passwordResetRateLimiter, validateForgotPassword, forgotPassword);
router.put('/resetpassword/:resettoken', validateResetPassword, resetPassword);

// Protected routes
router.put('/change-password', protect, validatePasswordChange, changePassword);
router.post('/logout', protect, logout);

module.exports = router;

