const express = require('express');
const pool = require('./db');
const router = express.Router();

// 크롤링 결과 목록 조회
router.get('/crawled-events', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM crawled_events ORDER BY crawled_at DESC LIMIT 100');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'DB 조회 실패', detail: err.message });
  }
});

module.exports = router;
