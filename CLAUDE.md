# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # start dev server at localhost:4321
npm run build    # build to dist/
npm run preview  # preview production build locally
```

No linter or test suite is configured.

## Architecture

A **static personal website** built with Astro, deployed to `www.oasaka.xyz` via GitHub Pages (`public/CNAME`). The entire site simulates a Linux desktop OS environment.

### Layout structure

```
StatusBar (28px top bar — fixed, z-index 9999)
  └─ shows "ethan@desktop · online · ~/home" + live clock

desktop (100vh - 28px - 56px, overflow hidden)
  ├─ desktop-bg (watermark text "ETHAN / Builder & Tinkerer")
  ├─ desktop-icons (top-right corner, 3 file icons)
  │   ├─ resume.pdf  → toggles win-resume
  │   ├─ about.md   → toggles win-about
  │   └─ photos/    → toggles win-photos
  └─ Windows (absolute positioned, all initially hidden)

Dock (56px bottom bar — fixed, z-index 9998)
  └─ 4 buttons: Projects · Blog · Movies · Books
```

### Windows

Every section is a `<Window>` component rendered in `Desktop.astro`. Valid window IDs (used in URL routing and `toggleWindow(id)`):

| ID | Title bar | Default size | Content |
|---|---|---|---|
| `about` | `about.md` | 400×280 | Markdown from `content/about/index.md` |
| `projects` | `projects/` | 520×400 | Cards from `content/projects/*.md` |
| `blog` | `blog/` | 520×380 | List+detail from `content/blog/*.md` |
| `movies` | `movies.json` | 580×480 | Grid from `content/movies/*.md` |
| `books` | `books.json` | 580×480 | Grid from `content/books/*.md` |
| `photos` | `photos/` | 580×420 | Thumbnails from external CDN |
| `resume` | `resume.pdf` | 700×520 | Google Docs iframe viewer |

### Window manager (`public/scripts/window-manager.js`)

Vanilla JS ES module, dynamically imported via `import('/scripts/window-manager.js')`. Handles:
- **Drag**: mouse + touch on title bar (clamped: top ≥ 28px, left ≥ -width+80px)
- **Resize**: bottom-right handle (min 280×200px)
- **Focus/z-index**: `bringToFront()` increments a shared `zCounter`
- **Open/close animations**: CSS classes `win-opening` / `win-closing` with `animationend` callbacks
- **URL sync**: `openWindow(id)` calls `history.pushState({}, '', '/${id}')`, closing all windows reverts to `/`
- **Auto-open on load**: reads `window.location.pathname` and opens matching window if it's in `['about', 'projects', 'blog', 'movies', 'books', 'contact']`
- **Dock indicators**: blue dot on dock item when corresponding window is open

`Desktop.astro` supports an `autoOpen` prop — passed as `data-auto-open` on the `#desktop` div — to open a specific window on load (used by `src/pages/*.astro` sub-routes).

### In-window navigation patterns

**Blog**: list view → click row → detail view (innerHTML copy from hidden pre-rendered `<div>`s). Back button restores list. Title bar updates to `blog/<id>.md`. Category filter buttons (all / tech / life) use `data-category` attribute on each row.

**Movies / Books**: CSS grid with filter buttons using `data-status` attribute on cards. Filter hides/shows cards via `display` toggling.

**Photos**: thumbnail grid → click → lightbox (full-image view inside same window). Images served from `https://cdn.jsdelivr.net/gh/ethan0xbuilds/ethan0xbuilds-assets@main/photos/`.

**Resume**: rendered via Google Docs viewer iframe. PDF hosted on GitHub Releases at tag `resume_20260330`.

### Mobile

`src/pages/mobile.astro` is a static "desktop only" gate page — it does NOT implement a mobile layout. Desktop.astro includes a `<script>` in `<head>` that redirects `window.innerWidth < 768` to `/mobile` before render.

### Content collections (`src/content/config.ts`)

All page content is Markdown with Zod-validated frontmatter:

| Collection | Required fields | Optional fields |
|---|---|---|
| `about` | _(none — single entry `about/index.md`)_ | — |
| `projects` | `name`, `description`, `icon`, `type` (`work`\|`oss`\|`side`), `tech[]` | `url` |
| `movies` | `title`, `rating` (1–5), `review`, `year` | `cover`, `watched` (YYYY-MM), `status` (default: `watched`) |
| `books` | `title`, `rating` (1–5), `review`, `author` | `cover`, `status` (default: `finished`) |
| `blog` | `title`, `date` (YYYY-MM-DD), `summary`, `category` (`tech`\|`life`) | — |

Movie covers are referenced as image URLs (external or `/`-rooted). Movies without a `cover` field show a `🎬` placeholder; the `content/movies/*.md` entries that lack covers are filtered out from display (see recent commits).

### External assets

- **Photos**: hosted in a separate repo `ethan0xbuilds/ethan0xbuilds-assets`, served via jsDelivr CDN
- **Resume PDF**: GitHub Releases on this repo, tag `resume_20260330`
- **Fonts**: JetBrains Mono via Google Fonts (preconnect in `<head>`)
- **Avatar**: `public/avatar.png` (also referenced in OG/Twitter meta tags)
