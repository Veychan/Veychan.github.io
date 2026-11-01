const fs = require('node:fs');
const base = process.env.PAGES_BASE_URL;
if (!base) throw new Error('缺少 PAGES_BASE_URL。此命令用于 Actions，本地请运行 npm run build。');
const url = new URL(base);
if (url.protocol !== 'https:') throw new Error('Pages 地址必须使用 HTTPS。');
const server = (process.env.WALINE_SERVER_URL || '').trim();
if (server && new URL(server).protocol !== 'https:') throw new Error('WALINE_SERVER_URL 必须使用 HTTPS。');
const config = {
  url: url.href.replace(/\/$/, ''),
  root: url.pathname.endsWith('/') ? url.pathname : `${url.pathname}/`
};
// JSON 也是合法 YAML。只在设置变量时覆盖，保留 _config.yml 中的手动配置。
if (server) config.waline = { server_url: server };
fs.writeFileSync('.pages-config.yml', JSON.stringify(config, null, 2));
console.log('GitHub Pages 基础路径已配置。');
