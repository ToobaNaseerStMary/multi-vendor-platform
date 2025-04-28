const express = require('express');
const { addProduct, editProduct, deleteProduct, getVendorProducts, getVendorOrders, updateOrderStatus, getCategories, releaseFunds } = require('../controllers/vendorController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = express.Router();

// Vendor routes (all require vendor role)
router.post('/products', [authMiddleware, roleMiddleware("vendor")], addProduct);
router.put('/products/:productId', [authMiddleware, roleMiddleware("vendor")], editProduct);
router.delete('/products/:productId', [authMiddleware, roleMiddleware("vendor")], deleteProduct);
router.get('/products', [authMiddleware, roleMiddleware("vendor")], getVendorProducts);
router.get('/orders', [authMiddleware, roleMiddleware("vendor")], getVendorOrders);
router.patch('/orders/:orderId/status', [authMiddleware, roleMiddleware("vendor")], updateOrderStatus);
router.get('/categories', [authMiddleware, roleMiddleware("vendor")], getCategories);

module.exports = router;
