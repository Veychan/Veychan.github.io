(() => {
  'use strict';
  const config = JSON.parse(document.querySelector('#site-config').textContent);
  const root = document.documentElement;
  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const themeButton = $('.theme-toggle');
  function syncTheme() {
    const light = root.dataset.theme === 'light';
    themeButton.setAttribute('aria-label', light ? '切换深色模式' : '切换浅色模式');
    $('meta[name="theme-color"]').content = light ? '#f8f6ef' : '#101110';
  }
  syncTheme();
  themeButton.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
    try { localStorage.setItem('chaoguang-theme', root.dataset.theme); } catch (_) { /* Private browsers can disable storage. */ }
    syncTheme();
  });

  const menuButton = $('.menu-toggle');
  const mobileMenu = $('#mobile-nav');
  const closeMenu = () => { mobileMenu.hidden = true; menuButton.setAttribute('aria-expanded', 'false'); menuButton.setAttribute('aria-label', '打开导航菜单'); };
  menuButton.addEventListener('click', () => {
    mobileMenu.hidden = !mobileMenu.hidden;
    menuButton.setAttribute('aria-expanded', String(!mobileMenu.hidden));
    menuButton.setAttribute('aria-label', mobileMenu.hidden ? '打开导航菜单' : '关闭导航菜单');
  });
  $$('a', mobileMenu).forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });

  $$('.filter-button').forEach(button => button.addEventListener('click', () => {
    $$('.filter-button').forEach(item => { item.classList.toggle('active', item === button); item.setAttribute('aria-pressed', String(item === button)); });
    let visible = 0;
    $$('.post-card').forEach(card => { card.hidden = button.dataset.filter !== 'all' && card.dataset.category !== button.dataset.filter; if (!card.hidden) visible++; });
    $('.filter-empty').hidden = visible !== 0;
  }));

  // Sunflowers lean toward the visitor's light; no continuous animation loop.
  if (!reducedMotion && matchMedia('(pointer: fine)').matches && $('.tracking-flower')) {
    let frame;
    window.addEventListener('pointermove', event => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        const progress = Math.max(0, Math.min(1, event.clientX / window.innerWidth));
        root.style.setProperty('--flower-tilt', `${(progress - .5) * 52}deg`);
        root.style.setProperty('--sun-x', `${10 + progress * 72}%`);
        root.style.setProperty('--sun-y', `${52 - Math.sin(progress * Math.PI) * 48}px`);
        frame = null;
      });
    }, {passive: true});
  }

  const backTop = $('.back-top');
  const progressBar = $('.reading-progress');
  let scrollFrame;
  const updateScroll = () => {
    const max = root.scrollHeight - window.innerHeight;
    progressBar.style.width = document.body.classList.contains('post-page') && max > 0 ? `${window.scrollY / max * 100}%` : '0%';
    backTop.classList.toggle('visible', window.scrollY > 500);
    scrollFrame = null;
  };
  window.addEventListener('scroll', () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll); }, {passive: true});
  window.addEventListener('resize', updateScroll, {passive: true});
  updateScroll();
  backTop.addEventListener('click', () => window.scrollTo({top: 0, behavior: reducedMotion ? 'instant' : 'smooth'}));

  // Native dialog supplies focus trapping, Escape handling and focus restoration.
  const dialog = $('.search-dialog');
  const input = $('#search-input');
  const results = $('#search-results');
  let searchData;
  let searchPromise;
  let searchSequence = 0;
  const message = text => { const p = document.createElement('p'); p.className = 'search-hint'; p.textContent = text; results.replaceChildren(p); };
  const loadSearch = async () => {
    if (searchData) return searchData;
    if (!searchPromise) searchPromise = fetch(config.search).then(response => {
      if (!response.ok) throw new Error('Search unavailable');
      return response.json();
    }).then(data => { searchData = data; return data; }).catch(error => { searchPromise = null; throw error; });
    return searchPromise;
  };
  const renderSearch = async () => {
    const sequence = ++searchSequence;
    const query = input.value.trim().toLocaleLowerCase();
    if (!query) { message('输入一个关键词，寻找你的下一束灵感。'); return; }
    message('正在寻找微光…');
    try {
      const data = await loadSearch();
      if (sequence !== searchSequence) return;
      const words = query.split(/\s+/);
      const matches = data.filter(post => words.every(word => [post.title, post.description, post.content, post.category, ...post.tags].join(' ').toLocaleLowerCase().includes(word))).slice(0, 20);
      if (!matches.length) { message('没有找到相关记录，换个关键词试试。'); return; }
      const fragment = document.createDocumentFragment();
      matches.forEach(post => {
        const link = document.createElement('a'); link.className = 'search-result'; link.href = post.url;
        const title = document.createElement('strong'); title.textContent = post.title;
        const description = document.createElement('p'); description.textContent = post.description;
        const meta = document.createElement('small'); meta.textContent = `${post.date}  /  ${post.tags.map(tag => `#${tag}`).join('  ')}`;
        link.append(title, description, meta); fragment.append(link);
      });
      results.replaceChildren(fragment);
    } catch (_) { if (sequence === searchSequence) message('暂时无法加载搜索，请检查网络后重新输入。'); }
  };
  $('.search-trigger').addEventListener('click', () => { closeMenu(); dialog.showModal(); input.focus(); renderSearch(); });
  $('.search-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  input.addEventListener('input', renderSearch);
  input.addEventListener('keydown', event => {
    if (event.key === 'Enter') { const first = $('.search-result', results); if (first) { event.preventDefault(); first.click(); } }
    if (event.key === 'ArrowDown') { const first = $('.search-result', results); if (first) { event.preventDefault(); first.focus(); } }
  });
  document.addEventListener('keydown', event => {
    const editing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName) || document.activeElement.isContentEditable;
    if ((event.key === '/' && !editing) || ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k')) { event.preventDefault(); if (!dialog.open) $('.search-trigger').click(); }
  });

  $$('.prose figure.highlight').forEach(figure => {
    figure.dataset.language = [...figure.classList].find(cls => cls !== 'highlight') || 'code';
    const button = document.createElement('button'); button.type = 'button'; button.className = 'code-copy'; button.textContent = '复制代码'; button.setAttribute('aria-label', '复制此代码块');
    button.addEventListener('click', async () => {
      const code = $('.code pre', figure) || $('pre', figure);
      try { await navigator.clipboard.writeText(code.innerText); button.textContent = '已复制 ✓'; }
      catch (_) { const range = document.createRange(); range.selectNodeContents(code); const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range); button.textContent = '已选中，请复制'; }
      setTimeout(() => { button.textContent = '复制代码'; }, 2200);
    });
    figure.append(button);
  });

  const headings = $$('.prose h2[id], .prose h3[id]');
  if (headings.length && $('.toc-box') && 'IntersectionObserver' in window) {
    const links = $$('.toc-link');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) links.forEach(link => link.classList.toggle('active', decodeURIComponent(link.hash.slice(1)) === entry.target.id)); });
    }, {rootMargin: '-5% 0px -75% 0px'});
    headings.forEach(heading => observer.observe(heading));
  }

  const walineElement = $('#waline');
  if (walineElement && config.waline.server_url) {
    let loading = false;
    const loadWaline = async () => {
      if (loading) return;
      loading = true;
      try {
        if (!$('#waline-stylesheet')) { const style = document.createElement('link'); style.id = 'waline-stylesheet'; style.rel = 'stylesheet'; style.href = config.walineStyle; document.head.append(style); }
        const {init} = await import(config.walineModule);
        walineElement.replaceChildren();
        init({el: walineElement, serverURL: config.waline.server_url, path: '/' + config.path.replace(/index\.html$/, ''), lang: config.waline.lang || 'zh-CN', dark: 'html[data-theme="dark"]', requiredMeta: config.waline.required_meta || ['nick'], pageSize: config.waline.page_size || 10, emoji: [], locale: {placeholder: '留下一点想法，或是一束微光。'}});
      } catch (_) {
        loading = false;
        const text = document.createElement('p'); text.className = 'comment-loading'; text.textContent = '评论暂时无法加载。';
        const retry = document.createElement('button'); retry.className = 'button button-quiet'; retry.textContent = '重新加载'; retry.addEventListener('click', loadWaline);
        walineElement.replaceChildren(text, retry);
      }
    };
    if ('IntersectionObserver' in window) { const observer = new IntersectionObserver(entries => { if (entries.some(entry => entry.isIntersecting)) { observer.disconnect(); loadWaline(); } }, {rootMargin: '250px'}); observer.observe(walineElement); } else loadWaline();
  }
})();
