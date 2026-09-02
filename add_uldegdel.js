const mysql = require('mysql2/promise');
async function main() {
  const conn = await mysql.createConnection('mysql://root@localhost:3306/tugeelt');
  try {
    await conn.execute(`ALTER TABLE srcms_baraa ADD COLUMN uldegdel INT DEFAULT 0;`);
    console.log('Column uldegdel added successfully');
  } catch (err) {
    if (err.code === 'ER_DUP_FIELDNAME') {
      console.log('Column uldegdel already exists');
    } else {
      console.error(err);
    }
  }
  process.exit(0);
}
main();
