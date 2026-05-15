const express = require('express');
const { Op, fn, col, literal } = require('sequelize');
const ScanResult = require('../models/ScanResult');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// POST /result
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { nama_makanan, confidence, emisi_co2_kg, kategori_dampak } = req.body;

    const scan = await ScanResult.create({
      user_id: req.user.id,
      nama_makanan,
      confidence,
      emisi_co2_kg,
      kategori_dampak,
    });

    return res.status(201).json(scan);
  } catch (error) {
    return res.status(500).json({ detail: error.message });
  }
});

// GET /result
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    // Semua scan user
    const semuaScan = await ScanResult.findAll({ where: { user_id: userId } });
    const totalScan = semuaScan.length;
    const totalCo2e = semuaScan.reduce((acc, s) => acc + (s.emisi_co2_kg || 0), 0);

    // History 7 hari
    const history = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const targetDate = new Date(today);
      targetDate.setDate(today.getDate() - i);
      const dateStr = targetDate.toISOString().split('T')[0];

      const totalHari = semuaScan
        .filter(s => {
          const scanDate = new Date(s.scanned_at).toISOString().split('T')[0];
          return scanDate === dateStr;
        })
        .reduce((acc, s) => acc + (s.emisi_co2_kg || 0), 0);

      history.push(Math.round(totalHari * 10000) / 10000);
    }

    return res.status(200).json({
      total_scan: totalScan,
      total_co2e: Math.round(totalCo2e * 10000) / 10000,
      history,
    });
  } catch (error) {
    return res.status(500).json({ detail: error.message });
  }
});

module.exports = router;