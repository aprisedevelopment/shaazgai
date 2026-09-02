const mariadb = require('mariadb');
async function test() {
  const pool = mariadb.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'tugeelt',
    connectionLimit: 5
  });
  try {
    console.log('Testing localhost...');
    const conn = await pool.getConnection();
    console.log('localhost connected!');
    conn.release();
  } catch (e) {
    console.error('localhost failed:', e.message);
  }
  
  const pool2 = mariadb.createPool({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: '',
    database: 'tugeelt',
    connectionLimit: 5
  });
  try {
    console.log('Testing 127.0.0.1...');
    const conn2 = await pool2.getConnection();
    console.log('127.0.0.1 connected!');
    conn2.release();
  } catch (e) {
    console.error('127.0.0.1 failed:', e.message);
  }
  
  process.exit(0);
}
test();
