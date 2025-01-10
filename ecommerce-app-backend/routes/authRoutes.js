const express = require('express');
const { body } = require('express-validator');
const authMiddleware = require('../middlewares/authMiddleware');
const { register, login, adminApproval, forgotPassword, resetPassword, updateProfile, getProfile } = require('../controllers/authController');
const router = express.Router();

router.post(
    '/signup',
    [
        body('username').notEmpty().withMessage('Username is required'),
        body('email').isEmail().withMessage('Valid email is required'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
        body('role').isIn(['buyer', 'vendor', 'admin']).withMessage('Valid role is required'),
    ],
    register
);
router.post('/login', login);
router.put('/update-profile', authMiddleware, updateProfile);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/profile', authMiddleware, getProfile);
router.get('/approve-admin/:userId', adminApproval);


module.exports = router;
