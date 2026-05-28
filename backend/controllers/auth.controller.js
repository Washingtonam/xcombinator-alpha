const User = require('../models/User'); // Use the exact filename case
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
    try {
        const { nin, fullName, phone, email, password } = req.body;
        
        // 1. Check if user already exists (by Email OR NIN)
        const userExists = await User.findOne({ $or: [{ email }, { nin }] });
        if (userExists) {
            return res.status(400).json({ message: 'User with this Email or NIN already exists' });
        }

        // 2. Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Create new user
        const newUser = await User.create({ 
            nin, 
            fullName, 
            phone, 
            email, 
            password: hashedPassword 
        });

        res.status(201).json({ 
            message: 'User created successfully', 
            user: { id: newUser._id, fullName: newUser.fullName } 
        });
    } catch (err) {
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