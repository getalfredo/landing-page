# Research: stunning landing pages for inspiration (wayfinder #36)

Date: 2026-07-16. Method: fetched the live pages directly (WebFetch markdown passes) for ~20 candidates across four buckets (dev tools, infra/self-host, indie SaaS, pure craft), corroborated motion and interaction details I could not see in fetched HTML with teardowns and the vendors' own design posts. Mapping is grounded in the locked HQ identity (issue #11 resolution, "The Web Console") and the built page (issue #23 resolution, plus a skim of `src/components/landing/`).

Two fetch caveats, disclosed inline where relevant: Fly.io and Railway now serve agent-briefing documents (llms.txt-style) to non-browser user agents, so their visual pages are described from search corroboration and their own titles/copy, not a full render. Godly.website has shut down and redirects to recent.design (403 to fetchers); Landing.love was used as the working gallery instead.

Ideas that duplicate what the page already does or has already decided were excluded per the ticket: interactive hero demo, ambient section loops, split-flap H1, timeline minimap (#29), waypoint etches, exclusive accordion FAQ, nameplate footer, amber/bone keycap CTAs.

## Ranked shortlist

### 1. A LIVE etch: let one real signal onto the page

- The move: somewhere small and load-bearing (footer strip or crescendo), show one piece of genuinely live telemetry from the box this page runs on - uptime of the landing page itself, requests served today, or the real waitlist count - labeled `LIVE` in the same etch vocabulary that currently says `SIMULATED FEED`.
- Sources: Zed uses a real GitHub activity stream as its product visual instead of a mockup (https://zed.dev); PostHog builds its whole page on radical transparency ("98% of our customers use PostHog for free") (https://posthog.com).
- Why it fits: the honesty rule currently only subtracts (disclaimers on fake feeds). One LIVE etch flips it into proof, and it is proof of the exact premise - "runs on your servers, reports to one HQ" - because the landing page itself runs on the single VPS the product is about. The SIMULATED/LIVE contrast makes both etches stronger.
- Size: prototype. The visual is one etch line; the real work is picking a data source that is truthful, cheap, and does not leak (page uptime from the process, request counter, or waitlist size which the API already computes).

### 2. Etched mono architecture diagram for the self-host topology

- The move: one static ASCII-style diagram in IBM Plex Mono, drawn in the etch color on the dark glass: `YOUR VPS -> alfredo -> [ auth | email | db | analytics | secrets ] -> HQ`, projects fanning in. Placed in the "Day one" act where the wired-once claim currently lives in prose only.
- Source: PlanetScale explains Vitess sharding with three progressively complex ASCII architecture diagrams as the page's primary visuals, in monospace, no illustration (https://planetscale.com).
- Why it fits: it is the cheapest possible on-material visual - mono type is already the etch vocabulary, and a topology diagram answers the one question the page never shows spatially: where does everything live. It also reads as engineer-honest in a way a polished isometric illustration never would.
- Size: straight build. A `<pre>` block or small SVG, one reduced-motion-safe fade.

### 3. Couple the keycaps to the physical keyboard

- The move: when the waitlist input is focused and the visitor presses Enter, the bone submit keycap visibly depresses (the existing `0 3px 0` press shadow collapsing) before the form submits. Optionally the same for the demo's Deploy key via a keyboard shortcut when the demo has focus.
- Sources: Resend's hero compositions respond to physical key presses (Spline case study: https://blog.spline.design/how-resend-uses-spline-for-3d-design); Raycast's entire hero is an interactive keyboard whose keys carry the value props (https://www.raycast.com).
- Why it fits: the keycap is already the page's tactile signature; right now it only responds to the mouse. Closing the loop with the real keyboard is a five-second craft signal aimed exactly at a keyboard-first audience, and it costs no new vocabulary.
- Size: prototype-small. A keydown handler plus the existing `:active` styles; needs care not to double-fire the submit.

### 4. Time-of-day awareness in the console

- The move: the hero demo's bezel clock etch shows the visitor's actual local time, and one ambient quality of the scene (LED glow intensity, or a `DAY`/`NIGHT` microlabel) shifts with it. Nothing fake: the clock is real, so it needs no SIMULATED etch.
- Source: Resend's hero cube uses a time-zone-based lighting system that shifts the scene's illumination by the visitor's local time of day (https://resend.com, teardown: https://blog.spline.design/how-resend-uses-spline-for-3d-design).
- Why it fits: the product promise is a console that is always watching; a console whose clock is right quietly asserts it is on. It also injects one genuinely-local detail into a demo that is otherwise all simulation, which sharpens the honesty split from idea 1.
- Size: small build. `Date` plus a CSS variable; reduced-motion safe by construction.

### 5. Setup-tax comparison strip

- The move: a small mono table in the "Day one" act: rows are auth / email / database / analytics / secrets; two columns, "every new project" (the wiring you redo) vs "with alfredo" (wired once), LED-green ticks in the second column. It is the checkbox panel's argument, stated as a ledger instead of a feature list.
- Sources: Bun anchors its whole page on comparison tables (Bun vs Node vs Deno, checkmarks and crosses) and benchmark bars placed early (https://bun.sh); Coolify's five-second positioning works by naming the alternatives outright - "open-source & self-hostable alternative to Vercel, Heroku, Netlify and Railway" (https://coolify.io).
- Why it fits: the setup-tax pain is currently carried by prose and the PatchBay loop; a ledger makes it countable, and tables in tracked mono caps are already the HQ's native furniture. Caution: new section content means new copy, which is locked per #14, so this is a copy ticket plus a prototype, not a drop-in.
- Size: prototype (visual is trivial; the copy ruling is the work).

### 6. Chrome-dimming pass: structure felt, not seen

- The move: an audit pass over the built page with Linear's refresh principles: not every element carries equal visual weight; dim the bezel chrome, hairlines, and non-load-bearing etches a step, so phosphor green and amber are the only things that ever compete for the eye. Linear's phrasing: "Structure should be felt not seen."
- Source: Linear's own write-up of its 2025 refresh - warmer less-saturated grays, dimmed navigation, icons scaled down, softer borders replacing dividers (https://linear.app/now/behind-the-latest-design-refresh, live at https://linear.app).
- Why it fits: the HQ material is dense (bezels, etches, seams, LEDs, microprint). The identity survives dimming; what it buys is that the signal colors read as signals, which is the identity's whole thesis. This is a refinement lens, not a new element.
- Size: prototype (one variant pass over existing CSS tokens, judged side by side).

### 7. One concrete number in the day-one claim

- The move: replace one soft claim with a measured one, e.g. the real elapsed time from `alfredo up` to a live URL on reference hardware, stated plainly ("4 minutes on a 5 EUR VPS" - whatever the true number is).
- Sources: Amie front-loads "Within 47 seconds: share summary, keep CRM updated" (https://www.amie.so); Frame.io leads sections with "2.9x faster" style multipliers (https://frame.io); Supabase's "Build in a weekend. Scale to millions." is the genre's most-copied line because it is two measurable scales (https://supabase.com).
- Why it fits: the voice rule is plain declarative sentences; a specific number is the most declarative sentence there is. Blocked on having a truthful measurement, and on the #14 copy lock, so it ranks last despite being cheap.
- Size: straight build once the number exists (copy ticket first).

Considered and rejected: install-command hero (Bun, Railway) - waitlist-only, no product access; testimonial and logo walls (Zed, Clerk, Stripe, Warp) - no users yet; mascot/illustration warmth (Fly.io's Frankie balloon, PostHog's hogs) - clashes with dark-glass console material; bento product grids (Stripe) - clashes with the narrative spine; role/persona tabs (Tailscale, Warp) - duplicates the intent switchboard; progressive day-timeline (Amie) - duplicates the Day one / Every day after acts; founder mission section (Zed, Daylight) - founder note exists.

## Per-page survey notes

### Dev tools

**Linear** (https://linear.app)
- Five-second hook: one system-of-record sentence ("The product development system for teams and agents") over stacked real product frames; monochrome discipline makes the product shots the only color.
- Moves: (1) 2025 refresh moved from cool blue-gray to warm desaturated gray, dimmed all navigation chrome, shrank icons - hierarchy through subtraction (their write-up: https://linear.app/now/behind-the-latest-design-refresh). (2) Section flow mirrors the product's own loop (Intake -> Plan -> Build -> Monitor). (3) Closing line "Built for the future. Available today." does crescendo work in six words.
- Verdict: the subtraction discipline translates directly (shortlist 6). The monochrome palette itself would clash - Alfredo's identity depends on its three signal colors.

**Stripe** (https://stripe.com)
- Five-second hook: institutional confidence - one abstract wave/gradient, a metric wall (1.9T USD, 99.999% uptime), logo carousel before any feature.
- Moves: (1) six-column bento grid of products; (2) accordion case-study reveals with photography that hides the parallelogram mark inside the images; (3) trust numbers as typography, oversized.
- Verdict: clash. Stripe sells scale to enterprises; Alfredo sells intimacy to one indie hacker. The only takeaway is the oversized-true-number instinct (feeds shortlist 7).

**Vercel** (https://vercel.com)
- Five-second hook: "Agentic Infrastructure" - a two-word H1 plus atmospheric dark gradient; customer case studies do all demonstration work (Notion, Zapier, Mintlify with feature tabs).
- Moves: (1) proof by named customer instead of screenshots; (2) staggered three-line subheading that reads as one sentence three ways; (3) full light/dark theme parity.
- Verdict: mostly clash (no customers yet, no light theme). The staggered-subhead trick is cute but would fight the locked H1.

**Clerk** (https://clerk.com)
- Five-second hook: component names as product demo - `<SignUp />`, `<UserButton />` shown as typed artifacts, so a developer sees the integration before any screenshot.
- Moves: (1) code-shaped nouns as hero furniture; (2) authority testimonials (Collison, Rauch) placed immediately before the final CTA.
- Verdict: partial translate - the "show the artifact developers will actually touch" instinct is what the hero demo's `alfredo up --with` line already does; nothing new to take. Testimonials not applicable.

**Raycast** (https://www.raycast.com)
- Five-second hook: an interactive keyboard as the hero, keys labeled Fast / Ergonomic / Native / Reliable - the input device is the value prop.
- Moves: (1) hardware-as-hero; (2) fragmented syntax section heads ("Fast. Think in milliseconds."); (3) rotating "favorite feature" cards inside testimonials.
- Verdict: the keyboard-tactility instinct translates as shortlist 3 (couple the existing keycaps to real key presses). A whole keyboard hero would duplicate the existing console demo. The fragment cadence violates the copy voice.

**Resend** (https://resend.com; teardowns: https://blog.spline.design/how-resend-uses-spline-for-3d-design, https://resend.com/blog/rebranding-resend, https://onepagelove.com/resend)
- Five-second hook: a black Rubik's cube slowly rotating on a near-black page, "Email for developers" - one tangible object carries the whole brand. (Direct fetch served their developer-tools manifest; visual details corroborated from their own rebrand post and the Spline case study.)
- Moves: (1) physicality doctrine - real materials and 3D objects to make an API feel tangible; (2) the hero scene's lighting direction shifts with the visitor's local time of day; (3) scenes respond to physical key presses; (4) dark-first palette that added grays and gradients over pure black/white for texture.
- Verdict: the strongest single-source match for the HQ. Alfredo already has the physical-object doctrine (keycaps, bezels); what translates is the responsiveness of the physical world: time-of-day (shortlist 4) and key-press coupling (shortlist 3). A 3D centerpiece object would compete with the console demo.

**Zed** (https://zed.dev)
- Five-second hook: "Your last next editor" - a confident pun H1, text-only hero, then a real GitHub activity stream where a product screenshot would normally sit.
- Moves: (1) live real data as the product visual - commits from their actual repos, timestamped; (2) three-word pillar headers (Fast, Agentic, Collaborative); (3) founder letter late in the page.
- Verdict: the real-data move is the seed of shortlist 1. The rest duplicates what Alfredo has (pillars ~ intents, founder letter exists).

**Warp** (https://www.warp.dev)
- Five-second hook: dark terminal screenshot full-width under a mission H1; four-tab product carousel replaces scrolling.
- Moves: (1) tabbed product angles so one viewport serves four stories; (2) "software factory" framing.
- Verdict: duplicates the intent switchboard pattern. Nothing new to take.

**Cursor** (https://cursor.com)
- Five-second hook: one flat declarative H1 ("Cursor is your coding agent for building ambitious software") with the product filling the viewport under it.
- Moves: (1) stacked full-bleed demo sections, each a different surface (IDE, CLI, Slack); (2) a 2022-2026 research timeline asserting pedigree; (3) changelog preview as momentum proof.
- Verdict: mostly scale-clash. The flat-declarative H1 confirms the voice rule rather than adding to it. Momentum proof (changelog) is interesting post-launch, not for a waitlist page.

**Bun** (https://bun.sh)
- Five-second hook: name, claim, install command - `curl -fsSL https://bun.sh/install | bash` is the CTA, and the first scroll is a benchmark bar chart (269ms vs 2,137ms).
- Moves: (1) benchmark bars early and often, every speed claim quantified; (2) Bun/Node/Deno checkmark comparison tables; (3) twelve tab-selectable runnable code samples; (4) named real users ("Claude Code uses Bun") before generic proof.
- Verdict: install-command hero clashes (waitlist-only). The countable-claims discipline translates as shortlist 5 and 7.

### Infra / self-host

**Tailscale** (https://tailscale.com)
- Five-second hook: text-only hero, category claim, dual CTA; the page bets everything on copy and logos.
- Moves: (1) five product pillars immediately after the hero; (2) closing CTA section that mirrors the hero verbatim; (3) developer-voice quotes doing the emotional work the enterprise copy cannot.
- Verdict: structurally conservative; Alfredo's page is already more composed. Nothing to take that is not already present.

**Fly.io** (https://fly.io; fetch served an agent briefing, visuals corroborated via search - live title "Build fast. Run any code fearlessly.")
- Five-second hook: hand-drawn hot-air-balloon illustrations (Annie Ruygt's "Frankie") over wry, plain, dev-honest copy ("Plans get complicated, so we just charge based on usage.").
- Moves: (1) a persistent illustrated character carrying warmth through technical content; (2) copy that talks like an engineer who respects you; (3) notable 2026 practice: fly.io serves a structured agent-briefing page to non-browser user agents.
- Verdict: illustration clashes with the dark-glass material; the copy voice is the closest published match to Alfredo's no-slop rule and worth rereading when copy tickets open. The agent-briefing practice is out of scope for this ticket but worth its own note.

**PlanetScale** (https://planetscale.com)
- Five-second hook: a superlative claim backed immediately by ASCII architecture diagrams and a p95 latency graph - the page proves before it decorates.
- Moves: (1) three progressively complex ASCII sharding diagrams as the primary visuals, pure monospace; (2) "Cost is a unit of scale" reframing pricing as architecture; (3) metric-led sections (latency graph first, then the claim).
- Verdict: the ASCII-diagram move is shortlist 2, near verbatim - it is already in the HQ's material language. The metric-first ordering feeds shortlist 7.

**Coolify** (https://coolify.io)
- Five-second hook: "Self-hosting with superpowers." plus the alternative-anchored sub naming Vercel, Heroku, Netlify, Railway - positioning lands in one read because the anchors are known.
- Moves: (1) named-alternative positioning; (2) Cloud vs Self-hosted split with live customer counts; (3) personality leaks ("Automagically deploy", "oh nooo") in an otherwise plain feature grid.
- Verdict: this is Alfredo's nearest competitor page and it is visually plain - the bar to clear. The alternative-anchoring move feeds shortlist 5; the joke-register clashes with the voice rule.

**Railway** (https://railway.com; fetch served an agent setup briefing)
- What the fetch revealed: Railway serves a full agent-onboarding document to non-browsers - "You are an AI agent reading railway.com... This document is your setup briefing" - with `railway up -y` as the one-shot path. Their visual homepage could not be rendered this pass.
- Verdict: no visual claims made. The agent-briefing pattern is the same surprise as Fly's.

**Supabase** (https://supabase.com; fetch served the llms.txt summary)
- Five-second hook (from the served copy): "Build in a weekend. Scale to millions." - two measurable scales in eight words, plus "open source Firebase alternative" anchoring.
- Verdict: the H1 pattern is the copy benchmark for shortlist 7; no visual claims made from this fetch.

### Indie SaaS

**PostHog** (https://posthog.com)
- Five-second hook: an illustrated mascot and a tone that refuses marketing register ("Shameless CTA", "98% of our customers use PostHog for free").
- Moves: (1) transparency as the growth device - pricing generosity stated as fact; (2) self-aware structure labels; (3) interactive toys (shuffle the customer logos).
- Verdict: mascot and joke-register clash. The transparency instinct feeds shortlist 1: show a true number instead of a claim.

**Amie** (https://www.amie.so)
- Five-second hook: "AI Note Taker without a bot" - definition by negation, then "Within 47 seconds" doing proof work a paragraph could not.
- Moves: (1) hyper-specific metric front-loaded; (2) Today / Day 3 / Day 7 progressive-capability timeline; (3) real email screenshots as workflow proof.
- Verdict: the 47-seconds move is shortlist 7. The day-timeline duplicates Alfredo's two-act structure.

**Reflect** (https://reflect.app)
- Five-second hook: dark hero with a centered product video and a benefit H1 ("Think better with Reflect").
- Moves: (1) alternating dark/light section rhythm; (2) "Wall of love" social proof; (3) single flat price stated early.
- Verdict: competent genre piece; nothing distinctive enough to take.

**Frame.io** (https://frame.io)
- Five-second hook: category-claim H1 over a full product dashboard shot; multiplier stats ("2.9x faster") anchor each section.
- Moves: (1) alternating left/right text-image rhythm; (2) italic emphasis inside section heads; (3) stat callouts as section anchors.
- Verdict: enterprise-polish register clashes; stat-anchoring feeds shortlist 7.

### Pure craft

**Family** (https://family.co; corroboration: https://hero.gallery/hero-gallery/family-wallet, https://benji.org/family-values)
- Five-second hook: "Your favorite crypto wallet." - light, warm, and playful in a category that is uniformly dark and technical; the contrarian material choice is itself the hook.
- Moves: (1) design principles published as doctrine (simplicity, fluidity, delight; text morphs animate shared letters between states); (2) micro-interactions given their own section ("Details that Matter") - the polish is the content; (3) dedicated loading animation treated as a brand surface.
- Verdict: the material is the opposite of the HQ, and that is the lesson - Family wins by total commitment to its chosen material, exactly what the HQ identity is doing with dark glass. The "details as content" instinct endorses shortlist 3 and 4 (spend on micro-tactility, not new sections).

**Teenage Engineering** (https://teenage.engineering)
- Five-second hook: the products are the page - dense modular grid, monochrome, terse lowercase microcopy ("buy now", "riddim n' ting"), zero persuasion copy.
- Moves: (1) spec-sheet register - the page trusts the hardware photography and model numbers completely; (2) hyphenated model naming (OB-4, TP-7, EP-133) as typographic identity.
- Verdict: Alfredo already borrows TE's physical vocabulary (issue #11 called the K variant "borrowed-TE clothing"); the page itself is a store, not a landing page, so its structure does not transfer. Its restraint endorses shortlist 6: the chrome should whisper.

**Daylight** (https://daylightcomputer.com)
- Five-second hook: "The computer, de-invented" over lifestyle photography of the device outdoors - a hardware page selling calm.
- Moves: (1) H1 by inversion of the category verb; (2) mission section (Public Benefit Co.) as copy-forward differentiator.
- Verdict: photography and wellness register clash. The inversion-H1 pattern is worth remembering for future copy but the H1 is locked.

## Notes and surprises for follow-up

- Fly.io and Railway both serve structured agent-briefing pages to non-browser user agents in 2026. Separate from this ticket, Alfredo may eventually want an equivalent (`llms.txt` or agent-routed homepage), since the audience runs agents.
- Godly.website is gone (redirects to recent.design, which 403s fetchers). Landing.love remains a usable gallery; its current front page is dominated by 3D/agency craft with little SaaS relevance this cycle.
- Resend's rebrand post (https://resend.com/blog/rebranding-resend) is the single most useful published doctrine for a physical-material identity like the HQ; worth a full human read.
