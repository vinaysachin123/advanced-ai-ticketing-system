const { PrismaClient } = require('@prisma/client');
try {
  const prisma = new PrismaClient();
  console.log("SUCCESS!");
} catch(e) {
  require('fs').writeFileSync('err_utf8.txt', e.toString() + "\n" + e.stack, {encoding: 'utf8'});
}
