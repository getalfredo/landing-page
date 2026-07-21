# Deploy rig: Coolify app, DNS, TLS, sqlite persistence

Runbook for wayfinder [#7](https://github.com/getalfredo/landing-page/issues/7). Coolify is already
running on the Hetzner box. This stands up the path to production and proves it
with a hello-world build, so that Go live ([#24](https://github.com/getalfredo/landing-page/issues/24))
is just "swap in the real app" once the `__exportAll` runtime 500 is fixed.

The rig is done when the hello-world app is reachable at the real domain over
HTTPS and its visit counter keeps climbing across a redeploy (the persisted DB file).

Work the phases in order. Phases 1-4 prove the rig; phase 5 records the facts;
phase 6 is the handoff config for the real app (do not do it in this ticket).

---

## Facts to fill in as you go

Fill these and hand them back so the ticket resolution can record them:

- Domain: `__________` (the owned domain / subdomain this ships to)
- Hetzner box public IP: `__________`
- Coolify app name: `__________`
- Coolify project / environment: `__________`
- Persistent volume mount path: `/data`
- Deploy trigger: `__________` (push-to-deploy on `main`, or manual "Deploy" button)
- Live URL (hello-world proof): `https://__________`

---

## Phase 1 — DNS

1. At your DNS registrar for the domain, add an **A record** pointing the host
   (apex `@` or a subdomain like `www` / `app`) at the Hetzner box public IP.
2. If shipping the apex, also confirm there's no conflicting AAAA/ALIAS.
3. Wait for propagation. Verify from your machine:
   ```bash
   dig +short <domain>
   ```
   It must return the box IP before Coolify can issue TLS.

## Phase 2 — Coolify app (hello-world, Dockerfile build)

In the Coolify UI, on the project for this repo:

1. **New Resource → Application → Public/Private GitHub repository** →
   `getalfredo/landing-page`, branch `main`.
2. **Build Pack: Dockerfile.**
3. **Base Directory:** `/docs/deploy/hello`
   **Dockerfile Location:** `Dockerfile`
   (This is the zero-dependency rig-proof image — it does not run the real app,
   so the `__exportAll` bug can't block the rig test.)
4. **Port (Ports Exposes):** `3000`.
5. **Domain:** set the FQDN from phase 1 (e.g. `https://<domain>`). Coolify uses
   this to route and to request the certificate.
6. Leave env vars empty for the hello-world (it needs none).

## Phase 3 — Persistent volume

The whole point of the rig is that the sqlite DB survives redeploys.

1. In the app's **Storages / Persistent Storage**, add a volume mounted at
   **`/data`** (a named Coolify volume, not a host bind unless you have a reason).
2. Both the hello-world image and the real app write under `/data`
   (`/data/rig-visits.txt` now, `/data/alfredo.db` later), so this one mount
   carries over unchanged to the real app.

## Phase 4 — Deploy and prove the rig

1. Click **Deploy**. Watch the build logs succeed and the container start
   (`rig hello-world listening on :3000`).
2. Confirm Coolify issued a Let's Encrypt cert (the domain shows a padlock).
3. Prove serving + TLS:
   ```bash
   curl -sS https://<domain>/health      # -> ok
   curl -sS https://<domain>/            # -> "Alfredo rig OK ... persisted visit count: N"
   ```
4. **Prove persistence:** note the visit count, then hit **Redeploy** (or
   restart the container). Reload `https://<domain>/`. The count must keep
   climbing from where it was, **not** reset to 1. If it resets, the volume
   mount is wrong — fix phase 3 before calling the rig done.

## Phase 5 — Record and hand back

Fill the **Facts** block above and post it back so the resolution comment on
[#7](https://github.com/getalfredo/landing-page/issues/7) can record: live URL, Coolify app name,
volume path (`/data`), and the deploy trigger. That closes the ticket.

---

## Phase 6 — Handoff to Go live (#24, do NOT do here)

When [#24](https://github.com/getalfredo/landing-page/issues/24) is ready with the real build fixed,
the same app switches over with three edits — captured here so the config is in one place:

- **Base Directory:** `/` · **Dockerfile Location:** `Dockerfile` (the repo-root
  one: `DATABASE_URL=/data/alfredo.db`, `PORT=3000`, runs `node .output/server/index.mjs`).
- **Runtime env vars:**
  - `DATABASE_URL=/data/alfredo.db` (already the Dockerfile default; set it in
    Coolify too for clarity).
  - `BETTER_AUTH_SECRET` — the `/api/auth/$` route mounts better-auth and reads
    this; generate with `npx -y @better-auth/cli secret`.
  - `BETTER_AUTH_URL=https://<domain>`.
- **Build-time env var:** `VITE_POSTHOG_KEY` — this is `VITE_`-prefixed, so it is
  **embedded at build time**, not read at runtime. In Coolify mark it as a build
  variable, and note the repo-root Dockerfile must accept it as a build arg
  (`ARG VITE_POSTHOG_KEY` before `npm run build`) or the key won't reach the
  bundle. `VITE_POSTHOG_HOST` is optional (defaults to `https://eu.i.posthog.com`).
- **Schema gap (rig fact):** the production image has no `drizzle/` migrations
  and no runtime table creation — the DB at `/data/alfredo.db` boots empty, so
  the first `waitlist` insert fails until the schema is applied. #24 must add a
  boot-time migration (drizzle-orm's better-sqlite3 migrator over generated SQL,
  no drizzle-kit needed at runtime) before the waitlist works in production.
