const mysql = require('mysql2/promise');
async function test() {
  try {
    const conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'tugeelt'
    });
    console.log('mysql2 connected successfully!');
    await conn.end();
  } catch(e) {
    console.error('mysql2 failed:', e);
  }
}
test();
