# Mobile Gate Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redirect visitors on screens narrower than 768px to a lightweight static page instead of loading the Linux desktop simulator.

**Architecture:** A synchronous inline `<script>` in the `<head>` of `index.astro` runs before any rendering — if `window.innerWidth < 768`, it calls `window.location.replace('/mobile')`. `/mobile` is a standalone Astro page (~2KB) with no desktop imports, styled to match the existing dark aesthetic.

**Tech Stack:** Astro 4 (static output), plain HTML/CSS, JetBrains Mono (already loaded via Google Fonts in Desktop.astro)

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `src/pages/mobile.astro` | Standalone mobile gate page — no imports, no JS |
| Modify | `src/pages/index.astro` | Add early redirect script as first child of `<head>` |

---

### Task 1: Create the mobile gate page

**Files:**
- Create: `src/pages/mobile.astro`

- [ ] **Step 1: Create `src/pages/mobile.astro`** with the following content:

```astro
---
---
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Ethan — Software Engineer</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: #0d1117;
      background-image:
        radial-gradient(ellipse at 15% 60%, rgba(60, 40, 120, 0.55) 0%, transparent 55%),
        radial-gradient(ellipse at 85% 15%, rgba(20, 80, 120, 0.5) 0%, transparent 50%),
        radial-gradient(ellipse at 50% 90%, rgba(80, 20, 60, 0.35) 0%, transparent 45%);
      font-family: 'JetBrains Mono', monospace;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 24px;
    }
    .gate {
      text-align: center;
      max-width: 320px;
    }
    .gate-icon {
      font-size: 48px;
      margin-bottom: 24px;
      opacity: 0.6;
    }
    .gate-title {
      font-size: 16px;
      font-weight: 700;
      color: #c75b39;
      margin-bottom: 12px;
      letter-spacing: 0.05em;
    }
    .gate-body {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.5);
      line-height: 1.8;
    }
  </style>
</head>
<body>
  <div class="gate">
    <div class="gate-icon">🖥️</div>
    <p class="gate-title">Built for desktop.</p>
    <p class="gate-body">This is a Linux desktop environment — open it on a PC for the full experience.</p>
  </div>
</body>
</html>
```

- [ ] **Step 2: Verify the page builds without errors**

```bash
npm run build
```

Expected: Build completes with no errors. Check that `dist/mobile/index.html` exists.

```bash
ls dist/mobile/
```

Expected output: `index.html`

- [ ] **Step 3: Preview the mobile page in browser**

```bash
npm run preview
```

Open `http://localhost:4321/mobile` in a browser. Expected: dark background, centered text "Built for desktop." in orange, body text in muted white. No console errors.

- [ ] **Step 4: Commit**

```bash
git add src/pages/mobile.astro
git commit -m "feat: add mobile gate page"
```

---

### Task 2: Add the early redirect script to index.astro

**Files:**
- Modify: `src/pages/index.astro`

`index.astro` is a one-liner that imports and renders `<Desktop />`. The `<head>` lives inside `Desktop.astro` (`src/components/Desktop.astro`), which is where the redirect script must go — as the **first child of `<head>`**, before any other tags.

- [ ] **Step 1: Open `src/components/Desktop.astro` and locate the `<head>` opening tag**

It is on line 30:
```html
<html lang="en">
<head>
  <meta charset="UTF-8" />
```

- [ ] **Step 2: Insert the redirect script as the very first child of `<head>`**

The result should look like this (lines 30–35 after the edit):

```html
<html lang="en">
<head>
  <script>if (window.innerWidth < 768) window.location.replace('/mobile');</script>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

The script must come before `<meta charset>` — this ensures it executes at the earliest possible moment during HTML parsing, before any layout or rendering begins.

- [ ] **Step 3: Verify build succeeds**

```bash
npm run build
```

Expected: Completes with no errors.

- [ ] **Step 4: Verify redirect works at desktop width**

```bash
npm run preview
```

Open `http://localhost:4321` in a browser at full desktop width (> 768px). Expected: desktop loads normally, no redirect.

- [ ] **Step 5: Verify redirect works at mobile width**

In the same browser session, open DevTools → toggle device toolbar → set width to 375px (iPhone). Hard-refresh (`Cmd+Shift+R` / `Ctrl+Shift+R`).

Expected: immediately redirected to `/mobile`, gate message shown, browser back button does **not** return to the desktop (because `replace()` was used).

- [ ] **Step 6: Commit**

```bash
git add src/components/Desktop.astro
git commit -m "feat: redirect mobile visitors to gate page"
```
