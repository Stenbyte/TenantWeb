# Tenant app roadmap

Engineering-first. Local until landlord basics work. Free-tier Azure later.
Delivery shape: **one web app** → responsive by screen size → later PWA. No native app in near term.

## Stages (overview)

| Stage | Focus |
|-------|--------|
| **V1** | Postgres cutover, bookings, tenant allowlist, isolation, versioning. Core flows work on desktop + phone **browser** (basic responsive). |
| **V2** | Landlord value features + intentional **mobile vs desktop layouts** (breakpoint design). Danish i18n. PWA foundation (manifest / installable). Secrets hygiene (user secrets + `.cursorignore`). |
| **V3** | Growth features, auth/security hardening, multi-user / multi-instance scale, ops, lean Azure. PWA polish. |

## V1 — Booking core + Postgres + tenant allowlist

- [ ] Local Postgres setup re-verified (how to run, connection string, migrate) + README if missing
- [ ] Mongo removed from runtime paths (API + Web talk Postgres only)
- [x] Refresh tokens stored/validated in Postgres
- [ ] Cookie auth flags verified (HttpOnly, Secure, SameSite)
- [ ] Book + cancel slot end-to-end on Postgres
- [ ] Double-booking prevented (constraint + concurrency) + tests
- [ ] Shared-DB tenant key isolation + integration tests (no cross-landlord reads)
- [ ] Landlord creates tenant accounts (invite/create; no open signup for tenants)
- [ ] BuildingSettings: slot length, max bookings/week
- [ ] API versioning basics
- [ ] Web app versioning basics
- [ ] Auth + booking isolation tests in CI locally
- [ ] Landlord panel: manage tenants + view bookings
- [ ] Core booking/auth usable on phone browser (responsive breakpoints; same app)

**V1 done when:** local Postgres is reproducible; landlord + tenant creds work; invite/create tenant; book without races; isolation proven with tests; booking works on a phone browser — all on Postgres, no Mongo.

## V2 — Landlord value + mobile layout + PWA start

- [ ] Intentional responsive design: different layouts/compositions by screen size (tenant booking mobile-first where it matters; landlord denser on desktop)
- [ ] PWA foundation: web app manifest + installability (home screen)
- [ ] Danish i18n (react-i18n)
- [ ] Fault report (text; photos later)
- [ ] Upcoming booking notification
- [ ] Machines down / substitute machine
- [ ] Forward to varmemester
- [ ] Maintenance notes
- [ ] CSV/PDF laundry usage export
- [ ] Move JWT + DB credentials out of committed `appsettings` into .NET user secrets / env (no secrets in git)
- [ ] Add `.cursorignore` in API + Web (env, secrets, dumps, certs) so agent/context skips them
- [ ] Stronger isolation if needed (RLS / schema) — only with a written why

## V3 — Growth / ops / security / scale

- [ ] PWA polish (service worker / light offline shell if it earns its keep)
- [ ] Notice board (beskedtavle)
- [ ] Slot trading
- [ ] Audit log + retention
- [ ] Hash refresh tokens at rest (store hash only; compare on refresh)
- [ ] Refresh reuse detection (rotated token reused → revoke user sessions)
- [ ] Shared rate-limit + login lockout store (Redis or DB) so multi-instance APIs don’t reset abuse state
- [ ] Rate-limit hardening + abuse tracking (beyond per-node in-memory)
- [ ] EF/Npgsql pool + query tuning under concurrent tenants (bookings peak)
- [ ] Horizontal API scale checklist: stateless app, refresh in Postgres, no sticky sessions required
- [ ] App Insights + alerts (still watch free-tier)
- [ ] Deploy lean Azure when product justifies it

## Explicit non-goals for now

Separate native iOS/Android apps, Face ID, payments / Bogføringslov, permanent IP bans, cold-start ping as a “feature”.
