const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 크롤링 API
app.get('/api/crawl', async (req, res) => {
  const { url, titleSelector, priceSelector, linkSelector, imageSelector, periodSelector, periodDataAttr } = req.query;
  if (!url) return res.status(400).json({ error: 'url 파라미터 필요' });

  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    // 동적으로 전달받은 선택자로 데이터 추출
    const titles = titleSelector ? [] : undefined;
    const prices = priceSelector ? [] : undefined;
    const links = linkSelector ? [] : undefined;
    const images = imageSelector ? [] : undefined;
    const periods = periodSelector ? [] : undefined;

    if (titleSelector) {
      $(titleSelector).each((i, el) => titles.push($(el).text().trim()));
    }
    if (priceSelector) {
      $(priceSelector).each((i, el) => prices.push($(el).text().trim()));
    }
    if (linkSelector) {
      $(linkSelector).each((i, el) => links.push($(el).attr('href')));
    }
    if (imageSelector) {
      $(imageSelector).each((i, el) => images.push($(el).attr('src')));
    }
    if (periodSelector) {
      $(periodSelector).each((i, el) => {
        if (periodDataAttr) {
          const attrVal = $(el).attr(periodDataAttr);
          if (attrVal) {
            periods.push(attrVal);
          } else {
            periods.push($(el).text().trim());
          }
        } else {
          periods.push($(el).text().trim());
        }
      });
    }

    res.json({ titles, prices, links, images, periods });
  } catch (e) {
    res.status(500).json({ error: '크롤링 실패', detail: e.message });
  }
});

const crawlAndSaveRouter = require('./crawl_and_save');
const eventSourcesApi = require('./event_sources_api');
const crawledEventsApi = require('./crawled_events_api');
const puppeteerCrawlRouter = require('./puppeteer_crawl');
const settingsApi = require('./settings_api');
app.use('/api', crawlAndSaveRouter);
app.use('/api', eventSourcesApi);
app.use('/api', crawledEventsApi);
app.use('/api', puppeteerCrawlRouter);
app.use('/api', settingsApi);

const { startCrawlingJob } = require('./cron');
startCrawlingJob();

app.listen(3001, () => {
  console.log('Express 서버가 3001번 포트에서 실행 중!');
});
