# Prakcheer Dashboard — Agent Index

RTL Farsi cloud-infrastructure dashboard. Next.js 14 App Router, Tailwind CSS, Vazirmatn font (offline), glassmorphism aesthetic, teal mountain wallpaper background.

## Agents

| File | Role |
|------|------|
| [agents/frontend-developer.md](agents/frontend-developer.md) | Builds pages, components, and features |
| [agents/design-reviewer.md](agents/design-reviewer.md) | Reviews UI against the design system |

## Skills

| File | When to use |
|------|-------------|
| [skills/scaffold-page.md](skills/scaffold-page.md) | Creating any new dashboard page |
| [skills/build-component.md](skills/build-component.md) | Creating a new reusable UI component |

## Design reference

| File | Contents |
|------|----------|
| [design/tokens.md](design/tokens.md) | All CSS custom properties |
| [design/components.md](design/components.md) | Component catalog with props |
| [design/patterns.md](design/patterns.md) | RTL, Farsi, glassmorphism patterns |

## Feature specs (one folder per page)

| Folder | Status |
|--------|--------|
| [features/01-dashboard/spec.md](features/01-dashboard/spec.md) | done |
| [features/02-iaas-servers/spec.md](features/02-iaas-servers/spec.md) | done |
| [features/03-iaas-networks/spec.md](features/03-iaas-networks/spec.md) | done |
| [features/04-iaas-firewall/spec.md](features/04-iaas-firewall/spec.md) | done |
| [features/05-billing/spec.md](features/05-billing/spec.md) | done |
| [features/06-support/spec.md](features/06-support/spec.md) | done |
| [features/07-settings/spec.md](features/07-settings/spec.md) | done |
| [features/08-iaas-volumes/spec.md](features/08-iaas-volumes/spec.md) | done |
| [features/09-iaas-floating-ips/spec.md](features/09-iaas-floating-ips/spec.md) | done |
| [features/10-iaas-snapshots/spec.md](features/10-iaas-snapshots/spec.md) | done |
| [features/11-monitoring/spec.md](features/11-monitoring/spec.md) | done |
| [features/12-load-balancers/spec.md](features/12-load-balancers/spec.md) | done |
| [features/13-activity-log/spec.md](features/13-activity-log/spec.md) | done |
| [features/14-iam/spec.md](features/14-iam/spec.md) | done |
| features/15-object-storage | done |
| features/16-dns | done |
| features/17-kubernetes | done |
| features/18-databases | done |
| features/19-cdn | done |

## Invariants

- **No CDN dependencies** — all fonts, icons, and assets are local.
- **Token-only styling** — never use raw hex in Tailwind classes; use CSS custom property tokens.
- **RTL-first** — use `start`/`end` logical properties everywhere. `ltr-text` class for IPs and numbers.
- **Glassmorphism** — all cards use `.glass`; sidebar/header use `.glass-shell`.
- **Offline Vazirmatn** — loaded via `next/font/local`; never override `--font-vazirmatn` in CSS.
- **Region-reactive pages** — every page owns a `region` state, passes it to `DashboardShell`, and filters all mock data through it.
