// PROTOTYPE — three OG share-image candidates (1200×630) for wayfinder #21.
// Each frame renders at native size and is scaled down; a thumbnail column
// approximates the X/Discord card size to judge legibility. Throwaway.
import type { CSSProperties, ReactNode } from "react";

const ink = {
	bg: "#14150e",
	panel: "#1e1f16",
	surface: "#191a11",
	seam: "rgba(236, 231, 218, 0.1)",
	paper: "#ece7da",
	paperSoft: "#97927f",
	led: "#3bd23b",
	ledGlow: "rgba(59, 210, 59, 0.75)",
	ledOff: "#3a3b30",
	amber: "#ffd23c",
	displayBg: "#0d0e08",
};

const fontDisplay = '"Space Grotesk", sans-serif';
const fontMono = '"IBM Plex Mono", monospace';

function Etch({
	children,
	size = 15,
	style,
}: {
	children: ReactNode;
	size?: number;
	style?: CSSProperties;
}) {
	return (
		<span
			style={{
				fontFamily: fontMono,
				fontSize: size,
				letterSpacing: "0.22em",
				textTransform: "uppercase",
				color: ink.paperSoft,
				...style,
			}}
		>
			{children}
		</span>
	);
}

function Led({ size = 14 }: { size?: number }) {
	return (
		<span
			style={{
				display: "inline-block",
				width: size,
				height: size,
				borderRadius: "50%",
				background: ink.led,
				boxShadow: `0 0 ${size}px ${ink.ledGlow}`,
				flexShrink: 0,
			}}
		/>
	);
}

function Wordmark({ size = 34 }: { size?: number }) {
	return (
		<span
			style={{
				display: "inline-flex",
				alignItems: "center",
				gap: size * 0.35,
				fontFamily: fontDisplay,
				fontWeight: 700,
				fontSize: size,
				color: ink.paper,
			}}
		>
			Alfredo
			<Led size={size * 0.38} />
		</span>
	);
}

// Shared outer shell: dark-glass panel with bezel seams on a charcoal ground.
function Frame({ children }: { children: ReactNode }) {
	return (
		<div
			style={{
				width: 1200,
				height: 630,
				background: ink.bg,
				position: "relative",
				overflow: "hidden",
				display: "flex",
				flexDirection: "column",
			}}
		>
			<div
				style={{
					position: "absolute",
					inset: 26,
					background: ink.surface,
					border: `1px solid ${ink.seam}`,
					borderRadius: 18,
					boxShadow: "inset 0 4px 24px rgba(0, 0, 0, 0.6)",
					display: "flex",
					flexDirection: "column",
					overflow: "hidden",
				}}
			>
				{children}
			</div>
		</div>
	);
}

function BottomRefrain() {
	return (
		<div
			style={{
				padding: "0 0 30px",
				display: "flex",
				justifyContent: "center",
			}}
		>
			<Etch size={14} style={{ opacity: 0.8 }}>
				YOUR SERVERS · ONE HQ · N PROJECTS
			</Etch>
		</div>
	);
}

// ── Option 1: type-only ────────────────────────────────────────────────────
function FrameTypeOnly() {
	return (
		<Frame>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					padding: "34px 48px 0",
				}}
			>
				<Wordmark />
				<Etch size={14}>SELF-HOSTED</Etch>
			</div>
			<div
				style={{
					flex: 1,
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					padding: "0 48px",
					gap: 10,
				}}
			>
				<div
					style={{
						fontFamily: fontDisplay,
						fontWeight: 700,
						fontSize: 62,
						lineHeight: 1.14,
						color: ink.paper,
						letterSpacing: "-0.01em",
					}}
				>
					Ship your next SaaS in minutes.
					<br />
					Watch them all from <span style={{ color: ink.amber }}>one HQ</span>.
				</div>
			</div>
			<BottomRefrain />
		</Frame>
	);
}

// ── Option 2: type + dashboard glimpse bleeding off the right edge ────────
function MockTile({
	label,
	num,
	note,
}: {
	label: string;
	num: string;
	note: string;
}) {
	return (
		<div
			style={{
				background: ink.panel,
				border: `1px solid ${ink.seam}`,
				borderRadius: 10,
				padding: "14px 18px",
				display: "flex",
				flexDirection: "column",
				gap: 4,
				minWidth: 150,
			}}
		>
			<Etch size={11}>{label}</Etch>
			<span
				style={{
					fontFamily: fontDisplay,
					fontWeight: 700,
					fontSize: 30,
					color: ink.paper,
				}}
			>
				{num}
			</span>
			<span
				style={{ fontFamily: fontMono, fontSize: 12, color: ink.paperSoft }}
			>
				{note}
			</span>
		</div>
	);
}

function FrameTypeGlimpse() {
	return (
		<Frame>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					padding: "34px 48px 0",
				}}
			>
				<Wordmark />
				<Etch size={14}>SELF-HOSTED</Etch>
			</div>
			<div
				style={{
					flex: 1,
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					padding: "0 48px",
					gap: 10,
					maxWidth: 760,
				}}
			>
				<div
					style={{
						fontFamily: fontDisplay,
						fontWeight: 700,
						fontSize: 58,
						lineHeight: 1.14,
						color: ink.paper,
						letterSpacing: "-0.01em",
					}}
				>
					Ship your next SaaS in minutes. Watch them all from{" "}
					<span style={{ color: ink.amber }}>one HQ</span>.
				</div>
			</div>
			{/* dashboard glimpse, bleeding off bottom-right */}
			<div
				style={{
					position: "absolute",
					right: -60,
					bottom: -40,
					width: 460,
					background: ink.displayBg,
					border: `1px solid ${ink.seam}`,
					borderRadius: 14,
					padding: 22,
					display: "flex",
					flexDirection: "column",
					gap: 14,
					boxShadow: "0 -8px 40px rgba(0,0,0,0.55)",
				}}
			>
				<div style={{ display: "flex", justifyContent: "space-between" }}>
					<Etch size={11}>HQ / DASHBOARD</Etch>
					<Etch size={11}>SIMULATED DATA</Etch>
				</div>
				<div style={{ display: "flex", gap: 12 }}>
					<MockTile label="TRAFFIC" num="48.2k" note="req · 4 apps" />
					<MockTile label="MAIL" num="1,204" note="sent · 3 bounced" />
				</div>
				<div style={{ display: "flex", gap: 12 }}>
					<MockTile label="UPTIME" num="100%" note="all projects up" />
					<MockTile label="ERRORS" num="2" note="1 new today" />
				</div>
			</div>
			<BottomRefrain />
		</Frame>
	);
}

// ── Option 3: wordmark monolith ────────────────────────────────────────────
function FrameMonolith() {
	return (
		<Frame>
			<div
				style={{
					flex: 1,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					gap: 26,
				}}
			>
				<span
					style={{
						display: "inline-flex",
						alignItems: "center",
						gap: 34,
						fontFamily: fontDisplay,
						fontWeight: 700,
						fontSize: 150,
						color: ink.paper,
						letterSpacing: "-0.02em",
					}}
				>
					Alfredo
					<Led size={52} />
				</span>
				<Etch size={20}>THE HOME FOR YOUR PROJECTS</Etch>
			</div>
			<BottomRefrain />
		</Frame>
	);
}

// ── Revised: big bottom-centered dashboard, cut off at the frame edge ─────
function DashboardStrip() {
	return (
		<div
			style={{
				position: "absolute",
				bottom: -110,
				left: "50%",
				transform: "translateX(-50%)",
				width: 880,
				background: ink.displayBg,
				border: `1px solid ${ink.seam}`,
				borderRadius: 16,
				padding: 26,
				display: "flex",
				flexDirection: "column",
				gap: 16,
				boxShadow: "0 -10px 50px rgba(0,0,0,0.6)",
			}}
		>
			<div style={{ display: "flex", justifyContent: "space-between" }}>
				<Etch size={12}>HQ / DASHBOARD</Etch>
				<Etch size={12}>4 PROJECTS · ALL UP</Etch>
				<Etch size={12}>SIMULATED DATA</Etch>
			</div>
			<div style={{ display: "flex", gap: 14 }}>
				<MockTile label="TRAFFIC" num="48.2k" note="req · 4 apps" />
				<MockTile label="MAIL" num="1,204" note="sent · 3 bounced" />
				<MockTile label="PAYMENTS" num="€ 2,410" note="top: invoicer" />
				<MockTile label="ERRORS" num="2" note="1 new today" />
			</div>
			{/* project cards, deliberately cut off by the frame edge */}
			<div style={{ display: "flex", gap: 14 }}>
				{["my-saas", "invoicer", "blog"].map((name) => (
					<div
						key={name}
						style={{
							flex: 1,
							background: ink.panel,
							border: `1px solid ${ink.seam}`,
							borderRadius: 10,
							padding: "12px 16px",
							display: "flex",
							alignItems: "center",
							gap: 10,
						}}
					>
						<Led size={9} />
						<span
							style={{
								fontFamily: fontMono,
								fontSize: 15,
								color: ink.paper,
							}}
						>
							{name}
						</span>
					</div>
				))}
			</div>
		</div>
	);
}

// Option 4: centered H1 up top, dashboard strip below.
function FrameH1Dashboard() {
	return (
		<Frame>
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					padding: "36px 48px 0",
				}}
			>
				<Wordmark size={30} />
			</div>
			<div
				style={{
					paddingTop: 34,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					gap: 6,
					textAlign: "center",
				}}
			>
				<div
					style={{
						fontFamily: fontDisplay,
						fontWeight: 700,
						fontSize: 60,
						lineHeight: 1.16,
						color: ink.paper,
						letterSpacing: "-0.01em",
					}}
				>
					Ship your next SaaS in minutes.
					<br />
					Watch them all from <span style={{ color: ink.amber }}>one HQ</span>.
				</div>
			</div>
			<DashboardStrip />
		</Frame>
	);
}

// Option 5: monolith wordmark up top, readable etch, dashboard strip below.
function FrameMonolithDashboard() {
	return (
		<Frame>
			<div
				style={{
					paddingTop: 44,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					gap: 18,
				}}
			>
				<span
					style={{
						display: "inline-flex",
						alignItems: "center",
						gap: 26,
						fontFamily: fontDisplay,
						fontWeight: 700,
						fontSize: 110,
						color: ink.paper,
						letterSpacing: "-0.02em",
						lineHeight: 1,
					}}
				>
					Alfredo
					<Led size={38} />
				</span>
				<Etch size={26} style={{ color: ink.paper, opacity: 0.85 }}>
					THE HOME FOR YOUR PROJECTS
				</Etch>
			</div>
			<DashboardStrip />
		</Frame>
	);
}

// ── Favicon: A + LED, dot vertically centered, behind or in front of the A,
// at different horizontal positions. Rendered at native 64px, scaled down.
type FaviconMode = {
	layer: "behind" | "front";
	x: "left" | "center" | "right";
};

function FaviconMark({ mode }: { mode: FaviconMode }) {
	const dotSize = mode.layer === "behind" ? 26 : 16;
	const left =
		mode.x === "left"
			? 10
			: mode.x === "right"
				? 64 - 10 - dotSize
				: 32 - dotSize / 2;
	const dot = (
		<span
			style={{
				position: "absolute",
				width: dotSize,
				height: dotSize,
				top: 32 - dotSize / 2,
				left,
				borderRadius: "50%",
				background: ink.led,
				boxShadow: `0 0 ${mode.layer === "behind" ? 14 : 8}px ${ink.ledGlow}`,
				zIndex: mode.layer === "behind" ? 0 : 2,
				opacity: mode.layer === "behind" ? 0.9 : 1,
			}}
		/>
	);
	return (
		<div
			style={{
				width: 64,
				height: 64,
				borderRadius: 14,
				background: ink.bg,
				border: `1px solid ${ink.seam}`,
				position: "relative",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				overflow: "hidden",
			}}
		>
			{dot}
			<span
				style={{
					fontFamily: fontDisplay,
					fontWeight: 700,
					fontSize: 46,
					lineHeight: 1,
					color: ink.paper,
					position: "relative",
					zIndex: 1,
				}}
			>
				A
			</span>
		</div>
	);
}

const FAVICON_MODES: { mode: FaviconMode; label: string }[] = [
	{ mode: { layer: "behind", x: "left" }, label: "behind · left" },
	{ mode: { layer: "behind", x: "center" }, label: "behind · center (halo)" },
	{ mode: { layer: "behind", x: "right" }, label: "behind · right" },
	{ mode: { layer: "front", x: "left" }, label: "front · left" },
	{ mode: { layer: "front", x: "center" }, label: "front · center" },
	{ mode: { layer: "front", x: "right" }, label: "front · right" },
];

function FaviconRow({ mode, label }: { mode: FaviconMode; label: string }) {
	return (
		<div style={{ display: "flex", alignItems: "center", gap: 28 }}>
			<div style={{ display: "flex", alignItems: "flex-end", gap: 18 }}>
				{[1, 0.5, 0.25].map((s) => (
					<div
						key={s}
						style={{
							width: 64 * s,
							height: 64 * s,
							overflow: "hidden",
							borderRadius: 14 * s,
						}}
					>
						<div
							style={{ transform: `scale(${s})`, transformOrigin: "top left" }}
						>
							<FaviconMark mode={mode} />
						</div>
					</div>
				))}
			</div>
			{/* fake browser tab at 16px */}
			<div
				style={{
					display: "flex",
					alignItems: "center",
					gap: 8,
					background: "#2b2b2b",
					borderRadius: "8px 8px 0 0",
					padding: "6px 14px",
				}}
			>
				<div
					style={{ width: 16, height: 16, overflow: "hidden", borderRadius: 4 }}
				>
					<div
						style={{ transform: "scale(0.25)", transformOrigin: "top left" }}
					>
						<FaviconMark mode={mode} />
					</div>
				</div>
				<span style={{ fontFamily: fontDisplay, fontSize: 12, color: "#ccc" }}>
					Alfredo · Ship your next SaaS in minutes
				</span>
			</div>
			<span style={{ fontFamily: fontMono, fontSize: 12, color: "#97927f" }}>
				{label}
			</span>
		</div>
	);
}

// ── Page: all candidates, full-ish size + thumbnail ────────────────────────
const OPTIONS: { key: string; title: string; note: string; el: ReactNode }[] = [
	{
		key: "4",
		title: "H1 + dashboard (revised)",
		note: "centered H1 up top, big bottom-centered dashboard cut off at the edge",
		el: <FrameH1Dashboard />,
	},
	{
		key: "5",
		title: "Monolith + dashboard (revised)",
		note: "giant wordmark, readable etch, same dashboard strip",
		el: <FrameMonolithDashboard />,
	},
	{
		key: "1",
		title: "Type-only",
		note: "wordmark + full H1 + refrain microprint",
		el: <FrameTypeOnly />,
	},
	{
		key: "2",
		title: "Type + HQ glimpse",
		note: "H1 left, dashboard mock bleeding off the corner, SIMULATED DATA etch",
		el: <FrameTypeGlimpse />,
	},
	{
		key: "3",
		title: "Wordmark monolith",
		note: "brand only, no message",
		el: <FrameMonolith />,
	},
];

function Scaled({ scale, children }: { scale: number; children: ReactNode }) {
	return (
		<div
			style={{
				width: 1200 * scale,
				height: 630 * scale,
				overflow: "hidden",
				borderRadius: 8,
				flexShrink: 0,
			}}
		>
			<div
				style={{ transform: `scale(${scale})`, transformOrigin: "top left" }}
			>
				{children}
			</div>
		</div>
	);
}

export function VariantWOgFrames() {
	return (
		<div
			style={{
				minHeight: "100vh",
				background: "#0a0a08",
				padding: "48px 32px 96px",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				gap: 56,
			}}
		>
			<link
				rel="stylesheet"
				href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=IBM+Plex+Mono:wght@400;500&display=swap"
			/>
			<div
				style={{
					fontFamily: fontMono,
					fontSize: 13,
					letterSpacing: "0.2em",
					textTransform: "uppercase",
					color: "#97927f",
				}}
			>
				OG image candidates · 1200×630 · wayfinder #21
			</div>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					gap: 24,
				}}
			>
				<div style={{ fontFamily: fontMono, fontSize: 14, color: "#ece7da" }}>
					<span style={{ color: "#ffd23c" }}>Favicon</span> — A + LED variations
					· 64 / 32 / 16 px + tab preview
				</div>
				{FAVICON_MODES.map((f) => (
					<FaviconRow key={f.label} mode={f.mode} label={f.label} />
				))}
			</div>
			{OPTIONS.map((o) => (
				<div
					key={o.key}
					style={{ display: "flex", flexDirection: "column", gap: 14 }}
				>
					<div style={{ fontFamily: fontMono, fontSize: 14, color: "#ece7da" }}>
						<span style={{ color: "#ffd23c" }}>Option {o.key}</span> — {o.title}
						<span style={{ color: "#97927f" }}> · {o.note}</span>
					</div>
					<div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
						<Scaled scale={0.55}>{o.el}</Scaled>
						<div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
							<Scaled scale={0.365}>{o.el}</Scaled>
							<span
								style={{
									fontFamily: fontMono,
									fontSize: 11,
									color: "#97927f",
									letterSpacing: "0.15em",
								}}
							>
								~TIMELINE CARD SIZE
							</span>
						</div>
					</div>
				</div>
			))}
		</div>
	);
}
