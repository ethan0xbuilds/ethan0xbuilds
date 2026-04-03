# Linux Desktop Redesign — Design Spec

**Date:** 2026-04-03
**Project:** ethan0xbuilds personal website
**Replaces:** glassmorphism single-page design (index.html, books.html, movies.html)

---

## Overview

Full rebuild of the personal website as a Linux desktop OS metaphor. Dark theme, monospace fonts, a top status bar, a bottom Dock, and draggable/resizable windows for each content section. Built with Astro, deployed to GitHub Pages.

---

## Architecture

**Approach:** Astro Islands + single desktop page with multi-route support.

- `src/pages/index.astro` is the main desktop. At build time, every window's content is pre-rendered and inlined as hidden HTML.
- `/about`, `/projects`, `/movies`, `/books`, `/contact`, `/blog` each have their own Astro page that renders the full `Desktop.astro` component with an `autoOpen` prop indicating which window to open automatically.
- `window-manager.js` (vanilla JS) handles all window interactions client-side. On `DOMContentLoaded` it reads `window.location.pathname` and calls `openWindow(id)` if a match is found.
- Output: `static` (GitHub Pages compatible). No server-side logic.

---

## Project Structure

```
ethan0xbuilds/
├── src/
│   ├── pages/
│   │   ├── index.astro
│   │   ├── about.astro
│   │   ├── projects.astro
│   │   ├── blog/index.astro
│   │   ├── movies.astro
│   │   ├── books.astro
│   │   └── contact.astro
│   ├── content/
│   │   ├── about.md
│   │   ├── contact.md
│   │   ├── projects/
│   │   │   └── *.md
│   │   ├── movies/
│   │   │   └── *.md        # frontmatter: title, cover, rating, review, year
│   │   └── books/
│   │       └── *.md        # frontmatter: title, cover, rating, review, author
│   ├── components/
│   │   ├── Desktop.astro   # top-level shell: StatusBar + desktop area + Dock
│   │   ├── Window.astro    # draggable/resizable window wrapper
│   │   ├── Dock.astro      # bottom dock with icon + label + open indicator
│   │   └── StatusBar.astro # top bar: username, path, datetime
│   └── scripts/
│       └── window-manager.js
├── public/
│   ├── avatar.png
│   └── resume.pdf
└── astro.config.mjs        # output: 'static'
```

---

## Visual Design

### Global

- Background: `#0d1117` (deep dark, slightly blue-tinted)
- Font: `JetBrains Mono` (Google Fonts), fallback `monospace`
- Desktop area background text: name `ETHAN` + tagline in extremely low opacity (`rgba(255,255,255,0.04)`) as watermark decoration

### Status Bar (top)

- Height: 28px
- Background: `rgba(0,0,0,0.7)` with `backdrop-filter: blur(10px)`
- Border-bottom: `1px solid rgba(255,255,255,0.08)`
- Left: `ethan@desktop` (username in `#7eb8f7`) · green dot + `online` · `~/home`
- Right: day of week + date · time (HH:MM)
- Mobile: simplified — username only + time

### Dock (bottom)

- Height: 56px (mobile: 48px)
- Background: `rgba(0,0,0,0.6)` with `backdrop-filter: blur(16px)`
- Border-top: `1px solid rgba(255,255,255,0.08)`
- 7 items: About · Projects · Blog · Movies · Books · Contact · Resume
- Each item: Lucide SVG icon (28px) + label (9px monospace) + indicator dot (4px, `#7eb8f7`) when window is open
- Mobile: icon 22px, labels hidden
- Resume: clicking triggers PDF download directly, no window

### Windows

- Default sizes per window (see content section)
- Title bar: 32px, `#252535`, traffic light buttons (red/yellow/green, 11px circles), centered monospace filename
- Window body: `#1a1a2e` background
- Resize handle: bottom-right corner grip
- Box shadow: `0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08)`
- Border-radius: 8px

---

## Window Interaction Model

### Open / Close / Focus

- Click Dock icon → open window (if closed) or focus+bring-to-front (if already open)
- Click already-focused Dock icon → minimize (hide); click again → restore
- Click red traffic light → close window, Dock indicator dot disappears
- Click anywhere on a window → bring to front

### Drag

- Drag target: title bar
- On `mousedown`: attach `mousemove` and `mouseup` listeners to document
- On `mousemove`: update `left`/`top` via `element.style`
- Boundary clamp: window cannot be dragged fully outside viewport (keep at least title bar visible)
- Touch support: mirror with `touchstart`/`touchmove`/`touchend`

### Resize

- Handle: bottom-right corner (12×12px visual grip)
- `mousedown` on handle → track delta, update `width`/`height`
- Minimum size: 280×200px

### Z-index

- Global `zCounter` integer, starts at 100
- On focus/open: `window.style.zIndex = ++zCounter`
- No reset needed for personal site usage

### URL Sync

- Open window → `history.pushState({}, '', '/' + windowId)`
- Close last window → `history.pushState({}, '', '/')`
- Multiple windows open: URL reflects the most recently focused window
- On page load: read `pathname`, auto-open matching window

---

## Content Windows

| Window | Default Size | Source | Content |
|--------|-------------|--------|---------|
| About | 480×360 | `content/about.md` | Avatar, bio, tech stack tags |
| Projects | 520×400 | `content/projects/*.md` | Card per project: name, description, GitHub link |
| Blog | 480×320 | — | "Coming soon" placeholder, full window frame |
| Movies | 580×480 | `content/movies/*.md` | Cover image grid + star rating + short review, scrollable |
| Books | 580×480 | `content/books/*.md` | Same layout as Movies |
| Contact | 400×280 | `content/contact.md` | Email, GitHub, X, Telegram links |

### Markdown Frontmatter

**Movies / Books:**
```yaml
---
title: "Inception"
cover: "https://..."   # external URL or /public path
rating: 5              # 1–5
review: "One-line note"
year: 2010             # movies only
author: "Author Name"  # books only
---
```

**Projects:**
```yaml
---
name: "ai-context-vault-cn"
description: "AI context management tool (Chinese edition)"
url: "https://github.com/..."
icon: "🗄️"
---
```

---

## Mobile Adaptation

Breakpoint: `max-width: 768px`

- Desktop drag area hidden; windows render as `position: fixed; inset: 0` full-screen overlays
- Window opens with slide-up animation (`transform: translateY(100%) → 0`)
- No drag or resize on mobile
- Dock fixed at bottom, icons 22px, labels hidden
- Status bar simplified

---

## Accessibility & Motion

- `a:focus-visible`: `outline: 2px solid #7eb8f7; outline-offset: 2px`
- All interactive elements have `aria-label`
- `@media (prefers-reduced-motion: reduce)`: disable all transitions and animations
- Window open/close animations respect reduced motion preference

---

## Deployment

- `astro.config.mjs`: `output: 'static'`, `site: 'https://www.oasaka.xyz'`
- GitHub Actions: build on push to `main`, deploy to `gh-pages` branch
- Existing resume PDF hosted as GitHub Release asset (URL unchanged)
