# Feature Spec: Settings

**Route:** `/settings`
**Status:** done
**Page file:** `src/app/settings/page.tsx`

## Breadcrumb

پراکچیر / تنظیمات

## Layout

Side tab navigation (vertical pill list) + content panel to the right (in RTL: start side).

## Tabs

### پروفایل (Profile)
- Avatar circle (initial letter, brand color)
- Editable fields: name, email, phone, role (read-only)
- Save button with transient "ذخیره شد" confirmation

### امنیت (Security)
- Password change form (current, new, confirm)
- 2FA toggle (TOTP, Google Authenticator) — toggle button
- Active sessions list: device, IP, location, last active, "این دستگاه" badge, logout button

### کلیدهای API (API Keys)
- Key list: name, prefix+masked suffix, created/last-used dates, active/inactive badge
- Copy + Delete per-row actions
- "ساخت کلید جدید" header button
- API documentation block with code sample and base URL

## Region-reactive fields

None — settings are account-wide, no region selector in this page.

## Mock data

API_KEYS: 3 keys (2 active, 1 inactive).
SESSIONS: 3 sessions (current device + 2 others).
Profile: static user info.
