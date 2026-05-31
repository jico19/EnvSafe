# Spec: Security Console Login Redesign

Redesign the login page to align with a "Security Console" / "Vault" aesthetic, focusing on visual polish, precision, and a high-tech feel.

## Visual Direction: "The Security Console"

- **Aesthetic:** Precise, technical, dark-themed, and secure.
- **Color Palette:**
    - Background: `zinc-950`
    - Card: `zinc-900` with transparency and blur.
    - Accents: `red-500` / `red-600` for primary actions and highlights.
    - Text: `zinc-100` (primary), `zinc-500` (labels/secondary).
- **Typography:**
    - Heavy use of `Geist Mono` for labels and data entry to emphasize the "technical console" nature.

## Component Design

### 1. Global Background
- Implement a subtle grid pattern overlay on the `zinc-950` body.
- CSS: `background-image: radial-gradient(circle, #27272a 1px, transparent 1px); background-size: 24px 24px;` (or similar).

### 2. Login Card
- **Background:** `bg-zinc-900/80` with `backdrop-blur-xl`.
- **Border:** `border border-zinc-800`.
- **Shadow:** Subtle deep shadow for depth.

### 3. Inputs
- **Font:** `font-mono`.
- **Style:** Dark background (`bg-zinc-950/50`), thin border.
- **Focus State:** `border-red-500`, `ring-2 ring-red-500/20`.
- **Labels:** `font-mono`, `text-xs`, `uppercase`, `tracking-widest`.

### 4. Primary Button
- **Style:** `bg-red-600` to `bg-red-700`.
- **Glow:** `shadow-[0_0_20px_rgba(220,38,38,0.2)]`.
- **Hover:** Intensified glow and slight scale or color shift.

## Technical Tasks

- [ ] Add grid pattern utility to `index.css`.
- [ ] Refactor `Login.jsx` with new Tailwind classes.
- [ ] Ensure `react-hook-form` validation messages match the mono/technical style.
- [ ] Add transition effects for focus and hover states.

## Success Criteria

- The login page feels more premium and "technical" than the current version.
- Visual consistency with the "EnvSafe" brand (Red/Dark Zinc).
- No regression in login functionality or form validation.
