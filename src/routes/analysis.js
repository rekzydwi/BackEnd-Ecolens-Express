const express = require('express');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const authMiddleware = require('../middleware/auth');
require('dotenv').config();

const router = express.Router();

// Simpan gambar di memory sementara (tidak perlu simpan ke disk)
const upload = multer({ storage: multer.memoryStorage() });

// POST /static-analysis
router.post('/', authMiddleware, upload.single('gambar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ detail: 'File gambar tidak ditemukan' });
    }

    // Teruskan gambar ke FastAPI
    const formData = new FormData();
    formData.append('gambar', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    const response = await axios.post(
      `${process.env.FASTAPI_URL}/static-analysis`,
      formData,
      { headers: formData.getHeaders() }
    );

    return res.status(200).json(response.data);
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }
    return res.status(500).json({ detail: error.message });
  }
});

module.exports = router;