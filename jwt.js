const jwt = require('jsonwebtoken');

const jwtAuthMiddleWare = (req, res, next) => {
    const authorization = req.headers.authorization;
    
    if (!authorization) {
        return res.status(401).json({ error: 'Token Not Found' });
    }
    
    const token = authorization.split(' ')[1];  // Splitting on space to get the token
    
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Verifying token
        req.user = decoded;  // Attaching the decoded payload to req.user
        next();  // Proceed to the next middleware or route handler
    } catch (error) {
        console.error(error);
        return res.status(401).json({ error: 'Invalid Token' });
    }
};

const generateToken = (userData) => {
    return jwt.sign(userData, process.env.JWT_SECRET,{expiresIn:30000});  // Token expires in 30 minutes
};

module.exports = { jwtAuthMiddleWare, generateToken };
