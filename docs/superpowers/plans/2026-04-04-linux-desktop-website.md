# Linux Desktop Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the existing Astro personal website into a polished Linux-desktop-themed showcase with all P0/P1 interactions, proper content, and GitHub Pages deployment.

**Architecture:** Single-page Astro app with all window content rendered server-side (SSR-to-static), with a client-side `window-manager.js` handling drag/focus/animation state. No framework island needed — pure vanilla JS + CSS.

**Tech Stack:** Astro 4.x (static), JetBrains Mono (Google Fonts), Vanilla JS (Pointer Events), CSS custom properties, GitHub Pages + CNAME

---

## Current State (read before starting)

The codebase already has:
- `src/components/{Desktop,Dock,StatusBar,Window}.astro` — core shell components
- `src/scripts/window-manager.js` — drag, resize, focus (z-index only), open/close, URL sync
- `src/content/{about,contact,projects,movies,books}/` — content collections
- `.github/workflows/deploy.yml` — currently deploys via SSH to VPS (needs replacing)

**What's missing / broken:**
- Window open/close has NO animation (just `display:none` toggle)
- Window focus/blur has NO visual distinction (only z-index changes)
- Dock icons have NO magnification on hover (only background highlight)
- About window shows plain markdown, needs neofetch-style layout
- Projects lack `type` field (work/oss/side) and color tags; only 1 project exists
- Blog window is a "Coming soon" placeholder
- Contact window needs terminal-aligned layout
- Window background is solid (no glassmorphism)
- Desktop background is flat `#0d1117` (no texture)
- GitHub Actions workflow deploys to VPS via SSH, needs replacing with GitHub Pages
- No `public/CNAME` file
- `astro.config.mjs` `site` still points to old domain

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `src/scripts/window-manager.js` | Modify | Add animation classes, focus/blur tracking |
| `src/components/Window.astro` | Modify | Add glassmorphism, focus/blur CSS, animation CSS |
| `src/components/Dock.astro` | Modify | Add magnification CSS on hover |
| `src/components/Desktop.astro` | Modify | About neofetch layout, contact layout, desktop texture, projects type tags, blog list |
| `src/content/config.ts` | Modify | Add `type` to projects schema, add `blog` collection, add `status`/`watched` fields |
| `src/content/about/index.md` | Modify | Rewrite with neofetch content |
| `src/content/contact/index.md` | Modify | Terminal-aligned contact data |
| `src/content/projects/*.md` | Create/Modify | Add all 7 projects with `type` field |
| `src/content/blog/*.md` | Create | 2 sample blog posts |
| `src/content/movies/*.md` | Modify | Add `watched` field |
| `src/content/books/*.md` | Modify | Add `status` field |
| `public/CNAME` | Create | `me.oasaka.xyz` |
| `public/resume.pdf` | Note | Must be placed manually (not in plan) |
| `astro.config.mjs` | Modify | Update `site` to `https://me.oasaka.xyz` |
| `.github/workflows/deploy.yml` | Replace | GitHub Pages deploy workflow |

---

## Task 1: Window Open/Close Animation (P0)

**Files:**
- Modify: `src/scripts/window-manager.js`
- Modify: `src/components/Window.astro` (CSS `<style>` block)

The current `openWindow` removes `win-hidden` (display:none) instantly — no animation. We need a CSS keyframe sequence: scale(0.85)+opacity:0 → scale(1)+opacity:1 on open, reverse on close.

- [ ] **Step 1: Add CSS animation classes and keyframes to `Window.astro`**

In `src/components/Window.astro`, inside the `<style>` block, replace the `.win-hidden` rule and add:

```css
/* Replace the old rule: .win-hidden { display: none; } */

@keyframes win-open {
  from { opacity: 0; transform: scale(0.85); }
  to   { opacity: 1; transform: scale(1); }
}
@keyframes win-close {
  from { opacity: 1; transform: scale(1); }
  to   { opacity: 0; transform: scale(0.85); }
}

.window {
  /* add to the existing .window rule */
  transform-origin: center bottom; /* animate from Dock direction */
}
.win-hidden {
  display: none;
}
.win-opening {
  animation: win-open 0.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
.win-closing {
  animation: win-close 0.15s ease-in forwards;
}
```

- [ ] **Step 2: Update `openWindow` in `window-manager.js` to use animation**

Replace the `openWindow` function:

```js
export function openWindow(id) {
  const win = document.getElementById(`win-${id}`);
  if (!win) return;
  if (!win.classList.contains('win-hidden')) {
    // already open — just focus
    bringToFront(win);
    focusWindow(win);
    return;
  }
  win.classList.remove('win-hidden', 'win-closing');
  win.classList.add('win-opening');
  win.addEventListener('animationend', () => win.classList.remove('win-opening'), { once: true });
  bringToFront(win);
  focusWindow(win);
  history.pushState({}, '', `/${id}`);
  updateDockIndicators();
}
```

- [ ] **Step 3: Update `closeWindow` in `window-manager.js` to use animation**

Replace the `closeWindow` function:

```js
export function closeWindow(id) {
  const win = document.getElementById(`win-${id}`);
  if (!win || win.classList.contains('win-hidden')) return;
  win.classList.add('win-closing');
  win.addEventListener('animationend', () => {
    win.classList.add('win-hidden');
    win.classList.remove('win-closing');
    const openWindows = [...document.querySelectorAll('.window:not(.win-hidden)')];
    if (openWindows.length === 0) history.pushState({}, '', '/');
    updateDockIndicators();
  }, { once: true });
}
```

- [ ] **Step 4: Verify visually**

Run: `npm run dev`

Open browser at `http://localhost:4321`. Click any Dock icon — the window should scale in smoothly. Click the red close button — the window should scale out before disappearing.

- [ ] **Step 5: Commit**

```bash
git add src/components/Window.astro src/scripts/window-manager.js
git commit -m "feat(P0): window open/close scale+opacity animation"
```

---

## Task 2: Window Focus/Blur Visual Distinction (P0)

**Files:**
- Modify: `src/scripts/window-manager.js`
- Modify: `src/components/Window.astro` (CSS)

When a window is not focused: slightly dimmed, traffic light buttons turn gray. When focused: full brightness, colored buttons.

- [ ] **Step 1: Add focus/blur CSS to `Window.astro`**

Add to the `<style>` block in `Window.astro`:

```css
/* Default (blurred) state */
.window {
  filter: brightness(0.75);
  transition: filter 0.15s ease;
}
/* Focused state */
.window.win-focused {
  filter: brightness(1);
}
/* Traffic lights: gray when blurred, colored when focused */
.window .win-btn-close    { background: #6b6b6b; }
.window .win-btn-minimize { background: #6b6b6b; }
.window .win-btn-maximize { background: #6b6b6b; }
.window.win-focused .win-btn-close    { background: #ff5f57; }
.window.win-focused .win-btn-minimize { background: #febc2e; }
.window.win-focused .win-btn-maximize { background: #28c840; }
```

- [ ] **Step 2: Add `focusWindow` and `blurAllWindows` to `window-manager.js`**

Add these functions (before `bringToFront`):

```js
function blurAllWindows() {
  document.querySelectorAll('.window').forEach(w => w.classList.remove('win-focused'));
}

function focusWindow(winEl) {
  blurAllWindows();
  winEl.classList.add('win-focused');
}
```

- [ ] **Step 3: Call `focusWindow` in all relevant places in `window-manager.js`**

In `bringToFront`, add focus:
```js
function bringToFront(winEl) {
  winEl.style.zIndex = ++zCounter;
  focusWindow(winEl);
}
```

In `initFocus`, update:
```js
function initFocus(winEl) {
  winEl.addEventListener('mousedown', () => {
    bringToFront(winEl);
  });
}
```

- [ ] **Step 4: Verify visually**

Run: `npm run dev`

Open two windows. Click one — it should be full brightness with colored traffic lights. The other should dim with gray traffic lights.

- [ ] **Step 5: Commit**

```bash
git add src/components/Window.astro src/scripts/window-manager.js
git commit -m "feat(P0): window focus/blur visual distinction"
```

---

## Task 3: Dock Magnification Effect (P0)

**Files:**
- Modify: `src/components/Dock.astro` (CSS only)

On hover, the hovered icon scales up (~1.3x). Neighboring icons slightly scale too for a "liquid" feel. We achieve this with CSS sibling selectors.

- [ ] **Step 1: Add magnification CSS to `Dock.astro`**

Add to the `<style>` block in `Dock.astro`:

```css
/* Magnification on hover */
.dock-item {
  transition: transform 0.15s ease, background 0.15s ease, color 0.15s ease;
}
.dock-item:hover {
  transform: scale(1.3) translateY(-6px);
  background: rgba(255, 255, 255, 0.1);
  color: white;
}
/* Adjacent sibling gets slight scale */
.dock-item:hover + .dock-item,
.dock-item:has(+ .dock-item:hover) {
  transform: scale(1.15) translateY(-3px);
}
```

Also update `.dock` to add `align-items: flex-end` so items grow upward:

```css
.dock {
  /* existing properties stay, add: */
  align-items: flex-end;
  padding-bottom: 6px;
}
```

- [ ] **Step 2: Verify visually**

Run: `npm run dev`

Hover over dock icons — they should scale up and lift. Adjacent icons should subtly scale.

- [ ] **Step 3: Commit**

```bash
git add src/components/Dock.astro
git commit -m "feat(P0): dock icon magnification on hover"
```

---

## Task 4: Window Glassmorphism (P1)

**Files:**
- Modify: `src/components/Window.astro` (CSS)

Change window background from solid `#1a1a2e` to semi-transparent with blur.

- [ ] **Step 1: Update window background CSS in `Window.astro`**

In the `.window` rule, replace `background: #1a1a2e;` with:

```css
.window {
  /* replace solid background */
  background: rgba(18, 18, 35, 0.82);
  backdrop-filter: blur(20px) saturate(1.4);
  -webkit-backdrop-filter: blur(20px) saturate(1.4);
}
```

In `.win-titlebar`, replace `background: #252535;` with:

```css
.win-titlebar {
  background: rgba(30, 30, 50, 0.9);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
```

- [ ] **Step 2: Verify visually**

Run: `npm run dev`

Open a window and drag it over the desktop watermark text — you should see a frosted glass effect.

- [ ] **Step 3: Commit**

```bash
git add src/components/Window.astro
git commit -m "feat(P1): window glassmorphism backdrop-filter"
```

---

## Task 5: Desktop Background Texture (P1)

**Files:**
- Modify: `src/components/Desktop.astro` (the `<style>` block in the `<head>`)

Add a subtle gradient + noise to break up the flat `#0d1117` background.

- [ ] **Step 1: Update body/desktop background in `Desktop.astro`**

In the `<style>` block inside `<head>`, replace:
```css
body {
  background: #0d1117;
  ...
}
```
with:
```css
body {
  background-color: #0d1117;
  background-image:
    radial-gradient(ellipse at 20% 50%, rgba(30, 30, 80, 0.35) 0%, transparent 60%),
    radial-gradient(ellipse at 80% 20%, rgba(15, 40, 60, 0.3) 0%, transparent 50%),
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
  background-repeat: repeat;
  font-family: 'JetBrains Mono', monospace;
  overflow: hidden;
  height: 100vh;
}
```

- [ ] **Step 2: Verify visually**

Run: `npm run dev`

Background should have subtle blue-purple atmospheric gradients and very faint noise texture instead of flat black.

- [ ] **Step 3: Commit**

```bash
git add src/components/Desktop.astro
git commit -m "feat(P1): desktop background atmospheric gradient + noise"
```

---

## Task 6: About Window — Neofetch Layout + Bio (P1/Content)

**Files:**
- Modify: `src/content/about/index.md`
- Modify: `src/components/Desktop.astro` (About window CSS)

Redesign the About window with bio text, neofetch-style skill table, and highlight number cards.

- [ ] **Step 1: Rewrite `src/content/about/index.md`**

```markdown
---
---
AN OBSCURE ENGINEER, BUILDING IN PUBLIC.

6 年软件开发经验，近 5 年深耕华为云 OpenStack 控制面。主导云原生化改造、性能调优与消息中间件治理。开源贡献者，prometheus/client_python 核心 PR 合并（73 轮 review，4 个月）。

<div class="neofetch">
  <div class="nf-row"><span class="nf-key">Languages</span><span class="nf-sep">:</span><span class="nf-val">Python · Go · Java · Shell</span></div>
  <div class="nf-row"><span class="nf-key">Frameworks</span><span class="nf-sep">:</span><span class="nf-val">Spring Boot · Django · Vue.js</span></div>
  <div class="nf-row"><span class="nf-key">Cloud</span><span class="nf-sep">:</span><span class="nf-val">Docker · K8s · OpenStack · Nginx/OpenResty</span></div>
  <div class="nf-row"><span class="nf-key">Monitoring</span><span class="nf-sep">:</span><span class="nf-val">Prometheus · Jenkins · pprof · JMeter</span></div>
  <div class="nf-row"><span class="nf-key">Data</span><span class="nf-sep">:</span><span class="nf-val">RabbitMQ · Pulsar · RocketMQ · Redis · MySQL</span></div>
  <div class="nf-row"><span class="nf-key">Tools</span><span class="nf-sep">:</span><span class="nf-val">Git · Linux · gRPC</span></div>
</div>

<div class="highlights">
  <div class="hl-card"><span class="hl-num">5+</span><span class="hl-label">年华为云 OpenStack</span></div>
  <div class="hl-card"><span class="hl-num">1000+</span><span class="hl-label">人天节省</span></div>
  <div class="hl-card"><span class="hl-num">73</span><span class="hl-label">轮 review 合并 PR</span></div>
</div>
```

- [ ] **Step 2: Add neofetch + highlights CSS to `Desktop.astro`**

In the `<style is:global>` block, replace the existing `.about-profile + *` rules and add:

```css
/* About bio text */
.about-profile + * > p:first-child {
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.14em;
  color: rgba(255,255,255,0.45);
  margin-bottom: 10px;
  text-transform: uppercase;
}
.about-profile + * > p:nth-child(2) {
  font-size: 12px;
  color: rgba(255,255,255,0.7);
  line-height: 1.7;
  margin-bottom: 16px;
}

/* Neofetch block */
.neofetch {
  background: rgba(0,0,0,0.25);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 6px;
  padding: 10px 14px;
  margin-bottom: 14px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
}
.nf-row { display: flex; gap: 0; margin-bottom: 3px; }
.nf-row:last-child { margin-bottom: 0; }
.nf-key {
  color: #c75b39;
  min-width: 90px;
  font-weight: 600;
}
.nf-sep { color: rgba(255,255,255,0.3); margin-right: 8px; }
.nf-val { color: rgba(255,255,255,0.8); }

/* Highlight cards */
.highlights {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}
.hl-card {
  background: rgba(199, 91, 57, 0.1);
  border: 1px solid rgba(199, 91, 57, 0.25);
  border-radius: 6px;
  padding: 10px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  text-align: center;
}
.hl-num {
  font-size: 18px;
  font-weight: 700;
  color: #c75b39;
}
.hl-label {
  font-size: 9px;
  color: rgba(255,255,255,0.5);
  line-height: 1.3;
}
```

- [ ] **Step 3: Verify visually**

Run: `npm run dev`

Open the About window. Should show: avatar → tagline → bio paragraph → neofetch table with orange keys → 3 highlight number cards.

- [ ] **Step 4: Commit**

```bash
git add src/content/about/index.md src/components/Desktop.astro
git commit -m "feat(P1): about window neofetch layout, bio text, highlight cards"
```

---

## Task 7: Projects — Type Tags + Full Project List (P1/Content)

**Files:**
- Modify: `src/content/config.ts`
- Modify/Create: `src/content/projects/*.md` (7 files total)
- Modify: `src/components/Desktop.astro` (projects window CSS + HTML)

- [ ] **Step 1: Add `type` field to projects schema in `src/content/config.ts`**

Replace the `projects` collection definition:

```typescript
const projects = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    description: z.string(),
    url: z.string().url().optional(),
    icon: z.string(),
    type: z.enum(['work', 'oss', 'side']),
    tech: z.array(z.string()),
  }),
});
```

- [ ] **Step 2: Rewrite all project content files**

Replace `src/content/projects/ai-context-vault-cn.md`:
```markdown
---
name: "ai-context-vault-cn"
description: "AI 上下文管理工具，面向中文开发者"
icon: "🗄️"
type: "side"
tech: ["Python", "CLI"]
url: "https://github.com/ethan0xbuilds/ai-context-vault-cn"
---
```

Create `src/content/projects/openstack-cloudnative.md`:
```markdown
---
name: "openstack-cloudnative"
description: "OpenStack 组件云原生化改造，30+ 组件迁移 K8s，节约 1000+ 人天"
icon: "☁️"
type: "work"
tech: ["Python", "K8s", "Docker", "Prometheus"]
---
```

Create `src/content/projects/prometheus-client-python.md`:
```markdown
---
name: "prometheus-client-python"
description: "prometheus/client_python 核心 PR，支持 mTLS/HTTPS，73 轮 review 合并"
icon: "📊"
type: "oss"
tech: ["Python", "TLS", "Prometheus"]
url: "https://github.com/prometheus/client_python"
---
```

Create `src/content/projects/cps-performance.md`:
```markdown
---
name: "cps-performance"
description: "CPS 服务性能优化，接口延迟降低 80-90%，90% 请求本地缓存命中"
icon: "⚡"
type: "work"
tech: ["Python", "Redis", "OpenStack"]
---
```

Create `src/content/projects/cloudmatrix-384.md`:
```markdown
---
name: "cloudmatrix-384"
description: "超节点管理平台前后端，逻辑超节点模块，30+ 接口压测"
icon: "🖥️"
type: "work"
tech: ["Go", "Jenkins", "JMeter"]
---
```

Create `src/content/projects/rabbitmq-governance.md`:
```markdown
---
name: "rabbitmq-governance"
description: "OpenStack 控制面消息中间件治理，RabbitMQ 到 Pulsar 迁移 POC"
icon: "🐇"
type: "work"
tech: ["RabbitMQ", "Pulsar", "Python"]
---
```

Create `src/content/projects/personal-website.md`:
```markdown
---
name: "personal-website"
description: "本站，模拟 Linux 桌面的 Astro 个人网站"
icon: "🖱️"
type: "side"
tech: ["Astro", "CSS", "JS"]
url: "https://github.com/ethan0xbuilds/ethan0xbuilds"
---
```

- [ ] **Step 3: Update Projects window HTML in `Desktop.astro`**

Find the `<!-- Projects Window -->` section and replace the inner `<div class="project-list">`:

```astro
<div class="project-list">
  {projects.map(p => (
    <div class="project-row">
      <span class="project-icon">{p.data.icon}</span>
      <div class="project-info">
        <div class="project-name-row">
          <span class="project-name">{p.data.name}</span>
          <span class={`project-type project-type-${p.data.type}`}>{p.data.type}</span>
          {p.data.url && (
            <a href={p.data.url} target="_blank" rel="noopener noreferrer" class="project-link" aria-label="GitHub">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </a>
          )}
        </div>
        <div class="project-desc">{p.data.description}</div>
        <div class="project-tech">
          {p.data.tech.map(t => <span class="tech-tag">{t}</span>)}
        </div>
      </div>
    </div>
  ))}
</div>
```

- [ ] **Step 4: Add project type tag CSS to `Desktop.astro`**

In `<style is:global>`, replace existing `.project-*` rules:

```css
.project-list { display: flex; flex-direction: column; gap: 8px; }
.project-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 12px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 6px;
  transition: background 0.15s ease;
}
.project-row:hover { background: rgba(255,255,255,0.08); }
.project-icon { font-size: 20px; margin-top: 2px; flex-shrink: 0; }
.project-info { flex: 1; min-width: 0; }
.project-name-row { display: flex; align-items: center; gap: 6px; margin-bottom: 3px; flex-wrap: wrap; }
.project-name { font-size: 12px; font-weight: 600; color: #c75b39; }
.project-type {
  font-size: 9px;
  padding: 1px 5px;
  border-radius: 3px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.project-type-work { background: rgba(59,130,246,0.2); color: #7eb8f7; border: 1px solid rgba(59,130,246,0.3); }
.project-type-oss  { background: rgba(34,197,94,0.2);  color: #4ade80; border: 1px solid rgba(34,197,94,0.3); }
.project-type-side { background: rgba(168,85,247,0.2); color: #c084fc; border: 1px solid rgba(168,85,247,0.3); }
.project-link { color: rgba(255,255,255,0.4); display: flex; align-items: center; margin-left: auto; }
.project-link:hover { color: #c75b39; }
.project-desc { font-size: 11px; color: rgba(255,255,255,0.55); line-height: 1.5; margin-bottom: 5px; }
.project-tech { display: flex; flex-wrap: wrap; gap: 4px; }
.tech-tag {
  font-size: 9px;
  padding: 1px 5px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 3px;
  color: rgba(255,255,255,0.5);
}
```

- [ ] **Step 5: Verify**

Run: `npm run dev`

Open Projects window. Should show 7 projects with emoji icons, colored type badges (blue=work, green=oss, purple=side), description, and tech tags. OSS projects show an external link icon.

- [ ] **Step 6: Commit**

```bash
git add src/content/config.ts src/content/projects/ src/components/Desktop.astro
git commit -m "feat(P1): projects type tags, color coding, full project list"
```

---

## Task 8: Blog Window — Article List + In-Window Detail (P1)

**Files:**
- Modify: `src/content/config.ts` (add blog collection)
- Create: `src/content/blog/2026-04-01-claude-code-website.md`
- Create: `src/content/blog/2026-03-15-openstack-cloudnative.md`
- Modify: `src/components/Desktop.astro` (blog window HTML + CSS)

- [ ] **Step 1: Add blog collection to `src/content/config.ts`**

Add after the existing collection definitions:

```typescript
const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.string(), // "YYYY-MM-DD"
    summary: z.string(),
  }),
});
```

And add `blog` to the exports:

```typescript
export const collections = { about, contact, projects, movies, books, blog };
```

- [ ] **Step 2: Create sample blog posts**

Create `src/content/blog/2026-04-01-claude-code-website.md`:
```markdown
---
title: "如何用 Claude Code 构建个人网站"
date: "2026-04-01"
summary: "用 AI 辅助开发一个模拟 Linux 桌面的 Astro 个人网站全过程记录。"
---

## 背景

最近在用 Claude Code 重构个人网站，目标是做一个模拟 Linux 桌面环境的展示站...

这是一篇关于如何使用 AI 辅助开发的实践总结，记录了从设计到实现的完整流程。

## 核心挑战

1. **窗口管理器** — 纯 Vanilla JS 实现拖拽、focus/blur 状态管理、动画
2. **静态 + 动态** — Astro 静态构建，但需要客户端交互
3. **内容管理** — Astro Content Collections 管理博客、电影、书籍数据

## 收获

AI 辅助开发最大的价值在于：帮你把"知道但懒得写"的样板代码快速落地。
真正的创意决策还是得自己来。
```

Create `src/content/blog/2026-03-15-openstack-cloudnative.md`:
```markdown
---
title: "我的 OpenStack 云原生化实践总结"
date: "2026-03-15"
summary: "5 年华为云 OpenStack 经验，30+ 组件迁移 K8s 的技术细节与踩坑记录。"
---

## 背景

华为云 OpenStack 控制面最初依赖裸机部署，缺乏弹性扩缩容能力。我们团队负责将 30+ 个组件迁移到 K8s。

## 技术方案

### 指标采集

使用 Keystone 鉴权完成 Prometheus Exporter，遇到的核心问题是 `prometheus/client_python` 不支持 HTTPS/mTLS。

最终我们设计了 TLS 上下文切换方案，支持 TLS 与 mTLS 双模式，并向上游提交了 PR，经过 73 轮 review 后合并。

### 容器化改造

Keystone 和 wrap-trigger 的容器化改造是最复杂的部分，涉及：

- 配置文件挂载（ConfigMap vs Secret）
- 健康检查端点设计
- 滚动升级策略

## 数据

改造完成后，节约估算超过 1000 人天的运维人力成本。
```

- [ ] **Step 3: Update Blog window in `Desktop.astro`**

First, add the blog import at the top of the frontmatter section (where other collections are imported):

```astro
const blogPosts = (await getCollection('blog')).sort(
  (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
);
```

Then replace the `<!-- Blog Window -->` content:

```astro
<!-- Blog Window -->
<Window id="blog" title="blog/" defaultWidth={520} defaultHeight={380} defaultTop={120} defaultLeft={200}>
  <div class="blog-list" id="blog-list">
    {blogPosts.map(post => (
      <button
        class="blog-row"
        data-post-id={post.id}
        aria-label={post.data.title}
      >
        <span class="blog-date">{post.data.date}</span>
        <span class="blog-title">{post.data.title}</span>
      </button>
    ))}
  </div>
  <div class="blog-detail" id="blog-detail" style="display:none;">
    <button class="blog-back" id="blog-back">← back</button>
    <div class="blog-post-content" id="blog-post-content"></div>
  </div>
</Window>
```

- [ ] **Step 4: Add blog CSS to `Desktop.astro`**

In `<style is:global>`:

```css
.blog-list { display: flex; flex-direction: column; }
.blog-row {
  display: flex;
  align-items: baseline;
  gap: 16px;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  background: none;
  border-left: none;
  border-right: none;
  border-top: none;
  cursor: pointer;
  text-align: left;
  width: 100%;
  color: inherit;
  font-family: 'JetBrains Mono', monospace;
}
.blog-row:last-child { border-bottom: none; }
.blog-date { font-size: 11px; color: rgba(255,255,255,0.35); min-width: 90px; flex-shrink: 0; }
.blog-title { font-size: 12px; color: rgba(255,255,255,0.8); transition: color 0.15s; }
.blog-row:hover .blog-title { color: #c75b39; }
.blog-back {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: rgba(255,255,255,0.4);
  background: none;
  border: none;
  cursor: pointer;
  font-family: 'JetBrains Mono', monospace;
  padding: 0 0 12px 0;
  transition: color 0.15s;
}
.blog-back:hover { color: #c75b39; }
.blog-post-content { font-size: 13px; line-height: 1.8; color: rgba(255,255,255,0.8); }
.blog-post-content h1, .blog-post-content h2 {
  color: white;
  margin: 16px 0 8px;
  font-size: 14px;
}
.blog-post-content p { margin-bottom: 10px; }
.blog-post-content code {
  background: rgba(255,255,255,0.08);
  padding: 1px 5px;
  border-radius: 3px;
  font-size: 11px;
}
.blog-post-content ol, .blog-post-content ul { padding-left: 20px; margin-bottom: 10px; }
.blog-post-content li { margin-bottom: 4px; }
```

- [ ] **Step 5: Add blog navigation script to `Desktop.astro`**

Add a `<script>` block (separate from the window-manager import) for blog navigation. Place it before the closing `</body>`:

```html
<script>
  // Inline blog post content for client-side navigation
  const blogData = {
    'blog/2026-04-01-claude-code-website': {
      title: '如何用 Claude Code 构建个人网站',
      date: '2026-04-01',
      html: document.querySelector('[data-blog-content="2026-04-01-claude-code-website"]')?.innerHTML ?? '',
    },
  };

  document.querySelectorAll('.blog-row').forEach(btn => {
    btn.addEventListener('click', () => {
      const list = document.getElementById('blog-list');
      const detail = document.getElementById('blog-detail');
      const content = document.getElementById('blog-post-content');
      const postId = btn.dataset.postId;
      // We'll fetch the rendered HTML from hidden elements
      const hidden = document.getElementById(`blog-post-${postId}`);
      if (!hidden || !list || !detail || !content) return;
      content.innerHTML = hidden.innerHTML;
      const win = btn.closest('.window');
      if (win) {
        const titleEl = win.querySelector('.win-title');
        if (titleEl) titleEl.textContent = `blog/${postId}.md`;
      }
      list.style.display = 'none';
      detail.style.display = 'block';
    });
  });

  document.getElementById('blog-back')?.addEventListener('click', () => {
    const list = document.getElementById('blog-list');
    const detail = document.getElementById('blog-detail');
    const win = document.getElementById('win-blog');
    if (!list || !detail) return;
    list.style.display = '';
    detail.style.display = 'none';
    if (win) {
      const titleEl = win.querySelector('.win-title');
      if (titleEl) titleEl.textContent = 'blog/';
    }
  });
</script>
```

Since we need to render Markdown server-side and pass it to client-side JS, embed rendered HTML in hidden divs. In `Desktop.astro` frontmatter:

```astro
const blogRendered = await Promise.all(
  blogPosts.map(async post => {
    const { Content } = await post.render();
    return { id: post.id, Content };
  })
);
```

Then after the Blog Window element, add:

```astro
<!-- Hidden rendered blog content for client-side use -->
<div style="display:none;" aria-hidden="true">
  {blogRendered.map(({ id, Content }) => (
    <div id={`blog-post-${id}`}><Content /></div>
  ))}
</div>
```

Update the blog navigation script to use these hidden divs (already references `blog-post-${postId}`).

- [ ] **Step 6: Verify**

Run: `npm run dev`

Open Blog window — should show date-sorted list. Click a title — content area replaces list, window title updates to `blog/slug.md`. Click "← back" — list returns.

- [ ] **Step 7: Commit**

```bash
git add src/content/config.ts src/content/blog/ src/components/Desktop.astro
git commit -m "feat(P1): blog window with article list and in-window detail view"
```

---

## Task 9: Contact Window Terminal Layout (Content)

**Files:**
- Modify: `src/content/contact/index.md`
- Modify: `src/components/Desktop.astro` (contact CSS)

- [ ] **Step 1: Rewrite `src/content/contact/index.md`**

```markdown
---
---
<div class="contact-list">
  <div class="contact-row"><span class="contact-key">GitHub</span><span class="contact-sep">:</span><a href="https://github.com/ethan0xbuilds" target="_blank" rel="noopener noreferrer" class="contact-val contact-link">ethan0xbuilds</a></div>
  <div class="contact-row"><span class="contact-key">Email</span><span class="contact-sep">:</span><span class="contact-val">ethan0xbuilds@proton.me</span></div>
  <div class="contact-row"><span class="contact-key">X</span><span class="contact-sep">:</span><a href="https://x.com/ethan0xbuilds" target="_blank" rel="noopener noreferrer" class="contact-val contact-link">@ethan0xbuilds</a></div>
  <div class="contact-row"><span class="contact-key">Telegram</span><span class="contact-sep">:</span><a href="https://t.me/ethan0xbuilds" target="_blank" rel="noopener noreferrer" class="contact-val contact-link">ethan0xbuilds</a></div>
  <div class="contact-row"><span class="contact-key">Discord</span><span class="contact-sep">:</span><span class="contact-val">ethan0xbuilds</span></div>
</div>
<div class="contact-echo">$ echo "Feel free to reach out"</div>
```

- [ ] **Step 2: Add contact CSS to `Desktop.astro`**

In `<style is:global>`:

```css
.contact-list { margin-bottom: 20px; }
.contact-row {
  display: flex;
  align-items: center;
  gap: 0;
  margin-bottom: 10px;
  font-size: 13px;
}
.contact-key {
  color: #c75b39;
  min-width: 80px;
  font-weight: 600;
}
.contact-sep { color: rgba(255,255,255,0.3); margin-right: 12px; }
.contact-val { color: rgba(255,255,255,0.8); }
.contact-link {
  color: #7eb8f7;
  text-decoration: none;
  transition: color 0.15s, text-decoration 0.15s;
}
.contact-link:hover { color: #c75b39; text-decoration: underline; }
.contact-echo {
  font-size: 11px;
  color: rgba(255,255,255,0.3);
  font-style: italic;
  margin-top: 8px;
}
```

- [ ] **Step 3: Verify**

Run: `npm run dev`

Open Contact window. Should show aligned label:value rows, orange labels, blue links.

- [ ] **Step 4: Commit**

```bash
git add src/content/contact/index.md src/components/Desktop.astro
git commit -m "feat: contact window terminal-aligned layout"
```

---

## Task 10: Content Schema Updates — Movies `watched`, Books `status` (Content)

**Files:**
- Modify: `src/content/config.ts`
- Modify: `src/content/movies/*.md`
- Modify: `src/content/books/*.md`
- Modify: `src/components/Desktop.astro` (books status filter)

- [ ] **Step 1: Update movies schema in `config.ts`**

Add `watched` field to movies:

```typescript
const movies = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    cover: z.string().optional(),
    rating: z.number().min(1).max(5),
    review: z.string(),
    year: z.number(),
    watched: z.string(), // "YYYY-MM"
  }),
});
```

Add `status` field to books:

```typescript
const books = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    cover: z.string().optional(),
    rating: z.number().min(1).max(5),
    review: z.string(),
    author: z.string(),
    status: z.enum(['reading', 'finished', 'want']).default('finished'),
  }),
});
```

- [ ] **Step 2: Update movie files with `watched` field**

`src/content/movies/oppenheimer.md`:
```markdown
---
title: "奥本海默"
rating: 5
review: "三小时没出戏，诺兰的信息密度真的没话说"
year: 2023
watched: "2024-01"
---
```

`src/content/movies/everything-everywhere.md` — add `watched: "2023-06"` (check existing, add field)

`src/content/movies/spider-man-into-the-spider-verse.md` — add `watched: "2023-03"`

- [ ] **Step 3: Update book files with `status` field**

`src/content/books/sapiens.md` — add `status: "finished"`

`src/content/books/high-output-management.md` — add `status: "finished"`

`src/content/books/zhong-guo-jing-ji.md` — add `status: "reading"` (or appropriate status)

- [ ] **Step 4: Add status filter buttons to Books window in `Desktop.astro`**

Replace the Books window content area:

```astro
<Window id="books" title="books.json" defaultWidth={580} defaultHeight={480} defaultTop={100} defaultLeft={160}>
  <div class="books-filters">
    <button class="filter-btn active" data-filter="all">all</button>
    <button class="filter-btn" data-filter="reading">reading</button>
    <button class="filter-btn" data-filter="finished">finished</button>
    <button class="filter-btn" data-filter="want">want</button>
  </div>
  <div class="media-grid" id="books-grid">
    {books.map(b => (
      <div class="media-card" data-status={b.data.status}>
        {b.data.cover
          ? <img src={b.data.cover} alt={b.data.title} class="media-cover" />
          : <div class="media-placeholder">📖</div>
        }
        <div class="media-body">
          <div class="media-title">{b.data.title}</div>
          <div class="media-rating">{'★'.repeat(b.data.rating)}{'☆'.repeat(5 - b.data.rating)}</div>
          <div class="media-author">{b.data.author}</div>
          <span class={`book-status book-status-${b.data.status}`}>{b.data.status}</span>
          <div class="media-review">{b.data.review}</div>
        </div>
      </div>
    ))}
  </div>
</Window>
```

- [ ] **Step 5: Add filter CSS and script**

CSS in `<style is:global>`:
```css
.books-filters {
  display: flex;
  gap: 6px;
  margin-bottom: 12px;
}
.filter-btn {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  padding: 3px 10px;
  border-radius: 4px;
  border: 1px solid rgba(255,255,255,0.15);
  background: rgba(255,255,255,0.05);
  color: rgba(255,255,255,0.5);
  cursor: pointer;
  transition: all 0.15s;
}
.filter-btn:hover, .filter-btn.active {
  background: rgba(199,91,57,0.2);
  border-color: rgba(199,91,57,0.4);
  color: #c75b39;
}
.book-status {
  display: inline-block;
  font-size: 8px;
  padding: 1px 4px;
  border-radius: 3px;
  text-transform: uppercase;
  font-weight: 600;
  margin-bottom: 4px;
}
.book-status-reading  { background: rgba(251,191,36,0.2); color: #fbbf24; }
.book-status-finished { background: rgba(34,197,94,0.2);  color: #4ade80; }
.book-status-want     { background: rgba(168,85,247,0.2); color: #c084fc; }
```

Script (add inside `<script>` block in Desktop.astro):
```js
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('#books-grid .media-card').forEach(card => {
      card.style.display = (filter === 'all' || card.dataset.status === filter) ? '' : 'none';
    });
  });
});
```

- [ ] **Step 6: Verify**

Run: `npm run dev`

Open Books window. Should show filter buttons at top. Click "reading" — only in-progress books show.

- [ ] **Step 7: Commit**

```bash
git add src/content/config.ts src/content/movies/ src/content/books/ src/components/Desktop.astro
git commit -m "feat: movies watched field, books status field + filter UI"
```

---

## Task 11: Infrastructure — GitHub Pages Deploy + CNAME (Deployment)

**Files:**
- Replace: `.github/workflows/deploy.yml`
- Create: `public/CNAME`
- Modify: `astro.config.mjs`

- [ ] **Step 1: Update `astro.config.mjs`**

Replace the `site` value:

```js
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  output: 'static',
  site: 'https://me.oasaka.xyz',
  integrations: [sitemap()],
});
```

- [ ] **Step 2: Create `public/CNAME`**

```
me.oasaka.xyz
```

- [ ] **Step 3: Replace `.github/workflows/deploy.yml`**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist/

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 4: Verify build locally**

Run: `npm run build`

Expected: Build succeeds with no errors, `dist/` contains `CNAME` file.

```bash
ls dist/CNAME  # should exist
cat dist/CNAME # should print: me.oasaka.xyz
```

- [ ] **Step 5: Commit**

```bash
git add astro.config.mjs public/CNAME .github/workflows/deploy.yml
git commit -m "feat: switch deploy to GitHub Pages, add CNAME for me.oasaka.xyz"
```

- [ ] **Step 6: Manual GitHub setup required (user action)**

After pushing, the user must:
1. Go to repository Settings → Pages → Source → select "GitHub Actions"
2. Add DNS CNAME record: `me.oasaka.xyz` → `ethan0xbuilds.github.io`
3. Wait for DNS propagation (~5-30 min)
4. Enable "Enforce HTTPS" in Pages settings

---

## Task 12: SEO Meta Tags (Accessibility + SEO)

**Files:**
- Modify: `src/components/Desktop.astro` (`<head>` section)

- [ ] **Step 1: Update `<head>` in `Desktop.astro`**

Replace the existing `<head>` content:

```html
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Ethan Chen — Software Engineer</title>
  <meta name="description" content="Ethan Chen is a software engineer with 6 years of experience in backend development, Go, Kubernetes, and OpenStack. Based in China, open to remote opportunities." />
  <!-- Open Graph -->
  <meta property="og:title" content="Ethan Chen — Software Engineer" />
  <meta property="og:description" content="6 years backend experience · OpenStack · Go · Kubernetes · Open source contributor" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://me.oasaka.xyz" />
  <meta property="og:image" content="https://me.oasaka.xyz/avatar.png" />
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:site" content="@ethan0xbuilds" />
  <meta name="twitter:title" content="Ethan Chen — Software Engineer" />
  <meta name="twitter:description" content="6 years backend experience · OpenStack · Go · Kubernetes" />
  <meta name="twitter:image" content="https://me.oasaka.xyz/avatar.png" />
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet" />
</head>
```

- [ ] **Step 2: Verify**

Run: `npm run build && npm run preview`

Check page source: `<title>` and `<meta>` tags should be present. Use browser DevTools to confirm.

- [ ] **Step 3: Commit**

```bash
git add src/components/Desktop.astro
git commit -m "feat: SEO meta tags, Open Graph, Twitter Card"
```

---

## Self-Review

### Spec Coverage Check

| PRD Requirement | Covered In |
|----------------|-----------|
| Window focus/blur visual (P0) | Task 2 |
| Window box-shadow (P0) | Already exists in `Window.astro` |
| Dock hover magnification (P0) | Task 3 |
| Dock open indicator dot (P0) | Already exists in `Dock.astro` |
| Window open/close animation (P0) | Task 1 |
| StatusBar real-time clock (P0) | Already exists |
| Mobile responsive (P0) | Already exists (full-screen on mobile) |
| Window glassmorphism (P1) | Task 4 |
| About neofetch skills (P1) | Task 6 |
| Projects type tag color coding (P1) | Task 7 |
| Blog code syntax highlighting (P1) | Not implemented — Astro's built-in shiki handles this if we add `markdown.syntaxHighlight` config. Added note below. |
| Desktop subtle texture (P1) | Task 5 |
| 5 core windows usable | Tasks 1-10 |
| Movies/Books windows functional | Tasks 10 |
| Resume download | Already in Dock, needs `public/resume.pdf` (user must add manually) |
| GitHub Pages workflow | Task 11 |
| CNAME file | Task 11 |
| astro.config.mjs site field | Task 11 |
| SEO meta tags | Task 12 |

**Gap found: Blog syntax highlighting**

Add to Task 8 or as a separate step: In `astro.config.mjs`, add:

```js
export default defineConfig({
  output: 'static',
  site: 'https://me.oasaka.xyz',
  integrations: [sitemap()],
  markdown: {
    syntaxHighlight: 'shiki',
    shikiConfig: { theme: 'tokyo-night' },
  },
});
```

This gives code blocks in blog posts dark syntax highlighting automatically.

**Gap: `public/resume.pdf`** — User must manually add the PDF file to `public/resume.pdf` (file naming: `Ethan_Chen_Software_Engineer_Resume.pdf`, but the Dock links to `/resume.pdf` — keep as `resume.pdf` for simplicity, or update the Dock `href` to match the actual filename).

### Placeholder Scan

No "TBD" or "TODO" placeholders found in plan.

### Type Consistency

- `p.data.type` used in Task 7 — matches `type: z.enum(['work', 'oss', 'side'])` added in Task 7 Step 1 ✓
- `b.data.status` used in Task 10 — matches `status: z.enum(['reading', 'finished', 'want'])` added in Task 10 Step 1 ✓
- `blogPosts` variable used in Tasks 8 — defined in frontmatter in same task ✓
- `focusWindow` called in Task 1's updated `openWindow` — defined in Task 2 ⚠️

**Order dependency:** Task 2 must be implemented before Task 1's `openWindow` update references `focusWindow`. Both tasks modify `window-manager.js` — do Task 2 Step 2 (add `focusWindow`/`blurAllWindows`) before Task 1 Step 2-3. Alternatively, define both functions in one go. The plan as written has this dependency — just do Task 1 first without the `focusWindow` call in `openWindow`, then add it after Task 2.

**Correction:** Reorder: implement `focusWindow` function in Task 2 first, then update `openWindow`/`closeWindow` in Task 1. Or combine: Tasks 1 and 2 can be done together since they both modify `window-manager.js`.

---

## Recommended Execution Order

Execute tasks in this order to avoid dependency issues:

1. **Task 2** (Focus/Blur) — defines `focusWindow` used by Task 1
2. **Task 1** (Open/Close Animation) — uses `focusWindow` from Task 2
3. **Task 3** (Dock Magnification) — independent
4. **Task 4** (Glassmorphism) — independent
5. **Task 5** (Desktop Texture) — independent
6. **Task 6** (About Neofetch) — independent
7. **Task 7** (Projects) — independent
8. **Task 8** (Blog) — depends on blog collection in config.ts (do after schema updates)
9. **Task 9** (Contact) — independent
10. **Task 10** (Movies/Books) — schema update, then UI
11. **Task 11** (Infrastructure) — update after all content is ready
12. **Task 12** (SEO) — last, after domain is confirmed

---
