# Glassmorphism Redesign — Design Spec

**Date:** 2026-03-31
**File:** `index.html`

---

## Context

The current page uses a dark navy gradient background with a single opaque white card. The design feels heavy and dated. The goal is a full visual refresh: lighter warm-toned gradient background, glassmorphism card style, and a multi-layer layout where header floats on the background and each section is an independent glass card.

---

## Background Layer

- Full viewport gradient: `135deg, #ff9a9e → #fecfef → #a18cd1` (orange-pink to lavender-purple)
- 2–3 decorative blurred light orbs (absolute-positioned divs, `border-radius: 50%`, `filter: blur(80-100px)`, low opacity) to add depth and prevent flatness
- Body: `min-height: 100vh`, flex center, no card wrapping the whole page

---

## Header (no card, floats on background)

- Avatar: 120px, circular, existing green border glow retained as visual anchor
- Name `Ethan`: white, 32px, bold, `text-shadow: 0 2px 8px rgba(0,0,0,0.2)`
- Subtitle `某不知名程序员`: `rgba(255,255,255,0.8)`, 12px, uppercase, letter-spacing 2px
- Margin below header before first card: 40px

---

## Glass Card System

All section cards share this style:

```css
background: rgba(255, 255, 255, 0.15);
backdrop-filter: blur(20px);
-webkit-backdrop-filter: blur(20px);
border: 1px solid rgba(255, 255, 255, 0.3);
border-radius: 16px;
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
```

**Typography inside cards:**
- Section heading: `rgba(255,255,255,0.6)`, 11px, uppercase, letter-spacing 1.5px
- Primary text: `white`
- Secondary/description text: `rgba(255,255,255,0.7)`

**Layout:**
- Max-width: 440px, centered
- Cards stack vertically, gap: 16px
- Card padding: 24px

---

## Connect Card

- Heading: "CONNECT"
- 3-column grid of social link buttons
- Each button: glass sub-card style (`rgba(255,255,255,0.1)` bg, `rgba(255,255,255,0.2)` border)
- Icon above label, column layout
- Hover: background → `rgba(255,255,255,0.25)`, `translateY(-2px)`
- Transition: 0.2s ease

---

## Projects Card

- Heading: "FEATURED PROJECTS"
- Single project row: emoji icon + name + description
- Row hover: background → `rgba(255,255,255,0.1)`, `translateY(-2px)`

---

## Resume Button

- Standalone full-width card (same glass style)
- Center-aligned: 📄 icon + "Resume" text
- Border: `1px solid rgba(255,255,255,0.5)`
- Hover: background → `rgba(255,255,255,0.25)`, `translateY(-2px)`, box-shadow deepens

---

## Footer

- Sits below all cards, no card wrapping
- Text: `rgba(255,255,255,0.5)`, 12px, centered
- Content: `© 2026 Ethan`

---

## Accessibility & Motion

- `a:focus-visible`: `outline: 2px solid white; outline-offset: 2px`
- `@media (prefers-reduced-motion: reduce)`: disable all animations/transitions
- All `aria-label` and `aria-hidden` attributes retained from current implementation

---

## Dark Mode

Remove separate dark mode overrides — the glassmorphism design works universally on the warm gradient background regardless of OS theme.
