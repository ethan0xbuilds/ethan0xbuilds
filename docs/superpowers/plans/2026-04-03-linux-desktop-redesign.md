# Linux Desktop Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将现有纯静态 HTML 网站重构为 Linux 桌面 OS 视觉风格，使用 Astro 构建，支持可拖拽/缩放窗口、底部 Dock、顶部状态栏，部署到 GitHub Pages。

**Architecture:** Astro Islands + 单桌面页面多路由。`src/pages/index.astro` 为主桌面，每个内容路由（`/about`、`/projects` 等）渲染同一个 `Desktop.astro` 组件并通过 `autoOpen` prop 自动打开对应窗口。`window-manager.js` 纯 JS 处理窗口交互（拖拽、缩放、焦点、URL 同步）。

**Tech Stack:** Astro 4.x (static output), Vanilla JS, CSS3, JetBrains Mono (Google Fonts), Lucide icons (SVG inline), GitHub Actions

---

## 文件清单

| 文件 | 操作 | 职责 |
|------|------|------|
| `astro.config.mjs` | 新建 | Astro 静态构建配置 |
| `package.json` | 新建 | 依赖管理 |
| `src/pages/index.astro` | 新建 | 主桌面入口页 |
| `src/pages/about.astro` | 新建 | `/about` 路由 |
| `src/pages/projects.astro` | 新建 | `/projects` 路由 |
| `src/pages/movies.astro` | 新建 | `/movies` 路由 |
| `src/pages/books.astro` | 新建 | `/books` 路由 |
| `src/pages/contact.astro` | 新建 | `/contact` 路由 |
| `src/pages/blog/index.astro` | 新建 | `/blog` 路由 |
| `src/components/Desktop.astro` | 新建 | 顶层 shell：StatusBar + 桌面区域 + Dock |
| `src/components/StatusBar.astro` | 新建 | 顶部状态栏（用户名、路径、时间） |
| `src/components/Dock.astro` | 新建 | 底部 Dock（图标 + 标签 + 指示点） |
| `src/components/Window.astro` | 新建 | 可拖拽/缩放窗口壳组件 |
| `src/scripts/window-manager.js` | 新建 | 窗口交互逻辑（拖拽、缩放、焦点、URL 同步） |
| `src/content/config.ts` | 新建 | Astro Content Collections schema |
| `src/content/about.md` | 新建 | About 窗口内容 |
| `src/content/contact.md` | 新建 | Contact 窗口内容 |
| `src/content/projects/*.md` | 新建 | 项目数据（frontmatter） |
| `src/content/movies/*.md` | 新建 | 电影数据（frontmatter） |
| `src/content/books/*.md` | 新建 | 书籍数据（frontmatter） |
| `public/avatar.png` | 保留 | 已有头像 |
| `public/resume.pdf` | 新建 | 简历 PDF |
| `.github/workflows/deploy.yml` | 新建 | GitHub Actions 构建+部署 |

---

### Task 1: 初始化 Astro 项目

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`

- [ ] **Step 1: 初始化 npm 并安装依赖**

```bash
npm init -y
npm install astro@^4
```

- [ ] **Step 2: 创建 `astro.config.mjs`**

```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  site: 'https://www.oasaka.xyz',
});
```

- [ ] **Step 3: 创建 `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict"
}
```

- [ ] **Step 4: 更新 `package.json` scripts**

在 `package.json` 中 `scripts` 字段改为：

```json
"scripts": {
  "dev": "astro dev",
  "build": "astro build",
  "preview": "astro preview"
}
```

- [ ] **Step 5: 创建必要目录结构**

```bash
mkdir -p src/pages src/components src/scripts src/content/projects src/content/movies src/content/books public
```

- [ ] **Step 6: 移动已有资源**

```bash
cp avatar.png public/avatar.png
```

- [ ] **Step 7: 验证 Astro 可以启动**

创建临时 `src/pages/index.astro`：
```html
---
---
<html><body><h1>Hello</h1></body></html>
```

运行：
```bash
npm run dev
```

预期：浏览器访问 `http://localhost:4321` 显示 "Hello"，无报错。

- [ ] **Step 8: Commit**

```bash
git add package.json astro.config.mjs tsconfig.json package-lock.json
git commit -m "chore: initialize astro project"
```

---

### Task 2: Content Collections schema + 示例数据

**Files:**
- Create: `src/content/config.ts`
- Create: `src/content/about.md`
- Create: `src/content/contact.md`
- Create: `src/content/projects/ai-context-vault-cn.md`
- Create: `src/content/movies/oppenheimer.md`
- Create: `src/content/books/zhong-guo-jing-ji.md`

- [ ] **Step 1: 创建 `src/content/config.ts`**

```typescript
import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    description: z.string(),
    url: z.string().url(),
    icon: z.string(),
  }),
});

const movies = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    cover: z.string().optional(),
    rating: z.number().min(1).max(5),
    review: z.string(),
    year: z.number(),
  }),
});

const books = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    cover: z.string().optional(),
    rating: z.number().min(1).max(5),
    review: z.string(),
    author: z.string(),
  }),
});

export const collections = { projects, movies, books };
```

- [ ] **Step 2: 创建 `src/content/about.md`**

```markdown
---
---
Builder & tinkerer. I work on developer tools, AI applications, and anything that makes computers feel more human.

**Stack:** TypeScript · Python · Rust · Go

**Interests:** Systems programming · LLM tooling · Open source
```

- [ ] **Step 3: 创建 `src/content/contact.md`**

```markdown
---
---
- GitHub: [ethan0xbuilds](https://github.com/ethan0xbuilds)
- Email: hi@oasaka.xyz
- X: [@ethan0xbuilds](https://x.com/ethan0xbuilds)
```

- [ ] **Step 4: 创建示例项目数据**

新建 `src/content/projects/ai-context-vault-cn.md`：
```markdown
---
name: "ai-context-vault-cn"
description: "AI context management tool for Chinese developers"
url: "https://github.com/ethan0xbuilds/ai-context-vault-cn"
icon: "🗄️"
---
```

- [ ] **Step 5: 创建示例电影数据**

新建 `src/content/movies/oppenheimer.md`：
```markdown
---
title: "奥本海默"
rating: 5
review: "三小时没出戏，诺兰的信息密度真的没话说"
year: 2023
---
```

新建 `src/content/movies/everything-everywhere.md`：
```markdown
---
title: "瞬息全宇宙"
rating: 5
review: "看完沉默了很久，混乱和爱意混在一起"
year: 2022
---
```

新建 `src/content/movies/spider-man-into-the-spider-verse.md`：
```markdown
---
title: "蜘蛛侠：平行宇宙"
rating: 4
review: "动画风格实验性极强，漫画帧的那段太绝了"
year: 2018
---
```

- [ ] **Step 6: 创建示例书籍数据**

新建 `src/content/books/zhong-guo-jing-ji.md`：
```markdown
---
title: "置身事内"
author: "兰小欢"
rating: 5
review: "读完才发现自己对中国经济的理解有多浅薄"
---
```

新建 `src/content/books/sapiens.md`：
```markdown
---
title: "人类简史"
author: "Yuval Noah Harari"
rating: 4
review: "宏大叙事，有些地方过于武断，但整体开眼界"
---
```

新建 `src/content/books/high-output-management.md`：
```markdown
---
title: "High Output Management"
author: "Andrew Grove"
rating: 5
review: "Grove 写给所有 manager 的书，实用性极强"
---
```

- [ ] **Step 7: 验证 Content Collections 类型正确**

```bash
npm run build 2>&1 | head -30
```

预期：无 TypeScript 类型错误，build 成功（即使页面内容还是临时的）。

- [ ] **Step 8: Commit**

```bash
git add src/content/
git commit -m "feat: add content collections schema and sample data"
```

---

### Task 3: StatusBar 组件

**Files:**
- Create: `src/components/StatusBar.astro`

- [ ] **Step 1: 创建 `src/components/StatusBar.astro`**

```astro
---
// StatusBar renders the top 28px bar.
// Time updates are handled client-side via inline script.
---
<header class="status-bar" role="banner">
  <div class="status-left">
    <span class="username">ethan<span class="at">@</span>desktop</span>
    <span class="separator">·</span>
    <span class="online-indicator" aria-label="online">
      <span class="dot" aria-hidden="true"></span>online
    </span>
    <span class="separator">·</span>
    <span class="path">~/home</span>
  </div>
  <div class="status-right">
    <span class="datetime" id="statusbar-datetime" aria-live="polite"></span>
  </div>
</header>

<style>
.status-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 28px;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  z-index: 9999;
  user-select: none;
}
.username { color: #7eb8f7; font-weight: 600; }
.at { color: rgba(255, 255, 255, 0.5); }
.separator { margin: 0 6px; color: rgba(255, 255, 255, 0.3); }
.online-indicator { display: flex; align-items: center; gap: 4px; color: #4ade80; }
.dot {
  width: 6px; height: 6px;
  background: #4ade80;
  border-radius: 50%;
  display: inline-block;
}
.path { color: rgba(255, 255, 255, 0.5); }
.datetime { color: rgba(255, 255, 255, 0.6); }

@media (max-width: 768px) {
  .separator, .online-indicator, .path { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  * { transition-duration: 0.01ms !important; }
}
</style>

<script>
function updateTime() {
  const el = document.getElementById('statusbar-datetime');
  if (!el) return;
  const now = new Date();
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const day = days[now.getDay()];
  const date = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  el.textContent = `${day} ${date}  ${time}`;
}
updateTime();
setInterval(updateTime, 30000);
</script>
```

- [ ] **Step 2: 在临时 index.astro 中引用验证**

修改 `src/pages/index.astro`：
```astro
---
import StatusBar from '../components/StatusBar.astro';
---
<html>
<head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet" />
</head>
<body style="background:#0d1117; margin:0;">
  <StatusBar />
</body>
</html>
```

运行 `npm run dev`，预期：顶部出现 28px 深色状态栏，左侧显示 `ethan@desktop · online · ~/home`，右侧显示当前时间。

- [ ] **Step 3: Commit**

```bash
git add src/components/StatusBar.astro src/pages/index.astro
git commit -m "feat: add StatusBar component"
```

---

### Task 4: Window 组件 + window-manager.js

**Files:**
- Create: `src/components/Window.astro`
- Create: `src/scripts/window-manager.js`

- [ ] **Step 1: 创建 `src/scripts/window-manager.js`**

```javascript
// window-manager.js
// Handles drag, resize, focus, open/close, and URL sync for desktop windows.

let zCounter = 100;

/** Bring a window element to front */
function bringToFront(winEl) {
  winEl.style.zIndex = ++zCounter;
}

/** Open a window by id, or focus it if already open */
export function openWindow(id) {
  const win = document.getElementById(`win-${id}`);
  if (!win) return;
  if (win.classList.contains('win-hidden')) {
    win.classList.remove('win-hidden');
  }
  bringToFront(win);
  history.pushState({}, '', `/${id}`);
  updateDockIndicators();
}

/** Close a window by id */
export function closeWindow(id) {
  const win = document.getElementById(`win-${id}`);
  if (!win) return;
  win.classList.add('win-hidden');
  const openWindows = [...document.querySelectorAll('.window:not(.win-hidden)')];
  if (openWindows.length === 0) {
    history.pushState({}, '', '/');
  }
  updateDockIndicators();
}

/** Toggle minimize: hide if focused, show if hidden */
export function toggleWindow(id) {
  const win = document.getElementById(`win-${id}`);
  if (!win) return;
  if (win.classList.contains('win-hidden')) {
    openWindow(id);
  } else {
    win.classList.add('win-hidden');
    updateDockIndicators();
  }
}

function updateDockIndicators() {
  document.querySelectorAll('[data-dock-id]').forEach(dockItem => {
    const id = dockItem.dataset.dockId;
    const win = document.getElementById(`win-${id}`);
    const dot = dockItem.querySelector('.dock-indicator');
    if (!dot || !win) return;
    dot.classList.toggle('active', !win.classList.contains('win-hidden'));
  });
}

/** Initialize drag on a window's title bar */
function initDrag(winEl) {
  const titleBar = winEl.querySelector('.win-titlebar');
  if (!titleBar) return;

  let startX, startY, startLeft, startTop;

  function onMouseMove(e) {
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    const newLeft = Math.max(-winEl.offsetWidth + 80, startLeft + dx);
    const newTop = Math.max(28, startTop + dy); // keep below status bar
    winEl.style.left = newLeft + 'px';
    winEl.style.top = newTop + 'px';
  }

  function onMouseUp() {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }

  titleBar.addEventListener('mousedown', e => {
    if (e.target.closest('.win-btn')) return; // don't drag on buttons
    startX = e.clientX;
    startY = e.clientY;
    startLeft = winEl.offsetLeft;
    startTop = winEl.offsetTop;
    bringToFront(winEl);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  // Touch support
  titleBar.addEventListener('touchstart', e => {
    if (e.target.closest('.win-btn')) return;
    const touch = e.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
    startLeft = winEl.offsetLeft;
    startTop = winEl.offsetTop;
    bringToFront(winEl);
  }, { passive: true });

  titleBar.addEventListener('touchmove', e => {
    const touch = e.touches[0];
    const dx = touch.clientX - startX;
    const dy = touch.clientY - startY;
    winEl.style.left = Math.max(-winEl.offsetWidth + 80, startLeft + dx) + 'px';
    winEl.style.top = Math.max(28, startTop + dy) + 'px';
  }, { passive: true });
}

/** Initialize resize on a window's resize handle */
function initResize(winEl) {
  const handle = winEl.querySelector('.win-resize-handle');
  if (!handle) return;

  let startX, startY, startW, startH;
  const MIN_W = 280, MIN_H = 200;

  function onMouseMove(e) {
    const dw = e.clientX - startX;
    const dh = e.clientY - startY;
    winEl.style.width = Math.max(MIN_W, startW + dw) + 'px';
    winEl.style.height = Math.max(MIN_H, startH + dh) + 'px';
  }

  function onMouseUp() {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }

  handle.addEventListener('mousedown', e => {
    e.stopPropagation();
    startX = e.clientX;
    startY = e.clientY;
    startW = winEl.offsetWidth;
    startH = winEl.offsetHeight;
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });
}

/** Initialize focus-on-click for a window */
function initFocus(winEl) {
  winEl.addEventListener('mousedown', () => bringToFront(winEl));
}

/** Bootstrap all windows on page load */
export function initWindowManager() {
  document.querySelectorAll('.window').forEach(win => {
    initDrag(win);
    initResize(win);
    initFocus(win);
  });

  // Auto-open window based on URL
  const path = window.location.pathname.replace(/^\//, '').replace(/\/$/, '');
  const validWindows = ['about', 'projects', 'blog', 'movies', 'books', 'contact'];
  if (path && validWindows.includes(path)) {
    openWindow(path);
  }

  updateDockIndicators();
}
```

- [ ] **Step 2: 创建 `src/components/Window.astro`**

```astro
---
interface Props {
  id: string;
  title: string;
  defaultWidth?: number;
  defaultHeight?: number;
  defaultTop?: number;
  defaultLeft?: number;
  initiallyHidden?: boolean;
}

const {
  id,
  title,
  defaultWidth = 480,
  defaultHeight = 360,
  defaultTop = 80,
  defaultLeft = 120,
  initiallyHidden = true,
} = Astro.props;
---

<div
  id={`win-${id}`}
  class:list={['window', initiallyHidden && 'win-hidden']}
  style={`width:${defaultWidth}px; height:${defaultHeight}px; top:${defaultTop}px; left:${defaultLeft}px;`}
  role="dialog"
  aria-label={title}
  aria-modal="false"
>
  <div class="win-titlebar">
    <div class="win-buttons">
      <button
        class="win-btn win-btn-close"
        aria-label={`Close ${title}`}
        onclick={`(function(){import('/scripts/window-manager.js').then(m=>m.closeWindow('${id}'))})()`}
      ></button>
      <button class="win-btn win-btn-minimize" aria-label="Minimize" disabled></button>
      <button class="win-btn win-btn-maximize" aria-label="Maximize" disabled></button>
    </div>
    <span class="win-title">{title}</span>
  </div>
  <div class="win-body">
    <slot />
  </div>
  <div class="win-resize-handle" aria-hidden="true"></div>
</div>

<style>
.window {
  position: absolute;
  display: flex;
  flex-direction: column;
  background: #1a1a2e;
  border-radius: 8px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08);
  overflow: hidden;
  min-width: 280px;
  min-height: 200px;
}
.win-hidden { display: none; }

.win-titlebar {
  height: 32px;
  background: #252535;
  display: flex;
  align-items: center;
  padding: 0 12px;
  gap: 8px;
  cursor: move;
  flex-shrink: 0;
  user-select: none;
}
.win-buttons { display: flex; gap: 6px; }
.win-btn {
  width: 11px; height: 11px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  padding: 0;
}
.win-btn-close  { background: #ff5f57; }
.win-btn-minimize { background: #febc2e; }
.win-btn-maximize { background: #28c840; }
.win-btn:disabled { opacity: 0.4; cursor: default; }

.win-title {
  flex: 1;
  text-align: center;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: rgba(255,255,255,0.6);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.win-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  color: rgba(255,255,255,0.85);
  line-height: 1.6;
}

.win-resize-handle {
  position: absolute;
  bottom: 0; right: 0;
  width: 12px; height: 12px;
  cursor: se-resize;
  background: linear-gradient(
    135deg,
    transparent 50%,
    rgba(255,255,255,0.2) 50%
  );
}

/* Mobile: full-screen overlay */
@media (max-width: 768px) {
  .window {
    position: fixed !important;
    inset: 0 !important;
    width: 100% !important;
    height: 100% !important;
    border-radius: 0;
    transform: translateY(100%);
    transition: transform 0.3s ease;
  }
  .window:not(.win-hidden) {
    transform: translateY(0);
  }
  .win-resize-handle { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  .window { transition-duration: 0.01ms !important; }
}
</style>
```

- [ ] **Step 3: 在临时 index.astro 验证 Window 组件**

修改 `src/pages/index.astro`：
```astro
---
import StatusBar from '../components/StatusBar.astro';
import Window from '../components/Window.astro';
---
<html>
<head>
  <meta charset="UTF-8" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet" />
  <style>
    body { background: #0d1117; margin: 0; }
    .desktop { position: relative; width: 100vw; height: 100vh; }
  </style>
</head>
<body>
  <StatusBar />
  <div class="desktop">
    <Window id="about" title="about.md" defaultWidth={480} defaultHeight={360} initiallyHidden={false}>
      <p>Hello from About window!</p>
    </Window>
  </div>
  <script type="module">
    import { initWindowManager } from '/scripts/window-manager.js';
    initWindowManager();
  </script>
</body>
</html>
```

运行 `npm run dev`，���期：桌面出现一个可拖拽、右下角可缩放的窗口，红色关闭按钮点击后窗口消失。

- [ ] **Step 4: Commit**

```bash
git add src/scripts/window-manager.js src/components/Window.astro src/pages/index.astro
git commit -m "feat: add Window component and window-manager.js"
```

---

### Task 5: Dock 组件

**Files:**
- Create: `src/components/Dock.astro`

- [ ] **Step 1: 创建 `src/components/Dock.astro`**

```astro
---
const items = [
  { id: 'about',    label: 'About',    action: 'open',     icon: 'user' },
  { id: 'projects', label: 'Projects', action: 'open',     icon: 'folder' },
  { id: 'blog',     label: 'Blog',     action: 'open',     icon: 'file-text' },
  { id: 'movies',   label: 'Movies',   action: 'open',     icon: 'film' },
  { id: 'books',    label: 'Books',    action: 'open',     icon: 'book-open' },
  { id: 'contact',  label: 'Contact',  action: 'open',     icon: 'mail' },
  { id: 'resume',   label: 'Resume',   action: 'download', icon: 'download' },
];

const icons: Record<string, string> = {
  user: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  folder: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>`,
  'file-text': `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
  film: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg>`,
  'book-open': `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
  mail: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
  download: `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
};
---

<nav class="dock" aria-label="Application Dock">
  {items.map(item => (
    item.action === 'download' ? (
      <a
        href="/resume.pdf"
        download
        class="dock-item"
        aria-label={`Download ${item.label}`}
        data-dock-id={item.id}
      >
        <span class="dock-icon" set:html={icons[item.icon]} />
        <span class="dock-label">{item.label}</span>
        <span class="dock-indicator" aria-hidden="true"></span>
      </a>
    ) : (
      <button
        class="dock-item"
        aria-label={`Open ${item.label}`}
        data-dock-id={item.id}
        onclick={`(function(){import('/scripts/window-manager.js').then(m=>m.toggleWindow('${item.id}'))})()`}
      >
        <span class="dock-icon" set:html={icons[item.icon]} />
        <span class="dock-label">{item.label}</span>
        <span class="dock-indicator" aria-hidden="true"></span>
      </button>
    )
  ))}
</nav>

<style>
.dock {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 56px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0 16px;
  z-index: 9998;
}

.dock-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  padding: 4px 8px;
  background: none;
  border: none;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  border-radius: 8px;
  transition: background 0.15s ease, color 0.15s ease;
  position: relative;
}
.dock-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}
.dock-item:focus-visible {
  outline: 2px solid #7eb8f7;
  outline-offset: 2px;
}

.dock-icon { display: flex; align-items: center; }

.dock-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
  color: rgba(255, 255, 255, 0.5);
  white-space: nowrap;
}

.dock-indicator {
  width: 4px; height: 4px;
  border-radius: 50%;
  background: #7eb8f7;
  opacity: 0;
  transition: opacity 0.2s ease;
}
.dock-indicator.active { opacity: 1; }

@media (max-width: 768px) {
  .dock { height: 48px; gap: 4px; }
  .dock-label { display: none; }
  .dock-icon svg { width: 22px; height: 22px; }
}

@media (prefers-reduced-motion: reduce) {
  .dock-item, .dock-indicator { transition-duration: 0.01ms !important; }
}
</style>
```

- [ ] **Step 2: 在临时 index.astro 中引用 Dock 验证**

修改 `src/pages/index.astro`，添加 Dock 引用：
```astro
---
import StatusBar from '../components/StatusBar.astro';
import Dock from '../components/Dock.astro';
import Window from '../components/Window.astro';
---
<html>
<head>
  <meta charset="UTF-8" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet" />
  <style>
    body { background: #0d1117; margin: 0; }
    .desktop { position: relative; width: 100vw; height: calc(100vh - 28px - 56px); margin-top: 28px; overflow: hidden; }
  </style>
</head>
<body>
  <StatusBar />
  <div class="desktop">
    <Window id="about" title="about.md" defaultWidth={480} defaultHeight={360} initiallyHidden={true}>
      <p>Hello from About window!</p>
    </Window>
  </div>
  <Dock />
  <script type="module">
    import { initWindowManager } from '/scripts/window-manager.js';
    initWindowManager();
  </script>
</body>
</html>
```

运行 `npm run dev`，预期：底部出现 Dock，点击 "About" 按钮，About 窗口打开，Dock 指示点亮起蓝色。点击关闭按钮，窗口消失，指示点熄���。

- [ ] **Step 3: Commit**

```bash
git add src/components/Dock.astro src/pages/index.astro
git commit -m "feat: add Dock component"
```

---

### Task 6: Desktop 组件 + 内容窗口（About、Projects、Contact、Blog）

**Files:**
- Create: `src/components/Desktop.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: 创建 `src/components/Desktop.astro`**

```astro
---
import StatusBar from './StatusBar.astro';
import Dock from './Dock.astro';
import Window from './Window.astro';
import { getCollection } from 'astro:content';

interface Props {
  autoOpen?: string;
}
const { autoOpen } = Astro.props;

const projects = await getCollection('projects');
const movies = await getCollection('movies');
const books = await getCollection('books');
---

<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ethan@desktop</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #0d1117;
      font-family: 'JetBrains Mono', monospace;
      overflow: hidden;
      height: 100vh;
    }
    .desktop {
      position: relative;
      width: 100vw;
      height: calc(100vh - 28px - 56px);
      margin-top: 28px;
      overflow: hidden;
    }
    .desktop-bg {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      gap: 8px;
      pointer-events: none;
      user-select: none;
    }
    .bg-name {
      font-size: clamp(60px, 12vw, 120px);
      font-weight: 700;
      color: rgba(255,255,255,0.04);
      letter-spacing: 0.3em;
    }
    .bg-tagline {
      font-size: clamp(12px, 2vw, 16px);
      color: rgba(255,255,255,0.03);
      letter-spacing: 0.4em;
      text-transform: uppercase;
    }

    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after { transition-duration: 0.01ms !important; animation-duration: 0.01ms !important; }
    }
  </style>
</head>
<body>
  <StatusBar />

  <div class="desktop" id="desktop">
    <div class="desktop-bg" aria-hidden="true">
      <div class="bg-name">ETHAN</div>
      <div class="bg-tagline">Builder &amp; Tinkerer</div>
    </div>

    <!-- About Window -->
    <Window id="about" title="about.md" defaultWidth={480} defaultHeight={360} defaultTop={80} defaultLeft={80}>
      <slot name="about" />
    </Window>

    <!-- Projects Window -->
    <Window id="projects" title="projects/" defaultWidth={520} defaultHeight={400} defaultTop={100} defaultLeft={160}>
      <div class="project-list">
        {projects.map(p => (
          <a href={p.data.url} target="_blank" rel="noopener noreferrer" class="project-row" aria-label={p.data.name}>
            <span class="project-icon">{p.data.icon}</span>
            <div>
              <div class="project-name">{p.data.name}</div>
              <div class="project-desc">{p.data.description}</div>
            </div>
          </a>
        ))}
      </div>
    </Window>

    <!-- Blog Window -->
    <Window id="blog" title="blog/" defaultWidth={480} defaultHeight={320} defaultTop={120} defaultLeft={200}>
      <div style="color: rgba(255,255,255,0.4); text-align:center; padding-top: 60px;">
        <div style="font-size:32px; margin-bottom:12px;">🚧</div>
        <div>Coming soon...</div>
      </div>
    </Window>

    <!-- Movies Window -->
    <Window id="movies" title="movies/" defaultWidth={580} defaultHeight={480} defaultTop={90} defaultLeft={140}>
      <div class="media-grid">
        {movies.sort((a, b) => b.data.year - a.data.year).map(m => (
          <div class="media-card">
            {m.data.cover
              ? <img src={m.data.cover} alt={m.data.title} class="media-cover" />
              : <div class="media-placeholder">🎬</div>
            }
            <div class="media-body">
              <div class="media-title">{m.data.title}</div>
              <div class="media-rating">{'★'.repeat(m.data.rating)}{'☆'.repeat(5 - m.data.rating)}</div>
              <div class="media-year">{m.data.year}</div>
              <div class="media-review">{m.data.review}</div>
            </div>
          </div>
        ))}
      </div>
    </Window>

    <!-- Books Window -->
    <Window id="books" title="books/" defaultWidth={580} defaultHeight={480} defaultTop={100} defaultLeft={160}>
      <div class="media-grid">
        {books.map(b => (
          <div class="media-card">
            {b.data.cover
              ? <img src={b.data.cover} alt={b.data.title} class="media-cover" />
              : <div class="media-placeholder">📖</div>
            }
            <div class="media-body">
              <div class="media-title">{b.data.title}</div>
              <div class="media-rating">{'★'.repeat(b.data.rating)}{'☆'.repeat(5 - b.data.rating)}</div>
              <div class="media-author">{b.data.author}</div>
              <div class="media-review">{b.data.review}</div>
            </div>
          </div>
        ))}
      </div>
    </Window>

    <!-- Contact Window -->
    <Window id="contact" title="contact.md" defaultWidth={400} defaultHeight={280} defaultTop={110} defaultLeft={180}>
      <slot name="contact" />
    </Window>
  </div>

  <Dock />

  <script define:vars={{ autoOpen }}>
    import('/scripts/window-manager.js').then(m => {
      m.initWindowManager();
      if (autoOpen) m.openWindow(autoOpen);
    });
  </script>
</body>
</html>

<style is:global>
  .project-list { display: flex; flex-direction: column; gap: 12px; }
  .project-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 8px;
    text-decoration: none;
    color: inherit;
    transition: background 0.15s ease;
  }
  .project-row:hover { background: rgba(255,255,255,0.1); }
  .project-row:focus-visible { outline: 2px solid #7eb8f7; outline-offset: 2px; }
  .project-icon { font-size: 24px; }
  .project-name { font-size: 13px; font-weight: 600; color: white; margin-bottom: 2px; }
  .project-desc { font-size: 11px; color: rgba(255,255,255,0.5); }

  .media-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }
  .media-card {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 8px;
    overflow: hidden;
  }
  .media-cover {
    width: 100%;
    aspect-ratio: 2/3;
    object-fit: cover;
    display: block;
  }
  .media-placeholder {
    width: 100%;
    aspect-ratio: 2/3;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 36px;
    background: rgba(255,255,255,0.03);
  }
  .media-body { padding: 8px; }
  .media-title { font-size: 12px; font-weight: 600; color: white; margin-bottom: 3px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .media-rating { font-size: 11px; color: rgba(255,200,80,0.9); margin-bottom: 2px; }
  .media-year, .media-author { font-size: 10px; color: rgba(255,255,255,0.4); margin-bottom: 4px; }
  .media-review { font-size: 10px; color: rgba(255,255,255,0.6); line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
</style>
```

- [ ] **Step 2: 更新 `src/pages/index.astro`**

```astro
---
import Desktop from '../components/Desktop.astro';
const aboutRaw = await import('../content/about.md');
const contactRaw = await import('../content/contact.md');
---
<Desktop>
  <aboutRaw.Content slot="about" />
  <contactRaw.Content slot="contact" />
</Desktop>
```

- [ ] **Step 3: ��行并验证**

```bash
npm run dev
```

预期：
- 桌面背景显示低透明度 "ETHAN" 水印
- Dock 底部 7 个图标
- 点击 About：打开 480×360 窗口，显示 about.md 内容
- 点击 Projects：打开 520×400 窗口，显示项目列表
- 点击 Blog：打开 "Coming soon" 窗口
- 点击 Movies：打开 580×480 窗口，显示 3 部电影卡片
- 点击 Books：打开 580×480 窗口，显示 3 本书卡片
- 点击 Contact：打开 400×280 窗口，显示联系方式

- [ ] **Step 4: Commit**

```bash
git add src/components/Desktop.astro src/pages/index.astro
git commit -m "feat: add Desktop component with all content windows"
```

---

### Task 7: 子路由页面

**Files:**
- Create: `src/pages/about.astro`
- Create: `src/pages/projects.astro`
- Create: `src/pages/movies.astro`
- Create: `src/pages/books.astro`
- Create: `src/pages/contact.astro`
- Create: `src/pages/blog/index.astro`

- [ ] **Step 1: 创建各子路由页面**

新建 `src/pages/about.astro`：
```astro
---
import Desktop from '../components/Desktop.astro';
const aboutRaw = await import('../content/about.md');
const contactRaw = await import('../content/contact.md');
---
<Desktop autoOpen="about">
  <aboutRaw.Content slot="about" />
  <contactRaw.Content slot="contact" />
</Desktop>
```

新建 `src/pages/projects.astro`：
```astro
---
import Desktop from '../components/Desktop.astro';
const aboutRaw = await import('../content/about.md');
const contactRaw = await import('../content/contact.md');
---
<Desktop autoOpen="projects">
  <aboutRaw.Content slot="about" />
  <contactRaw.Content slot="contact" />
</Desktop>
```

新建 `src/pages/movies.astro`：
```astro
---
import Desktop from '../components/Desktop.astro';
const aboutRaw = await import('../content/about.md');
const contactRaw = await import('../content/contact.md');
---
<Desktop autoOpen="movies">
  <aboutRaw.Content slot="about" />
  <contactRaw.Content slot="contact" />
</Desktop>
```

新建 `src/pages/books.astro`：
```astro
---
import Desktop from '../components/Desktop.astro';
const aboutRaw = await import('../content/about.md');
const contactRaw = await import('../content/contact.md');
---
<Desktop autoOpen="books">
  <aboutRaw.Content slot="about" />
  <contactRaw.Content slot="contact" />
</Desktop>
```

新建 `src/pages/contact.astro`：
```astro
---
import Desktop from '../components/Desktop.astro';
const aboutRaw = await import('../content/about.md');
const contactRaw = await import('../content/contact.md');
---
<Desktop autoOpen="contact">
  <aboutRaw.Content slot="about" />
  <contactRaw.Content slot="contact" />
</Desktop>
```

新建 `src/pages/blog/index.astro`：
```astro
---
import Desktop from '../../components/Desktop.astro';
const aboutRaw = await import('../../content/about.md');
const contactRaw = await import('../../content/contact.md');
---
<Desktop autoOpen="blog">
  <aboutRaw.Content slot="about" />
  <contactRaw.Content slot="contact" />
</Desktop>
```

- [ ] **Step 2: 验证子路由**

```bash
npm run dev
```

访问以下 URL，各自应自动打开对应窗口：
- `http://localhost:4321/about` → About 窗口打开
- `http://localhost:4321/movies` → Movies 窗口打开
- `http://localhost:4321/books` → Books 窗口打开
- `http://localhost:4321/contact` → Contact 窗口打开
- `http://localhost:4321/blog` → Blog 窗口打开

- [ ] **Step 3: Commit**

```bash
git add src/pages/
git commit -m "feat: add sub-route pages with autoOpen"
```

---

### Task 8: GitHub Actions 部署

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: 创建 `.github/workflows/deploy.yml`**

```bash
mkdir -p .github/workflows
```

新建 `.github/workflows/deploy.yml`：
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: 本地验证 build 无报错**

```bash
npm run build 2>&1 | tail -20
```

预期：显示 build 成功，`dist/` 目录生成，无 error。

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: add GitHub Actions deploy workflow"
```

---

### Task 9: 收尾 — 删除旧静态文件

**Files:**
- Delete: `index.html`
- Delete: `books.html`
- Delete: `movies.html`

- [ ] **Step 1: 确认 Astro build 输出完整**

```bash
npm run build
ls dist/
```

预期：`dist/` 包含 `index.html`、`about/index.html`、`movies/index.html`、`books/index.html` 等。

- [ ] **Step 2: 删除旧静态文件**

```bash
git rm index.html books.html movies.html
```

- [ ] **Step 3: Commit**

```bash
git commit -m "chore: remove legacy static HTML files"
```

---

## Self-Review

**Spec coverage check:**

| Spec 要求 | 计划任务 |
|-----------|---------|
| Astro static output | Task 1 |
| Content Collections (movies/books/projects frontmatter) | Task 2 |
| StatusBar (用户名、路径、时间) | Task 3 |
| Window 拖拽/缩放/焦点/关闭 | Task 4 |
| Dock 7 项 + 指示点 + Resume 下载 | Task 5 |
| Desktop shell + 水印 | Task 6 |
| About/Projects/Blog/Contact/Movies/Books 窗口 | Task 6 |
| 子路由 `/about` `/movies` 等 + autoOpen | Task 7 |
| URL 同步 (pushState) | Task 4 (window-manager.js) |
| Mobile 全屏 overlay + slide-up | Task 4 (Window.astro styles) |
| Dock mobile: 无标签, 22px 图标 | Task 5 |
| GitHub Actions 部署 | Task 8 |
| 删除旧 HTML | Task 9 |
| `a:focus-visible` 无障碍 | Task 4, 5 |
| `prefers-reduced-motion` | Task 3, 4, 5 |
