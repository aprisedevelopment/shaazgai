const mariadb = require('mariadb');
async function test() {
  let conn;
  try {
    const pool = mariadb.createPool('mariadb://tugeeltm_db:r3w%237j(m]%23Cc@localhost:3306/tugeeltm_db');
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
