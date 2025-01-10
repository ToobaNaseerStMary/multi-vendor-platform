const express = require('express');
const { check } = require('express-validator');
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = express.Router();

// Categories CRUD
router.post(
  '/categories',
  [authMiddleware, roleMiddleware("admin"), check('name', 'Category name is required').notEmpty()],
  adminController.createCategory
);
router.get('/categories', [authMiddleware, roleMiddleware("admin")], adminController.getCategories);
router.put(
  '/categories/:id',
  [authMiddleware, roleMiddleware("admin"), check('name', 'Category name is required').notEmpty()],
  adminController.updateCategory
);
router.delete('/categories/:id', authMiddleware, roleMiddleware("admin"), adminController.deleteCategory);

// Products CRUD
router.post(
  '/products',
  [authMiddleware, roleMiddleware("admin"), check('name', 'Product name is required').notEmpty()],
  adminController.createProduct
);
router.get('/products', authMiddleware, roleMiddleware("admin"), adminController.getProducts);
router.put('/products/:id', authMiddleware, roleMiddleware("admin"), adminController.updateProduct);
router.delete('/products/:id', authMiddleware, roleMiddleware("admin"), adminController.deleteProduct);

// Orders CRUD
router.get('/orders', authMiddleware, roleMiddleware("admin"), adminController.getOrders);
router.put('/orders/:id', authMiddleware, roleMiddleware("admin"), adminController.updateOrderStatus);
router.delete('/orders/:id', authMiddleware, roleMiddleware("admin"), adminController.deleteOrder);

// Users CRUD
router.get('/users', authMiddleware, roleMiddleware("admin"), adminController.getUsers);
router.delete('/users/:id', authMiddleware, roleMiddleware("admin"), adminController.deleteUser);
router.put('/users/:id', authMiddleware, roleMiddleware("admin"), adminController.updateUser);

module.exports = router;
