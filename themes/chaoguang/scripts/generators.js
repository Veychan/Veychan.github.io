hexo.extend.generator.register('chaoguang-search', function(locals) {
  const posts = locals.posts.sort('-date').toArray().map(post => ({
    title: post.title,
    url: hexo.config.root + post.path,
    date: post.date.format('YYYY.MM.DD'),
    category: post.categories && post.categories.length ? post.categories.first().name : '生活随笔',
    tags: post.tags.map(tag => tag.name),
    description: post.description || '',
    content: String(post.content).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  }));
  return { path: 'search.json', data: JSON.stringify(posts) };
});

hexo.extend.generator.register('chaoguang-topics', function(locals) {
  return (hexo.theme.config.sections || []).map(section => ({
    path: section.path + 'index.html',
    layout: 'topic',
    data: {
      title: section.name,
      description: section.description,
      type: 'topic',
      section,
      posts: locals.posts.filter(post => post.categories.toArray().some(category => category.name === section.name)).sort('-date')
    }
  }));
});
