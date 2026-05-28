# Feature Spec: IaaS Networks List

**Route:** `/iaas/networks`
**Status:** done
**Page file:** `src/app/iaas/networks/page.tsx`

## Breadcrumb

پراکچیر / زیرساخت ابری / شبکه‌ها

## Sections

1. **Dev state switcher** (remove in production)
2. **KPI mini-cards** — جمع شبکه‌ها, شبکه‌های فعال, زیرشبکه‌ها, IP شناور
3. **Search bar** — name/CIDR filter
4. **Networks table** — full columns

## Table columns

| Column | Notes |
|--------|-------|
| نام | Link to `/iaas/networks/[id]` |
| وضعیت | StatusBadge: active/inactive/building/error |
| منطقه | Region label |
| محدوده CIDR | `ltr-text font-mono` |
| زیرشبکه | Count |
| سرورهای متصل | Count |
| IP شناور | Count |
| ایجاد | Jalali date |
| عملیات | ActionMenu: مشاهده, مدیریت زیرشبکه, IP شناور, حذف (danger) |

## Region-reactive fields

- All 4 KPI values (total, active, subnets, floating IPs) derived from filtered list
- Table rows filtered by region, then further filtered by search

## Mock data

7 networks: 3 Tehran, 2 Isfahan, 2 Mashhad. Includes subnetCount, attachedServers, floatingIps per network.

## Empty states

- No networks in region → "در این منطقه شبکه‌ای وجود ندارد"
- No search match → "نتیجه‌ای برای جستجوی شما یافت نشد" + clear button
