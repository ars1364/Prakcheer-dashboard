# Feature Spec: Support

**Route:** `/support`
**Status:** done
**Page file:** `src/app/support/page.tsx`

## Breadcrumb

پراکچیر / پشتیبانی

## Sections

1. KPI cards: کل تیکت‌ها, باز/در بررسی, بحرانی, حل‌شده
2. Filter bar: search (id/title/category) + status select + priority select
3. Tickets table (region-reactive)
4. Stats row: avg response time, customer satisfaction %, SLA at-risk count

## Table columns

شماره | موضوع | دسته‌بندی | اولویت | وضعیت | منطقه | تاریخ ایجاد | آخرین به‌روزرسانی | مسئول

## Region-reactive fields

All KPI values + table rows filtered by region, then by status/priority/search (AND logic).

## Mock data

12 tickets: 5 Tehran, 3 Isfahan, 2 Mashhad, 2 Tehran.
Priority mix: 2 critical, 3 high, 4 medium, 3 low.
Status mix: open, in_progress, waiting, resolved, closed.

## Status badge mapping

- open → danger
- in_progress → warning
- waiting → info
- resolved / closed → success

## Priority badge mapping

- critical → danger
- high → warning
- medium → info
- low → success
