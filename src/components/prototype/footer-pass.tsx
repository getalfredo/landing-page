// PROTOTYPE — throwaway (wayfinder #32, footer punch). Round 2: the
// operator picked A "Nameplate"; the set is now four variations of the
// oversized-wordmark close, switchable via ?footer=a|b|c|d on the real
// page (dev builds only, floating switcher stacked above the #31 FAQ
// switcher). Round-1 rejects (rear panel, sign-off) live in git history.
//   a "Nameplate"     — round-1 original: left-aligned giant wordmark with
//                       a breathing LED dot; hairline row beneath with the
//                       microprint left and the link row right.
//   b "Engraved"      — same layout, but the name is milled into the
//                       chassis: stroke-only letters, no fill; the LED is
//                       the only thing still lit.
//   c "Baseline crop" — the link row moves above the name and the giant
//                       wordmark sinks below the page edge, cut mid-letter;
//                       the page ends inside the name.
//   d "Monument"      — centered stack: microprint etch on top, giant
//                       centered wordmark, link row centered beneath.
// Social targets: X https://x.com/alperortac; GitHub
// https://github.com/getalfredo (org to be confirmed by the operator).
// New etch strings are directional placeholders and go through copy
// discipline (#14) before any build. Keyboard cycling uses , and .
// (arrows belong to #30, [ and ] to #31). Remove with footer-pass.css.
import { useEffect, useState } from "react";
import "#/components/prototype/footer-pass.css";

export type FooterVariant = "a" | "b" | "c" | "d";

const ORDER: (FooterVariant | null)[] = [null, "a", "b", "c", "d"];
const NAMES: Record<FooterVariant, string> = {
	a: "Nameplate",
	b: "Engraved",
	c: "Baseline crop",
	d: "Monument",
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
		if (v === "a" || v === "b" || v === "c" || v === "d") setVariant(v);
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
	if (variant === "b") return <FooterEngraved />;
	if (variant === "c") return <FooterBaselineCrop />;
	return <FooterMonument />;
}

/* ------------------ shared nameplate pieces ------------------ */

function NameplateMark() {
	return (
		<p className="ftp-nameplate-mark">
			Alfredo
			<span className="ftp-nameplate-led" aria-hidden="true" />
		</p>
	);
}

function NameplateLinks() {
	return (
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
	);
}

const MICROPRINT = "THE HOME FOR YOUR PROJECTS · SELF-HOSTED, YOURS FOREVER";

/* --------------------- A — Nameplate ------------------------ */

function FooterNameplate() {
	return (
		<footer className="ftp-nameplate">
			<NameplateMark />
			<div className="ftp-nameplate-row">
				<span className="lp-etch lp-microprint">{MICROPRINT}</span>
				<NameplateLinks />
			</div>
		</footer>
	);
}

/* ---------------------- B — Engraved ------------------------ */

function FooterEngraved() {
	return (
		<footer className="ftp-nameplate ftp-engraved">
			<NameplateMark />
			<div className="ftp-nameplate-row">
				<span className="lp-etch lp-microprint">{MICROPRINT}</span>
				<NameplateLinks />
			</div>
		</footer>
	);
}

/* ------------------- C — Baseline crop ----------------------- */

function FooterBaselineCrop() {
	return (
		<footer className="ftp-nameplate ftp-crop">
			<div className="ftp-nameplate-row ftp-crop-row">
				<span className="lp-etch lp-microprint">{MICROPRINT}</span>
				<NameplateLinks />
			</div>
			<div className="ftp-crop-window">
				<NameplateMark />
			</div>
		</footer>
	);
}

/* ---------------------- D — Monument ------------------------- */

function FooterMonument() {
	return (
		<footer className="ftp-nameplate ftp-monument">
			<span className="lp-etch lp-microprint">{MICROPRINT}</span>
			<NameplateMark />
			<NameplateLinks />
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
