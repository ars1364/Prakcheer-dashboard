# Feature Spec: IaaS Snapshots

**Route:** `/iaas/snapshots`
**Status:** done
**Page file:** `src/app/iaas/snapshots/page.tsx`

## Breadcrumb

پراکچیر / زیرساخت ابری / اسنپ‌شات‌ها

## Sections

1. KPI cards: کل اسنپ‌شات‌ها, فضای مصرفی (GB), خودکار, خطا
2. Filter bar: search (name/id/sourceId) + status select + source type select + "ساخت اسنپ‌شات" button
3. Snapshots table (region-reactive)

## Table columns

نام اسنپ‌شات (name + description + id) | منبع (server/volume chip) | شناسه منبع | حجم (GB) | وضعیت | نوع (خودکار/دستی) | منطقه | تاریخ ساخت | عملیات (ActionMenu)

## Region-reactive fields

All KPI values + table rows filtered by region, then by status/source/search (AND logic).

## Mock data

10 snapshots: 5 Tehran, 3 Isfahan, 2 Mashhad.
Status mix: available (7), creating (1), error (1), deleting (1).
Auto mix: 4 auto (nightly), 6 manual.

## Source chip styling

- server → bg-brand-subtle text-brand
- volume → bg-bg-muted text-text-muted

## ActionMenu items per row

بازیابی سرور | ساخت سرور جدید | تغییر نام | حذف اسنپ‌شات (danger)

## Sidebar update

Added to IaaS children: دیسک‌ها (/iaas/volumes), IP شناور (/iaas/floating-ips), اسنپ‌شات (/iaas/snapshots)
