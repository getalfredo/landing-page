// PROTOTYPE — throwaway (wayfinder #51, etched mono architecture diagram).
// One static ASCII-style topology in IBM Plex Mono, etch color on the dark
// glass, answering the question the page never shows spatially: where does
// everything live. Switchable via ?topo=a|b|c (dev builds only). Rules
// held: plain English only (coined terms stay glossary-local per #34),
// integration labels generic (provider names live in showcase/FAQ),
// secrets excluded from wired lists (invisible wiring, not an integration).
// The three variants disagree on placement AND drawing ambition:
//
//   a "Act coda"      — Day one. The full vertical diagram closes the act
//        below the PatchBay loop: pain copy → payoff → loop → "and here is
//        the map". One server, projects fanning in, HQ below.
//   b "The answer"    — FAQ. A compact diagram inside "Where does it
//        run?": the spatial question gets the spatial answer, nothing
//        else on the page changes. Zero crowding of Day one.
//   c "Blueprint interlude" — a standalone quiet band between Day one and
//        the showcase: widescreen drawing with TWO server boxes (the
//        multi-server fact made literal) captioned by the etched refrain.
//        NOTE: this is the variant that overlaps hardest with the glossary
//        tree (#49) — same picture, plain English vs coined terms. The
//        reconciliation deferred on #49 gets decided with this pick.
//
// Diagram strings are placeholders pending #14 copy discipline at fold-in.
// Remove with topo-pass.css.
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LoopAnchor } from "#/components/landing/loop-anchor";
import { Waypoint } from "#/components/landing/waypoint";
import "#/components/prototype/topo-pass.css";

export type TopoVariant = "a" | "b" | "c";

const ORDER: (TopoVariant | null)[] = [null, "a", "b", "c"];
const NAMES: Record<TopoVariant, string> = {
	a: "Act coda",
	b: "The answer",
	c: "Blueprint interlude",
};

/* ---------------------- variant state ------------------------ */

/** Reads ?topo= on mount (dev only) and mirrors changes back into the URL. */
export function useTopoPass(): [
	TopoVariant | null,
	(v: TopoVariant | null) => void,
] {
	const [variant, setVariant] = useState<TopoVariant | null>(null);

	useEffect(() => {
		if (import.meta.env.PROD) return;
		const q = new URLSearchParams(window.location.search);
		const v = q.get("topo");
		if (v === "a" || v === "b" || v === "c") setVariant(v);
	}, []);

	const update = (v: TopoVariant | null) => {
		setVariant(v);
		const q = new URLSearchParams(window.location.search);
		if (v === null) q.delete("topo");
		else q.set("topo", v);
		const qs = q.toString();
		window.history.replaceState(
			null,
			"",
			qs ? `?${qs}` : window.location.pathname,
		);
	};

	return [variant, update];
}

/* ---------------------- the drawings ------------------------- */
// Plain strings; matching tokens get the green treatment at render so the
// character grid stays intact. Alignment is load-bearing — edit carefully.

const TOPO_FULL = `
     app-one     app-two     app-three
        │           │           │
        └───────────┼───────────┘
                    │  deployed by alfredo
                    ▼
   ┌─ YOUR SERVER ──────────────────────┐
   │                                    │
   │   alfredo · wires everything once  │
   │                                    │
   │   auth · email · database          │
   │   analytics · payments · errors    │
   │   uptime                           │
   │                                    │
   └─────────────────┬──────────────────┘
                     │  all of it reports
                     ▼
              ┌─────────────┐
              │   ONE  HQ   │
              └─────────────┘
               on your server too
`;

const TOPO_MINI = `
    your projects
         │
         ▼
 ┌─ YOUR SERVER ────────────┐
 │  alfredo · wired once    │
 │  auth · email · database │
 │  analytics · payments    │
 └────────────┬─────────────┘
              ▼
            one HQ
`;

const TOPO_WIDE = `
   app-one        app-two        app-three           app-four
      │              │               │                   │
      └──────────────┼───────────────┘                   │
                     ▼                                   ▼
  ┌─ YOUR SERVER 01 ─────────────────┐   ┌─ YOUR SERVER 02 ────────┐
  │  alfredo · wires once            │   │  added when you grew    │
  │  auth · email · database         │   │  payments · uptime      │
  │  analytics · errors              │   │                         │
  └────────────────┬─────────────────┘   └────────────┬────────────┘
                   │             reports              │
                   └───────────────┬──────────────────┘
                                   ▼
                           ┌─────────────┐
                           │   ONE  HQ   │
                           └─────────────┘
`;

const GREEN = /(alfredo|ONE {1,2}HQ|one {1,2}HQ)/g;

function TopoDiagram({ drawing, label }: { drawing: string; label: string }) {
	const parts = drawing.replace(/^\n/, "").split(GREEN);
	return (
		<div className="tpo-scroll">
			<pre className="tpo-pre" role="img" aria-label={label}>
				{/* split() on a capture group interleaves text and matches:
				    odd indices are always the matched tokens */}
				{parts.map((p, i) =>
					i % 2 === 1 ? (
						// biome-ignore lint/suspicious/noArrayIndexKey: static drawing
						<span key={i} className="tpo-green">
							{p}
						</span>
					) : (
						p
					),
				)}
			</pre>
		</div>
	);
}

const DIAGRAM_ALT =
	"Topology diagram: your projects deploy onto your own server, where Alfredo wires auth, email, database, analytics, payments, errors and uptime once; everything reports to one HQ.";

/* ------------- variant a: Day one act coda ------------------- */
// A prototype copy of day-one.tsx with the full diagram closing the act.

export function TopoDayOne() {
	return (
		<section className="lp-section" id="wp-deploy">
			<Waypoint index="01" label="DEPLOY" />
			<h2 className="lp-h2">
				Every new project makes you set up the same boilerplate again.
			</h2>
			<p className="lp-body">
				You have an idea. The waitlist needs email, so you set that up. Sign-ups
				need auth, and auth needs a database. Analytics, because you want to
				know if anyone shows up. Secrets, because the keys have to live
				somewhere. You have built all of this before, and you will build it
				again. Or you rent it: five managed services, five bills, none of it
				yours.
			</p>
			<p className="lp-payoff">
				<strong>Alfredo wires all of it once, on your own server.</strong> Your
				next project is live in minutes.
			</p>
			<LoopAnchor
				src="/generated/wiring-patchbay.mp4"
				poster="/generated/wiring-patchbay-poster.jpg"
				reducedSrc="/generated/wiring-patchbay-reduced-motion.jpg"
				label="Alfredo wiring loop: services are wired at deploy, reused across projects"
			/>
			<div className="tpo-coda">
				<span className="lp-etch tpo-etch">THE MAP</span>
				<TopoDiagram drawing={TOPO_FULL} label={DIAGRAM_ALT} />
			</div>
		</section>
	);
}

/* ------------- variant b: the FAQ answer --------------------- */
// A prototype copy of faq.tsx with the mini diagram inside answer 03.

const QA: { q: string; a: React.ReactNode }[] = [
	{
		q: "What exactly does Alfredo wire?",
		a: (
			<>
				That's a journey you steer. Alfredo starts with Umami for analytics,
				Postmark for email, Convex for the database, Better-Auth for auth, Creem
				for payments, Sentry for errors, GitHub and Uptime Kuma. The lineup
				grows from what you ask for.
			</>
		),
	},
	{
		q: "How does it work?",
		a: (
			<>
				When you deploy a project, Alfredo creates the keys and config each
				integration needs and wires them in automatically. You never copy a
				secret into a .env file again.
			</>
		),
	},
	{
		q: "Where does it run?",
		a: (
			<>
				On your own server. Any VPS you can SSH into works. Alfredo doesn't host
				your projects; you have full control.
			</>
		),
	},
	{
		q: "Is Alfredo open source?",
		a: <>Yes. Self-hosting only counts if you can read what you're hosting.</>,
	},
	{
		q: "What if Alfredo disappears?",
		a: (
			<>
				Your projects won't notice. Everything runs on your server, and the code
				stays open source.
			</>
		),
	},
	{
		q: "What happens with my email?",
		a: (
			<>
				You get{" "}
				<Link className="lp-link" to="/privacy">
					exactly one email
				</Link>
				: the one that says Alfredo is live. Be one of the first inside.
			</>
		),
	},
];

const index = (i: number) => String(i + 1).padStart(2, "0");

export function TopoFaq() {
	const [open, setOpen] = useState(2); // open on the diagram's row

	return (
		<section className="lp-section" id="wp-questions">
			<Waypoint index="06" label="QUESTIONS" />
			<h2 className="lp-h2">Questions.</h2>
			<div className="lp-faq-panel">
				{QA.map((item, i) => {
					const isOpen = open === i;
					return (
						<div
							key={item.q}
							className={isOpen ? "lp-faq-row lp-faq-row-open" : "lp-faq-row"}
						>
							<button
								type="button"
								className="lp-faq-row-btn"
								aria-expanded={isOpen}
								onClick={() => setOpen(i)}
							>
								<span className="lp-etch lp-faq-index">{index(i)}</span>
								<span className="lp-faq-q">{item.q}</span>
								<span className="lp-faq-led" aria-hidden="true" />
							</button>
							<div className="lp-faq-fold">
								<div className="lp-faq-fold-inner">
									<p className="lp-faq-a">{item.a}</p>
									{i === 2 && (
										<div className="tpo-faq-diagram">
											<TopoDiagram drawing={TOPO_MINI} label={DIAGRAM_ALT} />
										</div>
									)}
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</section>
	);
}

/* ------------- variant c: blueprint interlude ---------------- */
// A standalone quiet band between Day one and the showcase. No waypoint,
// no minimap station — an unnumbered divider (fold-in decides whether it
// earns a station; if it does, later waypoints renumber).

export function TopoInterlude() {
	return (
		<section className="tpo-interlude" aria-label="Where everything lives">
			<div className="tpo-interlude-glass">
				<TopoDiagram drawing={TOPO_WIDE} label={DIAGRAM_ALT} />
				<span className="lp-etch tpo-etch tpo-interlude-caption">
					YOUR SERVERS · ONE HQ · N PROJECTS
				</span>
			</div>
		</section>
	);
}

/* ---------------------- switcher bar ------------------------- */

export function TopoSwitcher({
	current,
	onChange,
}: {
	current: TopoVariant | null;
	onChange: (v: TopoVariant | null) => void;
}) {
	useEffect(() => {
		if (import.meta.env.PROD) return;
		const onKey = (e: KeyboardEvent) => {
			const t = e.target as HTMLElement | null;
			if (
				t &&
				(t.tagName === "INPUT" ||
					t.tagName === "TEXTAREA" ||
					t.isContentEditable)
			)
				return;
			if (e.key !== "[" && e.key !== "]") return;
			const i = ORDER.indexOf(current);
			const next =
				e.key === "]"
					? ORDER[(i + 1) % ORDER.length]
					: ORDER[(i - 1 + ORDER.length) % ORDER.length];
			onChange(next);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [current, onChange]);

	if (import.meta.env.PROD) return null;

	const cycle = (dir: 1 | -1) => {
		const i = ORDER.indexOf(current);
		onChange(ORDER[(i + dir + ORDER.length) % ORDER.length]);
	};

	return (
		<div className="tpo-switcher">
			<button
				type="button"
				onClick={() => cycle(-1)}
				aria-label="Previous topology variant"
			>
				←
			</button>
			<span>
				{current === null
					? "TOPO: OFF — [ ] to flip"
					: `TOPO ${current.toUpperCase()} — ${NAMES[current]}`}
			</span>
			<button
				type="button"
				onClick={() => cycle(1)}
				aria-label="Next topology variant"
			>
				→
			</button>
		</div>
	);
}
