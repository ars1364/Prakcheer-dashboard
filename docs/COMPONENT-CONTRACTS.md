# Component Contracts

All components use design tokens only — no hardcoded hex values, no arbitrary Tailwind values.
All strings are passed already-translated from the parent (components are i18n-neutral).
RTL is handled at the HTML root (`dir="rtl"`) — components use logical CSS properties.

---

## Layout Components

### `DashboardShell`

**Contract:** Root page wrapper. Composes `Sidebar` + `Header` + `<main>`.  
**Props:**
```ts
title: string           // page title passed to Header
breadcrumbs?: { label: string; href?: string }[]
children: ReactNode     // page content
```
**Rules:**
- Never add business logic here.
- `<main>` has `padding-inline-end: var(--sidebar-width)` and `padding-top: var(--header-height)`.
- Background is always `bg-bg` (never white, never card).

---

### `Sidebar`

**Contract:** Fixed inline-end navigation rail. Supports one level of nested children per item.  
**Props:** None (reads route from `usePathname`).  
**Rules:**
- Width is `var(--sidebar-width)` — never hardcoded.
- Active item: `bg-primary-light text-primary-text`.
- Hover item: `hover:bg-bg-subtle hover:text-text-main`.
- Sub-items indented with `border-e-2 border-surface` vertical rule.
- User profile at bottom — always inside border-t divider.

---

### `Header`

**Contract:** Fixed top bar. Title + breadcrumb on the inline-start side, action buttons on inline-end.  
**Props:**
```ts
title: string
breadcrumbs?: { label: string; href?: string }[]
```
**Rules:**
- Height is `var(--header-height)` — never hardcoded.
- `padding-inline-end: var(--sidebar-width)` so content doesn't go behind sidebar.
- Background: `bg-bg-card`, border-bottom: `border-border`.

---

## UI Components

### `Card`

**Contract:** Generic white surface that floats above the page background.  
**Props:**
```ts
children: ReactNode
className?: string
padding?: boolean   // default true — set false for tables/custom layouts
```
**Tokens used:** `bg-bg-card rounded-16 border border-border shadow-card`  
**Rule:** Never use `rounded-xl`, `shadow-md`, or any non-token class.

---

### `StatCard`

**Contract:** KPI display with optional icon, trend indicator, and subtitle.  
**Props:**
```ts
label: string       // uppercase label (translated by caller)
value: string       // formatted value (e.g. "12", "38٪", "4.2 TB")
sub?: string        // secondary text below value
trend?: "up" | "down" | "neutral"
trendValue?: string // e.g. "14٪" or "2 این ماه"
icon?: string       // emoji or symbol — 1-2 chars
accent?: string     // Tailwind class for icon bg — default bg-primary-light
```
**Rules:**
- Icon container: `w-44 h-44 rounded-12 {accent}`.
- Value: `text-2xl font-bold text-text-main tabular-nums`.
- Trend up → `text-success`, down → `text-danger`, neutral → `text-text-muted`.

---

### `Badge`

**Contract:** Small inline label for status, category, or count.  
**Props:**
```ts
children: ReactNode
variant?: "primary" | "success" | "warning" | "danger" | "muted"
```
**Tokens:**
- `primary`: `bg-primary-light text-primary-text`
- `success`: `bg-success-light text-success`
- `warning`: `bg-warning-light text-warning`
- `danger`:  `bg-danger-light text-danger`
- `muted`:   `bg-bg-subtle text-text-muted`

---

## Planned Components (not yet implemented)

| Component | Purpose |
|-----------|---------|
| `Button` | Primary / secondary / ghost / danger variants |
| `Input` | Text input with label, error state, Farsi placeholder |
| `Select` | Dropdown select, RTL-aware chevron |
| `DataTable` | Sortable, paginated table with bulk actions |
| `Modal` | Centered overlay with backdrop |
| `ConfirmDialog` | Destructive-action confirmation |
| `Snackbar` | Toast notifications (success / error / info) |
| `Breadcrumb` | Navigation trail, separator aware of RTL |
| `Tabs` | Horizontal tab bar |
| `Pagination` | Page navigator with RTL arrow flip |
| `EmptyState` | Centered empty / error / loading states |
| `Avatar` | User avatar with fallback initials |
| `SearchInput` | Input with embedded search icon |
| `FilterBar` | Filter chips row |
| `ProgressBar` | Linear progress / usage meter |
| `Tooltip` | Hover label |
| `Drawer` | Slide-in panel from inline-end |
| `PageHeader` | Page title + description + primary action block |
