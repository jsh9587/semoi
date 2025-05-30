// 이벤트 소스 테이블에 시간, 장소, 설명 선택자 컬럼 추가 마이그레이션
const pool = require('./db');

async function migrate() {
  try {
    await pool.query(`ALTER TABLE event_sources 
      ADD COLUMN time_selector VARCHAR(255) DEFAULT NULL,
      ADD COLUMN location_selector VARCHAR(255) DEFAULT NULL,
      ADD COLUMN desc_selector VARCHAR(255) DEFAULT NULL
    `);
    console.log('event_sources 테이블에 time_selector, location_selector, desc_selector 컬럼 추가 완료');
    process.exit(0);
  } catch (e) {
    console.error('마이그레이션 실패:', e);
    process.exit(1);
  }
}

migrate();
