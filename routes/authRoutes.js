const express = require('express');
const { signup, login, forgotPassword, resetPassword} = require('../controllers/authController');
const router = express.Router();

// POST /signup - Create a new user
router.post('/signup', signup);

// POST /login - Authenticate user and return JWT token
router.post('/login', login);

// Forgot password route
router.post('/forgot-password', forgotPassword);

// Reset password route
router.post('/reset-password/:token', resetPassword);

module.exports = router;
