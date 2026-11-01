/* Verify the generated site, including project-page subpaths. No network required. */
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const publicDir = path.resolve(__dirname, '..', 'public');
const home = fs.readFileSync(path.join(publicDir, 'index.html'), 'utf8');
const configMatch = home.match(/<script id="site-config" type="application\/json">([\s\S]*?)<\/script>/);
assert(configMatch, '缺少客户端配置');
const config = JSON.parse(configMatch[1]);
const prefix = new URL(config.root, 'https://local.test').pathname;
const files = fs.readdirSync(publicDir, {recursive: true}).filter(file => fs.statSync(path.join(publicDir, file)).isFile());
const pages = files.filter(file => file.endsWith('.html'));
const failures = [];
let references = 0;
function checkReference(reference, sourceFile, css = false) {
  if (!reference || /^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(reference)) return;
  const normalizedFile = sourceFile.split(path.sep).join('/');
  const url = new URL(reference.replaceAll('&amp;', '&'), `https://local.test${prefix}${normalizedFile}`);
  if (!url.pathname.startsWith(prefix)) { failures.push(`${sourceFile}: 引用越过站点子路径 ${reference}`); return; }
  const relative = decodeURIComponent(url.pathname.slice(prefix.length));
  let target = path.join(publicDir, relative);
  if (fs.existsSync(target) && fs.statSync(target).isDirectory()) target = path.join(target, 'index.html');
  if (!fs.existsSync(target)) failures.push(`${sourceFile}: 缺少 ${relative}`);
  references++;
}
for (const file of pages) {
  const html = fs.readFileSync(path.join(publicDir, file), 'utf8');
  assert(!/<%=|<%-/.test(html), `模板未渲染: ${file}`);
  assert(/<title>[^<]+<\/title>/.test(html), `缺少标题: ${file}`);
  for (const match of html.matchAll(/(?:href|src)="([^"]*)"/g)) checkReference(match[1], file);
}
for (const file of files.filter(file => file.endsWith('.css') && !file.includes('vendor'))) {
  const css = fs.readFileSync(path.join(publicDir, file), 'utf8');
  for (const match of css.matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g)) checkReference(match[1], file, true);
}
const posts = JSON.parse(fs.readFileSync(path.join(publicDir, 'search.json'), 'utf8'));
assert(posts.length > 0, '搜索索引为空');
for (const post of posts) { assert(post.title && post.content, '搜索条目缺少内容'); checkReference(post.url, 'search.json'); }
for (const file of ['404.html', 'atom.xml', 'sitemap.xml', 'vendor/waline/waline.js', 'vendor/waline/waline.css', '.nojekyll']) assert(fs.existsSync(path.join(publicDir, file)), `缺少 ${file}`);
assert(home.includes('向光而行') && home.includes('代码生长'), '首页缺少朝光品牌文案');
assert.equal(failures.length, 0, failures.join('\n'));
console.log(`检查通过：${pages.length} 个页面，${posts.length} 篇文章，${references} 个站内资源引用；基础路径 ${prefix}`);
