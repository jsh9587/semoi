// 알림 발송 유틸 (이메일/SMS/슬랙 등 확장 가능)
const fs = require('fs');
const path = require('path');

// 예시: 관리자/고객 이메일 목록을 settings.json에 저장
function getNotificationSettings() {
  const settingsPath = path.join(__dirname, 'settings.json');
  if (fs.existsSync(settingsPath)) {
    return JSON.parse(fs.readFileSync(settingsPath, 'utf-8'));
  }
  return { adminEmails: [], customerNotify: false };
}

// 실제 알림 발송 함수 (이메일/SMS/슬랙 등 확장 가능)
async function sendNotification({ to, subject, message }) {
  // 실제 이메일/SMS/슬랙 연동은 여기서 구현
  console.log(`[알림] to: ${to}, subject: ${subject}, message: ${message}`);
  // 예: nodemailer, twilio, slack webhook 등
}

// 관리자 알림
async function notifyAdmins(subject, message) {
  const { adminEmails = [] } = getNotificationSettings();
  for (const email of adminEmails) {
    await sendNotification({ to: email, subject, message });
  }
}

// 고객 알림
async function notifyCustomers(subject, message) {
  const { customerNotify, customerEmails = [] } = getNotificationSettings();
  if (!customerNotify) return;
  for (const email of customerEmails) {
    await sendNotification({ to: email, subject, message });
  }
}

module.exports = { notifyAdmins, notifyCustomers };
