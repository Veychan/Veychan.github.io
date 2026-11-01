---
title: 给静态博客，留一扇对话的窗
date: 2026-10-24 08:30:00
tags: [Waline, Hexo]
category: 手记
description: 文章是单向的表达，评论让灵感有了回声。记录 Waline 在静态博客中的接入方式。
cover_style: sunrise
demo: true
comments: true
---

静态博客的页面可以由 GitHub Pages 托管，但评论需要一个能保存内容的后端。Waline 把这两部分分开：前端负责显示评论，服务端负责存储和管理。

> 这是一篇介绍本项目评论配置的示例文章。

<!-- more -->

## 先准备服务端

按照 [Waline 官方快速开始](https://waline.js.org/guide/get-started/) 部署服务端，并配置数据库。

部署完成后，会获得一个 HTTPS 服务地址。访问该服务的 `/ui/register` 注册管理账号；官方说明，第一个注册者会成为管理员，因此部署后应及时完成注册。

博客仓库不需要数据库连接字符串。数据库凭据保存在 Waline 服务端的环境变量中。

## 在博客中填写地址

编辑 `_config.yml`：

```yaml
waline:
  server_url: 'https://你的评论服务域名'
  lang: zh-CN
  required_meta: [nick]
  page_size: 10
```

也可以在 GitHub 仓库的 **Settings → Secrets and variables → Actions → Variables** 中，添加 `WALINE_SERVER_URL`。这个地址是公开客户端配置，不是密钥。

## 按需加载

本项目把 Waline 客户端打包到博客自己的静态资源中。只有启用评论、且读者接近评论区域时，才会载入客户端。

核心初始化思路如下：

```javascript
const { init } = await import('/vendor/waline/waline.js');

init({
  el: '#waline',
  serverURL: 'https://你的评论服务域名',
  lang: 'zh-CN',
  dark: 'html[data-theme="dark"]'
});
```

主题会自动处理资源路径，项目主页部署在子目录时也能访问。单篇文章需要关闭评论时，在 Front Matter 中设置 `comments: false` 即可。

## 留下可以继续的对话

评论区最好的状态，或许不是很多数字，而是一个具体的问题、一次有用的补充，或者一句恰到好处的鼓励。

配置完成后，记得实际提交一条测试评论，确认读取、提交、管理与主题切换都符合预期。

参考：[Waline 客户端配置](https://waline.js.org/reference/client/props.html)。
