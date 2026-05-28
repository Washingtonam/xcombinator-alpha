const User = require('../models/user.model');

exports.register = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        
        // Simple check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const newUser = await User.create({ fullName, email, password });
        res.status(201).json({ message: 'User created successfully', userId: newUser._id });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};