const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');
const router = express.Router();

//register route
router.post('/register', authController.register);
//login route
router.post('/login', authController.login);

//Get current user info (protected route)
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const user = await User.findByPk(req.userId, {
            attributes: ['id', 'firstName', 'lastName', 'email']
        });
        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({message: 'Error fetching user', error: error.message});
    }
});

module.exports = router;