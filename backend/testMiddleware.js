const rateLimiter = require('./middleware/rateLimiter');
const captchaMiddleware = require('./middleware/captchaMiddleware');
const validators = require('./middleware/validators');
const authController = require('./controllers/authController');

console.log('--- rateLimiter ---');
for (const [key, value] of Object.entries(rateLimiter)) {
    console.log(`${key}: ${typeof value}`);
}

console.log('\n--- captchaMiddleware ---');
for (const [key, value] of Object.entries(captchaMiddleware)) {
    console.log(`${key}: ${typeof value}`);
}

console.log('\n--- validators ---');
for (const [key, value] of Object.entries(validators)) {
    console.log(`${key}: ${Array.isArray(value) ? 'array' : typeof value}`);
    if (Array.isArray(value)) {
        value.forEach((v, i) => console.log(`  [${i}]: ${typeof v}`));
    }
}

console.log('\n--- authController ---');
for (const [key, value] of Object.entries(authController)) {
    console.log(`${key}: ${typeof value}`);
}
