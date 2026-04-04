# Blog Migration Design

**Date:** 2026-04-05
**Topic:** Migrate blog posts from ethanschen.github.io to ethan0xbuilds, with category filtering

---

## Overview

Migrate 9 blog posts from the old Hugo site (`ethanschen/ethanschen.github.io`) to the new Astro-based site (`ethan0xbuilds/ethan0xbuilds`), and add `tech` / `life` category filtering to the blog window.

---

## Schema Change

Add a required `category` field to the `blog` collection in `src/content/config.ts`:

```ts
const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.string(), // "YYYY-MM-DD"
    summary: z.string(),
    category: z.enum(['tech', 'life']),
  }),
});
```

The two existing posts must also be updated to include `category`:
- `2026-03-15-openstack-cloudnative.md` → `tech`
- `2026-04-01-claude-code-website.md` → `tech`

---

## Content Migration

9 posts from the old repo, converted from Hugo TOML frontmatter to Astro YAML frontmatter. Cloudinary image URLs are preserved as-is.

| New filename | category | Original path |
|---|---|---|
| `2021-06-05-consistent-hash.md` | tech | `content/tech/2021-06-05-Consistent-Hash/index.md` |
| `2021-06-13-virtual-nodes-distribution.md` | tech | `content/tech/2021-06-13-Virtual-Nodes-Distribution/index.md` |
| `2025-01-04-kubernetes-debugging-methods.md` | tech | `content/tech/2025-01-04-Kubernetes-Debugging-Methods/index.md` |
| `2024-08-30-read-excerpts.md` | life | `content/life/2024-08-30-read-excerpts/index.md` |
| `2024-10-20-read-notes.md` | life | `content/life/2024-10-20-read-notes/index.md` |
| `2025-01-01-new-year-reflection.md` | life | `content/life/2025-01-01-new-year-reflection/index.md` |
| `2025-01-02-work-and-thoughts.md` | life | `content/life/2025-01-02-work-and-thoughts/index.md` |
| `2025-01-17-read-and-thoughts.md` | life | `content/life/2025-01-17-read-and-thoughts/index.md` |
| `2025-06-08-life.md` | life | `content/life/2025-06-08/index.md` |

Each migrated post frontmatter follows this format:

```yaml
---
title: "..."
date: "YYYY-MM-DD"
summary: "一句话摘要，根据正文内容生成"
category: tech   # or life
---
```

---

## Blog Window UI

In `src/components/Desktop.astro`, add category filter buttons to the Blog Window, reusing the existing `.books-filters` / `.filter-btn` styles:

```html
<div class="books-filters">
  <button class="filter-btn active" data-filter="all">all</button>
  <button class="filter-btn" data-filter="tech">tech</button>
  <button class="filter-btn" data-filter="life">life</button>
</div>
```

Each `.blog-row` gets a `data-category` attribute:

```astro
<button class="blog-row" data-post-id={post.id} data-category={post.data.category}>
```

Filter JS: on button click, show rows where `data-category === filter` (or all when `filter === 'all'`). This mirrors the existing movies/books filter logic exactly.

The filter state resets to `all` when the blog window is reopened (same as the existing `resetBlogWindow()` function — extend it to also reset the active filter button).

---

## Out of Scope

- No new pages or routes (blog stays inside the window)
- No pagination
- No tag-based filtering beyond tech/life
- No changes to the blog detail view
