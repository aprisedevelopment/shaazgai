const mariadb = require('mariadb');

const pool = mariadb.createPool({
  host: 'localhost', 
  user: 'root', 
  password: '',
  database: 'tugeelt',
  connectionLimit: 5
});

async function main() {
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.query("ALTER TABLE srcms_baraa ADD COLUMN options TEXT NULL");
    console.log("Success");
  } catch (err) {
    if (err.code === 'ER_DUP_FIELDNAME') {
       console.log("Column already exists");
    } else {
       console.log(err);
    }
  } finally {
    if (conn) conn.end();
    process.exit(0);
  }
}
main();
