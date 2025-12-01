//middleware for token verification

const authMiddleware = (req, res, next) => {
    //get token from headers
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(!token){
        return res.status(401).json({message: 'No token provided'});
    }

    try{
    //simple token verification userId_timestamp
    const [userId] = token.split('-');
    req.userId = parseInt(userId);
    next();
    } catch (error){
        return res.status(403).json({message: 'Invalid token'});
    }
};

module.exports = authMiddleware;
