# Component Catalog

All reusable components. Check here before building anything new.

## Layout

| Component | Path | Props | Notes |
|-----------|------|-------|-------|
| `DashboardShell` | `components/layout/DashboardShell.tsx` | `title`, `breadcrumbs?`, `children`, `regions?`, `selectedRegion?`, `onRegionChange?` | Wraps every page. Manages sidebar open state. |
| `Header` | `components/layout/Header.tsx` | `title`, `breadcrumbs?`, `onMenuToggle`, `regions?`, `selectedRegion?`, `onRegionChange?` | Fixed top bar. Renders region selector. |
| `Sidebar` | `components/layout/Sidebar.tsx` | `isOpen`, `onClose` | Fixed start (right in RTL). Glass-shell. |

## UI primitives

| Component | Path | Props | Notes |
|-----------|------|-------|-------|
| `DashboardCard` | `components/ui/DashboardCard.tsx` | `title?`, `action?`, `children`, `padding?=true`, `className?` | Glass card container. |
| `MetricCard` | `components/ui/MetricCard.tsx` | `icon`, `label`, `value`, `context?`, `trend?`, `trendValue?` | KPI tile with trend arrow. Value always `ltr-text`. |
| `StatusBadge` | `components/ui/StatusBadge.tsx` | `variant: success\|warning\|danger\|info`, `dot?=false`, `children` | Colored pill badge. |
| `ResourceBar` | `components/ui/ResourceBar.tsx` | `label`, `used`, `total`, `pct`, `color?` | Horizontal usage progress bar. |
| `ActionMenu` | `components/ui/ActionMenu.tsx` | `items: {label, onClick, danger?}[]` | Kebab ⋮ dropdown for table rows. |
| `EmptyState` | `components/ui/EmptyState.tsx` | `icon?`, `title`, `description?`, `action?` | Centered empty content placeholder. |
| `ErrorState` | `components/ui/ErrorState.tsx` | `title`, `description?`, `onRetry?` | Error with retry button. |
| `MetricCardSkeleton` | `components/ui/LoadingSkeleton.tsx` | — | Skeleton for MetricCard loading state. |
| `TableSkeleton` | `components/ui/LoadingSkeleton.tsx` | — | Skeleton for table loading state. |

## Dashboard-specific

| Component | Path | Props | Notes |
|-----------|------|-------|-------|
| `StatusStrip` | `components/dashboard/StatusStrip.tsx` | `status: stable\|degraded\|incident\|outage`, `alertCount`, `lastUpdated` | Service health banner. Pulsing dot. |
| `AlertsCard` | `components/dashboard/AlertsCard.tsx` | `alerts: Alert[]` | Severity-sorted alert list. Handles empty state. |

## Alert type

```ts
type Alert = {
  id: string;
  severity: "critical" | "warning" | "info";
  title: string;
  meta: string;
  href?: string;
  actionLabel?: string;
};
```
