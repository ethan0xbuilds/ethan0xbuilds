# Glassmorphism Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign index.html with a warm orange-to-purple gradient background, glassmorphism cards, and a floating header layout.

**Architecture:** Single-file static page — all HTML, CSS in `index.html`. Complete rewrite of styles; HTML structure changes minimally (remove `.container` wrapper, add orb divs). No JS changes needed.

**Tech Stack:** Plain HTML/CSS, no build tools.

---

### Task 1: Background, orbs, and body layout

**Files:**
- Modify: `index.html` — `<style>` block and `<body>` HTML

- [ ] **Step 1: Replace `:root`, `body`, and `.container` styles**

In the `<style>` block, replace all `:root`, `@media (prefers-color-scheme: dark)` blocks, `body`, `.container`, and `@keyframes slideUp` with:

```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #a18cd1 100%);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
    position: relative;
    overflow-x: hidden;
}

/* Decorative orbs */
.orb {
    position: fixed;
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
}

.orb-1 {
    width: 300px;
    height: 300px;
    background: rgba(255, 150, 120, 0.4);
    filter: blur(80px);
    top: -80px;
    left: -80px;
}

.orb-2 {
    width: 250px;
    height: 250px;
    background: rgba(180, 130, 220, 0.4);
    filter: blur(90px);
    bottom: -60px;
    right: -60px;
}

.orb-3 {
    width: 200px;
    height: 200px;
    background: rgba(254, 180, 220, 0.3);
    filter: blur(100px);
    top: 50%;
    left: 60%;
}

.page {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 440px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
}
```

- [ ] **Step 2: Update HTML structure**

Replace the opening body tags:
```html
<body>
    <div class="orb orb-1"></div>
    <div class="orb orb-2"></div>
    <div class="orb orb-3"></div>
    <div class="page">
```

Replace the closing `</div>` that was `.container` with `</div>` for `.page`.

- [ ] **Step 3: Open in browser and verify**

Open `index.html`. Expected: warm pink-to-purple gradient background with soft blurred orbs. Content may look broken — that's fine, next tasks fix it.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "style: add warm gradient background and orb decorations"
```

---

### Task 2: Floating header

**Files:**
- Modify: `index.html` — `.header`, `.avatar`, `.name`, `.title` styles

- [ ] **Step 1: Replace header-related styles**

Remove all existing `.header`, `.avatar`, `.avatar img`, `.name`, `.title` CSS and replace with:

```css
/* Header */
.header {
    text-align: center;
    margin-bottom: 8px;
    width: 100%;
}

.avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    margin: 0 auto 20px;
    box-shadow: 0 0 0 3px #16a085, 0 10px 30px rgba(0, 0, 0, 0.2);
    overflow: hidden;
}

.avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.name {
    font-size: 32px;
    font-weight: 700;
    color: white;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    margin-bottom: 8px;
}

.title {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.8);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 2px;
}
```

- [ ] **Step 2: Open in browser and verify**

Open `index.html`. Expected: avatar and name/title floating directly on the gradient background with white text, no card around the header.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "style: floating header with white text on gradient"
```

---

### Task 3: Glass card base + Connect section

**Files:**
- Modify: `index.html` — `.social-section`, `.social-section h3`, `.social-links`, `.social-link`, `.social-icon` styles and HTML

- [ ] **Step 1: Add glass card base and replace social section styles**

Remove `.social-section`, `.social-section h3`, `.social-links`, `.social-link`, `@media (prefers-color-scheme: dark) .social-link`, `.social-link:hover`, `.social-icon` CSS and replace with:

```css
/* Glass card base */
.glass-card {
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    padding: 24px;
    width: 100%;
}

.glass-card h3 {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.6);
    text-transform: uppercase;
    letter-spacing: 1.5px;
    font-weight: 600;
    margin-bottom: 16px;
}

/* Social links */
.social-links {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
}

.social-link {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    padding: 16px 8px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 12px;
    text-decoration: none;
    color: white;
    font-size: 13px;
    font-weight: 500;
    transition: all 0.2s ease;
    text-align: center;
}

.social-link:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.social-icon {
    font-size: 20px;
}
```

- [ ] **Step 2: Update Connect HTML**

Replace the `.social-section` div with:

```html
<div class="glass-card">
    <h3>Connect</h3>
    <div class="social-links">
        <a href="https://x.com/ethan0xbuilds" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="Follow on X / Twitter">
            <span class="social-icon" aria-hidden="true">𝕏</span>
            <span>X / Twitter</span>
        </a>
        <a href="https://t.me/ethan0xbuilds" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="Message on Telegram">
            <span class="social-icon" aria-hidden="true">✈️</span>
            <span>Telegram</span>
        </a>
        <a href="https://discord.com/users/ethan0xbuilds" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="Connect on Discord">
            <span class="social-icon" aria-hidden="true">💬</span>
            <span>Discord</span>
        </a>
    </div>
</div>
```

- [ ] **Step 3: Open in browser and verify**

Expected: glass card with blurred background, 3-column social buttons with semi-transparent glass style.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "style: glass card system and Connect section"
```

---

### Task 4: Projects card

**Files:**
- Modify: `index.html` — `.content-section`, `.project-card`, `.project-card-*` styles and HTML

- [ ] **Step 1: Replace project-related styles**

Remove `.content-section`, `@media (prefers-color-scheme: dark) .content-section`, `.content-section h3`, `.project-card`, `@media (prefers-color-scheme: dark) .project-card`, `.project-card:hover`, `.project-icon`, `.project-card-info`, `.project-card-name`, `.project-card-desc` CSS and replace with:

```css
/* Project card */
.project-card {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 16px;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 12px;
    text-decoration: none;
    color: white;
    font-size: 14px;
    transition: all 0.2s ease;
}

.project-card:hover {
    background: rgba(255, 255, 255, 0.18);
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.project-icon {
    font-size: 22px;
    flex-shrink: 0;
}

.project-card-info {
    display: flex;
    flex-direction: column;
    gap: 3px;
}

.project-card-name {
    font-weight: 600;
    color: white;
}

.project-card-desc {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.7);
}
```

- [ ] **Step 2: Update Projects HTML**

Replace the `.content-section` div with:

```html
<div class="glass-card">
    <h3>Featured Projects</h3>
    <a href="https://github.com/ethan0xbuilds/ai-context-vault-cn" target="_blank" rel="noopener noreferrer" class="project-card" aria-label="View ai-context-vault-cn on GitHub">
        <span class="project-icon" aria-hidden="true">🗄️</span>
        <div class="project-card-info">
            <span class="project-card-name">ai-context-vault-cn</span>
            <span class="project-card-desc">AI context management tool (Chinese edition)</span>
        </div>
    </a>
</div>
```

- [ ] **Step 3: Open in browser and verify**

Expected: glass card with project row inside, subtle inner glass style on the row.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "style: glass projects card"
```

---

### Task 5: Resume button + footer + cleanup

**Files:**
- Modify: `index.html` — `.resume-btn`, `.footer` styles, HTML, and remove all unused CSS

- [ ] **Step 1: Replace resume and footer styles**

Remove `.resume-btn`, `.placeholder`, `.footer` CSS and replace with:

```css
/* Resume button */
.resume-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    padding: 18px;
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.5);
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    text-decoration: none;
    color: white;
    font-size: 15px;
    font-weight: 600;
    transition: all 0.2s ease;
}

.resume-btn:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

/* Footer */
.footer {
    text-align: center;
    margin-top: 8px;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.5);
}
```

- [ ] **Step 2: Update Resume and Footer HTML**

Replace the existing resume `<a>` tag with:

```html
<a href="https://github.com/ethan0xbuilds/ethan0xbuilds/releases/download/resume_20260330/ethan_resume.pdf" target="_blank" rel="noopener noreferrer" class="resume-btn" aria-label="View Resume PDF">
    <span aria-hidden="true">📄</span>
    <span>Resume</span>
</a>
```

Replace the footer with:

```html
<div class="footer">
    <p>© 2026 Ethan</p>
</div>
```

- [ ] **Step 3: Remove all remaining unused CSS**

Remove these CSS blocks that are no longer used:
- `@media (prefers-color-scheme: dark)` (all instances)
- Any remaining references to `--primary`, `--secondary`, `--accent`, `--highlight`, `--light`, `--text`, `--text-light`, `--border` variables
- `@media (max-width: 480px)` `.lang-toggle` block

- [ ] **Step 4: Add accessibility and motion styles**

Add at the end of the `<style>` block:

```css
/* Focus states */
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
    body {
        padding: 32px 16px;
    }

    .name {
        font-size: 26px;
    }

    .avatar {
        width: 100px;
        height: 100px;
    }

    .social-links {
        grid-template-columns: 1fr;
    }
}
```

- [ ] **Step 5: Open in browser and verify full page**

Open `index.html`. Expected:
- Warm gradient background with soft orbs
- Avatar + name + title floating on background
- 3 glass cards stacked: Connect, Projects, Resume button
- Footer text at bottom, semi-transparent white
- Tab through all links — white focus ring visible
- Hover all cards — subtle lift + brightness

- [ ] **Step 6: Commit and push**

```bash
git add index.html
git commit -m "style: complete glassmorphism redesign"
git push
```
