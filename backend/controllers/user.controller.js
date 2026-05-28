const User = require('../models/user.model');

exports.getProfile = async (req, res) => {
    try {
        // Fetch user by ID (password excluded for security)
        const user = await User.findById(req.user.id).select('-password');
        
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};