const User = require('../models/user.model');

// Make sure you are using 'exports.register'
exports.register = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const newUser = await User.create({ fullName, email, password });
        res.status(201).json({ message: 'User created successfully', userId: newUser._id });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Add this placeholder so the router doesn't break
exports.login = async (req, res) => {
    res.status(200).json({ message: 'Login endpoint' });
};