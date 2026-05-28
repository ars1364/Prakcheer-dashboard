# Skill: Scaffold a New Dashboard Page

Use this skill whenever building a new page. Follow every step in order.

## Step 1 — Create the route file

```
src/app/<route>/page.tsx
```

For nested routes (e.g. `/iaas/servers`):
```
src/app/iaas/servers/page.tsx
```

## Step 2 — Page file skeleton

```tsx
"use client";

import { useState } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
// import UI components as needed

// ─── Regions ─────────────────────────────────────────────────────────────────
const REGIONS = [
  { id: "all",     label: "همه مناطق" },
  { id: "tehran",  label: "تهران"     },
  { id: "isfahan", label: "اصفهان"    },
  { id: "mashhad", label: "مشهد"      },
];

// ─── Mock data ────────────────────────────────────────────────────────────────
// Define ALL_<RESOURCE> constants here. Tag each row with `region` field.
// Define per-region lookup objects (REGION_KPIS, REGION_BILLING, etc.)

type PageState = "loading" | "error" | "empty" | "partial" | "ready";

export default function <PageName>Page() {
  const [pageState, setPageState] = useState<PageState>("ready");
  const [region, setRegion]       = useState("all");

  // Derive filtered data from region
  const items = region === "all" ? ALL_ITEMS : ALL_ITEMS.filter(i => i.region === region);

  return (
    <DashboardShell
      title="<Farsi page title>"
      breadcrumbs={[{ label: "پراکچیر", href: "/" }, { label: "<Farsi page title>" }]}
      regions={REGIONS}
      selectedRegion={region}
      onRegionChange={setRegion}
    >
      {/* Dev state switcher — remove in production */}
      {/* ... */}

      {/* pageState === "loading" */}
      {/* pageState === "error" */}
      {/* pageState === "empty" */}
      {/* pageState === "partial" — banner only, falls through to content */}

      {/* Main content — shown in ready + partial */}
      {(pageState === "ready" || pageState === "partial") && (
        <>
          {/* Unique stat header — do NOT use the generic 4-MetricCard grid.
              Choose a pattern from design/patterns.md that fits the page's domain:
              - segmented bar panel (fleet/allocation/capacity)
              - metric + breakdown bars (billing, cost, quota)
              - threat/alert hero (security, firewall, incidents)
              - dot/grid map (per-item status: tickets, IPs, servers)
              Each page MUST look different from every other page at the top. */}
          {/* Charts / visualization section */}
          {/* Filter bar */}
          {/* Main card / table */}
        </>
      )}
    </DashboardShell>
  );
}
```

## Step 3 — Add the route to the sidebar

Open `src/components/layout/Sidebar.tsx`. Add the new route under the correct `NAV_GROUPS` group or as a child of an existing expandable item.

## Step 4 — Wire region reactivity

Every data display (KPI cards, tables, charts, billing rows) must derive from the filtered/per-region data, not the raw ALL_* constants.

## Step 5 — Add the feature spec

Create `../.claude/features/NN-<page-slug>/spec.md` (increment NN). Document:
- Route and breadcrumb path
- What mock data it needs
- List of UI sections
- Region-reactive fields
- Empty state trigger condition

## Step 6 — Take a screenshot and review

Run the dev server on port 3010. Use Playwright to take a full-page screenshot. Run the Design Reviewer checklist from `agents/design-reviewer.md` before committing.

## Notes

- Never create a `layout.tsx` unless the page group needs shared UI beyond DashboardShell.
- Farsi text direction is inherited from `html { direction: rtl }` — no need to set it per-page.
- Keep all mock data outside the component function to prevent re-creation on render.
