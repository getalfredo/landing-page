# Fresh-eyes audit: what else needs addressing (wayfinder #33)

Date: 2026-07-15. Method: static sweep of the repo plus a live pass over the dev build in Chrome (desktop 1440px and emulated 390px mobile), console and network inspection, and a walk of the known leads from the build's review wave.

## Verdict in one paragraph

The page is in good shape. Nothing found threatens the destination. The audit confirms most known leads, surfaces a handful of small correctness and hygiene defects that fit one mechanical fix-it session, and rules the two structural leads (mobile deploy feedback, missing scroll reveals) already absorbed by open tickets. One lead turned out worse than reported: dev.db is not merely untracked clutter, it is committed to git history with live test rows.

## Known leads, verified

### 1. Mobile hides the boot terminal, Deploy gives no feedback — CONFIRMED, absorbed by hero v2

`hero-demo.css` hides `.wcn-term` below 860px. Verified live at 390px: tapping Deploy greys the key out, no boot readout appears, and the next hot key ("Show dashboard") materializes at the top of the panel, which is scrolled out of view when the user taps Deploy at the bottom. A real dead-end.

No new ticket: the hero v2 overlay layout ([#26](https://github.com/getalfredo/landing-page/issues/26), "mobile hides nothing") replaces this demo wholesale, pending [#47](https://github.com/getalfredo/landing-page/issues/47) and the fold-in. If the fold-in stalls before launch, this needs a stopgap (show a one-line boot status under the Deploy key on mobile).

### 2. ALREADY ABOARD only for same-session resubmits — CONFIRMED, acceptable as designed

The API answers duplicates with an identical 201 (the #4 no-leakage rule), so the client can only detect duplicates it saw itself (`confirmedEmails` set in `waitlist-form.tsx`). A cross-session duplicate sees `WAITLIST ● CONFIRMED · YOU ARE #n` with their original stable queue position, because the insert is idempotent and the position is computed from the existing row.

**Decision: acceptable.** The message is honest (they are confirmed, that is their position), stable across resubmits, and leaks nothing. No change.

One adjacent defect found: `trackWaitlistSignup(source)` fires on every successful POST, including detected resubmits, inflating the signup event. Fix: skip tracking when `already` is true. → fix-it pass.

### 3. manifest.json not linked — CONFIRMED

`public/manifest.json` exists (icons, theme_color `#14150e`) but `__root.tsx` head has no `rel="manifest"` link and no `theme-color` meta. Both are one-liners. → fix-it pass.

### 4. dev.db — WORSE THAN REPORTED

dev.db is **tracked and committed** (commit `7ca6c86`), carrying two test rows (`milestone3-check@…`, `uxtest1@…`). No real emails, so no history rewrite needed, but:

- any real local signup would silently end up in a public(-ish) git object;
- the Docker image build copies the repo, so a stale committed DB can shadow or confuse the prod sqlite path (the #24 persistence blocker's neighbor).

Fix: `git rm --cached dev.db`, add to `.gitignore`, confirm the prod DB path lives outside the deploy checkout (the #7 rig already plans a persistent volume). → fix-it pass, wired to block [Go live](https://github.com/getalfredo/landing-page/issues/24).

### 5. tsc errors — CONFIRMED, now three files' worth

`bun x tsc --noEmit` fails with:

- `drizzle.config.ts:6` — `dbCredentials.url` is `string | undefined`. Fix with a default (`process.env.DATABASE_URL ?? "file:./dev.db"`) or an explicit throw.
- `src/components/prototype/hero-demo-v2.tsx` — three errors (arithmetic on non-numbers at 242, a `.proj` narrowing miss at 880). Prototype file; fix cheaply or leave to die with the #47 fold-in, but a red `tsc` masks new errors, so fixing is better. → fix-it pass.

### 6. Performance leads — measured qualitatively, deferred to the prod build

- Both act videos (~936K + ~896K mp4) start downloading on initial page load because the `<video>` elements carry `autoPlay`, even though both sit below the fold and an IntersectionObserver already drives play/pause. Dropping `autoPlay` (the observer's `play()` covers it) plus `preload="metadata"` defers ~1.8MB off the critical path. → fix-it pass.
- Fonts: five woff2 files across four families (Space Grotesk 400/500/700, IBM Plex Mono, VT323) plus Inter Variable imported in `styles.css`. Fontsource ships latin-subset files, so weight is acceptable; no action now.
- LCP of the hero glass: dev-server numbers are not representative. Run Lighthouse against the built output as part of the [Go live](https://github.com/getalfredo/landing-page/issues/24) smoke test.

### 7. No scroll reveals — ABSORBED

Section identity ([#29](https://github.com/getalfredo/landing-page/issues/29), waypoints + timeline minimap) is decided and waiting on the narrative-v2 rebuild wave. Nothing new to add.

### 8. OG image and favicon on dark surfaces — FINE

Eyeballed `og.png` (1200×630) and `favicon-32.png` on dark ground: the OG frame is dark glass with bone text and reads well against both light and dark chrome; the 32px favicon's bone "A" and LED dot survive a dark tab bar. No action.

## Fresh findings

### 9. PostHog runs with a placeholder key in dev — console errors on every load

`.env.local` carries `VITE_POSTHOG_KEY=phc_xxx`, so `posthog.init` runs against EU cloud with a bogus key: a 404 on the config fetch and a 401 on `/flags` land in the console on every page load. Cosmetic locally, but two risks: it trains everyone to ignore console errors, and if the placeholder ever reaches the prod env the four analytics events vanish silently. Fix: skip init when the key is missing OR matches `phc_xxx`; go-live checklist confirms the real key. → fix-it pass + note on #24.

### 10. TanStackDevtools mounted unconditionally in `__root.tsx`

The devtools panel is rendered in the root shell with no dev gate. The package self-excludes in production builds, but the built-output runtime 500 on #24 is still undiagnosed, and an explicit `import.meta.env.DEV` gate costs one line and removes the panel (and its chunk) from the prod graph outright. → fix-it pass.

### 11. Mobile header crowding at 390px

The `SELF-HOSTED` etch wraps to two lines and collides visually with the wordmark's LED dot; the "Join the waitlist" keycap wraps to two lines too. Small CSS fix (hide the etch below ~480px or tighten the gap). → fix-it pass.

### 12. Hero demo bezel header wraps mid-token on mobile

`ALFREDO OS 0.1 · HQ / DEPLOY · UNIT 000-001` breaks into `UNIT 000-` / `001` at 390px. The DOM bezel belongs to the current hero demo, which hero v2 replaces, so no separate ticket; the fix-it pass may cheaply `white-space: nowrap` + hide the unit tag on narrow screens if it lands first.

### 13. Route-tree warning for `waitlist.test.ts`

Vite logs a route warning on every dev boot because the test file sits in `src/routes/api/`. Rename to the `-` ignore prefix or set `routeFileIgnorePattern`. → fix-it pass.

### 14. `public/drizzle.svg` is an unused starter asset

No references anywhere in `src/`. Delete. → fix-it pass.

## What this graduates

One new ticket collects every mechanical item above: **Fix-it pass: hygiene and small defects from the fresh-eyes audit** (task, AFK), wired to block Go live. Items 2b, 3, 4, 5, 6a, 9, 10, 11, 12 (best effort), 13, 14.

Everything structural was already on the map: hero v2 fold-in, rebuild wave, go-live smoke test.
