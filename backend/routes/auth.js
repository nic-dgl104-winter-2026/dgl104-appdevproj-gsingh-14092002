// AUTH ROUTES
// This file handles two things only:
// 1. Register — create a new account
// 2. Login — check username and password

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const getDatabase = require('../db/database');
const createUser = require('../patterns/factory');

// REGISTER — POST /api/auth/register
// When someone fills the register form, this runs
router.post('/register', (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Check if username and password were provided
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const db = getDatabase();

    // Check if username already exists
    const existingUser = db.prepare(
      'SELECT * FROM users WHERE username = ?'
    ).get(username);

    if (existingUser) {
      return res.status(400).json({ error: 'Username already taken' });
    }

    // Use Factory Pattern to create user with correct role
    const newUser = createUser(username, password, role || 'developer');

    // Hash the password — never store plain passwords!
    // bcrypt turns "mypassword" into a scrambled string
    const hashedPassword = bcrypt.hashSync(newUser.password, 10);

    // Save user to database
    const result = db.prepare(
      'INSERT INTO users (username, password, role) VALUES (?, ?, ?)'
    ).run(newUser.username, hashedPassword, newUser.role);

    res.status(201).json({
      message: 'Account created successfully!',
      userId: result.lastInsertRowid,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// LOGIN — POST /api/auth/login
// When someone fills the login form, this runs
router.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if username and password were provided
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const db = getDatabase();

    // Find the user in database
    const user = db.prepare(
      'SELECT * FROM users WHERE username = ?'
    ).get(username);

    // If user not found
    if (!user) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    // Check if password matches
    const passwordMatch = bcrypt.compareSync(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    // Create a token — like a temporary ID card for the session
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful!',
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;