const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const source = path.join(root, 'node_modules', '@waline', 'client', 'dist');
const target = path.join(root, 'themes', 'chaoguang', 'source', 'vendor', 'waline');
if (!fs.existsSync(source)) throw new Error('缺少依赖，请先运行 npm ci。');
fs.mkdirSync(target, { recursive: true });
// Copy individual files: fs.cp directory metadata can be restricted on Windows.
for (const file of ['waline.js', 'waline.css', 'waline.js.map', 'waline.css.map']) {
  fs.copyFileSync(path.join(source, file), path.join(target, file));
}
console.log('Waline 客户端已准备就绪（本地托管，无需外部 CDN）。');
