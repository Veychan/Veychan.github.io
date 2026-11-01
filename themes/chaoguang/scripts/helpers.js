const icons = {
  arrow: '<path d="M7 17 17 7M7 7h10v10"/>',
  right: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4.5 4.5"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/>',
  moon: '<path d="M20.5 13A8.5 8.5 0 0 1 11 3.5 8.5 8.5 0 1 0 20.5 13Z"/>',
  rss: '<circle cx="5" cy="19" r="1"/><path d="M4 11a9 9 0 0 1 9 9M4 4a16 16 0 0 1 16 16"/>',
  github: '<path d="M9 19c-4 1-4-2-6-2m12 5v-3.5c0-1 .1-1.4-.5-2 3-.4 6-1.5 6-6A4.7 4.7 0 0 0 19 7.3 4.3 4.3 0 0 0 18.9 4S17.7 3.6 15 5a13.4 13.4 0 0 0-6 0C6.3 3.6 5.1 4 5.1 4A4.3 4.3 0 0 0 5 7.3a4.7 4.7 0 0 0-1.5 3.2c0 4.5 3 5.6 6 6-.6.6-.6 1.2-.5 2V22"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  terminal: '<path d="m5 7 5 5-5 5m8 0h6"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  copy: '<rect x="8" y="8" width="12" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  up: '<path d="M12 20V4m-6 6 6-6 6 6"/>',
  mountain: '<path d="m2 20 8-16 5 9 3-5 5 12H2Zm5-10 3 2 3-2"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>',
  tag: '<path d="M20 13 11 22 2 13V3h10l9 9-1 1Z"/><circle cx="7" cy="8" r="1"/>',
  chart: '<path d="M3 3v18h18M7 14l4-5 4 3 6-8"/><path d="M17 4h4v4"/>'
};
hexo.extend.helper.register('cg_icon', function(name, cls = '') {
  return `<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || icons.sun}</svg>`;
});
hexo.extend.helper.register('cg_flower', function(cls = '') {
  const petals = Array.from({length: 16}, (_, i) => `<ellipse cx="50" cy="25" rx="6" ry="17" transform="rotate(${i * 22.5} 50 50)"/>`).join('');
  const seeds = Array.from({length: 34}, (_, i) => {
    const a = i * 2.4, r = Math.sqrt(i) * 2.5;
    return `<circle cx="${50 + Math.cos(a) * r}" cy="${50 + Math.sin(a) * r}" r="1.1"/>`;
  }).join('');
  return `<svg class="sunflower ${cls}" viewBox="0 0 100 100" aria-hidden="true"><g class="flower-head"><g fill="currentColor">${petals}</g><circle cx="50" cy="50" r="20" fill="#38291a" stroke="#ffcd69" stroke-width="2"/><g fill="#dca34b">${seeds}</g></g></svg>`;
});
hexo.extend.helper.register('cg_category', function(post) {
  return post.categories && post.categories.length ? post.categories.first().name : '生活随笔';
});
hexo.extend.helper.register('cg_reading', function(content) {
  const text = String(content || '').replace(/<[^>]*>/g, ' ');
  const chinese = (text.match(/[\u3400-\u9fff]/g) || []).length;
  const words = (text.replace(/[\u3400-\u9fff]/g, ' ').match(/\b\w+\b/g) || []).length;
  return Math.max(1, Math.ceil(chinese / 350 + words / 200));
});
hexo.extend.helper.register('cg_json', function(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026');
});
