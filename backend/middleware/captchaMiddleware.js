const axios = require('axios');

// Middleware to verify reCAPTCHA token
const verifyRecaptcha = async (req, res, next) => {
    // Skip verification in development if no secret is provided or specifically disabled
    if (process.env.NODE_ENV === 'development' && !process.env.RECAPTCHA_SECRET_KEY) {
        return next();
    }

    const { recaptchaToken } = req.body;

    if (!recaptchaToken) {
        res.status(400);
        throw new Error('Please complete the CAPTCHA');
    }

    try {
        const secretKey = process.env.RECAPTCHA_SECRET_KEY || '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe'; // Fallback to test key
        const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaToken}`;

        const response = await axios.post(verificationUrl);
        const { success, score } = response.data;

        if (!success) {
            res.status(400);
            throw new Error('CAPTCHA verification failed. Please try again.');
        }

        next();
    } catch (error) {
        console.error('reCAPTCHA Verification Error:', error.message);
        res.status(500);
        throw new Error('Server error during CAPTCHA verification');
    }
};

module.exports = { verifyRecaptcha };
