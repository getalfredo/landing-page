// Gallery (wayfinder #35, variant C "Monitor wall"): a fixed right-edge
// pull-tab opens a full-screen takeover showing every set-piece at once as a
// wall of small monitors (loops playing, live feeds scaled down and inert).
// Clicking a monitor focuses it full size and interactive; ← / → cycle the
// focused feed and Esc steps back (focus → wall → closed). Mounts outside
// <main> as an overlay.
//
// The entry list is the page's real set-pieces after rebuild wave 2: the HQ
// demo and intent switchboard mount live, both wiring loops and the OG
// postcard play from their built assets. Captions are plain-English per the
// #14 voice.
import { type ComponentType, useCallback, useEffect, useState } from "react";
import { HeroDemo } from "#/components/landing/hero-demo";
import { Showcase } from "#/components/landing/showcase";
import { usePrefersReducedMotion } from "#/components/landing/use-prefers-reduced-motion";
import "#/components/landing/gallery.css";

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
};

const ENTRIES: GalleryEntry[] = [
	{
		id: "hq",
		index: "01",
		label: "THE HQ DEMO",
		short: "HQ DEMO",
		kind: "LIVE",
		caption: "The deploy story on a loop. Scrub it right here.",
		Live: HeroDemo,
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

/** Fixed right-edge pull-tab that opens the wall. */
function GalleryTab({ onOpen }: { onOpen: () => void }) {
	return (
		<button type="button" className="gxp-tab" onClick={onOpen}>
			<span className="gxp-tab-led" aria-hidden="true" />
			<span className="lp-etch gxp-tab-label">THE WALL</span>
		</button>
	);
}

/** Capture-phase key handling so overlay arrows/Esc win over the page. */
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

export function Gallery() {
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

	if (!open) return <GalleryTab onOpen={() => setOpen(true)} />;

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
