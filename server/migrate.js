require('dotenv').config();
const pool = require('./db');

async function migrate() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS event_sources (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      url TEXT NOT NULL,
      category VARCHAR(100),
      title_selector VARCHAR(255),
      price_selector VARCHAR(255),
      link_selector VARCHAR(255),
      image_selector VARCHAR(255),
      period_selector VARCHAR(255),
      period_data_attr VARCHAR(255),
      status VARCHAR(50),
      last_crawled DATETIME,
      success_rate INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    const conn = await pool.getConnection();
    await conn.query(createTableQuery);
    conn.release();
    console.log('마이그레이션 완료: event_sources 테이블 생성');
  } catch (err) {
    console.error('마이그레이션 실패:', err);
  } finally {
    process.exit();
  }
}

migrate();
