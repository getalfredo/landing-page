// PROTOTYPE (wayfinder #18) — wiring video, variant C "Service lanes".
// Services are persistent horizontal lanes with pulses running along
// them; projects are vertical columns that clamp onto the lanes they
// selected. One seasoned project is already attached; my-saas drops in
// and its nodes ignite; side-gig follows, reusing auth instantly while
// a brand-new Creem lane slides in underneath and boots. Then the old
// project retires and lifts out — its lanes keep pulsing. Apps come and
// go, services stay. 450 frames @ 30fps, dims out to loop.
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { ConsoleFrame, Etch, Led } from "./console/chrome";
import { ink } from "./console/theme";

// Timeline anchors (frames @ 30fps)
const LANES_IN = 0;
const MYSAAS_IN = 48;
const NODES1 = [72, 88, 104, 120]; // my-saas nodes: auth, db, email, analytics
const LIVE_MS = 142;
const SIDEGIG_IN = 186;
const NODE_AUTH2 = 206; // reuse: instant
const PAYLANE_IN = 222; // Creem lane slides in
const PAY_OK = 260;
const NODE_PAY = 268;
const LIVE_SG = 290;
const RETIRE = 324; // invoicer lifts out; lanes keep running
const DIM_AT = 420;

// Layout (px inside the console surface, ~1208×550)
const LABEL_W = 250;
const LANE_X = 290;
const LANE_END = 1170;
const LANE_W = LANE_END - LANE_X;
const LANE_YS = [128, 210, 292, 374]; // auth, db, email, analytics
const PAY_Y = 456;
const COL_TOP = 56;

const LANES = [
	{ id: "AUTH", provider: "BETTER-AUTH", up: "UP 148D", y: LANE_YS[0] },
	{ id: "DB", provider: "CONVEX", up: "UP 212D", y: LANE_YS[1] },
	{ id: "EMAIL", provider: "POSTMARK", up: "UP 212D", y: LANE_YS[2] },
	{ id: "ANALYTICS", provider: "UMAMI", up: "UP 63D", y: LANE_YS[3] },
];

type Column = {
	name: string;
	cx: number;
	nodes: { y: number; at: number }[];
	inAt: number;
	liveAt: number;
	preLive: boolean; // attached before frame 0
};

const COLUMNS: Column[] = [
	{
		name: "invoicer",
		cx: 470,
		inAt: 0,
		liveAt: 0,
		preLive: true,
		nodes: [
			{ y: LANE_YS[0], at: 0 },
			{ y: LANE_YS[1], at: 0 },
			{ y: LANE_YS[2], at: 0 },
		],
	},
	{
		name: "my-saas",
		cx: 710,
		inAt: MYSAAS_IN,
		liveAt: LIVE_MS,
		preLive: false,
		nodes: LANE_YS.map((y, i) => ({ y, at: NODES1[i] })),
	},
	{
		name: "side-gig",
		cx: 950,
		inAt: SIDEGIG_IN,
		liveAt: LIVE_SG,
		preLive: false,
		nodes: [
			{ y: LANE_YS[0], at: NODE_AUTH2 },
			{ y: PAY_Y, at: NODE_PAY },
		],
	},
];

function clamp01(frame: number, at: number, dur: number) {
	return interpolate(frame, [at, at + dur], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
}

function flash(frame: number, at: number, dur = 14) {
	if (frame < at || frame >= at + dur) return 0;
	return 1 - (frame - at) / dur;
}

function Lane({
	frame,
	label,
	provider,
	up,
	y,
	at,
	booting = false,
}: {
	frame: number;
	label: string;
	provider: string;
	up: string;
	y: number;
	at: number;
	booting?: boolean;
}) {
	const on = clamp01(frame, at, 12);
	const isBooting = booting && frame < PAY_OK;
	const blink = Math.floor(frame / 8) % 2 === 0;
	// Two pulses travel each lane, offset by lane position for variety.
	const pulses = [0, 1].map((k) => {
		const speed = 3.2;
		const span = LANE_W + 60;
		const off = (y * 1.7 + k * span * 0.5) % span;
		return ((frame * speed + off) % span) - 60;
	});
	return (
		<div
			style={{
				position: "absolute",
				left: 0,
				top: y - 26,
				right: 38,
				opacity: on,
			}}
		>
			<div
				style={{
					position: "absolute",
					left: 28,
					top: 0,
					width: LABEL_W - 28,
					display: "flex",
					flexDirection: "column",
					gap: 5,
				}}
			>
				<span style={{ display: "flex", alignItems: "center", gap: 9 }}>
					{isBooting ? (
						<span
							style={{
								width: 9,
								height: 9,
								borderRadius: "50%",
								background: blink ? ink.amber : ink.ledOff,
								boxShadow: blink ? `0 0 9px ${ink.amberGlow}` : "none",
								flexShrink: 0,
							}}
						/>
					) : (
						<Led size={9} />
					)}
					<span style={{ fontSize: 16, fontWeight: 700, color: ink.paper }}>
						{provider}
					</span>
				</span>
				<Etch size={9} style={{ opacity: 0.75 }}>
					{label} · {isBooting ? "STARTING" : up}
				</Etch>
			</div>
			<div
				style={{
					position: "absolute",
					left: LANE_X,
					top: 25,
					width: LANE_W,
					height: 2,
					background: "rgba(88, 232, 92, 0.16)",
					overflow: "hidden",
				}}
			>
				{!isBooting &&
					pulses.map((x, k) => (
						<span
							// biome-ignore lint/suspicious/noArrayIndexKey: fixed two-pulse set
							key={k}
							style={{
								position: "absolute",
								left: x,
								top: 0,
								width: 52,
								height: 2,
								background: `linear-gradient(90deg, transparent, ${ink.green})`,
								opacity: 0.8,
							}}
						/>
					))}
			</div>
		</div>
	);
}

function AppColumn({ frame, col }: { frame: number; col: Column }) {
	const drop = interpolate(frame, [col.inAt, col.inAt + 12], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: Easing.out(Easing.cubic),
	});
	const retired = col.preLive && frame >= RETIRE;
	const retireT = col.preLive
		? interpolate(frame, [RETIRE, RETIRE + 20], [0, 1], {
				extrapolateLeft: "clamp",
				extrapolateRight: "clamp",
				easing: Easing.in(Easing.cubic),
			})
		: 0;
	const live = col.preLive || frame >= col.liveAt;
	const liveHit = flash(frame, col.liveAt, 16);
	const colW = 168;
	const bottom = Math.max(...col.nodes.map((n) => n.y)) + 30;

	return (
		<div
			style={{
				position: "absolute",
				left: col.cx - colW / 2,
				top: COL_TOP,
				width: colW,
				height: bottom - COL_TOP,
				opacity: drop * (1 - retireT * 0.88),
				transform: `translateY(${(1 - drop) * -18 - retireT * 14}px)`,
			}}
		>
			<div
				style={{
					position: "absolute",
					inset: 0,
					background: "rgba(236, 231, 218, 0.03)",
					border: `1px solid ${ink.seam}`,
					borderRadius: 12,
				}}
			/>
			<div
				style={{
					position: "absolute",
					top: 10,
					left: 0,
					right: 0,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					gap: 6,
				}}
			>
				<span style={{ display: "flex", alignItems: "center", gap: 8 }}>
					<Led size={9} on={live && !retired} />
					<span style={{ fontSize: 17, fontWeight: 700, color: ink.paper }}>
						{col.name}
					</span>
				</span>
				<Etch
					size={9}
					style={
						retired
							? { color: ink.paperSoft }
							: live
								? {
										color: ink.green,
										textShadow: `0 0 ${8 * liveHit}px ${ink.greenGlow}`,
									}
								: { color: ink.amber }
					}
				>
					{retired
						? "RETIRED"
						: live
							? col.preLive
								? "LIVE · UP 148D"
								: "LIVE · UP 0M"
							: "WIRING"}
				</Etch>
			</div>
			{col.nodes.map((n) => {
				const lit = clamp01(frame, n.at, 6);
				const hit = flash(frame, n.at, 16);
				const off = retired ? 0.25 : 1;
				return (
					<span
						key={n.y}
						style={{
							position: "absolute",
							left: colW / 2 - 7,
							top: n.y - COL_TOP - 7,
							width: 14,
							height: 14,
							borderRadius: "50%",
							border: `1px solid ${ink.seam}`,
							background: lit > 0 ? ink.led : ink.displayBg,
							boxShadow:
								lit > 0
									? `0 0 ${9 + 8 * hit}px ${ink.ledGlow}`
									: "inset 0 2px 4px rgba(0,0,0,0.6)",
							opacity: off * (lit > 0 ? 0.75 + 0.25 * lit : 0.9),
						}}
					/>
				);
			})}
		</div>
	);
}

export function WiringLanes() {
	const frame = useCurrentFrame();
	const dim = interpolate(frame, [DIM_AT, DIM_AT + 18], [1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: Easing.in(Easing.cubic),
	});
	const payOn = frame >= PAYLANE_IN;
	const retireNote = clamp01(frame, RETIRE + 16, 10);

	return (
		<ConsoleFrame
			brand="HQ"
			mode="FLEET"
			refrain="YOUR SERVERS · ONE HQ · N PROJECTS"
		>
			<AbsoluteFill style={{ opacity: dim }}>
				<span
					style={{
						position: "absolute",
						left: 28,
						top: 26,
						opacity: clamp01(frame, LANES_IN, 10),
					}}
				>
					<Etch size={10}>RUNNING SERVICES</Etch>
				</span>
				<span
					style={{
						position: "absolute",
						left: LANE_X + 130,
						top: 26,
						opacity: clamp01(frame, LANES_IN, 10),
					}}
				>
					<Etch size={10}>PROJECTS · COME AND GO</Etch>
				</span>

				{LANES.map((l, i) => (
					<Lane
						key={l.id}
						frame={frame}
						label={l.id}
						provider={l.provider}
						up={l.up}
						y={l.y}
						at={LANES_IN + i * 5}
					/>
				))}
				{payOn && (
					<Lane
						frame={frame}
						label="PAYMENTS"
						provider="CREEM"
						up="UP 0M"
						y={PAY_Y}
						at={PAYLANE_IN}
						booting
					/>
				)}

				{COLUMNS.map((col) => (
					<AppColumn key={col.name} frame={frame} col={col} />
				))}

				<span
					style={{
						position: "absolute",
						left: COLUMNS[0].cx,
						top: 336,
						transform: "translateX(-50%)",
						opacity: retireNote,
					}}
				>
					<Etch size={9} style={{ color: ink.paperSoft }}>
						LANES KEEP RUNNING
					</Etch>
				</span>
			</AbsoluteFill>
		</ConsoleFrame>
	);
}
