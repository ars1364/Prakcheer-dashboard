# Feature Spec: Dashboard

**Route:** `/`
**Status:** done
**Page file:** `src/app/page.tsx`

## Breadcrumb

پراکچیر

## Sections

1. **Dev state switcher** (remove in production) — buttons for loading/error/empty/partial/ready
2. **Welcome hero** — user name, active server count from region KPI, account balance
3. **StatusStrip** — service health banner, alert count, last updated time
4. **KPI grid** (2 cols mobile, 4 cols lg) — سرورهای فعال, مصرف CPU, ترافیک شبکه, هزینه این ماه
5. **Alerts + server table** (1:2 ratio on xl) — AlertsCard + truncated server list
6. **Usage + billing** (1:1) — ResourceBar trio + billing rows with total

## Region-reactive fields

- Welcome hero server count (`kpis.heroLabel`)
- StatusStrip status and lastUpdated
- All 4 KPI card values
- Server table rows (filtered by region)
- AlertsCard alerts (filtered by region)
- ResourceBar values
- Billing rows and total

## Mock data

`ALL_SERVERS` (9 servers), `ALL_ALERTS` (3 alerts), `REGION_KPIS`, `REGION_STATUS`, `REGION_BILLING`, `REGION_RESOURCES` — all in `src/app/page.tsx`.

## Empty state trigger

When `pageState === "empty"`.
