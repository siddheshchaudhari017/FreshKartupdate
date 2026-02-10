const express = require('express');
const router = express.Router();
const {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    updateOrderStatus,
    cancelOrder,
    getMyOrders,
    getOrders
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/rbacMiddleware');

router.route('/').post(protect, addOrderItems).get(protect, requireRole('admin'), getOrders);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/pay').put(protect, updateOrderToPaid);
router.route('/:id/status').put(protect, requireRole('admin'), updateOrderStatus);
router.route('/:id/cancel').put(protect, cancelOrder);

module.exports = router;
