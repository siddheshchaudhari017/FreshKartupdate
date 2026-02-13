require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { logger } = require('./utils/auditLogger');
const {
    corsOptions,
    helmetConfig,
    hppConfig,
    cleanInput
} = require('./middleware/securityMiddleware');

const app = express();

// 1. Body parsers (Must be before cleanInput and other security middleware)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 2. Security Middleware
app.use(helmetConfig); // Security headers
app.use(cors(corsOptions)); // CORS with whitelist
app.use(cleanInput); // Custom NoSQL/XSS protection
app.use(hppConfig); // Prevent HTTP parameter pollution

// Request logging middleware
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.path}`, {
        ip: req.ip,
        userAgent: req.headers['user-agent']
    });
    next();
});

app.get('/', (req, res) => {
    res.send('API is running...');
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));

// Error handling middleware
app.use(require('./middleware/errorMiddleware').notFound);
app.use(require('./middleware/errorMiddleware').errorHandler);

// Start Server
const startServer = async () => {
    const PORT = process.env.PORT || 5000;

    // Start listening first
    const server = app.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
        logger.info(`Server started on port ${PORT}`);
    });

    // Then attempt to connect to DB
    try {
        await connectDB();
    } catch (error) {
        console.error(`Initial MongoDB connection failed: ${error.message}`);
    }
};

startServer();
