const { execSync } = require('child_process');
try {
  execSync('npx prisma validate', { stdio: 'pipe' });
  console.log("No error!");
} catch (e) {
  require('fs').writeFileSync('prisma_err_utf8.txt', e.stderr, {encoding: 'utf8'});
}
