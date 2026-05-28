# Feature Spec: IaaS Firewall

**Route:** `/iaas/firewall`
**Status:** done
**Page file:** `src/app/iaas/firewall/page.tsx`

## Breadcrumb

پراکچیر / زیرساخت ابری / فایروال

## Sections

1. KPI cards: total rules, inbound, outbound, denied
2. Filter bar: search (name/port/source IP) + direction select + action select
3. Firewall rules table

## Table columns

نام قانون | جهت (inbound/outbound badge) | عملکرد (allow/deny badge) | پروتکل | پورت | مبدأ | اولویت | منطقه | عملیات

## Region-reactive fields

All KPI values + table rows filtered by region, then by direction/action/search filters (AND logic).

## Mock data

12 rules: 7 Tehran, 3 Isfahan, 2 Mashhad. Mix of allow/deny, inbound/outbound, TCP/UDP/ICMP/Any.

## Status indicator

Inline dot (green = active, gray = inactive) next to rule name — not a badge, just a colored circle.
