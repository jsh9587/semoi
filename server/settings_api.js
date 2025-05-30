const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const SETTINGS_PATH = path.join(__dirname, 'settings.json');

// 기본값
const defaultSettings = {
  crawlInterval: 6,
  maxConcurrent: 5,
  approvalNotify: true,
  errorNotify: true,
  adminEmails: [],
  customerNotify: false,
  customerEmails: [],
  notifyType: "email", // email, sms, kakao
  notifyTriggers: ["approval_request", "error", "new_event"] // 확장 가능

};

function readSettings() {
  try {
    if (fs.existsSync(SETTINGS_PATH)) {
      const raw = fs.readFileSync(SETTINGS_PATH, 'utf-8');
      return { ...defaultSettings, ...JSON.parse(raw) };
    }
  } catch {}
  return { ...defaultSettings };
}

function writeSettings(settings) {
  fs.writeFileSync(SETTINGS_PATH, JSON.stringify(settings, null, 2), 'utf-8');
}

// GET: 설정 조회
router.get('/settings', (req, res) => {
  res.json(readSettings());
});

// PUT: 설정 저장
const { updateCrawlingSchedule } = require('./cron');
router.put('/settings', (req, res) => {
  const settings = { ...defaultSettings, ...req.body };
  writeSettings(settings);
  updateCrawlingSchedule();
  res.json(settings);
});

module.exports = router;
