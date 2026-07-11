// PROTOTYPE (wayfinder #18) — wiring video, variant A "Patch bay".
// Running services sit racked on the left with long uptimes; a deploy
// types in, a fresh app card appears on the right, and wires draw from
// each selected service to the app. Deploy 1 (my-saas) overlaps fully —
// every wire is a reuse. Deploy 2 (side-gig) selects auth + payments:
// auth reattaches instantly, Creem isn't running yet so it slides into
// the rack, boots, then wires. 450 frames @ 30fps, dims out to loop.
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { Caret } from "@/components/remocn/caret";
import { useTypewriter } from "@/lib/remocn-ui";
import { ConsoleFrame, Etch, Led } from "./console/chrome";
import { fonts, ink } from "./console/theme";

const SERVICES = [
	{ id: "auth", provider: "BETTER-AUTH", up: "UP 148D" },
	{ id: "db", provider: "CONVEX", up: "UP 212D" },
	{ id: "email", provider: "POSTMARK", up: "UP 212D" },
	{ id: "analytics", provider: "UMAMI", up: "UP 63D" },
];

// Timeline anchors (frames @ 30fps)
const RAIL_IN = 0;
const STRIP_IN = 10;
const TYPE1 = 24; // alfredo up my-saas --with auth,db,email,analytics
const APP1_IN = 78;
const WIRE1 = [92, 114, 136, 158]; // one wire per selected service
const WIRE_DRAW = 14;
const LIVE1 = 186;
const TYPE2 = 218; // alfredo up side-gig --with auth,payments
const APP2_IN = 268;
const WIRE_AUTH2 = 280; // reuse: fast
const CREEM_IN = 294; // new service slides into the rack
const CREEM_OK = 324;
const WIRE_PAY = 328;
const LIVE2 = 352;
const DIM_AT = 420;

// Layout (px inside the console surface, ~1208×550)
const RAIL_X = 28;
const RAIL_W = 300;
const SLOT_H = 72;
const SLOT_GAP = 14;
const RAIL_Y = 92;
const APP_X = 700;
const APP_W = 470;
const APP1_Y = 96;
const APP2_Y = 300;
const APP_H = 180;

function slotY(i: number) {
	return RAIL_Y + i * (SLOT_H + SLOT_GAP);
}

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

function flash(frame: number, at: number, dur = 14) {
	if (frame < at || frame >= at + dur) return 0;
	return 1 - (frame - at) / dur;
}

function ServiceModule({
	frame,
	provider,
	kind,
	up,
	at,
	starting = false,
	flashAts = [],
}: {
	frame: number;
	provider: string;
	kind: string;
	up: string;
	at: number;
	starting?: boolean;
	flashAts?: number[];
}) {
	const hit = flashAts.reduce((a, f) => Math.max(a, flash(frame, f, 12)), 0);
	const isBooting = starting && frame < CREEM_OK;
	const blink = Math.floor(frame / 8) % 2 === 0;
	return (
		<div
			style={{
				height: SLOT_H,
				background: ink.panel,
				border: `1px solid ${hit > 0 ? `rgba(88, 232, 92, ${0.25 + 0.5 * hit})` : ink.seam}`,
				borderRadius: 12,
				padding: "12px 18px",
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				gap: 6,
				...enterAt(frame, at),
			}}
		>
			<span style={{ display: "flex", alignItems: "center", gap: 10 }}>
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
				<span style={{ fontSize: 17, fontWeight: 700, color: ink.paper }}>
					{provider}
				</span>
				<span style={{ marginLeft: "auto" }}>
					<Etch size={10}>{isBooting ? "STARTING" : up}</Etch>
				</span>
			</span>
			<Etch size={10} style={{ opacity: 0.75 }}>
				{kind}
			</Etch>
		</div>
	);
}

type Wire = {
	fromSlot: number;
	toApp: 1 | 2;
	lane: number; // vertical slot on the app edge
	at: number;
	draw: number;
	tag?: string;
};

const WIRES: Wire[] = [
	{ fromSlot: 0, toApp: 1, lane: 0, at: WIRE1[0], draw: WIRE_DRAW },
	{ fromSlot: 1, toApp: 1, lane: 1, at: WIRE1[1], draw: WIRE_DRAW },
	{ fromSlot: 2, toApp: 1, lane: 2, at: WIRE1[2], draw: WIRE_DRAW },
	{ fromSlot: 3, toApp: 1, lane: 3, at: WIRE1[3], draw: WIRE_DRAW },
	{
		fromSlot: 0,
		toApp: 2,
		lane: 0,
		at: WIRE_AUTH2,
		draw: 8,
		tag: "REUSED · UP 148D",
	},
	{
		fromSlot: 4,
		toApp: 2,
		lane: 1,
		at: WIRE_PAY,
		draw: WIRE_DRAW,
		tag: "STARTED",
	},
];

function wireGeometry(w: Wire) {
	const y1 = slotY(w.fromSlot) + SLOT_H / 2;
	const appY = w.toApp === 1 ? APP1_Y : APP2_Y;
	const y2 = appY + 48 + w.lane * 30;
	const x1 = RAIL_X + RAIL_W;
	const x2 = APP_X;
	return { x1, y1, x2, y2 };
}

function Wires({ frame }: { frame: number }) {
	return (
		<svg
			role="img"
			aria-label="Service wiring"
			style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
		>
			{WIRES.map((w) => {
				const t = clamp01(frame, w.at, w.draw);
				if (t <= 0) return null;
				const { x1, y1, x2, y2 } = wireGeometry(w);
				const hit = flash(frame, w.at + w.draw, 16);
				return (
					<g key={`${w.fromSlot}-${w.toApp}`}>
						<path
							d={`M ${x1} ${y1} C ${x1 + 170} ${y1}, ${x2 - 170} ${y2}, ${x2} ${y2}`}
							fill="none"
							stroke={ink.green}
							strokeWidth={2}
							opacity={0.4 + 0.35 * hit}
							pathLength={1}
							strokeDasharray={1}
							strokeDashoffset={1 - t}
						/>
						{t >= 1 && (
							<circle
								cx={x2}
								cy={y2}
								r={4 + 3 * hit}
								fill={ink.green}
								opacity={0.7 + 0.3 * hit}
							/>
						)}
					</g>
				);
			})}
		</svg>
	);
}

function WireTags({ frame }: { frame: number }) {
	return (
		<>
			{WIRES.filter((w) => w.tag).map((w) => {
				const { x1, y1, x2, y2 } = wireGeometry(w);
				const on = clamp01(frame, w.at + w.draw, 8);
				if (on <= 0) return null;
				return (
					<span
						key={w.tag}
						style={{
							position: "absolute",
							left: (x1 + x2) / 2,
							top: (y1 + y2) / 2 - 9,
							transform: "translateX(-50%)",
							background: ink.surface,
							border: `1px solid ${ink.seam}`,
							borderRadius: 6,
							padding: "2px 8px",
							opacity: on,
						}}
					>
						<Etch
							size={9}
							style={{ color: w.tag === "STARTED" ? ink.amber : ink.green }}
						>
							{w.tag}
						</Etch>
					</span>
				);
			})}
		</>
	);
}

function AppCard({
	frame,
	name,
	url,
	at,
	liveAt,
	chips,
	chipAts,
	y,
}: {
	frame: number;
	name: string;
	url: string;
	at: number;
	liveAt: number;
	chips: string[];
	chipAts: number[];
	y: number;
}) {
	const live = frame >= liveAt;
	const liveHit = flash(frame, liveAt, 16);
	return (
		<div
			style={{
				position: "absolute",
				left: APP_X,
				top: y,
				width: APP_W,
				height: APP_H,
				background: ink.panel,
				border: `1px solid ${ink.seam}`,
				borderRadius: 14,
				padding: "16px 22px",
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between",
				...enterAt(frame, at),
			}}
		>
			<div style={{ display: "flex", alignItems: "center", gap: 11 }}>
				<Led size={11} on={live} />
				<span style={{ fontSize: 22, fontWeight: 700, color: ink.paper }}>
					{name}
				</span>
				<span style={{ marginLeft: "auto" }}>
					<Etch
						size={10}
						style={
							live
								? {
										color: ink.green,
										textShadow: `0 0 ${8 * liveHit}px ${ink.greenGlow}`,
									}
								: { color: ink.amber }
						}
					>
						{live ? "LIVE · UP 0M" : "WIRING"}
					</Etch>
				</span>
			</div>
			<span style={{ fontFamily: fonts.mono, fontSize: 13, color: ink.green }}>
				{url}
			</span>
			<div style={{ display: "flex", gap: 10 }}>
				{chips.map((c, i) => {
					const pop = clamp01(frame, chipAts[i], 6);
					return (
						<span
							key={c}
							style={{ flex: 1, display: "flex", alignItems: "center", gap: 7 }}
						>
							<span
								style={{
									width: 20,
									height: 20,
									borderRadius: 6,
									border: `1px solid ${ink.seam}`,
									background: ink.displayBg,
									boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.6)",
									color: ink.green,
									fontSize: 13,
									lineHeight: "18px",
									textAlign: "center",
									textShadow: `0 0 6px ${ink.greenGlow}`,
								}}
							>
								<span style={{ opacity: pop }}>✓</span>
							</span>
							<Etch size={9}>{c}</Etch>
						</span>
					);
				})}
			</div>
		</div>
	);
}

function DeployStrip({ frame }: { frame: number }) {
	const tw1 = useTypewriter(
		"alfredo up my-saas --with auth,db,email,analytics",
		{ cps: 30, startFrame: TYPE1 },
	);
	const tw2 = useTypewriter("alfredo up side-gig --with auth,payments", {
		cps: 30,
		startFrame: TYPE2,
	});
	const second = frame >= TYPE2;
	const tw = second ? tw2 : tw1;

	const ok1 = frame >= LIVE1 && !second;
	const ok2 = frame >= LIVE2;
	const amber = second
		? ok2
			? "1 REUSED · 1 STARTED"
			: null
		: ok1
			? "4/4 REUSED · LIVE IN 4S"
			: null;

	return (
		<div
			style={{
				position: "absolute",
				top: 22,
				left: RAIL_X,
				right: 28,
				display: "flex",
				alignItems: "center",
				background: ink.displayBg,
				border: `1px solid ${ink.seam}`,
				borderRadius: 10,
				padding: "11px 18px",
				boxShadow: "inset 0 2px 8px rgba(0, 0, 0, 0.7)",
				fontFamily: fonts.terminal,
				fontSize: 22,
				whiteSpace: "pre",
				...enterAt(frame, STRIP_IN),
			}}
		>
			<span
				style={{ color: ink.green, textShadow: `0 0 6px ${ink.greenGlow}` }}
			>
				{"> "}
				{tw.text}
			</span>
			{(ok1 || ok2) && (
				<span
					style={{ color: ink.green, textShadow: `0 0 8px ${ink.greenGlow}` }}
				>
					{" ... ok"}
				</span>
			)}
			{amber && (
				<span
					style={{
						opacity: clamp01(frame, (second ? LIVE2 : LIVE1) + 4, 5),
						color: ink.amber,
						textShadow: `0 0 7px ${ink.amberGlow}`,
					}}
				>
					{` · ${amber}`}
				</span>
			)}
			<Caret
				color={ink.green}
				blink={!tw.typing}
				style={{ width: 11, height: 22, marginLeft: 4 }}
			/>
		</div>
	);
}

export function WiringPatchBay() {
	const frame = useCurrentFrame();
	const dim = interpolate(frame, [DIM_AT, DIM_AT + 18], [1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: Easing.in(Easing.cubic),
	});

	return (
		<ConsoleFrame
			brand="HQ"
			mode="WIRING"
			refrain="YOUR SERVERS · ONE HQ · N PROJECTS"
		>
			<AbsoluteFill style={{ opacity: dim }}>
				<DeployStrip frame={frame} />

				<span
					style={{
						position: "absolute",
						left: RAIL_X + 2,
						top: RAIL_Y - 22,
						...enterAt(frame, RAIL_IN),
					}}
				>
					<Etch size={10}>RUNNING SERVICES</Etch>
				</span>
				<span
					style={{
						position: "absolute",
						left: APP_X + 2,
						top: RAIL_Y - 22,
						...enterAt(frame, RAIL_IN),
					}}
				>
					<Etch size={10}>PROJECTS</Etch>
				</span>

				<div
					style={{
						position: "absolute",
						left: RAIL_X,
						top: RAIL_Y,
						width: RAIL_W,
						display: "flex",
						flexDirection: "column",
						gap: SLOT_GAP,
					}}
				>
					{SERVICES.map((s, i) => (
						<ServiceModule
							key={s.id}
							frame={frame}
							provider={s.provider}
							kind={s.id.toUpperCase()}
							up={s.up}
							at={RAIL_IN + i * 4}
							flashAts={WIRES.filter((w) => w.fromSlot === i).map(
								(w) => w.at + w.draw,
							)}
						/>
					))}
					{frame >= CREEM_IN && (
						<ServiceModule
							frame={frame}
							provider="CREEM"
							kind="PAYMENTS"
							up="UP 0M"
							at={CREEM_IN}
							starting
							flashAts={[WIRE_PAY + WIRE_DRAW]}
						/>
					)}
				</div>

				<Wires frame={frame} />
				<WireTags frame={frame} />

				{frame >= APP1_IN && (
					<AppCard
						frame={frame}
						name="my-saas"
						url="https://my-saas.example.dev"
						at={APP1_IN}
						liveAt={LIVE1}
						chips={["auth", "db", "email", "analytics"]}
						chipAts={WIRE1.map((a) => a + WIRE_DRAW)}
						y={APP1_Y}
					/>
				)}
				{frame < APP2_IN && (
					<div
						style={{
							position: "absolute",
							left: APP_X,
							top: APP2_Y,
							width: APP_W,
							height: APP_H,
							border: `1px dashed ${ink.seam}`,
							borderRadius: 14,
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							justifyContent: "center",
							gap: 10,
							opacity:
								clamp01(frame, RAIL_IN, 10) *
								(1 - clamp01(frame, APP2_IN - 6, 6)),
						}}
					>
						<Led size={9} on={false} />
						<Etch size={10}>BAY · EMPTY</Etch>
					</div>
				)}
				{frame >= APP2_IN && (
					<AppCard
						frame={frame}
						name="side-gig"
						url="https://side-gig.example.dev"
						at={APP2_IN}
						liveAt={LIVE2}
						chips={["auth", "payments"]}
						chipAts={[WIRE_AUTH2 + 8, WIRE_PAY + WIRE_DRAW]}
						y={APP2_Y}
					/>
				)}
			</AbsoluteFill>
		</ConsoleFrame>
	);
}
