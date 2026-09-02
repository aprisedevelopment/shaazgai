const mariadb = require('mariadb')
const fs = require('fs')

async function run() {
  const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'tugeelt',
    connectionLimit: 1
  })

  let conn
  try {
    conn = await pool.getConnection()
    
    // Create srcms_favorites table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS srcms_favorites (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userid INT DEFAULT 0,
        sesid VARCHAR(100),
        bid INT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX userid_idx (userid),
        INDEX sesid_idx (sesid),
        INDEX bid_idx (bid)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `)
    console.log('srcms_favorites table created successfully')

  } catch (err) {
    console.error('Error:', err)
  } finally {
    if (conn) conn.release()
    await pool.end()
  }
}

run()
