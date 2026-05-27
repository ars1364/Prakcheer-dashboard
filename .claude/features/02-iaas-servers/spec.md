# Feature Spec: IaaS Servers List

**Route:** `/iaas/servers`
**Status:** done
**Page file:** `src/app/iaas/servers/page.tsx`

## Breadcrumb

پراکچیر / زیرساخت ابری / سرورها

## Sections

1. **Dev state switcher** (remove in production)
2. **KPI mini-cards** (2 cols mobile, 4 cols lg) — جمع سرورها, در حال اجرا, متوقف/خطا, در حال ساخت
3. **Filter bar** — search input (name/IP) + status filter select
4. **Full server table** — all columns including region, disk, created date

## Table columns

| Column | Notes |
|--------|-------|
| نام | Link to `/iaas/servers/[id]` |
| وضعیت | StatusBadge with dot |
| منطقه | Region label |
| آدرس IP | `ltr-text font-mono` |
| vCPU / RAM | `ltr-text` |
| دیسک | `ltr-text` |
| ایجاد | Relative date |
| عملیات | ActionMenu: مشاهده, کنسول, راه‌اندازی مجدد, خاموش کردن (danger) |

## Region-reactive fields

- All 4 KPI mini-card values
- Server table rows (filtered by region, then filtered by search + status)
- Empty state message changes when region has no servers vs when search yields no results

## Mock data

Same `ALL_SERVERS` from dashboard page (12 total after adding srv-10, srv-11, srv-12). Per-region server KPIs derived from filtered list counts.

## Filter behavior

Client-side: search filters on `name` and `ip` fields (case-insensitive). Status filter is a separate select. Both filters compound (AND logic). Region filter is the global header selector.

## Empty state trigger

- No servers in selected region → "در این منطقه سروری وجود ندارد"
- No servers match search → "نتیجه‌ای برای جستجوی شما یافت نشد"

## Create server CTA

`+ سفارش سرور جدید` button in DashboardCard action area → `/iaas/servers/new`
