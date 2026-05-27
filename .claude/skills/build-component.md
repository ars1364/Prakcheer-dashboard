# Skill: Build a UI Component

Use this skill before writing any new shared component. Short-circuit if the component already exists.

## Step 0 — Check if it already exists

Read `design/components.md`. If a component matching the need is listed, use it — don't build a new one.

## Step 1 — Decide placement

| Type | Location |
|------|----------|
| Generic (button, badge, card) | `src/components/ui/` |
| Dashboard-specific (alerts, status strip) | `src/components/dashboard/` |
| Layout (sidebar, header, shell) | `src/components/layout/` |

## Step 2 — Define the props interface first

Write the TypeScript interface before the JSX. Confirm it covers all use cases in the feature spec.

```tsx
interface MyComponentProps {
  // required props first, optional props last
  label: string;
  variant?: "primary" | "secondary";
  className?: string;
}
```

## Step 3 — Styling rules

- **Use `.glass`** for any card-like surface.
- **Token-only colors** — use CSS custom property names in Tailwind: `text-brand`, `bg-bg-card`, `border-border`, `text-text-muted`, etc.
- **No hard-coded hex** in className strings. `style={}` props are acceptable for values that can't be expressed as tokens yet.
- **Logical CSS** — `ps-*`/`pe-*` not `pl-*`/`pr-*`; `start-*`/`end-*` not `left-*`/`right-*`.
- **`ltr-text` class** on any span containing: IP addresses, file sizes, resource counts (e.g. "4 vCPU"), percentages as numbers, money amounts.

## Step 4 — Shadow rule

All glass cards must include this shadow:
```tsx
style={{ boxShadow: "0 8px 32px rgba(15,50,47,0.10)" }}
```

## Step 5 — Export

Named export only:
```tsx
export default function MyComponent(...) { ... }
```

## Step 6 — Register in design/components.md

After building, add one row to the component table in `design/components.md`:

```
| MyComponent | src/components/ui/MyComponent.tsx | Props summary | When to use |
```

## Common pitfalls

- Forgetting `"use client"` on interactive components (onClick, useState, etc.)
- Using `text-left` / `text-right` instead of `text-start` / `text-end`
- Putting mock data inside the component — mock data belongs in the page file
- Adding `w-44` without checking the Tailwind spacing override (see `tailwind.config.ts` — `"44": "44px"`)
