# Feature Spec: IaaS Volumes

**Route:** `/iaas/volumes`
**Status:** done
**Page file:** `src/app/iaas/volumes/page.tsx`

## Breadcrumb

پراکچیر / زیرساخت ابری / دیسک‌ها

## Sections

1. KPI cards: کل دیسک‌ها, فضای کل (GB), متصل, آزاد
2. Filter bar: search (name/id/attached-server) + status select + type select + "ساخت دیسک جدید" button
3. Volumes table (region-reactive)

## Table columns

نام دیسک (name + id sub-label) | نوع | حجم (GB) | IOPS | وضعیت | متصل به | منطقه | تاریخ ساخت | عملیات (ActionMenu)

## Region-reactive fields

All KPI values + table rows filtered by region, then by status/type/search (AND logic).

## Mock data

12 volumes: 6 Tehran, 3 Isfahan, 3 Mashhad.
Types: NVMe (high IOPS 16000), SSD (3000), HDD (500).
Status mix: attached, available, creating, error.

## Type color coding

- NVMe → text-brand (blue)
- SSD → text-success (green)
- HDD → text-text-muted (gray)

## ActionMenu items per row

اتصال به سرور | تغییر اندازه | ساخت اسنپ‌شات | حذف دیسک (danger)
