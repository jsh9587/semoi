const express = require('express');
const pool = require('./db');
const router = express.Router();

// 크롤링 결과 목록 조회 (status 필터 지원)
router.get('/crawled-events', async (req, res) => {
  try {
    const status = req.query.status;
    let query = 'SELECT * FROM crawled_events';
    let params = [];
    if (status) {
      query += ' WHERE status=?';
      params.push(status);
    }
    query += ' ORDER BY crawled_at DESC LIMIT 100';
    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'DB 조회 실패', detail: err.message });
  }
});

// 크롤링 결과 수정(승인/거절/수정)
router.put('/crawled-events/:id', async (req, res) => {
  const { id } = req.params;
  const { status, title, price, link, image, period } = req.body;
  try {
    await pool.query(
      `UPDATE crawled_events SET status=?, title=?, price=?, link=?, image=?, period=? WHERE id=?`,
      [status, title, price, link, image, period, id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'DB 수정 실패', detail: err.message });
  }
});

module.exports = router;
