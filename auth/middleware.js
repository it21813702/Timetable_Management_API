//cretae middleware function to veryfy JWT tokents for protected routes

const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

function authenticateToken(req, res, next) {
  const token = req.headers.authorization.split(" ")[1]; //extract token from auth header
  
  if (!token) {
    return res.status(401).json({ message: 'Auth header missing, please include a JWT token' });
  }

  try {
    //verify token and decode payload
    const decoded = jwt.verify(token, JWT_SECRET); 
    req.user = decoded;
    next(); //called when successfully authenticated

  } catch (error) {
    res.status(403).json({ message: 'Invalid token' });
  
  }
};

module.exports = authenticateToken;