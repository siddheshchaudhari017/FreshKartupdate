const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const router = express.Router();
const dotenv = require('dotenv');

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const upload = multer({ storage: multer.memoryStorage() });

const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/rbacMiddleware');

router.post('/', protect, requireRole(['admin', 'seller']), upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const stream = cloudinary.uploader.upload_stream(
        { folder: 'freshkart' },
        (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).send(error.message);
            }
            res.send(result.secure_url);
        }
    );

    streamifier.createReadStream(req.file.buffer).pipe(stream);
});

module.exports = router;
