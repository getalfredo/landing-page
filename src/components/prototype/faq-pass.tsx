// PROTOTYPE — throwaway (wayfinder #31, FAQ treatment). Three treatments of
// the FAQ section, switchable via ?faq=a|b|c on the real page (dev builds
// only, floating switcher stacked above the #30 CTA switcher):
//   a "Accordion panel" — one console glass panel with seam-divided rows;
//                         each row is a button with an etched index and an
//                         LED that lights while open; several rows may be
//                         open at once, the first starts open.
//   b "Open ledger"     — no interaction: a wider two-column ledger, etched
//                         index and question left, answer right, hairline
//                         rows; everything readable at a glance.
//   c "Key and display" — six keycap question keys on a rail; the selected
//                         key sits depressed with a lit LED and its answer
//                         shows in one display window beside the rail.
// Copy is the locked #14 six-question set verbatim (duplicated from
// faq.tsx on purpose — the prototype dies whole). New etch strings are
// directional placeholders and go through copy discipline (#14) before any
// build. Keyboard cycling uses [ and ] (arrows belong to the #30 switcher).
// Remove with faq-pass.css.
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import "#/components/prototype/faq-pass.css";

export type FaqVariant = "a" | "b" | "c";

const ORDER: (FaqVariant | null)[] = [null, "a", "b", "c"];
const NAMES: Record<FaqVariant, string> = {
	a: "Accordion panel",
	b: "Open ledger",
	c: "Key and display",
};

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

/** Reads ?faq= on mount (dev only) and mirrors changes back into the URL. */
export function useFaqPass(): [
	FaqVariant | null,
	(v: FaqVariant | null) => void,
] {
	const [variant, setVariant] = useState<FaqVariant | null>(null);

	useEffect(() => {
		if (import.meta.env.PROD) return;
		const q = new URLSearchParams(window.location.search);
		const v = q.get("faq");
		if (v === "a" || v === "b" || v === "c") setVariant(v);
	}, []);

	const update = (v: FaqVariant | null) => {
		setVariant(v);
		const q = new URLSearchParams(window.location.search);
		if (v === null) q.delete("faq");
		else q.set("faq", v);
		const qs = q.toString();
		window.history.replaceState(
			null,
			"",
			qs ? `?${qs}` : window.location.pathname,
		);
	};

	return [variant, update];
}

export function FaqPass({ variant }: { variant: FaqVariant }) {
	if (variant === "a") return <FaqAccordion />;
	if (variant === "b") return <FaqLedger />;
	return <FaqDeck />;
}

/* ------------------- A — Accordion panel ------------------- */

function FaqAccordion() {
	const [open, setOpen] = useState<ReadonlySet<number>>(new Set([0]));
	const toggle = (i: number) =>
		setOpen((prev) => {
			const next = new Set(prev);
			if (next.has(i)) next.delete(i);
			else next.add(i);
			return next;
		});

	return (
		<section className="lp-section">
			<h2 className="lp-h2">Questions.</h2>
			<div className="fqp-panel">
				{QA.map((item, i) => {
					const isOpen = open.has(i);
					return (
						<div
							key={item.q}
							className={isOpen ? "fqp-row fqp-row-open" : "fqp-row"}
						>
							<button
								type="button"
								className="fqp-row-btn"
								aria-expanded={isOpen}
								onClick={() => toggle(i)}
							>
								<span className="lp-etch fqp-index">{index(i)}</span>
								<span className="fqp-q">{item.q}</span>
								<span className="fqp-led" aria-hidden="true" />
							</button>
							<div className="fqp-fold">
								<div className="fqp-fold-inner">
									<p className="fqp-a">{item.a}</p>
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</section>
	);
}

/* --------------------- B — Open ledger ---------------------- */

function FaqLedger() {
	return (
		<section className="lp-section">
			<h2 className="lp-h2">Questions.</h2>
			<dl className="fqp-ledger">
				{QA.map((item, i) => (
					<div key={item.q} className="fqp-ledger-row">
						<dt className="fqp-ledger-q">
							<span className="lp-etch fqp-index">{index(i)}</span>
							{item.q}
						</dt>
						<dd className="fqp-ledger-a">{item.a}</dd>
					</div>
				))}
			</dl>
		</section>
	);
}

/* ------------------- C — Key and display -------------------- */

function FaqDeck() {
	const [sel, setSel] = useState(0);
	const current = QA[sel];

	return (
		<section className="lp-section">
			<h2 className="lp-h2">Questions.</h2>
			<div className="fqp-deck">
				<div className="fqp-keys">
					{QA.map((item, i) => (
						<button
							key={item.q}
							type="button"
							className={sel === i ? "fqp-key fqp-key-on" : "fqp-key"}
							aria-pressed={sel === i}
							onClick={() => setSel(i)}
						>
							<span className="fqp-key-led" aria-hidden="true" />
							<span>{item.q}</span>
						</button>
					))}
				</div>
				<div className="fqp-display">
					<p className="lp-etch fqp-display-etch">ANSWER · {index(sel)}</p>
					<p className="fqp-display-q">{current.q}</p>
					<p className="fqp-display-a">{current.a}</p>
				</div>
			</div>
		</section>
	);
}

/* ---------------------- Switcher ----------------------------- */

/** Floating variant switcher: ‹ label ›, [ and ] keys, dev only. */
export function FaqSwitcher({
	current,
	onChange,
}: {
	current: FaqVariant | null;
	onChange: (v: FaqVariant | null) => void;
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
		<div className="fqp-switcher">
			<button
				type="button"
				onClick={() => cycle(-1)}
				aria-label="Previous FAQ variant"
			>
				←
			</button>
			<span>
				{current === null
					? "FAQ: LIVE — current page"
					: `FAQ ${current.toUpperCase()} — ${NAMES[current]}`}
			</span>
			<button
				type="button"
				onClick={() => cycle(1)}
				aria-label="Next FAQ variant"
			>
				→
			</button>
		</div>
	);
}
