const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
require('dotenv').config();

const router = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Daftar akun baru
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Rekzy
 *               email:
 *                 type: string
 *                 example: rekzy@gmail.com
 *               password:
 *                 type: string
 *                 example: rekzy123
 *     responses:
 *       201:
 *         description: Berhasil daftar
 *       409:
 *         description: Email sudah terdaftar
 */
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const sudahAda = await User.findOne({ where: { email } });
    if (sudahAda) {
      return res.status(409).json({ detail: 'Email sudah terdaftar' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    return res.status(201).json({
      access_token: token,
      token_type: 'bearer',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    return res.status(500).json({ detail: error.message });
  }
});


/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login dengan email dan password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: rekzy@gmail.com
 *               password:
 *                 type: string
 *                 example: rekzy123
 *     responses:
 *       200:
 *         description: Berhasil login
 *       401:
 *         description: Email atau password salah
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ detail: 'Email atau password salah' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ detail: 'Email atau password salah' });
    }

    const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    return res.status(200).json({
      access_token: token,
      token_type: 'bearer',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    return res.status(500).json({ detail: error.message });
  }
});


/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Ambil data user yang sedang login
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Data user berhasil diambil
 *       401:
 *         description: Token tidak valid
 */
router.get('/me', authMiddleware, (req, res) => {
  const user = req.user;
  return res.status(200).json({
    id: user.id,
    name: user.name,
    email: user.email,
    created_at: user.created_at,
  });
});


/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Berhasil logout
 *       401:
 *         description: Token tidak valid
 */
router.post('/logout', authMiddleware, (req, res) => {
  return res.status(200).json({ message: `Sampai jumpa, ${req.user.name}!` });
});

module.exports = router;