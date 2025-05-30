require('dotenv').config({ path: __dirname + '/.env' });
const pool = require('./db');

async function migrate() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS crawled_events (
      id INT AUTO_INCREMENT PRIMARY KEY,
      source_id INT,
      title VARCHAR(255),
      price VARCHAR(255),
      link TEXT,
      image TEXT,
      period VARCHAR(255),
      raw_json JSON,
      crawled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (source_id) REFERENCES event_sources(id) ON DELETE CASCADE
    );
  `;

  try {
    const conn = await pool.getConnection();
    await conn.query(createTableQuery);
    conn.release();
    console.log('마이그레이션 완료: crawled_events 테이블 생성');
  } catch (err) {
    console.error('마이그레이션 실패:', err);
  } finally {
    process.exit();
  }
}

migrate();
