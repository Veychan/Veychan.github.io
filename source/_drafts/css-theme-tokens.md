---
title: 用 CSS 变量，收藏两种晨光
date: 2026-10-27 10:00:00
tags: [CSS, 前端]
category: 技术
description: 深色是山谷的静，浅色是天亮后的纸。用一组语义化变量，让两种主题自然切换。
cover_style: code
demo: true
comments: true
---

主题切换的关键，是给颜色一个明确的职责。背景、正文、边框和强调色，都应该有自己的名字。

> 这是一篇演示排版与代码高亮的示例文章，可以替换成你的技术实践。

<!-- more -->

## 从语义开始

与其把某个变量叫作 `yellow`，不如表达它在界面里的作用。

```css
:root {
  --bg: #101110;
  --text: #eeeee7;
  --muted: #95978d;
  --gold: #f1c16b;
  --line: #2b2d27;
}

.article {
  color: var(--text);
  background: var(--bg);
  border: 1px solid var(--line);
}
```

这样，当配色发生变化时，组件的意图依然清楚。

## 切换另一束光

在根节点上添加一个主题属性，再覆盖同名变量。

```css
html[data-theme="light"] {
  --bg: #f8f6ef;
  --text: #292d25;
  --muted: #69705f;
  --gold: #916219;
  --line: #dedfd2;
}
```

注意，强调色在浅色背景中需要重新选择。深色主题里明亮的金色，直接放在米白色背景上，可能会让文字难以辨认。

## 保存读者的选择

```javascript
const root = document.documentElement;
const next = root.dataset.theme === 'light' ? 'dark' : 'light';
root.dataset.theme = next;

try {
  localStorage.setItem('chaoguang-theme', next);
} catch {
  // 存储不可用时，页面仍然可以正常切换。
}
```

在页面加载的早期恢复这个值，可以减少切换前的颜色闪烁。图表、代码高亮和评论组件也应跟随相同的主题状态。

## 留意小细节

- 给切换按钮设置准确的无障碍名称。
- 保持链接、键盘焦点和正文之间足够的区分。
- 尊重 `prefers-reduced-motion`，减少不必要的动画。
- 让读者的选择保留下来，而不是每次打开页面都重新开始。

好的配色不是为了展示颜色本身，而是让阅读更安静，让内容更清楚。
