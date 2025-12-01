const User = require('../models/User');

//register new user

exports.register = async (req, res) => {
    try {
        const {email, password, firstName, lastName} = req.body;

        //check if user already exists
        const existingUser = await User.findOne({where: {email}});
        if(existingUser){
            return res.status(400).json({message: 'User already exists'});
        }

        //create new user
        const newUser = await User.create({email, password, firstName, lastName});
        res.status(201).json({message: 'User registered successfully', userId: newUser.id, email: newUser.email});
    } catch (error) {
        res.status(500).json({message: 'Server error', error: error.message});
    }
};

//login user
exports.login = async (req, res) => {
    try {
        const {email, password} = req.body;

        //find user by email
        const user = await User.findOne({where: {email}});
        if(!user || user.password !== password){
            return res.status(401).json({message: 'Invalid email or password'});
        }

        //create simple session token
        const token = '${user.id}-${Date.now()}';
        res.status(200).json({message: 'Login successful', token, id: user.id, email: user.email, firstName: user.firstName});
    } catch (error) {
        res.status(500).json({message: 'Server error', error: error.message});
    }
}