const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

//register route
router.post('/register', authController.register);
//login route
router.post('/login', authController.login);

module.exports = router;