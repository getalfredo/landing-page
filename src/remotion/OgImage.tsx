// OG share image (1200×630) for wayfinder #21: the approved "H1 + dashboard"
// frame promoted from the variant-w prototype. Rendered as a Still to
// public/generated/og.png at build by plugins/remotion-assets.ts.
// Fonts come from the loadFont-bound `fonts` in console/theme.ts so the
// headless render loads real typefaces instead of system fallbacks.
import type { ReactNode } from "react";
import { Etch, Led } from "./console/chrome";
import { fonts, ink } from "./console/theme";

function Wordmark({ size }: { size: number }) {
	return (
		<span
			style={{
				display: "inline-flex",
				alignItems: "center",
				gap: size * 0.35,
				fontFamily: fonts.display,
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

// Outer shell: dark-glass panel with bezel seams on a charcoal ground.
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
					fontFamily: fonts.display,
					fontWeight: 700,
					fontSize: 30,
					color: ink.paper,
				}}
			>
				{num}
			</span>
			<span
				style={{ fontFamily: fonts.mono, fontSize: 12, color: ink.paperSoft }}
			>
				{note}
			</span>
		</div>
	);
}

// Wide dashboard strip, bottom-centered and deliberately cut off by the
// frame's bottom edge. SIMULATED DATA etch stays on this asset (#13/#21).
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
								fontFamily: fonts.mono,
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

export function OgImage() {
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
						fontFamily: fonts.display,
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
