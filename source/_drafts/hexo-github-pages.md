---
title: 从一行 Markdown，到自己的数字花园
date: 2026-10-30 09:20:00
tags: [Hexo, GitHub Pages]
category: 技术
description: 用 Hexo 写作，让 GitHub Actions 自动构建。把重复的工作交给工具，把时间留给表达。
cover_style: terminal
demo: true
comments: true
---

一篇文章从本地文件变成公开页面，其实可以很简单：用 Markdown 写作，把改动推送到 GitHub，由 Actions 完成构建和部署。

> 这是一篇可删除或替换的示例文章，同时也是朝光博客的使用指南。

<!-- more -->

## 本地启动

安装 Node.js 24 后，在博客目录运行：

```bash
npm ci
npm run dev
```

打开终端提示的本地地址，就能预览博客。修改文章后，刷新页面查看结果。

## 写下第一篇文章

通过命令创建文章：

```bash
npm run new -- "我的第一束光"
```

Hexo 会在 `source/_posts/` 中生成一个 Markdown 文件。文件开头的 Front Matter 控制标题、日期和分类等信息。

```yaml
---
title: 我的第一束光
date: 2026-11-01 09:00:00
tags: [随笔]
category: 随笔
description: 今天，开始记录。
cover_style: flower
comments: true
---
```

`category` 对应首页的筛选按钮，可填写「生活随笔」「数据与AI」或「投资与交易」。`cover_style` 可选 `summit`、`terminal`、`flower`、`code`、`sunrise`。放在 `<!-- more -->` 前的内容可以作为文章摘要。

## 交给 GitHub Actions

将源代码推送到 GitHub 仓库的 `main` 分支，然后在仓库 **Settings → Pages → Source** 中选择 **GitHub Actions**。

本项目已带有 `.github/workflows/pages.yml`，会执行：

```bash
npm ci
npm run build:pages
npm run check
```

构建结果位于 `public/`，由 Pages 专用 Action 上传并部署。源文件进入仓库，生成文件由流水线处理。

## 个人主页还是项目主页

仓库名为 `<用户名>.github.io` 时，可以使用根路径的个人主页。其他仓库一般通过 `https://<用户名>.github.io/<仓库名>/` 访问。

这里的部署脚本会从 Pages Action 读取站点地址，自动处理 `url` 和 `root`，包括项目主页的子目录。启用自定义域名时，也请同步修改 `_config.yml` 并参考 GitHub 的域名设置说明。

## 发布前做一次检查

```bash
npm run build
npm run check
```

检查会验证生成页面、站内链接、搜索索引和主要静态资源。通过之后，再把改动推送到远端。

参考：[Hexo 的 GitHub Pages 文档](https://hexo.io/docs/github-pages)、[GitHub Pages 发布来源说明](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)。
