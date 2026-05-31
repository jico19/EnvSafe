# EnvSafe — Tailwind CSS Design Guide

> A minimal, dark, developer-focused UI. Think terminal meets SaaS.

---

## Philosophy

- **Dark. Dense. Sharp.** No gradients, no rounded blobs, no pastel cards.
- Feels like a tool built **by developers, for developers.**
- Every element earns its place. No decorative fluff.
- Inspired by: VS Code, Vercel Dashboard, Linear, GitHub dark mode.

---

## Color Palette

Use these Tailwind classes consistently throughout the app.

| Role | Tailwind Class | Hex |
|---|---|---|
| Page Background | `bg-zinc-950` | #09090b |
| Surface / Cards | `bg-zinc-900` | #18181b |
| Elevated Surface | `bg-zinc-800` | #27272a |
| Border | `border-zinc-700` | #3f3f46 |
| Subtle Border | `border-zinc-800` | #27272a |
| Primary Text | `text-zinc-100` | #f4f4f5 |
| Secondary Text | `text-zinc-400` | #a1a1aa |
| Muted Text | `text-zinc-600` | #52525b |
| Accent (Red) | `text-red-500` | #ef4444 |
| Accent Background | `bg-red-600` | #dc2626 |
| Accent Hover | `hover:bg-red-700` | #b91c1c |
| Success | `text-emerald-400` | #34d399 |
| Warning | `text-yellow-400` | #facc15 |
| Danger | `text-red-400` | #f87171 |

---

## Typography

```
Font Family:   font-mono  (for keys, values, code, logs)
               font-sans  (for headings, labels, body)

Headings:      text-zinc-100 font-semibold tracking-tight
Body:          text-zinc-400 text-sm
Labels:        text-zinc-500 text-xs uppercase tracking-widest
Code / Keys:   font-mono text-red-400 bg-zinc-800 px-1.5 py-0.5 rounded
```

### Size Scale
```
Page Title:     text-xl font-semibold text-zinc-100
Section Title:  text-sm font-medium text-zinc-300 uppercase tracking-widest
Body Text:      text-sm text-zinc-400
Small / Meta:   text-xs text-zinc-500
Mono / Keys:    text-sm font-mono text-red-400
```

---

## Layout

```
Max Width:       max-w-6xl mx-auto
Page Padding:    px-6 py-8
Section Gap:     space-y-6
Card Gap:        space-y-3
```

### Sidebar Layout (Dashboard)
```
Sidebar:   w-56 bg-zinc-900 border-r border-zinc-800 h-screen fixed
Main:      ml-56 bg-zinc-950 min-h-screen p-8
```

---

## Components

### Card / Panel
```html
<div class="bg-zinc-900 border border-zinc-800 rounded-md p-4">
```

### Table Row (for variable list)
```html
<tr class="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors">
```

### Input Field
```html
<input class="
  w-full bg-zinc-800 border border-zinc-700
  text-zinc-100 text-sm font-mono
  px-3 py-2 rounded-md
  placeholder:text-zinc-600
  focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500
  transition-colors
"/>
```

### Primary Button (Red Accent)
```html
<button class="
  bg-red-600 hover:bg-red-700
  text-white text-sm font-medium
  px-4 py-2 rounded-md
  transition-colors
">
  Add Variable
</button>
```

### Ghost Button
```html
<button class="
  bg-transparent hover:bg-zinc-800
  text-zinc-400 hover:text-zinc-100
  text-sm font-medium
  px-4 py-2 rounded-md border border-zinc-700
  transition-colors
">
  Cancel
</button>
```

### Danger Button
```html
<button class="
  bg-transparent hover:bg-red-950
  text-red-500 hover:text-red-400
  text-sm font-medium
  px-4 py-2 rounded-md border border-red-900
  transition-colors
">
  Delete
</button>
```

### Badge / Role Tag
```html
<!-- Owner -->
<span class="text-xs font-mono bg-red-950 text-red-400 border border-red-900 px-2 py-0.5 rounded">
  owner
</span>

<!-- Developer -->
<span class="text-xs font-mono bg-zinc-800 text-zinc-400 border border-zinc-700 px-2 py-0.5 rounded">
  developer
</span>

<!-- Viewer -->
<span class="text-xs font-mono bg-zinc-900 text-zinc-500 border border-zinc-800 px-2 py-0.5 rounded">
  viewer
</span>
```

### Environment Tag
```html
<!-- Production -->
<span class="text-xs font-mono bg-red-950 text-red-400 px-2 py-0.5 rounded border border-red-900">
  production
</span>

<!-- Staging -->
<span class="text-xs font-mono bg-yellow-950 text-yellow-400 px-2 py-0.5 rounded border border-yellow-900">
  staging
</span>

<!-- Dev -->
<span class="text-xs font-mono bg-zinc-800 text-emerald-400 px-2 py-0.5 rounded border border-zinc-700">
  dev
</span>
```

### Variable Key Display
```html
<code class="font-mono text-sm text-red-400 bg-zinc-800 px-2 py-0.5 rounded">
  DATABASE_URL
</code>
```

### Masked Value (hidden secret)
```html
<span class="font-mono text-sm text-zinc-600 tracking-widest">
  ••••••••••••••••
</span>
```

### Audit Log Row
```html
<div class="flex items-center gap-4 py-2 border-b border-zinc-800 text-sm">
  <span class="text-zinc-600 font-mono text-xs w-40">2026-05-31 10:42</span>
  <span class="text-zinc-400">jico@email.com</span>
  <span class="text-emerald-400 font-mono text-xs">viewed</span>
  <code class="text-red-400 font-mono text-xs">DATABASE_URL</code>
</div>
```

### Sidebar Nav Item
```html
<!-- Active -->
<a class="flex items-center gap-2 px-3 py-2 rounded-md bg-zinc-800 text-zinc-100 text-sm font-medium">
  Variables
</a>

<!-- Inactive -->
<a class="flex items-center gap-2 px-3 py-2 rounded-md text-zinc-500 hover:text-zinc-100 hover:bg-zinc-800 text-sm transition-colors">
  Audit Log
</a>
```

### Divider
```html
<hr class="border-zinc-800" />
```

### Empty State
```html
<div class="text-center py-16">
  <p class="text-zinc-600 text-sm font-mono">no variables found.</p>
  <p class="text-zinc-700 text-xs mt-1">add your first variable to get started.</p>
</div>
```

---

## Logo / Brand

```html
<div class="flex items-center gap-2">
  <span class="text-red-500 font-mono font-bold text-lg">ENV</span>
  <span class="text-zinc-100 font-mono font-bold text-lg">SAFE</span>
  <span class="text-zinc-700 font-mono text-xs ml-1">v1.0</span>
</div>
```

---

## Page-by-Page Notes

### Login Page
- Full screen `bg-zinc-950`
- Centered card `bg-zinc-900 border border-zinc-800`
- Logo on top
- No illustrations, no background art — pure form

### Dashboard (Project List)
- Grid of project cards `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`
- Each card: project name, env tag, member count, last updated
- Top bar: search input + "New Project" red button

### Project View (Variables Table)
- Full-width table inside a card
- Columns: `KEY` | `VALUE (masked)` | `ADDED BY` | `DATE` | `ACTIONS`
- Reveal button (eye icon) per row for authorized users
- Sticky header row

### Audit Log
- Chronological list, newest first
- Color-coded actions: `viewed` = emerald, `added` = blue, `deleted` = red, `edited` = yellow
- Font mono throughout — feels like a real log

### Team Management
- Member list with role badges
- Inline role switcher dropdown
- Remove member danger button on the right

---

## Do's and Don'ts

### ✅ DO
- Use `font-mono` for anything technical (keys, values, logs, timestamps)
- Keep borders subtle (`border-zinc-800`) — just enough to separate
- Use `red-500` / `red-600` sparingly — only for CTAs and important accents
- Use `transition-colors` on every interactive element
- Keep padding tight and consistent (`p-4`, `px-3 py-2`)

### ❌ DON'T
- No white backgrounds anywhere
- No rounded-full or pill shapes (use `rounded-md` max)
- No shadows (`shadow-*`) — borders do the separation work
- No gradients
- No colorful illustrations or icons — use simple lucide-react icons in `text-zinc-500`
- No Inter or sans-serif for code/data — always `font-mono`

---

## Icon Style (lucide-react)

```html
<!-- Always zinc-500, size 16px, no fill -->
<Icon size={16} className="text-zinc-500" />

<!-- Active / accent state -->
<Icon size={16} className="text-red-500" />
```

---

## Summary in One Sentence

> Dark zinc backgrounds, sharp red accents, mono fonts for data, zero decoration — every pixel either informs or enables an action.