# ISPRO PH / SJKM Data Link Clone — Implementation TODO

## Phase 1 — Backend API completion (`ispro-clone/server.js`)
- [ ] Add `password` column to subscribers (for customer portal login)
- [ ] Add customer-session store (in-memory)
- [ ] Add `/api/site/info` (branding + plans) for `site.js`
- [ ] Add `/api/site/bills?u=` (public bill lookup for Bills page)
- [ ] Add `/api/portal/login`, `/api/portal/me`, `/api/portal/logout`

## Phase 2 — Full Settings module (admin)
- [ ] Expand admin Settings view: Invoice auto-generation, Due-date mode, Landing branding, Payment gateways, Modes of payment, Employees & Roles/Permissions, MikroTik auto-isolate + EXPIRE profile script, GenieACS TR-069, DB backup
- [ ] Add backend tables/APIs for employees & roles

## Phase 3 — Wire up & verify
- [ ] Confirm every page's API calls have matching backend routes (bills, login, portal, site info)
- [ ] Run `node server.js` in `ispro-clone/` and test full flow
