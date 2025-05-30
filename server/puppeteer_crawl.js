const express = require('express');
const pool = require('./db');
const router = express.Router();
const puppeteer = require('puppeteer');

// puppeteer 기반 크롤링 + DB 저장 API
router.post('/puppeteer-crawl-and-save', async (req, res) => {
  const { sourceId, url, titleSelector, priceSelector, linkSelector, imageSelector, periodSelector, periodDataAttr } = req.body;
  if (!url || !sourceId) return res.status(400).json({ error: 'url, sourceId 파라미터 필요' });

  let browser;
  try {
    browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 2000)); // 렌더링 대기

    // 데이터 추출
    const results = await page.evaluate((titleSelector, priceSelector, linkSelector, imageSelector, periodSelector, periodDataAttr) => {
      function getAttrOrText(el, attr) {
        if (!el) return null;
        if (attr) return el.getAttribute(attr) || el.textContent.trim();
        return el.textContent.trim();
      }
      const items = Array.from(document.querySelectorAll(titleSelector ? titleSelector : 'body > *'));
      return items.map((_, i) => {
        const title = titleSelector ? document.querySelectorAll(titleSelector)[i]?.textContent.trim() : null;
        const price = priceSelector ? document.querySelectorAll(priceSelector)[i]?.textContent.trim() : null;
        const link = linkSelector ? getAttrOrText(document.querySelectorAll(linkSelector)[i], 'href') || getAttrOrText(document.querySelectorAll(linkSelector)[i], 'onclick') : null;
        const image = imageSelector ? document.querySelectorAll(imageSelector)[i]?.getAttribute('src') : null;
        let period = null;
        if (periodSelector) {
          const el = document.querySelectorAll(periodSelector)[i];
          if (el) {
            period = periodDataAttr ? el.getAttribute(periodDataAttr) || el.textContent.trim() : el.textContent.trim();
          }
        }
        return { title, price, link, image, period };
      });
    }, titleSelector, priceSelector, linkSelector, imageSelector, periodSelector, periodDataAttr);

    // DB 저장 (최대 10개)
    const conn = await pool.getConnection();
    for (let i = 0; i < results.length && i < 10; i++) {
      const { title, price, link, image, period } = results[i];
      await conn.query(
        `INSERT INTO crawled_events (source_id, title, price, link, image, period, raw_json) VALUES (?, ?, ?, ?, ?, ?, ?)` ,
        [sourceId, title, price, link, image, period, JSON.stringify(results[i])]
      );
    }
    conn.release();
    await browser.close();
    res.json({ success: true, count: results.length });
  } catch (e) {
    if (browser) await browser.close();
    res.status(500).json({ error: 'puppeteer 크롤링 실패', detail: e.message });
  }
});

module.exports = router;
