const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) =>{
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(403).json({ error: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    if(!token){
        return res.status(403).json({error: 'Access denied. No token provided.'});
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decodedUser) =>{
        if(err){
            return res.status(403).json({error: 'Access denied. Unauthorized'});
        }

        req.user = decodedUser;
        next();
    });
}

module.exports = authenticateJWT;