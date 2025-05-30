const cron = require('node-cron');
const fs = require('fs');
const path = require('path');
const pool = require('./db');

let task = null;

function getSettings() {
  const settingsPath = path.join(__dirname, 'settings.json');
  if (fs.existsSync(settingsPath)) {
    return JSON.parse(fs.readFileSync(settingsPath, 'utf-8'));
  }
  return { crawlInterval: 6 };
}

const pLimit = require('./pLimit');

async function runAllSources() {
  // 모든 이벤트 소스 불러오기
  const [sources] = await pool.query('SELECT * FROM event_sources');
  const { maxConcurrent = 5 } = getSettings();
  const limit = pLimit(maxConcurrent);
  await Promise.all(sources.map(source =>
    limit(async () => {
      try {
        const res = await fetch('http://localhost:3001/api/puppeteer-crawl-and-save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sourceId: source.id,
            url: source.url,
            titleSelector: source.title_selector,
            priceSelector: source.price_selector,
            linkSelector: source.link_selector,
            imageSelector: source.image_selector,
            periodSelector: source.period_selector,
            periodDataAttr: source.period_data_attr,
            timeSelector: source.time_selector,
            locationSelector: source.location_selector,
            descSelector: source.desc_selector
          })
        });
        const data = await res.json();
        console.log(`[자동크롤링] 소스ID ${source.id} 저장:`, data.count);
      } catch (e) {
        console.error(`[자동크롤링] 소스ID ${source.id} 실패:`, e);
      }
    })
  ));
}

function startCrawlingJob() {
  if (task) task.stop();
  const { crawlInterval } = getSettings();
  const cronExp = `0 */${crawlInterval} * * *`;
  task = cron.schedule(cronExp, () => {
    console.log('자동 크롤링 실행!');
    runAllSources();
  });
  task.start();
  console.log(`크롤링 스케줄러가 ${crawlInterval}시간마다 실행되도록 설정됨`);
}

function updateCrawlingSchedule() {
  startCrawlingJob();
}

module.exports = { startCrawlingJob, updateCrawlingSchedule, runAllSources };
