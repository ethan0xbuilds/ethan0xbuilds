# Mobile Gate — Design Spec

**Date:** 2026-04-05

## Summary

Add a mobile gate that prevents the Linux desktop simulator from rendering on narrow screens (< 768px). Mobile visitors are redirected to a lightweight static page that explains the site is desktop-only.

## Problem

The site simulates a Linux desktop environment. On mobile it is unusable — windows, the dock, drag interactions, and the status bar are all designed for large screens. A partial mobile adaptation exists but produces a degraded experience.

## Approach

**Separate `/mobile` page + early client-side redirect.**

A synchronous inline script in `<head>` of `index.astro` checks `window.innerWidth` before the browser renders anything. If width < 768px, it calls `window.location.replace('/mobile')`, loading a tiny standalone page. The desktop HTML is never executed or rendered on mobile.

`replace()` is used over `href =` so the redirect does not pollute browser history.

## Files

### `src/pages/mobile.astro` (new)
- Standalone `<html>` page — no imports from Desktop, no content collections, no JS
- Same visual identity as the desktop: `#0d1117` background, `JetBrains Mono` font, `#c75b39` accent
- Centered gate message:
  > **Built for desktop.**
  > This is a Linux desktop environment — open it on a PC for the full experience.
- Minimal HTML, no scripts, ~2KB total

### `src/pages/index.astro` (modified)
- Add as the **first child of `<head>`**:
  ```html
  <script>
    if (window.innerWidth < 768) {
      window.location.replace('/mobile');
    }
  </script>
  ```
- No other changes to this file or any other component

## Breakpoint

`768px` — consistent with the existing `@media (max-width: 768px)` breakpoint already present in `Desktop.astro`.

## What does not change

`Desktop.astro`, `Window.astro`, `Dock.astro`, `StatusBar.astro` — all untouched. The gate is entirely additive.

## Out of scope

- Tablet handling (768px–1024px) — out of scope, existing desktop layout handles this acceptably
- Server-side UA detection — not viable, site is `output: 'static'`
- Orientation change re-checking — out of scope for now
