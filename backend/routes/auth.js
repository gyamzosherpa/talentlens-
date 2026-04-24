import express from 'express';
import bcrypt from 'bcryptjs';
import passport from '../config/passport.js';
import pool from '../db/index.js';

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: 'Name, email and password are required.' });

    if (password.length < 6)
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });

    const exists = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (exists.rows.length > 0)
      return res.status(409).json({ error: 'Email already registered.' });

    const hash = await bcrypt.hash(password, 12);
    const result = await pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, role',
      [name, email, hash]
    );

    const user = result.rows[0];
    req.login(user, (err) => {
      if (err) return res.status(500).json({ error: 'Login after register failed.' });
      res.status(201).json({ user });
    });
  } catch (err) {
    console.error('[auth] register error:', err);
    res.status(500).json({ error: 'Registration failed.' });
  }
});

// POST /api/auth/login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ error: info?.message || 'Login failed.' });
    req.login(user, (err) => {
      if (err) return next(err);
      res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    });
  })(req, res, next);
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  req.logout(() => res.json({ message: 'Logged out.' }));
});

// GET /api/auth/me
router.get('/me', (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Not authenticated.' });
  res.json({ user: req.user });
});

export default router;
