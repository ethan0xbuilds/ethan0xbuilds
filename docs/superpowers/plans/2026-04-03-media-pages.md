# 书影记录页 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 新增 `books.html` 和 `movies.html` 两个独立静态页面，并在主页添加入口链接。

**Architecture:** 纯静态 HTML/CSS，无构建工具，无 JavaScript。所有样式内联在 `<style>` 标签中，与主页 `index.html` 保持相同的玻璃拟态风格。三个页面通过普通 `<a>` 链接互相导航。

**Tech Stack:** HTML5, CSS3 (glassmorphism, CSS Grid, backdrop-filter)

---

## 文件清单

| 文件 | 操作 | 职责 |
|------|------|------|
| `index.html` | 修改 | 在 Featured Projects 卡片中新增书单和影单入口 |
| `books.html` | 新建 | 书单页：网格卡片展示已读书籍 |
| `movies.html` | 新建 | 影单页：网格卡片展示已看电影 |

---

### Task 1: 在 index.html 添加书单和影单入口

**Files:**
- Modify: `index.html`（在 Featured Projects `<div class="glass-card">` 内追加两个 `.project-card`）

- [ ] **Step 1: 在 Featured Projects 卡片末尾插入两个入口链接**

找到 `index.html` 中以下代码块的末尾（`ai-context-vault-cn` 卡片之后，`</div>` 之前）：

```html
        <!-- Projects Section -->
        <div class="glass-card">
            <h3>Featured Projects</h3>
            <a href="https://github.com/ethan0xbuilds/ai-context-vault-cn" ...>
                ...
            </a>
            <!-- 在此处插入 -->
        </div>
```

插入以下内容（替换注释行）：

```html
            <a href="books.html" class="project-card" aria-label="我的书单">
                <span class="project-icon" aria-hidden="true">📚</span>
                <div class="project-card-info">
                    <span class="project-card-name">书单</span>
                    <span class="project-card-desc">Reading List</span>
                </div>
            </a>
            <a href="movies.html" class="project-card" aria-label="我的影单">
                <span class="project-icon" aria-hidden="true">🎬</span>
                <div class="project-card-info">
                    <span class="project-card-name">影单</span>
                    <span class="project-card-desc">Watching List</span>
                </div>
            </a>
```

- [ ] **Step 2: 浏览器验证**

用浏览器打开 `index.html`（直接双击或 `open index.html`）。

预期：Featured Projects 卡片中出现「📚 书单」和「🎬 影单」两行，样式与上方的 `ai-context-vault-cn` 卡片一致。

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add books and movies entry links to index"
```

---

### Task 2: 创建 books.html

**Files:**
- Create: `books.html`

- [ ] **Step 1: 创建 books.html**

新建文件 `books.html`，内容如下（包含 3 条示例书目，供验证布局用）：

```html
<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>书单 — Ethan</title>
    <meta name="description" content="Ethan 的书单" />
    <style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px 20px;
    position: relative;
    overflow-x: hidden;
}

.orb {
    position: fixed;
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
}
.orb-1 {
    width: 300px; height: 300px;
    background: rgba(255, 150, 120, 0.4);
    filter: blur(80px);
    top: -80px; left: -80px;
}
.orb-2 {
    width: 250px; height: 250px;
    background: rgba(180, 130, 220, 0.4);
    filter: blur(90px);
    bottom: -60px; right: -60px;
}
.orb-3 {
    width: 200px; height: 200px;
    background: rgba(254, 180, 220, 0.3);
    filter: blur(100px);
    top: 50%; left: 60%;
}

.page {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 680px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
}

/* Back button */
.back-btn {
    align-self: flex-start;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 20px;
    text-decoration: none;
    color: rgba(255, 255, 255, 0.7);
    font-size: 13px;
    transition: all 0.2s ease;
}
.back-btn:hover {
    background: rgba(255, 255, 255, 0.2);
    color: white;
}

/* Header */
.header {
    text-align: center;
    width: 100%;
}
.page-title {
    font-size: 32px;
    font-weight: 700;
    color: white;
    margin-bottom: 6px;
}
.page-subtitle {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.5);
    text-transform: uppercase;
    letter-spacing: 2px;
}

/* Page nav */
.page-nav {
    display: flex;
    gap: 10px;
}
.nav-link {
    padding: 8px 20px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 600;
    text-decoration: none;
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: rgba(255, 255, 255, 0.6);
    background: rgba(255, 255, 255, 0.08);
    transition: all 0.2s ease;
}
.nav-link:hover {
    background: rgba(255, 255, 255, 0.15);
    color: white;
}
.nav-link.active {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.5);
    color: white;
}

/* Grid */
.grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    width: 100%;
}

/* Media card */
.media-card {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 12px;
    overflow: hidden;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.media-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.cover {
    width: 100%;
    aspect-ratio: 2 / 3;
    object-fit: cover;
    display: block;
}

/* Emoji placeholder when no cover image */
.cover-placeholder {
    width: 100%;
    aspect-ratio: 2 / 3;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 48px;
    background: rgba(255, 255, 255, 0.05);
}

.card-body {
    padding: 12px;
}
.card-title {
    font-size: 13px;
    font-weight: 600;
    color: white;
    margin-bottom: 4px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.card-rating {
    font-size: 12px;
    color: rgba(255, 200, 80, 0.9);
    margin-bottom: 3px;
}
.card-date {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.4);
    margin-bottom: 6px;
}
.card-note {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.6);
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

/* Footer */
.footer {
    margin-top: 8px;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.4);
}

/* Focus */
a:focus-visible {
    outline: 2px solid white;
    outline-offset: 2px;
    border-radius: 4px;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
    }
}

/* Responsive */
@media (max-width: 480px) {
    body { padding: 24px 16px; }
    .page-title { font-size: 26px; }
    .grid { grid-template-columns: 1fr; }
}
    </style>
</head>
<body>
    <div class="orb orb-1"></div>
    <div class="orb orb-2"></div>
    <div class="orb orb-3"></div>

    <div class="page">
        <a href="index.html" class="back-btn" aria-label="返回主页">← 主页</a>

        <div class="header">
            <div class="page-title">📚 书单</div>
            <div class="page-subtitle">Reading List</div>
        </div>

        <nav class="page-nav" aria-label="页面导航">
            <span class="nav-link active">📚 书单</span>
            <a href="movies.html" class="nav-link">🎬 影单</a>
        </nav>

        <!-- 书单网格 — 最新在前 -->
        <div class="grid">

            <!-- 书目模板（复制此块添加新书）：
            <div class="media-card">
                <img src="封面图URL" alt="书名" class="cover" />
                或无图时用：
                <div class="cover-placeholder">📖</div>
                <div class="card-body">
                    <div class="card-title">书名</div>
                    <div class="card-rating">★★★★☆</div>
                    <div class="card-date">YYYY-MM-DD</div>
                    <div class="card-note">一句话感想</div>
                </div>
            </div>
            -->

            <div class="media-card">
                <div class="cover-placeholder">📖</div>
                <div class="card-body">
                    <div class="card-title">置身事内</div>
                    <div class="card-rating">★★★★★</div>
                    <div class="card-date">2026-03-15</div>
                    <div class="card-note">读完才发现自己对中国经济的理解有多浅薄</div>
                </div>
            </div>

            <div class="media-card">
                <div class="cover-placeholder">📖</div>
                <div class="card-body">
                    <div class="card-title">人类简史</div>
                    <div class="card-rating">★★★★☆</div>
                    <div class="card-date">2026-02-20</div>
                    <div class="card-note">宏大叙事，有些地方过于武断，但整体开眼界</div>
                </div>
            </div>

            <div class="media-card">
                <div class="cover-placeholder">📖</div>
                <div class="card-body">
                    <div class="card-title">High Output Management</div>
                    <div class="card-rating">★★★★★</div>
                    <div class="card-date">2026-01-08</div>
                    <div class="card-note">Grove 写给所有 manager 的书，实用性极强</div>
                </div>
            </div>

        </div>

        <div class="footer">© 2026 Ethan</div>
    </div>
</body>
</html>
```

- [ ] **Step 2: 浏览器验证**

```bash
open books.html
```

预期：
- 深靛蓝渐变背景 + 三个装饰光球
- 顶部「← 主页」返回按钮
- 「📚 书单 / Reading List」标题
- 两个页面导航胶囊（「书单」高亮，「影单」可点击）
- 3 张书目卡片，每张有 emoji 占位、标题、★ 评分、日期、感想

- [ ] **Step 3: Commit**

```bash
git add books.html
git commit -m "feat: add books page with grid card layout"
```

---

### Task 3: 创建 movies.html

**Files:**
- Create: `movies.html`

- [ ] **Step 1: 创建 movies.html**

新建文件 `movies.html`，内容如下（与 `books.html` 结构完全相同，仅标题、导航高亮和示例数据不同）：

```html
<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>影单 — Ethan</title>
    <meta name="description" content="Ethan 的影单" />
    <style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px 20px;
    position: relative;
    overflow-x: hidden;
}

.orb {
    position: fixed;
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
}
.orb-1 {
    width: 300px; height: 300px;
    background: rgba(255, 150, 120, 0.4);
    filter: blur(80px);
    top: -80px; left: -80px;
}
.orb-2 {
    width: 250px; height: 250px;
    background: rgba(180, 130, 220, 0.4);
    filter: blur(90px);
    bottom: -60px; right: -60px;
}
.orb-3 {
    width: 200px; height: 200px;
    background: rgba(254, 180, 220, 0.3);
    filter: blur(100px);
    top: 50%; left: 60%;
}

.page {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 680px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
}

.back-btn {
    align-self: flex-start;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 20px;
    text-decoration: none;
    color: rgba(255, 255, 255, 0.7);
    font-size: 13px;
    transition: all 0.2s ease;
}
.back-btn:hover {
    background: rgba(255, 255, 255, 0.2);
    color: white;
}

.header {
    text-align: center;
    width: 100%;
}
.page-title {
    font-size: 32px;
    font-weight: 700;
    color: white;
    margin-bottom: 6px;
}
.page-subtitle {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.5);
    text-transform: uppercase;
    letter-spacing: 2px;
}

.page-nav {
    display: flex;
    gap: 10px;
}
.nav-link {
    padding: 8px 20px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 600;
    text-decoration: none;
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: rgba(255, 255, 255, 0.6);
    background: rgba(255, 255, 255, 0.08);
    transition: all 0.2s ease;
}
.nav-link:hover {
    background: rgba(255, 255, 255, 0.15);
    color: white;
}
.nav-link.active {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.5);
    color: white;
}

.grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    width: 100%;
}

.media-card {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 12px;
    overflow: hidden;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.media-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.cover {
    width: 100%;
    aspect-ratio: 2 / 3;
    object-fit: cover;
    display: block;
}

.cover-placeholder {
    width: 100%;
    aspect-ratio: 2 / 3;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 48px;
    background: rgba(255, 255, 255, 0.05);
}

.card-body {
    padding: 12px;
}
.card-title {
    font-size: 13px;
    font-weight: 600;
    color: white;
    margin-bottom: 4px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.card-rating {
    font-size: 12px;
    color: rgba(255, 200, 80, 0.9);
    margin-bottom: 3px;
}
.card-date {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.4);
    margin-bottom: 6px;
}
.card-note {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.6);
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.footer {
    margin-top: 8px;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.4);
}

a:focus-visible {
    outline: 2px solid white;
    outline-offset: 2px;
    border-radius: 4px;
}

@media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
    }
}

@media (max-width: 480px) {
    body { padding: 24px 16px; }
    .page-title { font-size: 26px; }
    .grid { grid-template-columns: 1fr; }
}
    </style>
</head>
<body>
    <div class="orb orb-1"></div>
    <div class="orb orb-2"></div>
    <div class="orb orb-3"></div>

    <div class="page">
        <a href="index.html" class="back-btn" aria-label="返回主页">← 主页</a>

        <div class="header">
            <div class="page-title">🎬 影单</div>
            <div class="page-subtitle">Watching List</div>
        </div>

        <nav class="page-nav" aria-label="页面导航">
            <a href="books.html" class="nav-link">📚 书单</a>
            <span class="nav-link active">🎬 影单</span>
        </nav>

        <!-- 影单网格 — 最新在前 -->
        <div class="grid">

            <!-- 影目模板（复制此块添加新电影）：
            <div class="media-card">
                <img src="封面图URL" alt="电影名" class="cover" />
                或无图时用：
                <div class="cover-placeholder">🎬</div>
                <div class="card-body">
                    <div class="card-title">电影名</div>
                    <div class="card-rating">★★★★☆</div>
                    <div class="card-date">YYYY-MM-DD</div>
                    <div class="card-note">一句话感想</div>
                </div>
            </div>
            -->

            <div class="media-card">
                <div class="cover-placeholder">🎬</div>
                <div class="card-body">
                    <div class="card-title">奥本海默</div>
                    <div class="card-rating">★★★★★</div>
                    <div class="card-date">2026-03-01</div>
                    <div class="card-note">三小时没出戏，诺兰的信息密度真的没话说</div>
                </div>
            </div>

            <div class="media-card">
                <div class="cover-placeholder">🎬</div>
                <div class="card-body">
                    <div class="card-title">瞬息全宇宙</div>
                    <div class="card-rating">★★★★★</div>
                    <div class="card-date">2026-01-20</div>
                    <div class="card-note">看完沉默了很久，混乱和爱意混在一起</div>
                </div>
            </div>

            <div class="media-card">
                <div class="cover-placeholder">🎬</div>
                <div class="card-body">
                    <div class="card-title">蜘蛛侠：平行宇宙</div>
                    <div class="card-rating">★★★★☆</div>
                    <div class="card-date">2025-12-10</div>
                    <div class="card-note">动画风格实验性极强，漫画帧的那段太绝了</div>
                </div>
            </div>

        </div>

        <div class="footer">© 2026 Ethan</div>
    </div>
</body>
</html>
```

- [ ] **Step 2: 浏览器验证**

```bash
open movies.html
```

预期：
- 与 books.html 一致的背景和布局
- 「🎬 影单 / Watching List」标题
- 两个页面导航胶囊（「影单」高亮，「书单」可跳转回 books.html）
- 3 张影目卡片

- [ ] **Step 3: 验证三页导航链接**

在浏览器中依次点击：
1. `index.html` → 点击「📚 书单」→ 应跳转到 `books.html`
2. `books.html` → 点击「🎬 影单」→ 应跳转到 `movies.html`
3. `movies.html` → 点击「📚 书单」→ 应跳转到 `books.html`
4. `books.html` → 点击「← 主页」→ 应返回 `index.html`

- [ ] **Step 4: Commit**

```bash
git add movies.html
git commit -m "feat: add movies page with grid card layout"
```
