# Prakcheer Design System

## Color System — 60/30/10 Rule

Colors are extracted from the Prakcheer logo (cloud + sphere, white background excluded).
The three logo colors map directly to the 60/30/10 ratio:

| Role | % | Source | Token | Hex |
|------|---|--------|-------|-----|
| Background (dominant) | 60% | light-blue front cloud | `--color-bg` | `#EFF6FF` |
| Structural surfaces | 30% | medium-blue back cloud | `--color-surface` | `#BFDBFE` |
| Accent / Primary | 10% | deep-blue sphere | `--color-primary` | `#1D4ED8` |

### Full Palette

```
bg.DEFAULT      #EFF6FF  — page background (60%)
bg.subtle       #DBEAFE  — subtle surface, alternating rows
bg.card         #FFFFFF  — card / panel surface (floats above bg)

surface.DEFAULT #BFDBFE  — sidebar active, panel bg (30%)
surface.hover   #93C5FD  — hover on surface elements
surface.muted   #E0EFFE  — input background, table zebra

primary.DEFAULT #1D4ED8  — CTA, active nav, links (10%)
primary.hover   #1E40AF  — hover on primary
primary.light   #DBEAFE  — badge/chip tint background
primary.text    #1E3A8A  — text on primary.light surfaces

text.main       #0F172A  — headings, body
text.muted      #475569  — secondary text, labels, metadata
text.placeholder #94A3B8 — placeholder text

border.DEFAULT  #BFDBFE  — default borders
border.strong   #93C5FD  — stronger borders on hover/focus

success         #16A34A / #DCFCE7
warning         #D97706 / #FEF3C7
danger          #DC2626 / #FEE2E2
```

## Typography

Font: **Vazirmatn** — open source, supports Farsi + Latin  
Direction: RTL globally (`<html dir="rtl" lang="fa">`)

| Scale | Size | Weight | Use |
|-------|------|--------|-----|
| heading-lg | 24px | 700 | Page titles |
| heading-md | 18px | 600 | Card titles, section headers |
| heading-sm | 15px | 600 | Sub-section headers |
| body | 14px | 400 | Body text |
| body-sm | 13px | 400 | Secondary text, table cells |
| caption | 12px | 400 | Labels, timestamps, metadata |
| caption-bold | 12px | 600 | Badge text, column headers |

## Spacing Scale

All spacing values are multiples of 4px:
`4 8 12 16 20 24 32 40 48 56 64`

## Border Radius Scale

`4 6 8 12 16 20 24 999(pill)`

## Shadows

```
shadow-card   — subtle lift for cards: 0 1px 4px rgba(29,78,216,0.06)
shadow-panel  — stronger lift for panels/modals: 0 2px 12px rgba(29,78,216,0.08)
shadow-focus  — focus ring: 0 0 0 3px rgba(29,78,216,0.20)
```

## Layout

```
--sidebar-width:  240px  (fixed, inline-end)
--header-height:   60px  (fixed, top)
```

Main content has `padding-inline-end: 240px` and `padding-top: 60px`.

---

## RTL Rules

1. Never use `left`/`right` CSS properties — use `start`/`end` (logical properties).
2. Tailwind: use `ps-*`/`pe-*`/`ms-*`/`me-*`/`start-*`/`end-*` — never `pl-`/`pr-`/`ml-`/`mr-`.
3. Flex direction: default RTL flow is right-to-left. Use `flex-row-reverse` only when you explicitly need LTR order inside an RTL context.
4. Icons with direction meaning (arrows, chevrons): flip with `scale-x-[-1]` for RTL.
5. Font numbers: use Eastern Arabic numerals for Farsi UI text (`۱۲۳`), Latin numerals for technical data (IP addresses, version numbers).
