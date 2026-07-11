// PROTOTYPE (wayfinder #18) — wiring video, variant B "Deploy manifest".
// A single deploy form makes the model literal: a project is a selection
// of integrations at deploy time. As each row checks in, the status
// column resolves — four read RUNNING · REUSE with their uptime, Creem
// reads NOT RUNNING · WILL START. Deploy is pressed; the attach log on
// the right lands the reused services in fractions of a second while
// Creem takes visibly longer to boot, and the app card comes up live.
// 420 frames @ 30fps, dims out to loop.
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Caret } from "@/components/remocn/caret";
import { useTypewriter } from "@/lib/remocn-ui";
import { ConsoleFrame, Etch, Led } from "./console/chrome";
import { fonts, ink } from "./console/theme";

type Row = {
	id: string;
	provider: string;
	up: string | null; // null = not running yet
	checkAt: number;
	attachAt: number; // frame the attach log line lands ok
	attachNote: string;
};

const ROWS: Row[] = [
	{
		id: "auth",
		provider: "BETTER-AUTH",
		up: "UP 148D",
		checkAt: 44,
		attachAt: 182,
		attachNote: "attached 0.3s",
	},
	{
		id: "db",
		provider: "CONVEX",
		up: "UP 212D",
		checkAt: 66,
		attachAt: 196,
		attachNote: "attached 0.2s",
	},
	{
		id: "email",
		provider: "POSTMARK",
		up: "UP 212D",
		checkAt: 88,
		attachAt: 210,
		attachNote: "attached 0.3s",
	},
	{
		id: "analytics",
		provider: "UMAMI",
		up: "UP 63D",
		checkAt: 110,
		attachAt: 224,
		attachNote: "attached 0.2s",
	},
	{
		id: "payments",
		provider: "CREEM",
		up: null,
		checkAt: 132,
		attachAt: 288,
		attachNote: "started 9.8s",
	},
];

// Timeline anchors (frames @ 30fps)
const PANEL_IN = 6;
const NAME_TYPE = 18;
const STATUS_DELAY = 8; // status resolves this many frames after the check
const DEPLOY_PRESS = 156;
const LOG_IN = 170;
const CREEM_LINE = 232; // start line appears, ok lands at attachAt
const CARD_IN = 300;
const FOOT_IN = 316;
const DIM_AT = 392;

function clamp01(frame: number, at: number, dur: number) {
	return interpolate(frame, [at, at + dur], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
}

function enterAt(frame: number, at: number) {
	const t = interpolate(frame, [at, at + 10], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: Easing.out(Easing.cubic),
	});
	return { opacity: t, transform: `translateY(${(1 - t) * 10}px)` };
}

function ManifestRow({ frame, row }: { frame: number; row: Row }) {
	const check = clamp01(frame, row.checkAt, 5);
	const status = clamp01(frame, row.checkAt + STATUS_DELAY, 6);
	const running = row.up !== null;
	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				gap: 14,
				padding: "8px 4px",
				borderBottom: `1px solid ${ink.seam}`,
				...enterAt(frame, PANEL_IN + row.checkAt * 0.1),
			}}
		>
			<span
				style={{
					width: 22,
					height: 22,
					borderRadius: 6,
					border: `1px solid ${ink.seam}`,
					background: ink.displayBg,
					boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.6)",
					color: ink.green,
					fontSize: 14,
					lineHeight: "20px",
					textAlign: "center",
					textShadow: `0 0 6px ${ink.greenGlow}`,
					flexShrink: 0,
				}}
			>
				<span style={{ opacity: check }}>✓</span>
			</span>
			<span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
				<span style={{ fontSize: 16, fontWeight: 700, color: ink.paper }}>
					{row.provider}
				</span>
				<Etch size={9} style={{ opacity: 0.75 }}>
					{row.id}
				</Etch>
			</span>
			<span
				style={{
					marginLeft: "auto",
					textAlign: "right",
					display: "flex",
					flexDirection: "column",
					gap: 2,
					opacity: status,
				}}
			>
				<Etch size={10} style={{ color: running ? ink.green : ink.amber }}>
					{running ? "RUNNING · REUSE" : "NOT RUNNING · WILL START"}
				</Etch>
				<Etch size={9} style={{ opacity: 0.7 }}>
					{running ? row.up : "BOOTS ON DEPLOY"}
				</Etch>
			</span>
		</div>
	);
}

function DeployKey({ frame }: { frame: number }) {
	const down = interpolate(
		frame,
		[DEPLOY_PRESS, DEPLOY_PRESS + 5, DEPLOY_PRESS + 12],
		[0, 1, 0],
		{ extrapolateLeft: "clamp", extrapolateRight: "clamp" },
	);
	const armed = frame >= ROWS[4].checkAt + STATUS_DELAY + 6;
	return (
		<div
			style={{
				marginTop: 14,
				alignSelf: "stretch",
				borderRadius: 10,
				padding: "11px 0",
				textAlign: "center",
				background: armed ? ink.amber : ink.panel2,
				color: armed ? "#1a1505" : ink.paperSoft,
				fontFamily: fonts.mono,
				fontSize: 14,
				fontWeight: 500,
				letterSpacing: "0.22em",
				boxShadow: armed
					? `0 ${3 - 3 * down}px 0 rgba(0,0,0,0.55), inset 0 ${down * 2}px 6px rgba(0,0,0,0.25)`
					: "none",
				transform: `translateY(${down * 3}px)`,
				border: `1px solid ${armed ? "rgba(255, 210, 60, 0.6)" : ink.seam}`,
			}}
		>
			DEPLOY
		</div>
	);
}

function AttachLog({ frame }: { frame: number }) {
	const dots = ".".repeat((Math.floor(frame / 10) % 3) + 1);
	return (
		<div
			style={{
				background: ink.displayBg,
				border: `1px solid ${ink.seam}`,
				borderRadius: 12,
				padding: "16px 22px",
				boxShadow: "inset 0 3px 12px rgba(0, 0, 0, 0.8)",
				fontFamily: fonts.terminal,
				fontSize: 21,
				lineHeight: 1.55,
				color: ink.green,
				whiteSpace: "pre",
				...enterAt(frame, LOG_IN),
			}}
		>
			<div style={{ textShadow: `0 0 6px ${ink.greenGlow}` }}>
				{"> deploy my-saas"}
			</div>
			{ROWS.slice(0, 4).map((r) => {
				const lineAt = r.attachAt - 8;
				return (
					<div key={r.id} style={{ opacity: clamp01(frame, lineAt, 3) }}>
						<span style={{ opacity: 0.85 }}>
							{r.id} {".".repeat(14 - r.id.length)}
						</span>
						<span
							style={{
								opacity: clamp01(frame, r.attachAt, 3),
								textShadow: `0 0 8px ${ink.greenGlow}`,
							}}
						>
							{` ok  ${r.attachNote}`}
						</span>
					</div>
				);
			})}
			<div style={{ opacity: clamp01(frame, CREEM_LINE, 3) }}>
				<span style={{ opacity: 0.85 }}>{"payments ......"}</span>
				{frame < ROWS[4].attachAt ? (
					<span style={{ color: ink.amber }}>{` booting${dots}`}</span>
				) : (
					<span style={{ textShadow: `0 0 8px ${ink.greenGlow}` }}>
						{` ok  ${ROWS[4].attachNote}`}
					</span>
				)}
			</div>
			<div
				style={{
					opacity: clamp01(frame, CARD_IN - 4, 3),
					color: ink.amber,
					textShadow: `0 0 7px ${ink.amberGlow}`,
				}}
			>
				{"READY  00:10"}
			</div>
		</div>
	);
}

function LiveCard({ frame }: { frame: number }) {
	const live = frame >= CARD_IN + 8;
	return (
		<div
			style={{
				background: ink.panel,
				border: `1px solid ${ink.seam}`,
				borderRadius: 14,
				padding: "16px 22px",
				display: "flex",
				flexDirection: "column",
				gap: 12,
				...enterAt(frame, CARD_IN),
			}}
		>
			<div style={{ display: "flex", alignItems: "center", gap: 11 }}>
				<Led size={11} on={live} />
				<span style={{ fontSize: 22, fontWeight: 700, color: ink.paper }}>
					my-saas
				</span>
				<span style={{ marginLeft: "auto" }}>
					<Etch size={10} style={{ color: ink.green }}>
						LIVE · UP 0M
					</Etch>
				</span>
			</div>
			<span style={{ fontFamily: fonts.mono, fontSize: 13, color: ink.green }}>
				https://my-saas.example.dev
			</span>
			<span style={{ opacity: clamp01(frame, FOOT_IN, 8) }}>
				<Etch size={10}>4 REUSED · 1 STARTED · 0 SET UP BY HAND</Etch>
			</span>
		</div>
	);
}

export function WiringManifest() {
	const frame = useCurrentFrame();
	const tw = useTypewriter("my-saas", { cps: 16, startFrame: NAME_TYPE });
	const dim = interpolate(frame, [DIM_AT, DIM_AT + 18], [1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: Easing.in(Easing.cubic),
	});

	return (
		<ConsoleFrame
			brand="HQ"
			mode="DEPLOY"
			refrain="YOUR SERVERS · ONE HQ · N PROJECTS"
		>
			<AbsoluteFill
				style={{
					opacity: dim,
					padding: "26px 46px",
					display: "flex",
					flexDirection: "row",
					gap: 40,
				}}
			>
				<div
					style={{
						width: 520,
						alignSelf: "flex-start",
						background: ink.panel,
						border: `1px solid ${ink.seam}`,
						borderRadius: 14,
						padding: "18px 26px",
						display: "flex",
						flexDirection: "column",
						...enterAt(frame, PANEL_IN),
					}}
				>
					<Etch size={11}>NEW PROJECT</Etch>
					<div
						style={{
							marginTop: 10,
							marginBottom: 6,
							background: ink.displayBg,
							border: `1px solid ${ink.seam}`,
							borderRadius: 8,
							padding: "8px 14px",
							fontFamily: fonts.terminal,
							fontSize: 22,
							color: ink.green,
							textShadow: `0 0 6px ${ink.greenGlow}`,
						}}
					>
						{tw.text}
						<Caret
							color={ink.green}
							blink={!tw.typing}
							style={{ width: 11, height: 22, marginLeft: 2 }}
						/>
					</div>
					<Etch size={10} style={{ margin: "10px 0 2px" }}>
						INTEGRATIONS · PICK PER PROJECT
					</Etch>
					{ROWS.map((row) => (
						<ManifestRow key={row.id} frame={frame} row={row} />
					))}
					<DeployKey frame={frame} />
				</div>

				<div
					style={{
						flex: 1,
						display: "flex",
						flexDirection: "column",
						gap: 20,
						justifyContent: "center",
					}}
				>
					{frame >= LOG_IN && <AttachLog frame={frame} />}
					{frame >= CARD_IN && <LiveCard frame={frame} />}
				</div>
			</AbsoluteFill>
		</ConsoleFrame>
	);
}
