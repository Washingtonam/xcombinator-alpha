const User = require('../models/user.model');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
    try {
        const { nin, fullName, phone, email, password } = req.body;

        if (!nin || !fullName || !phone || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const userExists = await User.findOne({ $or: [{ email }, { nin }] });
        if (userExists) {
            return res.status(400).json({ message: 'User with this Email or NIN already exists' });
        }

        const newUser = await User.create({ 
            nin, 
            fullName, 
            phone, 
            email, 
            password 
        });

        res.status(201).json({ 
            message: 'User created successfully', 
            user: { id: newUser._id, fullName: newUser.fullName } 
        });
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message });
        }
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        // 4. Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        // TODO: Generate JWT here in the next step
        res.status(200).json({ 
            message: 'Login successful', 
            user: { id: user._id, fullName: user.fullName, wallet: user.walletBalance } 
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
};