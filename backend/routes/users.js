// USERS ROUTES
// This file handles getting user information
// Simple — just two routes

const express = require('express');
const router = express.Router();
const getDatabase = require('../db/database');
const jwt = require('jsonwebtoken');

// MIDDLEWARE — checks if user is logged in
function authenticate(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ error: 'Please login first' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token, please login again' });
  }
}

// GET ALL USERS — GET /api/users
// Used when assigning a task to someone
router.get('/', authenticate, (req, res) => {
  try {
    const db = getDatabase();

    // Get all users but never send passwords!
    const users = db.prepare(
      'SELECT id, username, role FROM users'
    ).all();

    res.json(users);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not get users' });
  }
});

// GET MY PROFILE — GET /api/users/me
// Returns the currently logged in user's info
router.get('/me', authenticate, (req, res) => {
  try {
    const db = getDatabase();

    const user = db.prepare(
      'SELECT id, username, role FROM users WHERE id = ?'
    ).get(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not get profile' });
  }
});

module.exports = router;