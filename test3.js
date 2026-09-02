const mariadb = require('mariadb');
async function test() {
  let conn;
  try {
    const pool = mariadb.createPool({
      host: 'localhost',
      user: 'tugeeltm_db',
      password: 'r3w#7j(m]#Cc',
      database: 'tugeeltm_db',
      port: 3306
    });
    conn = await pool.getConnection();
    console.log("Connected! DB Version:", await conn.query("SELECT VERSION()"));
  } catch (err) {
    console.error("Connection failed:", err);
  } finally {
    if (conn) conn.release();
    process.exit();
  }
}
test();
