const express = require('express');
const { getProducts, placeOrder, getOrderHistory, cancelOrder } = require('../controllers/buyerController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = express.Router();

// Buyer routes (all require buyer role)
router.get('/products', [authMiddleware, roleMiddleware("buyer")], getProducts);
router.post('/orders', [authMiddleware, roleMiddleware("buyer")], placeOrder);
router.get('/orders/history', [authMiddleware, roleMiddleware("buyer")], getOrderHistory);
router.patch('/orders/:orderId/cancel', [authMiddleware, roleMiddleware("buyer")], cancelOrder);

module.exports = router;
