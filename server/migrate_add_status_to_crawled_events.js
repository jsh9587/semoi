require('dotenv').config({ path: __dirname + '/.env' });
const pool = require('./db');

async function migrate() {
  const alterTableQuery = `
    ALTER TABLE crawled_events
    ADD COLUMN status VARCHAR(50) DEFAULT 'pending' AFTER period;
  `;
  try {
    const conn = await pool.getConnection();
    await conn.query(alterTableQuery);
    conn.release();
    console.log('마이그레이션 완료: crawled_events.status 컬럼 추가');
  } catch (err) {
    if (err.message.includes('Duplicate column name')) {
      console.log('이미 status 컬럼이 존재합니다.');
    } else {
      console.error('마이그레이션 실패:', err);
    }
  } finally {
    process.exit();
  }
}

migrate();
