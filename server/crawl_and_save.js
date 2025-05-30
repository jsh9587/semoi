const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const pool = require('./db');

const router = express.Router();

// 크롤링 + DB 저장 API
router.post('/crawl-and-save', async (req, res) => {
  const { sourceId, url, titleSelector, priceSelector, linkSelector, imageSelector, periodSelector, periodDataAttr } = req.body;
  if (!url || !sourceId) return res.status(400).json({ error: 'url, sourceId 파라미터 필요' });

  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    // 데이터 추출
    const titles = titleSelector ? [] : undefined;
    const prices = priceSelector ? [] : undefined;
    const links = linkSelector ? [] : undefined;
    const images = imageSelector ? [] : undefined;
    const periods = periodSelector ? [] : undefined;

    if (titleSelector) $(titleSelector).each((i, el) => titles.push($(el).text().trim()));
    if (priceSelector) $(priceSelector).each((i, el) => prices.push($(el).text().trim()));
    if (linkSelector) $(linkSelector).each((i, el) => links.push($(el).attr('href')));
    if (imageSelector) $(imageSelector).each((i, el) => images.push($(el).attr('src')));
    if (periodSelector) {
      $(periodSelector).each((i, el) => {
        if (periodDataAttr) {
          const attrVal = $(el).attr(periodDataAttr);
          if (attrVal) periods.push(attrVal);
          else periods.push($(el).text().trim());
        } else {
          periods.push($(el).text().trim());
        }
      });
    }

    // 결과를 events 테이블에 저장 (최대 10개만 예시)
    const conn = await pool.getConnection();
    for (let i = 0; i < Math.max(
      titles?.length || 0,
      prices?.length || 0,
      links?.length || 0,
      images?.length || 0,
      periods?.length || 0
    ) && i < 10; i++) {
      await conn.query(
        `INSERT INTO crawled_events (source_id, title, price, link, image, period, raw_json) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          sourceId,
          titles ? titles[i] : null,
          prices ? prices[i] : null,
          links ? links[i] : null,
          images ? images[i] : null,
          periods ? periods[i] : null,
          JSON.stringify({ title: titles ? titles[i] : null, price: prices ? prices[i] : null, link: links ? links[i] : null, image: images ? images[i] : null, period: periods ? periods[i] : null })
        ]
      );
    }
    conn.release();

    res.json({ success: true, count: Math.max(
      titles?.length || 0,
      prices?.length || 0,
      links?.length || 0,
      images?.length || 0,
      periods?.length || 0
    ) });
  } catch (e) {
    res.status(500).json({ error: '크롤링 및 저장 실패', detail: e.message });
  }
});

module.exports = router;
