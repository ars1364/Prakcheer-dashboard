# Feature Spec: Billing

**Route:** `/billing`
**Status:** done
**Page file:** `src/app/billing/page.tsx`

## Breadcrumb

پراکچیر / صورتحساب

## Sections

1. KPI cards: هزینه این ماه, فاکتورهای پرداخت, در انتظار, اعتبار باقی‌مانده
2. Two-column: current month ResourceBars + service cost share bars + wallet credit
3. Invoice history table (account-wide, not region-filtered)

## Region-reactive fields

- KPI "هزینه این ماه" value
- Current month breakdown rows (amounts + percentages)
- Service cost share percentages
- Note in invoice table header clarifies invoices are account-wide

## Mock data

REGION_BILLING: per-region totals and row breakdown.
INVOICES: 6 invoices (1 pending, 5 paid), Jalali dates, INV-YYYY-NNN numbering.

## Special components

ResourceBar reused for usage breakdown (label=service, used=amount string, total=total string, pct=percentage).
Custom horizontal bar for cost share (no ResourceBar — uses inline div for color control).
Wallet credit block inside the cost-share card.
