# Patterns Reference

## RTL layout

The `html` element has `direction: rtl`. All content inherits this.

### Logical CSS rules

| Wrong (LTR-specific) | Correct (logical) |
|----------------------|-------------------|
| `pl-*` / `pr-*` | `ps-*` / `pe-*` |
| `ml-*` / `mr-*` | `ms-*` / `me-*` |
| `left-*` / `right-*` | `start-*` / `end-*` |
| `text-left` / `text-right` | `text-start` / `text-end` |
| `border-l` / `border-r` | `border-s` / `border-e` |
| `rounded-l-*` / `rounded-r-*` | `rounded-s-*` / `rounded-e-*` |
| `padding-left` (inline) | `paddingInlineStart` |
| `padding-right` (inline) | `paddingInlineEnd` |

In RTL: `start` = right, `end` = left.

### Sidebar direction

Sidebar is fixed at `start-0` (= right side in RTL). Content has `padding-inline-start: var(--sidebar-width)`.

### LTR islands

Wrap these in `<span className="ltr-text">`:
- IP addresses: `185.94.97.211`
- Disk/RAM sizes: `16 GB RAM`, `4 vCPU`
- Percentages with numbers: `38%`
- Money amounts when written left-to-right
- Font-mono identifiers (server IDs, etc.)

```css
.ltr-text {
  direction: ltr;
  text-align: left;
  unicode-bidi: embed;
}
```

## Glassmorphism

### Standard card

```tsx
<div
  className="glass rounded-20 border p-20"
  style={{ boxShadow: "0 8px 32px rgba(15,50,47,0.10)" }}
>
  ...
</div>
```

### Card without padding (table host)

```tsx
<DashboardCard title="..." padding={false}>
  <div className="overflow-x-auto">
    <table className="w-full min-w-[480px]">...</table>
  </div>
</DashboardCard>
```

### Shell elements (sidebar, header)

```tsx
className="glass-shell fixed ..."
```

## Wallpaper background

Background image on `html` with `background-attachment: fixed` — guaranteed not to scroll. Blur is applied via `backdrop-filter` on `body::before`, not on the image element itself (doing so breaks Chromium compositing and causes the layer to scroll).

## Typography

Farsi numerals in body text: ۱۲۳۴۵۶۷۸۹۰ (use `toLocaleString('fa-IR')` or hardcode).

English/LTR numbers inside tables: wrap in `ltr-text font-mono`.

Metric card values are always `text-[30px] font-bold ltr-text tabular-nums`.

## Status colors

| Status | Tailwind class | Hex |
|--------|----------------|-----|
| Running / Success | `text-success` | green |
| Stopped / Error | `text-danger` | red |
| Building / Info | `text-info` (or blue) | blue |
| Warning / Degraded | `text-warning` | amber |
| Outage | `text-danger` | red |
| Stable | `text-success` | green |

## Region selector pattern

Every page owns `const [region, setRegion] = useState("all")` and passes it to `DashboardShell`. The `REGIONS` constant is the same across all pages:

```ts
const REGIONS = [
  { id: "all",     label: "همه مناطق" },
  { id: "tehran",  label: "تهران"     },
  { id: "isfahan", label: "اصفهان"    },
  { id: "mashhad", label: "مشهد"      },
];
```

Filtering pattern:
```ts
const items = region === "all" ? ALL_ITEMS : ALL_ITEMS.filter(i => i.region === region);
```
