const express = require('express');
const router = express.Router();
const authController = require('../controller/authcontroller');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profile', authController.protect, authController.getProfile);

module.exports = router;
