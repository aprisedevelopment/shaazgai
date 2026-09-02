const mysql = require('mysql2/promise');
async function main() {
  const conn = await mysql.createConnection('mysql://root@localhost:3306/tugeelt');
  await conn.execute(`CREATE TABLE IF NOT EXISTS srcms_notifications (
    id INT AUTO_INCREMENT PRIMARY KEY, 
    title VARCHAR(255) NOT NULL, 
    message TEXT, 
    type VARCHAR(50) DEFAULT 'info', 
    isRead BOOLEAN DEFAULT false, 
    link VARCHAR(255), 
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
  console.log('Table created');
  process.exit(0);
}
main();
