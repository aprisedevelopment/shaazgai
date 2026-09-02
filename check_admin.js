const mariadb = require('mariadb');
const crypto = require('crypto');

async function checkAdmin() {
  let conn;
  try {
    conn = await mariadb.createConnection({
      host: 'localhost', 
      user: 'root', 
      password: '',
      database: 'tugeelt'
    });
    
    const rows = await conn.query("DESCRIBE srcms_zahialga");
    console.log('Columns:', rows.map(r => `${r.Field}: ${r.Type}`));
  } catch (err) {
    console.log(err);
  } finally {
    if (conn) conn.end();
  }
}

checkAdmin();
