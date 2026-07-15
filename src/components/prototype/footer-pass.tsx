// PROTOTYPE — throwaway (wayfinder #32, footer punch). Three treatments of
// the footer, switchable via ?footer=a|b|c on the real page (dev builds
// only, floating switcher stacked above the #31 FAQ switcher):
//   a "Nameplate"  — editorial punch: one oversized wordmark spans the
//                    column and closes the page; beneath it a single
//                    hairline row with the microprint left and the link
//                    row (X, GitHub, Privacy) right.
//   b "Rear panel" — the back of the device: one console glass plate with
//                    seam-divided cells; identity left, socials as labeled
//                    ports with LEDs in the middle, legal as a serial etch
//                    block right.
//   c "Sign-off"   — a dark display strip types a green sign-off
//                    transmission when it scrolls into view (bookending
//                    the hero's boot readout), cursor blinking on the last
//                    line; wordmark and mono link row beneath.
// Social targets: X https://x.com/alperortac; GitHub
// https://github.com/getalfredo (org to be confirmed by the operator).
// New etch strings are directional placeholders and go through copy
// discipline (#14) before any build. Keyboard cycling uses , and .
// (arrows belong to #30, [ and ] to #31). Remove with footer-pass.css.
import { useEffect, useRef, useState } from "react";
import { Wordmark } from "#/components/landing/wordmark";
import "#/components/prototype/footer-pass.css";

export type FooterVariant = "a" | "b" | "c";

const ORDER: (FooterVariant | null)[] = [null, "a", "b", "c"];
const NAMES: Record<FooterVariant, string> = {
	a: "Nameplate",
	b: "Rear panel",
	c: "Sign-off",
};

const X_URL = "https://x.com/alperortac";
const GITHUB_URL = "https://github.com/getalfredo";

/** Reads ?footer= on mount (dev only) and mirrors changes back into the URL. */
export function useFooterPass(): [
	FooterVariant | null,
	(v: FooterVariant | null) => void,
] {
	const [variant, setVariant] = useState<FooterVariant | null>(null);

	useEffect(() => {
		if (import.meta.env.PROD) return;
		const q = new URLSearchParams(window.location.search);
		const v = q.get("footer");
		if (v === "a" || v === "b" || v === "c") setVariant(v);
	}, []);

	const update = (v: FooterVariant | null) => {
		setVariant(v);
		const q = new URLSearchParams(window.location.search);
		if (v === null) q.delete("footer");
		else q.set("footer", v);
		const qs = q.toString();
		window.history.replaceState(
			null,
			"",
			qs ? `?${qs}` : window.location.pathname,
		);
	};

	return [variant, update];
}

export function FooterPass({ variant }: { variant: FooterVariant }) {
	if (variant === "a") return <FooterNameplate />;
	if (variant === "b") return <FooterRearPanel />;
	return <FooterSignOff />;
}

/* --------------------- A — Nameplate ------------------------ */

function FooterNameplate() {
	return (
		<footer className="ftp-nameplate">
			<p className="ftp-nameplate-mark">
				Alfredo
				<span className="ftp-nameplate-led" aria-hidden="true" />
			</p>
			<div className="ftp-nameplate-row">
				<span className="lp-etch lp-microprint">
					THE HOME FOR YOUR PROJECTS · SELF-HOSTED, YOURS FOREVER
				</span>
				<nav className="ftp-nameplate-links" aria-label="Footer">
					<a className="lp-etch ftp-etch-link" href={X_URL}>
						X · @ALPERORTAC
					</a>
					<a className="lp-etch ftp-etch-link" href={GITHUB_URL}>
						GITHUB
					</a>
					<a className="lp-etch ftp-etch-link" href="/privacy">
						PRIVACY
					</a>
				</nav>
			</div>
		</footer>
	);
}

/* --------------------- B — Rear panel ----------------------- */

function FooterRearPanel() {
	return (
		<footer className="ftp-rear">
			<div className="ftp-rear-plate">
				<div className="ftp-rear-cell ftp-rear-ident">
					<Wordmark />
					<span className="lp-etch lp-microprint">
						THE HOME FOR YOUR PROJECTS
					</span>
				</div>
				<div className="ftp-rear-cell">
					<span className="lp-etch ftp-rear-label">CONNECT</span>
					<div className="ftp-rear-ports">
						<a className="ftp-port" href={X_URL}>
							<span className="ftp-port-led" aria-hidden="true" />
							<span className="lp-etch ftp-port-text">X · @ALPERORTAC</span>
						</a>
						<a className="ftp-port" href={GITHUB_URL}>
							<span className="ftp-port-led" aria-hidden="true" />
							<span className="lp-etch ftp-port-text">GITHUB · GETALFREDO</span>
						</a>
					</div>
				</div>
				<div className="ftp-rear-cell">
					<span className="lp-etch ftp-rear-label">PAPERWORK</span>
					<a className="lp-etch ftp-etch-link" href="/privacy">
						PRIVACY
					</a>
					<span className="lp-etch lp-microprint">
						SELF-HOSTED · YOURS FOREVER
					</span>
				</div>
			</div>
		</footer>
	);
}

/* ---------------------- C — Sign-off ------------------------ */

const SIGNOFF_LINES = [
	"alfredo hq · standing by",
	"your servers · one hq · n projects",
	"be there when it boots.",
];

function FooterSignOff() {
	const ref = useRef<HTMLDivElement>(null);
	// Lines typed on scroll into view; reduced motion shows all at once.
	const [shown, setShown] = useState(0);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			setShown(SIGNOFF_LINES.length);
			return;
		}
		let timer: ReturnType<typeof setInterval> | undefined;
		const io = new IntersectionObserver(
			([entry]) => {
				if (!entry.isIntersecting) return;
				io.disconnect();
				timer = setInterval(() => {
					setShown((n) => {
						if (n + 1 >= SIGNOFF_LINES.length) clearInterval(timer);
						return n + 1;
					});
				}, 520);
			},
			{ threshold: 0.4 },
		);
		io.observe(el);
		return () => {
			io.disconnect();
			if (timer) clearInterval(timer);
		};
	}, []);

	return (
		<footer className="ftp-signoff">
			<div className="ftp-signoff-display" ref={ref}>
				{SIGNOFF_LINES.map((line, i) => (
					<p
						key={line}
						className={
							i < shown ? "ftp-signoff-line" : "ftp-signoff-line ftp-hidden"
						}
					>
						<span aria-hidden="true">&gt; </span>
						{line}
						{i === SIGNOFF_LINES.length - 1 && (
							<span className="ftp-cursor" aria-hidden="true" />
						)}
					</p>
				))}
			</div>
			<div className="ftp-signoff-row">
				<Wordmark />
				<nav className="ftp-signoff-links" aria-label="Footer">
					<a className="lp-etch ftp-etch-link" href={X_URL}>
						X · @ALPERORTAC
					</a>
					<a className="lp-etch ftp-etch-link" href={GITHUB_URL}>
						GITHUB
					</a>
					<a className="lp-etch ftp-etch-link" href="/privacy">
						PRIVACY
					</a>
				</nav>
			</div>
		</footer>
	);
}

/* ---------------------- Switcher ----------------------------- */

/** Floating variant switcher: ‹ label ›, , and . keys, dev only. */
export function FooterSwitcher({
	current,
	onChange,
}: {
	current: FooterVariant | null;
	onChange: (v: FooterVariant | null) => void;
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
			if (e.key !== "," && e.key !== ".") return;
			const i = ORDER.indexOf(current);
			const next =
				e.key === "."
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
		<div className="ftp-switcher">
			<button
				type="button"
				onClick={() => cycle(-1)}
				aria-label="Previous footer variant"
			>
				←
			</button>
			<span>
				{current === null
					? "FOOTER: LIVE — current page"
					: `FOOTER ${current.toUpperCase()} — ${NAMES[current]}`}
			</span>
			<button
				type="button"
				onClick={() => cycle(1)}
				aria-label="Next footer variant"
			>
				→
			</button>
		</div>
	);
}
