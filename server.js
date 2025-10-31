// server.js
const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const verifyToken = require('./middleware/authMiddleware');

dotenv.config();

const app = express();
app.use(express.json());

// Hardcoded demo user
const user = {
  id: 1,
  username: 'nandini',
  password: 'password123'
};

// Route: Login → issues JWT token
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username !== user.username || password !== user.password) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Generate JWT token (expires in 1 hour)
  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({ message: 'Login successful', token });
});

// Protected route
app.get('/protected', verifyToken, (req, res) => {
  res.json({
    message: `Hello ${req.user.username}, you have access to this protected route!`,
    user: req.user
  });
});

// Public route
app.get('/', (req, res) => {
  res.send('Welcome! Please login to access protected routes.');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
