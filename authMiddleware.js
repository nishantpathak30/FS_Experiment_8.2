// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];

  // Check if header is present
  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  // Extract token (format: "Bearer <token>")
  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'Access denied: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // store decoded user data in request object
    next(); // proceed to next middleware or route
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

module.exports = verifyToken;
