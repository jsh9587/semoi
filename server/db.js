require('dotenv').config({ path: __dirname + '/.env' });
const mysql = require('mysql2/promise');
console.log('DB ENV:', process.env.DB_USERNAME, process.env.DB_PASSWORD);

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
