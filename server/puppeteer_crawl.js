const express = require('express');
const pool = require('./db');
const router = express.Router();
const puppeteer = require('puppeteer');

// puppeteer 기반 크롤링 + DB 저장 API
router.post('/puppeteer-crawl-and-save', async (req, res) => {
  const { sourceId, url, titleSelector, priceSelector, linkSelector, imageSelector, periodSelector, periodDataAttr, timeSelector, locationSelector, descSelector } = req.body;
  if (!url || !sourceId) return res.status(400).json({ error: 'url, sourceId 파라미터 필요' });

  let browser;
  try {
    browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 2000)); // 렌더링 대기

    // 데이터 추출
    const results = await page.evaluate((titleSelector, priceSelector, linkSelector, imageSelector, periodSelector, periodDataAttr, timeSelector, locationSelector, descSelector) => {
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
        const time = timeSelector ? document.querySelectorAll(timeSelector)[i]?.textContent.trim() : null;
        const location = locationSelector ? document.querySelectorAll(locationSelector)[i]?.textContent.trim() : null;
        const description = descSelector ? document.querySelectorAll(descSelector)[i]?.textContent.trim() : null;
        return { title, price, link, image, period, time, location, description };
      });
    }, titleSelector, priceSelector, linkSelector, imageSelector, periodSelector, periodDataAttr, timeSelector, locationSelector, descSelector);

    // DB 저장 (최대 10개, 중복 타이틀/링크는 건너뜀)
    const conn = await pool.getConnection();
    for (let i = 0; i < results.length && i < 10; i++) {
      const { title, price, link, image, period, time, location, description } = results[i];
      // 중복 체크: 같은 source_id, title, link가 이미 있으면 건너뜀
      const [dups] = await conn.query(
        `SELECT id FROM crawled_events WHERE source_id=? AND title=? AND link=?`,
        [sourceId, title, link]
      );
      if (dups.length > 0) continue;
      await conn.query(
        `INSERT INTO crawled_events (source_id, title, price, link, image, period, time, location, description, raw_json) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)` ,
        [sourceId, title, price, link, image, period, time, location, description, JSON.stringify(results[i])]
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
