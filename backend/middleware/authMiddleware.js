const jwt = require('jsonwebtoken');

exports.protect = (req, res, next) => {
    let token = req.headers.authorization;

    if (!token || !token.startsWith('Bearer')) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
};