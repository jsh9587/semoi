const express = require('express');
const pool = require('./db');
const router = express.Router();

// 이벤트 소스 목록 조회
router.get('/event-sources', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM event_sources ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'DB 조회 실패', detail: err.message });
  }
});

// 이벤트 소스 추가
router.post('/event-sources', async (req, res) => {
  const { name, url, category, titleSelector, priceSelector, linkSelector, imageSelector, periodSelector, periodDataAttr } = req.body;
  try {
    const [result] = await pool.query(
      `INSERT INTO event_sources (name, url, category, title_selector, price_selector, link_selector, image_selector, period_selector, period_data_attr) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, url, category, titleSelector, priceSelector, linkSelector, imageSelector, periodSelector, periodDataAttr]
    );
    res.json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: 'DB 추가 실패', detail: err.message });
  }
});

// 이벤트 소스 수정
router.put('/event-sources/:id', async (req, res) => {
  const { id } = req.params;
  const { name, url, category, titleSelector, priceSelector, linkSelector, imageSelector, periodSelector, periodDataAttr } = req.body;
  try {
    await pool.query(
      `UPDATE event_sources SET name=?, url=?, category=?, title_selector=?, price_selector=?, link_selector=?, image_selector=?, period_selector=?, period_data_attr=? WHERE id=?`,
      [name, url, category, titleSelector, priceSelector, linkSelector, imageSelector, periodSelector, periodDataAttr, id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'DB 수정 실패', detail: err.message });
  }
});

// 이벤트 소스 삭제
router.delete('/event-sources/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM event_sources WHERE id=?', [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'DB 삭제 실패', detail: err.message });
  }
});

module.exports = router;
