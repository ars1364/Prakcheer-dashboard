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

## Stat header patterns (replaces MetricCard grid)

Every page uses a unique top-section panel instead of the generic 4-MetricCard grid. Pattern families:

### Segmented bar panel
For fleet/allocation/capacity that can be split into colored segments:
```tsx
<div className="glass rounded-16 px-20 py-16 mb-4">
  <div className="flex items-center justify-between mb-10">
    <span className="text-[13px] font-medium text-text-muted">{label}</span>
    <span className="ltr-text text-[13px] font-semibold text-text-main">{total}</span>
  </div>
  <div className="flex h-10 rounded-full overflow-hidden gap-[2px] mb-16">
    {items.map(item => (
      <div key={item.id} style={{ flex: item.weight, background: item.color }} title={item.name} />
    ))}
  </div>
  <div className="grid grid-cols-4 gap-10">
    {stats.map(s => (
      <div key={s.label} className="flex flex-col items-center py-10 px-6 rounded-12" style={{ background: s.bg }}>
        <span className="text-[24px] font-bold ltr-text" style={{ color: s.color }}>{s.count}</span>
        <span className="text-[11px] text-text-muted text-center mt-2">{s.label}</span>
      </div>
    ))}
  </div>
</div>
```
Used by: servers (fleet), volumes (storage type), floating-ips (allocation), snapshots (source).

### Metric + breakdown bars panel
For pages where one hero number + category breakdown matters:
```tsx
<div className="glass rounded-16 px-20 py-18 mb-4">
  <div className="flex flex-wrap gap-24 items-start">
    <div> {/* Hero number */}
      <p className="text-[12px] text-text-muted mb-6">{heroLabel}</p>
      <p className="text-[36px] font-bold text-text-main ltr-text leading-none">{value}</p>
    </div>
    <div className="flex-1 min-w-[200px]"> {/* Category bars */}
      {rows.map(r => (
        <div key={r.label} className="flex items-center gap-10 mb-10">
          <span className="text-[12px] text-text-muted w-[92px] shrink-0">{r.label}</span>
          <div className="flex-1 h-[8px] rounded-full bg-border overflow-hidden">
            <div style={{ width: `${r.pct}%`, background: r.color }} className="h-full rounded-full" />
          </div>
          <span className="ltr-text text-[12px] font-medium text-text-main w-[32px] text-end">{r.pct}٪</span>
        </div>
      ))}
    </div>
  </div>
</div>
```
Used by: billing.

### Threat/alert hero panel
For security/ops pages where the most important metric is a danger-colored hero:
```tsx
<div className="glass rounded-16 px-20 py-16 mb-4">
  <div className="flex flex-wrap gap-16 items-center">
    <div className="rounded-14 px-20 py-14 flex flex-col items-center min-w-[130px]"
         style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
      <p className="text-[11px] text-text-muted mb-4">{heroLabel}</p>
      <p className="text-[36px] font-bold ltr-text leading-none" style={{ color: "#ef4444" }}>{value}</p>
    </div>
    {/* ratio bar + stat grid */}
  </div>
</div>
```
Used by: firewall.

### Dot/grid map panel
For pages showing per-item status as a visual grid:
```tsx
<div className="glass rounded-16 px-20 py-16 mb-4">
  <div className="flex flex-wrap gap-8 mb-14">
    {items.map(item => (
      <div key={item.id} className="w-18 h-18 rounded-4" style={{ background: statusColor[item.status] }} title={item.name} />
    ))}
  </div>
  <div className="flex flex-wrap gap-10">
    {stats.map(s => (
      <div key={s.label} className="flex items-center gap-10 flex-1 min-w-[110px] rounded-12 px-14 py-10" style={{ background: s.bg }}>
        <span className="text-[26px] font-bold ltr-text" style={{ color: s.color }}>{s.count}</span>
        <span className="text-[12px] text-text-muted">{s.label}</span>
      </div>
    ))}
  </div>
</div>
```
Used by: support (ticket priority map).

## recharts usage

recharts is installed. Import from `"recharts"`. Always set `fontFamily: "var(--font-vazirmatn)"` on all axis ticks and tooltip contentStyle. Wrap charts in `<div className="ltr-text">` since recharts renders LTR.

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
