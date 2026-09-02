const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
try {
  const adapter = new PrismaMariaDb('mariadb://johndoe:randompassword@localhost:3306/mydb');
  console.log("Success");
} catch(e) {
  console.error("String failed", e);
}
try {
  const adapter2 = new PrismaMariaDb({
    host: 'localhost',
    user: 'johndoe',
    password: 'randompassword',
    database: 'mydb'
  });
  console.log("Config object success");
} catch (e) {
  console.error("Object failed", e);
}
