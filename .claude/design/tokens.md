# Design Tokens

All tokens are CSS custom properties defined in `dashboard/src/app/globals.css`.

## Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--color-bg` | `transparent` | Page background (wallpaper shows through) |
| `--color-bg-card` | `rgba(255,255,255,0.78)` | Card background |
| `--color-bg-muted` | `rgba(240,250,249,0.70)` | Muted surface |
| `--color-brand` | `#1a4d8f` | Primary interactive, active states |
| `--color-brand-hover` | `#153d72` | Brand hover state |
| `--color-brand-light` | `rgba(26,77,143,0.10)` | Icon backgrounds, subtle highlights |
| `--color-brand-subtle` | `rgba(26,77,143,0.06)` | Very subtle brand tint |
| `--color-text` | `#0f1f1e` | Primary text |
| `--color-muted` | `#3d5957` | Secondary/muted text |
| `--color-placeholder` | `#7a9b98` | Placeholder text |
| `--color-border` | `rgba(94,168,161,0.25)` | Default border |
| `--color-border-strong` | `rgba(94,168,161,0.45)` | Emphasized border (hover) |

## Tailwind semantic aliases (from tailwind.config.ts)

| Tailwind class | Token |
|----------------|-------|
| `text-brand` | `--color-brand` |
| `text-brand-hover` | `--color-brand-hover` |
| `bg-brand` | `--color-brand` |
| `bg-brand-light` | `--color-brand-light` |
| `text-text-main` | `--color-text` |
| `text-text-muted` | `--color-muted` |
| `text-text-placeholder` | `--color-placeholder` |
| `border-border` | `--color-border` |
| `border-border-strong` | `--color-border-strong` |
| `bg-bg` | `--color-bg` |
| `bg-bg-card` | `--color-bg-card` |
| `text-success` | (green) |
| `text-danger` | (red) |

## Layout

| Token | Value |
|-------|-------|
| `--sidebar-width` | `240px` |
| `--header-height` | `60px` |
| `--content-max` | `1280px` |

## Typography

Font: **Vazirmatn** (loaded offline via `next/font/local`). Weights: 300, 400, 500, 600, 700.

| Size | px | Usage |
|------|----|-------|
| `text-[11px]` | 11 | Captions, group labels, mono tags |
| `text-[12px]` | 12 | Small labels, table headers, meta |
| `text-[13px]` | 13 | Body, descriptions, table cells |
| `text-[14px]` | 14 | Card titles, emphasized labels |
| `text-[15px]` | 15 | Header title, subtitle |
| `text-[18px]` | 18 | Billing total |
| `text-[20px]` | 20 | Welcome heading |
| `text-[30px]` | 30 | Metric card values |

## Spacing overrides (tailwind.config.ts)

The default Tailwind scale uses `rem`. These values are **overridden to exact px**:

| Class | px |
|-------|----|
| `w-44` / `h-44` | 44 |
| `w-48` / `h-48` | 48 |
| `w-34` / `h-34` | 34 |
| `w-36` / `h-36` | 36 |
| `w-32` / `h-32` | 32 |
| `w-28` / `h-28` | 28 |

## Glass surfaces

| Class | blur | opacity | use for |
|-------|------|---------|---------|
| `.glass` | 16px | 76% white | content cards |
| `.glass-shell` | 20px | 88% white | sidebar, header |

Shadow on all glass cards:
```
box-shadow: 0 8px 32px rgba(15,50,47,0.10)
```
