const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Helper to generate token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Register User
exports.register = async (req, res) => {
    try {
        const { nin, fullName, phone, email, password } = req.body;
        
        const userExists = await User.findOne({ $or: [{ email }, { nin }] });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({ 
            nin, fullName, phone, email, password: hashedPassword 
        });

        res.status(201).json({ 
            user: { id: newUser._id, fullName: newUser.fullName, email: newUser.email },
            token: generateToken(newUser._id)
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
};

// Login User
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                user: { id: user._id, fullName: user.fullName, email: user.email },
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error: ' + err.message });
    }
};

// Get Profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};