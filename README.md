# 朝光 · 向光而行，代码生长。

站点地址：[veychan.github.io](https://veychan.github.io/) · 源码仓库：[Veychan/Veychan.github.io](https://github.com/Veychan/Veychan.github.io)

Hexo 8 + GitHub Pages + Waline 3，原创「曜石黑 × 晨光金」主题。以「生活随笔」「数据与AI」「投资与交易」为三大栏目，各有首页入口和独立文章列表。日照金山背景、追光向日葵、深浅主题、全文搜索、分类筛选、文章目录、代码复制、阅读进度、归档、标签、RSS 和移动端导航均已实现。

## 在本地运行

安装 Node.js 24，在此目录执行：

```powershell
npm ci
npm run dev
```

打开 `http://127.0.0.1:4000`。停止预览：在终端按 `Ctrl+C`。

```powershell
npm run new -- "我的第一篇文章"
npm run build
npm run check
```

`source/_posts/` 是文章目录。除欢迎文外，预置文章均在文首标为示例，可以直接删除或替换。原 Hexo、CSS 和 Waline 建站示例保存在 `source/_drafts/`，默认不发布。首页按日期倒序，最新一篇以精选样式显示。使用真实发布日期，未来文章默认不发布。

## 个性化

编辑根目录 `_config.yml`：

- `title`、`author`、`description`：站点信息。
- `url`：正式站点完整 URL；GitHub Actions 构建时自动使用 Pages 返回的 URL。
- `social.github`、`social.email`：填入后显示相应入口；留空则隐藏。
- `waline.server_url`：你的 Waline 服务地址。

首页文案在 `themes/chaoguang/_config.yml`；关于介绍在 `source/about/index.md`；样式在 `themes/chaoguang/source/css/style.css`。

三大栏目也在主题配置的 `sections` 中统一管理，首页入口、分类筛选和栏目页切换会同步读取这里的配置。栏目地址：`topics/life/`、`topics/data-ai/`、`topics/investing/`。

文章配置示例：

```yaml
---
title: 我的第一束光
date: 2026-11-01 09:00:00
tags: [数据分析, 实验记录]
category: 数据与AI
description: 一段简短的文章介绍。
cover_style: summit
comments: true
---
```

`category` 填「生活随笔」「数据与AI」或「投资与交易」。新文章模板默认归入「生活随笔」。`cover_style` 支持 `summit`（金山）、`terminal`（终端）、`code`（代码）、`flower`（向日葵）、`sunrise`（日出轨道）。`demo: true` 会在文章页显示「示例文章」标识。`comments: false` 关闭单篇评论。

## 部署到 GitHub Pages

1. 新建 GitHub 仓库，推荐名称为 `<用户名>.github.io`。普通项目仓库同样支持。
2. 在仓库 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**。
3. 将本目录源代码推送到仓库的 `main` 分支：

```powershell
git init -b main
git add .
git commit -m "feat: launch Chaoguang blog"
git remote add origin https://github.com/你的用户名/你的仓库.git
git push -u origin main
```

已存在 Git 仓库时跳过 `git init`；已有 `origin` 时先核对地址。工作流在每次推送后自动构建、校验并部署。正式访问地址以 Actions 的 `deploy` 任务输出为准。

流水线自动处理根路径和 `/仓库名/` 子路径。**无需个人访问令牌、无需把 public 提交到仓库**。如果修改了默认分支名，请同时修改 `.github/workflows/pages.yml` 的分支设置。

自定义域名：在 Pages 中绑定域名、配置 DNS，将域名写入 `source/CNAME`，并把 `_config.yml` 的 `url` 改成对应 HTTPS 地址。

## 启用 Waline

本项目包含客户端；你仍需部署自己的 Waline 服务端及数据库。GitHub Pages 本身不能运行评论后端。

1. 按 [Waline 官方快速开始](https://waline.js.org/guide/get-started/) 部署后端。
2. 部署完成后及时访问 `https://你的服务域名/ui/register` 注册管理员。
3. 设置 `_config.yml` 的 `waline.server_url`；或在仓库 **Settings → Secrets and variables → Actions → Variables** 新建 `WALINE_SERVER_URL`。
4. 重新构建和部署，在文章页测试读取、提交与管理评论。

`server_url` 是公开地址，数据库凭据仅配置在后端部署平台。若服务配置了域名白名单或 CORS，加入博客正式域名；本地调试时按需允许 `http://127.0.0.1:4000`。

客户端从已锁定版本的 npm 包复制到本地资源目录，接近评论区域时才加载，并跟随主题切换。没有服务地址时显示「评论暂未开放」，不会向演示服务器发送数据。未连接真实后端前，无法验证评论持久化。

## 检查与维护

`npm run check` 校验已生成 HTML 的站内链接、CSS 图片路径、搜索索引、RSS、404 和 Waline 静态资源。依赖由 `package-lock.json` 锁定，CI 使用 `npm ci`。

模拟子目录部署：

```powershell
$env:PAGES_BASE_URL = 'https://example.github.io/chaoguang'
npm run build:pages
npm run check
Remove-Item Env:PAGES_BASE_URL
npm run build
```

源码不依赖 CDN 字体与图标。极慢网络下也能显示系统字体、SVG 图标和正文；JS 不可用时文章、导航、归档、标签和 RSS 仍可访问。

## 视觉资产

金山背景由内置 imagegen 工具生成，并已存入 `source/images/golden-summit.webp`（约 104 KB）。原始图和完整生成提示词保存在 `design/`，不参与网站发布。向日葵、太阳标志和装饰图案为代码生成的 SVG/CSS。

## 官方参考

- [Hexo 部署到 GitHub Pages](https://hexo.io/docs/github-pages)
- [GitHub Pages 发布来源配置](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [Waline 快速开始](https://waline.js.org/guide/get-started/)
