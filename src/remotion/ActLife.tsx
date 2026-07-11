// Act 2 anchor video (wayfinder #12): the console at work. The dashboard
// opens with three seasoned projects and an empty bay; mid-loop the fleet
// strip types `alfredo up my-saas`, the newborn ignites into the bay, the
// FLEET tile flips 3/4 → 4/4 and the amber refrain increments — then all
// four tick live. 390 frames @ 30fps; the display dims at the end and
// re-enters with the bay empty again, reading as a demo cycle.
import type { CSSProperties } from "react";
import {
	AbsoluteFill,
	Easing,
	interpolate,
	random,
	useCurrentFrame,
} from "remotion";
import { Caret } from "@/components/remocn/caret";
import { useTypewriter } from "@/lib/remocn-ui";
import { ConsoleFrame, Etch, Led, LoadBar } from "./console/chrome";
import { fonts, ink } from "./console/theme";

type ProjectSpec = {
	name: string;
	up: string;
	req: number;
	mail: number;
	pay: number;
	eur: number;
	load: number;
	maxInc: number;
	tickFrom: number;
};

const FLEET: ProjectSpec[] = [
	{
		name: "invoicer",
		up: "UP 148D",
		req: 48210,
		mail: 291,
		pay: 57,
		eur: 2840,
		load: 5,
		maxInc: 5,
		tickFrom: 30,
	},
	{
		name: "shiplog",
		up: "UP 63D",
		req: 9184,
		mail: 44,
		pay: 12,
		eur: 348,
		load: 3,
		maxInc: 3,
		tickFrom: 30,
	},
	{
		name: "pantry-api",
		up: "UP 212D",
		req: 130552,
		mail: 812,
		pay: 0,
		eur: 0,
		load: 8,
		maxInc: 11,
		tickFrom: 30,
	},
];

const NEWBORN: ProjectSpec = {
	name: "my-saas",
	up: "UP 0M",
	req: 0,
	mail: 0,
	pay: 0,
	eur: 0,
	load: 2,
	maxInc: 1,
	tickFrom: 170,
};

// Timeline anchors (frames @ 30fps)
const DEPLOY_TYPE = 118; // strip retypes `alfredo up my-saas`
const DEPLOY_OK = 150; // ok lands in the strip
const BAY_FILL = 154; // newborn card ignites into the empty bay
const STRIP_BACK = 176; // strip returns to `fleet` with the refrain at 4
const DIM_AT = 372;

const MAIL_EVENTS = [
	{ p: "shiplog", at: 90 },
	{ p: "pantry-api", at: 130 },
	{ p: "invoicer", at: 200 },
	{ p: "pantry-api", at: 255 },
	{ p: "my-saas", at: 300 },
];
const PAY_EVENTS = [
	{ p: "invoicer", at: 210, eur: 49 },
	{ p: "shiplog", at: 280, eur: 29 },
];

function fmt(n: number) {
	return n.toLocaleString("en-US");
}

function flash(frame: number, at: number, dur = 14) {
	if (frame < at || frame >= at + dur) return 0;
	return 1 - (frame - at) / dur;
}

function httpValue(p: ProjectSpec, frame: number) {
	if (frame < p.tickFrom) return p.req;
	const buckets = Math.floor((frame - p.tickFrom) / 6);
	let total = p.req;
	for (let k = 0; k <= buckets; k++) {
		total += Math.floor(random(`${p.name}-req-${k}`) * (p.maxInc + 1));
	}
	return total;
}

function mailValue(p: ProjectSpec, frame: number) {
	return (
		p.mail + MAIL_EVENTS.filter((e) => e.p === p.name && e.at <= frame).length
	);
}

function mailFlash(p: ProjectSpec, frame: number) {
	return MAIL_EVENTS.filter((e) => e.p === p.name).reduce(
		(a, e) => Math.max(a, flash(frame, e.at)),
		0,
	);
}

function payValue(p: ProjectSpec, frame: number) {
	return (
		p.pay + PAY_EVENTS.filter((e) => e.p === p.name && e.at <= frame).length
	);
}

function payFlash(p: ProjectSpec, frame: number) {
	return PAY_EVENTS.filter((e) => e.p === p.name).reduce(
		(a, e) => Math.max(a, flash(frame, e.at)),
		0,
	);
}

function loadValue(p: ProjectSpec, frame: number) {
	const bucket = Math.floor(frame / 15);
	const jitter = Math.floor(random(`${p.name}-load-${bucket}`) * 3) - 1;
	const spike = p.name === "pantry-api" && frame >= 210 && frame < 270 ? 2 : 0;
	return Math.max(1, Math.min(10, p.load + jitter + spike));
}

function enterAt(frame: number, at: number) {
	const t = interpolate(frame, [at, at + 10], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: Easing.out(Easing.cubic),
	});
	return {
		opacity: t,
		transform: `translateY(${(1 - t) * 10}px)`,
	};
}

const panelStyle: CSSProperties = {
	background: ink.panel,
	border: `1px solid ${ink.seam}`,
	borderRadius: 12,
};

function Tile({
	label,
	value,
	note,
	glow = 0,
	style,
}: {
	label: string;
	value: string;
	note: string;
	glow?: number;
	style: CSSProperties;
}) {
	return (
		<div
			style={{
				...panelStyle,
				flex: 1,
				padding: "16px 22px",
				display: "flex",
				flexDirection: "column",
				gap: 6,
				...style,
			}}
		>
			<Etch size={12}>{label}</Etch>
			<span
				style={{
					fontSize: 36,
					fontWeight: 700,
					letterSpacing: "-0.02em",
					fontVariantNumeric: "tabular-nums",
					color: glow > 0 ? ink.amber : ink.paper,
					textShadow: glow > 0 ? `0 0 ${10 * glow}px ${ink.amberGlow}` : "none",
				}}
			>
				{value}
			</span>
			<span
				style={{ fontFamily: fonts.mono, fontSize: 13, color: ink.paperSoft }}
			>
				{note}
			</span>
		</div>
	);
}

function CardBody({ p, frame }: { p: ProjectSpec; frame: number }) {
	const stats = [
		{ label: "HTTP", value: fmt(httpValue(p, frame)), flash: 0 },
		{
			label: "MAIL",
			value: fmt(mailValue(p, frame)),
			flash: mailFlash(p, frame),
		},
		{ label: "PAY", value: fmt(payValue(p, frame)), flash: payFlash(p, frame) },
	];
	return (
		<>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "baseline",
					gap: 8,
				}}
			>
				<span style={{ display: "inline-flex", alignItems: "center", gap: 9 }}>
					<Led size={9} />
					<span
						style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.01em" }}
					>
						{p.name}
					</span>
				</span>
				<Etch size={10}>{p.up}</Etch>
			</div>
			<LoadBar lit={loadValue(p, frame)} />
			<div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
				{stats.map((s) => (
					<span
						key={s.label}
						style={{ display: "flex", flexDirection: "column", gap: 3 }}
					>
						<Etch size={10}>{s.label}</Etch>
						<span
							style={{
								fontFamily: fonts.mono,
								fontSize: 15,
								fontVariantNumeric: "tabular-nums",
								color: s.flash > 0 ? ink.green : ink.paper,
								textShadow:
									s.flash > 0
										? `0 0 ${8 * s.flash}px ${ink.greenGlow}`
										: "none",
							}}
						>
							{s.value}
						</span>
					</span>
				))}
			</div>
		</>
	);
}

function ProjectCard({
	p,
	frame,
	style,
}: {
	p: ProjectSpec;
	frame: number;
	style: CSSProperties;
}) {
	return (
		<div
			style={{
				...panelStyle,
				flex: 1,
				padding: "18px 20px",
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between",
				gap: 14,
				...style,
			}}
		>
			<CardBody p={p} frame={frame} />
		</div>
	);
}

// Fourth slot: an etched empty bay until the deploy fills it mid-loop.
function NewbornBay({ frame, style }: { frame: number; style: CSSProperties }) {
	const bayOut = interpolate(frame, [BAY_FILL - 4, BAY_FILL + 4], [1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	const cardIn = enterAt(frame, BAY_FILL);
	return (
		<div style={{ flex: 1, position: "relative", ...style }}>
			<div
				style={{
					position: "absolute",
					inset: 0,
					border: `1px dashed ${ink.seam}`,
					borderRadius: 12,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					gap: 10,
					opacity: bayOut,
				}}
			>
				<Led size={9} on={false} />
				<Etch size={10}>BAY 004 · EMPTY</Etch>
			</div>
			{frame >= BAY_FILL && (
				<div
					style={{
						...panelStyle,
						position: "absolute",
						inset: 0,
						padding: "18px 20px",
						display: "flex",
						flexDirection: "column",
						justifyContent: "space-between",
						gap: 14,
						...cardIn,
					}}
				>
					<CardBody p={NEWBORN} frame={frame} />
				</div>
			)}
		</div>
	);
}

function FleetStrip({ frame }: { frame: number }) {
	const twFleet = useTypewriter("fleet", { cps: 16, startFrame: 48 });
	const twUp = useTypewriter("alfredo up my-saas", {
		cps: 24,
		startFrame: DEPLOY_TYPE,
	});
	const twBack = useTypewriter("fleet", { cps: 20, startFrame: STRIP_BACK });

	let typed: string;
	let typing: boolean;
	if (frame < DEPLOY_TYPE) {
		typed = twFleet.text;
		typing = twFleet.typing;
	} else if (frame < STRIP_BACK) {
		typed = twUp.text;
		typing = twUp.typing;
	} else {
		typed = twBack.text;
		typing = twBack.typing;
	}

	const refrainCount = frame < STRIP_BACK ? 3 : 4;
	const refrainAt = frame < DEPLOY_TYPE ? 68 : 192;
	const showRefrain = frame < DEPLOY_TYPE || frame >= STRIP_BACK;
	const refrain = interpolate(frame, [refrainAt, refrainAt + 4], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	const okIn = interpolate(frame, [DEPLOY_OK, DEPLOY_OK + 3], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				background: ink.displayBg,
				border: `1px solid ${ink.seam}`,
				borderRadius: 10,
				padding: "12px 20px",
				boxShadow: "inset 0 2px 8px rgba(0, 0, 0, 0.7)",
				fontFamily: fonts.terminal,
				fontSize: 23,
				whiteSpace: "pre",
				...enterAt(frame, 44),
			}}
		>
			<span
				style={{ color: ink.green, textShadow: `0 0 6px ${ink.greenGlow}` }}
			>
				{"> "}
				{typed}
			</span>
			{frame >= DEPLOY_TYPE && frame < STRIP_BACK && (
				<span
					style={{
						opacity: okIn,
						color: ink.green,
						textShadow: `0 0 8px ${ink.greenGlow}`,
					}}
				>
					{" ............ ok"}
				</span>
			)}
			{showRefrain && (
				<span
					style={{
						opacity: refrain,
						color: ink.amber,
						textShadow: `0 0 7px ${ink.amberGlow}`,
					}}
				>
					{` — ${refrainCount} PROJECTS · 1 BOX · 0 EXTRA TABS`}
				</span>
			)}
			<Caret
				color={ink.green}
				blink={!typing}
				style={{ width: 12, height: 23, marginLeft: 4 }}
			/>
		</div>
	);
}

export function ActLife() {
	const frame = useCurrentFrame();

	const everyone = [...FLEET, NEWBORN];
	const newbornLive = frame >= BAY_FILL;
	const counted = newbornLive ? everyone : FLEET;

	const totReq = counted.reduce((a, p) => a + httpValue(p, frame), 0);
	const totMail = counted.reduce((a, p) => a + mailValue(p, frame), 0);
	const totEur =
		FLEET.reduce((a, p) => a + p.eur, 0) +
		PAY_EVENTS.filter((e) => e.at <= frame).reduce((a, e) => a + e.eur, 0);
	const eurGlow = PAY_EVENTS.reduce(
		(a, e) => Math.max(a, flash(frame, e.at, 18)),
		0,
	);
	const fleetGlow = flash(frame, BAY_FILL, 18);

	const dim = interpolate(frame, [DIM_AT, DIM_AT + 16], [1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: Easing.in(Easing.cubic),
	});

	return (
		<ConsoleFrame mode="DASHBOARD">
			<AbsoluteFill
				style={{
					padding: "28px 32px",
					display: "flex",
					flexDirection: "column",
					gap: 16,
					opacity: dim,
				}}
			>
				<div style={{ display: "flex", gap: 14 }}>
					<Tile
						label="TRAFFIC"
						value={fmt(totReq)}
						note="busiest: pantry-api"
						style={enterAt(frame, 8)}
					/>
					<Tile
						label="MAIL"
						value={fmt(totMail)}
						note={`across ${counted.length} inboxes`}
						style={enterAt(frame, 13)}
					/>
					<Tile
						label="REVENUE"
						value={`€ ${fmt(totEur)}`}
						note="top: invoicer"
						glow={eurGlow}
						style={enterAt(frame, 18)}
					/>
					<Tile
						label="FLEET"
						value={newbornLive ? "4/4" : "3/4"}
						note={newbornLive ? "live · 0 incidents" : "1 bay free"}
						glow={fleetGlow}
						style={enterAt(frame, 23)}
					/>
				</div>

				<div style={{ display: "flex", gap: 14, flex: 1 }}>
					{FLEET.map((p, i) => (
						<ProjectCard
							key={p.name}
							p={p}
							frame={frame}
							style={enterAt(frame, 26 + i * 6)}
						/>
					))}
					<NewbornBay frame={frame} style={enterAt(frame, 44)} />
				</div>

				<FleetStrip frame={frame} />
			</AbsoluteFill>
		</ConsoleFrame>
	);
}
