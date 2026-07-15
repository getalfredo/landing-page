// PROTOTYPE — throwaway (wayfinder #35, gallery). Three variants of a
// "flip through every set-piece" gallery, switchable via ?gallery=a|b|c on
// the real page (dev builds only, floating switcher stacked above the #32
// footer switcher, keyboard - and =).
//   a "Reel"         — overlay lightbox: a fixed right-edge pull-tab opens a
//                      full-screen carousel with one big stage, side arrow
//                      keys, a bottom thumbnail rail, and etched captions.
//                      Live entries (HQ demo, switchboard) mount live and
//                      stay fully interactive inside the stage.
//   b "Archive"      — dedicated in-page section after the founder note: a
//                      scroll-snap filmstrip of framed slides, prev/next
//                      keycaps, caption plates. Live entries do NOT embed;
//                      they show an etched LIVE FEED plate with an amber
//                      "SEE IT LIVE" key that jumps to the real section.
//   c "Monitor wall" — full-screen takeover: every entry at once as a wall
//                      of small monitors (loops playing, live feeds scaled
//                      down and inert); clicking a monitor focuses it full
//                      size (interactive), arrows cycle, Esc steps back.
// Entries are the real assets available today (HQ demo, both wiring loops,
// intent switchboard, OG frame); captions are directional placeholders and
// go through copy discipline (#14) before any build. The final entry list
// is wired at build (#26/#29 assets land later). Remove with
// gallery-pass.css.
import {
	type ComponentType,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import { HeroDemo } from "#/components/landing/hero-demo";
import { Showcase } from "#/components/landing/showcase";
import { usePrefersReducedMotion } from "#/components/landing/use-prefers-reduced-motion";
import "#/components/prototype/gallery-pass.css";

export type GalleryVariant = "a" | "b" | "c";

const ORDER: (GalleryVariant | null)[] = [null, "a", "b", "c"];
const NAMES: Record<GalleryVariant, string> = {
	a: "Reel",
	b: "Archive",
	c: "Monitor wall",
};

/* ---------------------- content model ------------------------ */

type EntryKind = "LIVE" | "LOOP" | "STILL";

type GalleryEntry = {
	id: string;
	index: string;
	label: string;
	short: string;
	kind: EntryKind;
	caption: string;
	src?: string;
	poster?: string;
	reducedSrc?: string;
	Live?: ComponentType;
	jumpTo?: string;
};

const ENTRIES: GalleryEntry[] = [
	{
		id: "hq",
		index: "01",
		label: "THE HQ DEMO",
		short: "HQ DEMO",
		kind: "LIVE",
		caption: "The deploy story, playable. Click through it right here.",
		Live: HeroDemo,
		jumpTo: ".lp-hero",
	},
	{
		id: "patchbay",
		index: "02",
		label: "DAY ONE · PATCH BAY",
		short: "PATCH BAY",
		kind: "LOOP",
		caption: "Running services wire themselves into every new project.",
		src: "/generated/wiring-patchbay.mp4",
		poster: "/generated/wiring-patchbay-poster.jpg",
		reducedSrc: "/generated/wiring-patchbay-reduced-motion.jpg",
	},
	{
		id: "lanes",
		index: "03",
		label: "EVERY DAY AFTER · LANES",
		short: "LANES",
		kind: "LOOP",
		caption: "Projects come and go. The lanes keep running.",
		src: "/generated/wiring-lanes.mp4",
		poster: "/generated/wiring-lanes-poster.jpg",
		reducedSrc: "/generated/wiring-lanes-reduced-motion.jpg",
	},
	{
		id: "switchboard",
		index: "04",
		label: "INTENT SWITCHBOARD",
		short: "SWITCHBOARD",
		kind: "LIVE",
		caption: "Four intents, every project, one glass.",
		Live: Showcase,
		jumpTo: 'section[aria-label="Inside the headquarters"]',
	},
	{
		id: "og",
		index: "05",
		label: "THE POSTCARD",
		short: "POSTCARD",
		kind: "STILL",
		caption: "The frame your link shows before anyone clicks.",
		src: "/generated/og.png",
	},
];

/* ---------------------- variant state ------------------------ */

/** Reads ?gallery= on mount (dev only) and mirrors changes back into the URL. */
export function useGalleryPass(): [
	GalleryVariant | null,
	(v: GalleryVariant | null) => void,
] {
	const [variant, setVariant] = useState<GalleryVariant | null>(null);

	useEffect(() => {
		if (import.meta.env.PROD) return;
		const q = new URLSearchParams(window.location.search);
		const v = q.get("gallery");
		if (v === "a" || v === "b" || v === "c") setVariant(v);
	}, []);

	const update = (v: GalleryVariant | null) => {
		setVariant(v);
		const q = new URLSearchParams(window.location.search);
		if (v === null) q.delete("gallery");
		else q.set("gallery", v);
		const qs = q.toString();
		window.history.replaceState(
			null,
			"",
			qs ? `?${qs}` : window.location.pathname,
		);
	};

	return [variant, update];
}

/* --------------------- shared pieces ------------------------- */

/** Renders a LOOP or STILL entry's media; LIVE entries are the caller's job. */
function EntryMedia({
	entry,
	playing,
}: {
	entry: GalleryEntry;
	playing: boolean;
}) {
	const reduced = usePrefersReducedMotion();
	if (entry.kind === "STILL")
		return <img className="gxp-media" src={entry.src} alt={entry.label} />;
	if (reduced || !playing)
		return (
			<img
				className="gxp-media"
				src={reduced ? entry.reducedSrc : entry.poster}
				alt={entry.label}
			/>
		);
	return (
		<video
			className="gxp-media"
			src={entry.src}
			poster={entry.poster}
			autoPlay
			muted
			loop
			playsInline
		/>
	);
}

function KindTag({ kind }: { kind: EntryKind }) {
	return (
		<span className={`lp-etch gxp-kind gxp-kind-${kind.toLowerCase()}`}>
			{kind === "LIVE" ? (
				<>
					<span className="gxp-kind-led" aria-hidden="true" /> LIVE
				</>
			) : (
				kind
			)}
		</span>
	);
}

/** Neutralized wrapper so full sections (Showcase) sit flat inside a stage. */
function LiveMount({ entry }: { entry: GalleryEntry }) {
	const Live = entry.Live;
	if (!Live) return null;
	return (
		<div className="gxp-live" data-entry={entry.id}>
			<Live />
		</div>
	);
}

/** Fixed right-edge pull-tab that opens the overlay variants. */
function GalleryTab({ label, onOpen }: { label: string; onOpen: () => void }) {
	return (
		<button type="button" className="gxp-tab" onClick={onOpen}>
			<span className="gxp-tab-led" aria-hidden="true" />
			<span className="lp-etch gxp-tab-label">{label}</span>
		</button>
	);
}

/** Capture-phase key handling so overlay arrows beat the #30 switcher. */
function useOverlayKeys(handler: (key: string) => boolean) {
	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			const t = e.target as HTMLElement | null;
			if (
				t &&
				(t.tagName === "INPUT" ||
					t.tagName === "TEXTAREA" ||
					t.isContentEditable)
			)
				return;
			if (handler(e.key)) {
				e.preventDefault();
				e.stopPropagation();
			}
		};
		window.addEventListener("keydown", onKey, { capture: true });
		return () =>
			window.removeEventListener("keydown", onKey, { capture: true });
	}, [handler]);
}

function useBodyScrollLock(locked: boolean) {
	useEffect(() => {
		if (!locked) return;
		const prev = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = prev;
		};
	}, [locked]);
}

/* ----------------------- A — Reel ----------------------------- */

function GalleryReel() {
	const [open, setOpen] = useState(false);
	const [idx, setIdx] = useState(0);
	const entry = ENTRIES[idx];

	const step = useCallback((dir: 1 | -1) => {
		setIdx((i) => (i + dir + ENTRIES.length) % ENTRIES.length);
	}, []);

	useOverlayKeys(
		useCallback(
			(key: string) => {
				if (!open) return false;
				if (key === "Escape") {
					setOpen(false);
					return true;
				}
				if (key === "ArrowRight") {
					step(1);
					return true;
				}
				if (key === "ArrowLeft") {
					step(-1);
					return true;
				}
				return false;
			},
			[open, step],
		),
	);
	useBodyScrollLock(open);

	if (!open)
		return <GalleryTab label="THE REEL" onOpen={() => setOpen(true)} />;

	return (
		<div className="gxp-overlay" role="dialog" aria-label="Gallery">
			<button
				type="button"
				className="gxp-scrim"
				aria-label="Close gallery"
				onClick={() => setOpen(false)}
			/>
			<div className="gxp-reel">
				<div className="gxp-reel-head">
					<span className="lp-etch gxp-head-label">
						{entry.index} · {entry.label}
					</span>
					<span className="gxp-head-right">
						<KindTag kind={entry.kind} />
						<span className="lp-etch gxp-counter">
							{entry.index} / {String(ENTRIES.length).padStart(2, "0")}
						</span>
						<button
							type="button"
							className="gxp-key gxp-key-close"
							onClick={() => setOpen(false)}
							aria-label="Close gallery"
						>
							✕
						</button>
					</span>
				</div>
				<div className="gxp-reel-stage">
					<button
						type="button"
						className="gxp-key gxp-arrow"
						onClick={() => step(-1)}
						aria-label="Previous entry"
					>
						←
					</button>
					<div className="gxp-stage-body">
						{entry.kind === "LIVE" ? (
							<LiveMount entry={entry} />
						) : (
							<EntryMedia entry={entry} playing />
						)}
					</div>
					<button
						type="button"
						className="gxp-key gxp-arrow"
						onClick={() => step(1)}
						aria-label="Next entry"
					>
						→
					</button>
				</div>
				<p className="gxp-caption">{entry.caption}</p>
				<div className="gxp-rail" role="tablist" aria-label="Gallery entries">
					{ENTRIES.map((e, i) => (
						<button
							key={e.id}
							type="button"
							role="tab"
							aria-selected={i === idx}
							className={`gxp-rail-cap${i === idx ? " gxp-rail-cap-on" : ""}`}
							onClick={() => setIdx(i)}
						>
							<span
								className={`gxp-cap-led${i === idx ? " gxp-cap-led-on" : ""}`}
								aria-hidden="true"
							/>
							<span className="gxp-cap-index">{e.index}</span>
							<span className="gxp-cap-label">{e.short}</span>
						</button>
					))}
				</div>
			</div>
		</div>
	);
}

/* ---------------------- B — Archive --------------------------- */

export function GalleryArchive() {
	const stripRef = useRef<HTMLDivElement>(null);

	const scrollByCard = (dir: 1 | -1) => {
		const strip = stripRef.current;
		if (!strip) return;
		const card = strip.querySelector<HTMLElement>(".gxp-card");
		strip.scrollBy({
			left: dir * ((card?.offsetWidth ?? 640) + 24),
			behavior: "smooth",
		});
	};

	const jump = (selector: string) => {
		document.querySelector(selector)?.scrollIntoView({ behavior: "smooth" });
	};

	return (
		<section className="lp-section gxp-archive" aria-label="The reel">
			<div className="gxp-archive-head">
				<div>
					<h2 className="lp-h2">Every screen on this page.</h2>
					<p className="lp-sub gxp-archive-sub">
						The demos, loops, and frames in one strip. Flip through.
					</p>
				</div>
				<div className="gxp-archive-nav">
					<button
						type="button"
						className="gxp-key"
						onClick={() => scrollByCard(-1)}
						aria-label="Scroll gallery back"
					>
						←
					</button>
					<button
						type="button"
						className="gxp-key"
						onClick={() => scrollByCard(1)}
						aria-label="Scroll gallery forward"
					>
						→
					</button>
				</div>
			</div>
			<div className="gxp-strip" ref={stripRef}>
				{ENTRIES.map((e) => (
					<figure className="gxp-card" key={e.id}>
						<div className="gxp-card-media">
							{e.kind === "LIVE" ? (
								<div className="gxp-live-plate">
									<span className="gxp-plate-index" aria-hidden="true">
										{e.index}
									</span>
									<span className="lp-etch gxp-plate-etch">
										<span className="gxp-kind-led" aria-hidden="true" /> LIVE
										FEED · RUNNING ON THIS PAGE
									</span>
									{e.jumpTo && (
										<button
											type="button"
											className="gxp-jump-key"
											onClick={() => jump(e.jumpTo as string)}
										>
											SEE IT LIVE
										</button>
									)}
								</div>
							) : (
								<EntryMedia entry={e} playing />
							)}
						</div>
						<figcaption className="gxp-card-plate">
							<span className="gxp-card-plate-row">
								<span className="lp-etch gxp-head-label">
									{e.index} · {e.label}
								</span>
								<KindTag kind={e.kind} />
							</span>
							<span className="gxp-caption gxp-card-caption">{e.caption}</span>
						</figcaption>
					</figure>
				))}
			</div>
		</section>
	);
}

/* -------------------- C — Monitor wall ------------------------ */

function GalleryWall() {
	const [open, setOpen] = useState(false);
	const [focus, setFocus] = useState<number | null>(null);
	const entry = focus === null ? null : ENTRIES[focus];

	const step = useCallback((dir: 1 | -1) => {
		setFocus((f) =>
			f === null ? 0 : (f + dir + ENTRIES.length) % ENTRIES.length,
		);
	}, []);

	useOverlayKeys(
		useCallback(
			(key: string) => {
				if (!open) return false;
				if (key === "Escape") {
					if (focus !== null) setFocus(null);
					else setOpen(false);
					return true;
				}
				if (focus !== null && key === "ArrowRight") {
					step(1);
					return true;
				}
				if (focus !== null && key === "ArrowLeft") {
					step(-1);
					return true;
				}
				return false;
			},
			[open, focus, step],
		),
	);
	useBodyScrollLock(open);

	if (!open)
		return <GalleryTab label="THE WALL" onOpen={() => setOpen(true)} />;

	return (
		<div className="gxp-overlay" role="dialog" aria-label="Monitor wall">
			<button
				type="button"
				className="gxp-scrim"
				aria-label="Close monitor wall"
				onClick={() => setOpen(false)}
			/>
			<div className="gxp-wall">
				<div className="gxp-reel-head">
					<span className="lp-etch gxp-head-label">
						EVERY SCREEN · {String(ENTRIES.length).padStart(2, "0")} FEEDS
					</span>
					<span className="gxp-head-right">
						{entry && (
							<button
								type="button"
								className="gxp-key gxp-key-back"
								onClick={() => setFocus(null)}
							>
								BACK TO WALL
							</button>
						)}
						<button
							type="button"
							className="gxp-key gxp-key-close"
							onClick={() => setOpen(false)}
							aria-label="Close monitor wall"
						>
							✕
						</button>
					</span>
				</div>
				{entry === null ? (
					<div className="gxp-wall-grid">
						{ENTRIES.map((e, i) => (
							// biome-ignore lint/a11y/useSemanticElements: live feeds contain buttons of their own; nesting them inside a <button> is invalid HTML (hydration error)
							<div
								key={e.id}
								role="button"
								tabIndex={0}
								className="gxp-monitor"
								onClick={() => setFocus(i)}
								onKeyDown={(ev) => {
									if (ev.key === "Enter" || ev.key === " ") {
										ev.preventDefault();
										setFocus(i);
									}
								}}
							>
								<span className="gxp-monitor-head">
									<span className="lp-etch gxp-monitor-label">
										{e.index} · {e.short}
									</span>
									<KindTag kind={e.kind} />
								</span>
								<span className="gxp-monitor-body">
									{e.kind === "LIVE" ? (
										<span className="gxp-monitor-live" aria-hidden="true">
											<LiveMount entry={e} />
										</span>
									) : (
										<EntryMedia entry={e} playing />
									)}
								</span>
							</div>
						))}
					</div>
				) : (
					<>
						<div className="gxp-reel-stage">
							<button
								type="button"
								className="gxp-key gxp-arrow"
								onClick={() => step(-1)}
								aria-label="Previous feed"
							>
								←
							</button>
							<div className="gxp-stage-body">
								{entry.kind === "LIVE" ? (
									<LiveMount entry={entry} />
								) : (
									<EntryMedia entry={entry} playing />
								)}
							</div>
							<button
								type="button"
								className="gxp-key gxp-arrow"
								onClick={() => step(1)}
								aria-label="Next feed"
							>
								→
							</button>
						</div>
						<p className="gxp-caption">
							{entry.index} · {entry.caption}
						</p>
					</>
				)}
			</div>
		</div>
	);
}

/* --------------------- pass mount ----------------------------- */

/** Overlay variants (a, c) mount outside <main>; b mounts as a section. */
export function GalleryPass({ variant }: { variant: GalleryVariant }) {
	if (variant === "a") return <GalleryReel />;
	if (variant === "c") return <GalleryWall />;
	return null;
}

/* ---------------------- Switcher ----------------------------- */

/** Floating variant switcher: ‹ label ›, - and = keys, dev only. */
export function GallerySwitcher({
	current,
	onChange,
}: {
	current: GalleryVariant | null;
	onChange: (v: GalleryVariant | null) => void;
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
			if (e.key !== "-" && e.key !== "=") return;
			const i = ORDER.indexOf(current);
			const next =
				e.key === "="
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
		<div className="gxp-switcher">
			<button
				type="button"
				onClick={() => cycle(-1)}
				aria-label="Previous gallery variant"
			>
				←
			</button>
			<span>
				{current === null
					? "GALLERY: OFF — current page"
					: `GALLERY ${current.toUpperCase()} — ${NAMES[current]}`}
			</span>
			<button
				type="button"
				onClick={() => cycle(1)}
				aria-label="Next gallery variant"
			>
				→
			</button>
		</div>
	);
}
