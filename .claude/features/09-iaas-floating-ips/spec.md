# Feature Spec: IaaS Floating IPs

**Route:** `/iaas/floating-ips`
**Status:** done
**Page file:** `src/app/iaas/floating-ips/page.tsx`

## Breadcrumb

پراکچیر / زیرساخت ابری / IP شناور

## Sections

1. KPI cards: کل IP شناور, متصل, آزاد, رزرو شده
2. Filter bar: LTR IP/rDNS search + status select + "درخواست IP جدید" button
3. Floating IPs table (region-reactive)

## Table columns

آدرس IP (monospace + id sub-label) | rDNS | وضعیت | متصل به | پهنای باند | منطقه | تاریخ ساخت | عملیات (ActionMenu)

## Region-reactive fields

All KPI values + table rows filtered by region, then by status/search (AND logic).

## Mock data

10 IPs: 5 Tehran, 3 Isfahan, 2 Mashhad.
Status mix: attached (6), unattached (3), reserved (1).

## LTR fields

IP addresses and rDNS hostnames always use ltr-text + font-mono classes.

## ActionMenu items per row

اتصال به سرور | ویرایش rDNS | جدا کردن | آزادسازی IP (danger)
