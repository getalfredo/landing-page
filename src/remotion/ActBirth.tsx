// Act 1 anchor video (wayfinder #12): a project being born. The boot
// readout types `alfredo up`, each module reports ok, READY lands in
// amber — then the terminal glides up and the live project card rises
// in below it. Readout and card stay on screen together, so a visitor
// glancing at any point in the loop sees the whole claim. 390 frames
// @ 30fps, loops seamlessly back to the bare prompt.
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

const MODULES = ["auth", "email", "db", "analytics", "secrets"];
const COMMAND = `alfredo up my-saas --with ${MODULES.join(",")}`;

// Timeline anchors (frames @ 30fps)
const TYPE_START = 24;
const BOOT_START = 100;
const BOOT_STAGGER = 16;
const OK_DELAY = 9;
const READY_AT = 184;
const CARD_IN = 200; // terminal glides up, card rises in below
const WELLS_AT = 214;
const HTTP_AT = 224;
const MAIL_AT = 312;
const CLEAR_AT = 354; // display clears back toward the bare prompt
const PROMPT_BACK = 374;

function lineIn(frame: number, at: number) {
	return interpolate(frame, [at, at + 3], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
}

function BootTerminal({ frame }: { frame: number }) {
	// After the clear the window returns bare — same content as frame 0.
	const reset = frame >= PROMPT_BACK - 10;
	const tw = useTypewriter(COMMAND, { cps: 26, startFrame: TYPE_START });
	const typed = reset ? "" : tw.text;
	const showCaret = reset || frame < BOOT_START;

	const opacity = interpolate(
		frame,
		[CLEAR_AT, CLEAR_AT + 14, PROMPT_BACK, PROMPT_BACK + 12],
		[1, 0, 0, 1],
		{ extrapolateLeft: "clamp", extrapolateRight: "clamp" },
	);

	// Centered while the readout runs; glides up when the card arrives.
	const top = interpolate(frame, [CARD_IN - 4, CARD_IN + 10], [130, 24], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: Easing.out(Easing.cubic),
	});

	return (
		<div
			style={{
				position: "absolute",
				top,
				left: "50%",
				transform: "translateX(-50%)",
				width: 760,
				height: 282,
				background: ink.displayBg,
				border: `1px solid ${ink.seam}`,
				borderRadius: 12,
				padding: "20px 26px",
				boxShadow: "inset 0 3px 12px rgba(0, 0, 0, 0.8)",
				fontFamily: fonts.terminal,
				fontSize: 23,
				lineHeight: 1.5,
				color: ink.green,
				whiteSpace: "pre",
				opacity,
			}}
		>
			<div style={{ textShadow: `0 0 7px ${ink.greenGlow}` }}>
				{"> "}
				{typed}
				{showCaret && (
					<Caret
						color={ink.green}
						blink={!tw.typing || reset}
						style={{ width: 12, height: 23, verticalAlign: "text-bottom" }}
					/>
				)}
			</div>
			{!reset &&
				MODULES.map((id, i) => {
					const at = BOOT_START + i * BOOT_STAGGER;
					return (
						<div key={id} style={{ opacity: lineIn(frame, at) }}>
							<span style={{ opacity: 0.85 }}>
								{id} {".".repeat(16 - id.length)}
							</span>
							<span
								style={{
									opacity: lineIn(frame, at + OK_DELAY),
									textShadow: `0 0 8px ${ink.greenGlow}`,
								}}
							>
								{" ok"}
							</span>
						</div>
					);
				})}
			{!reset && (
				<div
					style={{
						opacity: lineIn(frame, READY_AT),
						color: ink.amber,
						textShadow: `0 0 7px ${ink.amberGlow}`,
					}}
				>
					{"READY  00:05"}
				</div>
			)}
		</div>
	);
}

function tricklingHttp(frame: number) {
	if (frame < HTTP_AT) return 0;
	const buckets = Math.floor((frame - HTTP_AT) / 8);
	let total = 0;
	for (let k = 0; k <= buckets; k++) {
		total += random(`birth-http-${k}`) < 0.55 ? 1 : 0;
	}
	return total;
}

function LiveCard({ frame }: { frame: number }) {
	const enter = interpolate(frame, [CARD_IN, CARD_IN + 12], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: Easing.out(Easing.cubic),
	});
	const exit = interpolate(frame, [CLEAR_AT, CLEAR_AT + 14], [1, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
		easing: Easing.in(Easing.cubic),
	});
	const opacity = enter * exit;
	const rise = (1 - enter) * 16;

	const loadBucket = Math.floor(frame / 15);
	const load = 1 + (random(`birth-load-${loadBucket}`) < 0.5 ? 1 : 0);
	const http = tricklingHttp(frame);
	const mail = frame >= MAIL_AT ? 1 : 0;
	const mailFlash =
		frame < MAIL_AT
			? 0
			: interpolate(frame, [MAIL_AT, MAIL_AT + 14], [1, 0], {
					extrapolateRight: "clamp",
				});

	const stats: Array<{ label: string; value: string; flash: number }> = [
		{ label: "HTTP", value: String(http), flash: 0 },
		{ label: "MAIL", value: String(mail), flash: mailFlash },
		{ label: "PAY", value: "0", flash: 0 },
	];

	return (
		<div
			style={{
				position: "absolute",
				bottom: 24,
				left: "50%",
				width: 760,
				background: ink.panel,
				border: `1px solid ${ink.seam}`,
				borderRadius: 14,
				padding: "18px 24px",
				display: "flex",
				flexDirection: "column",
				gap: 14,
				opacity,
				transform: `translateX(-50%) translateY(${rise}px)`,
			}}
		>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					gap: 16,
				}}
			>
				<span style={{ display: "inline-flex", alignItems: "center", gap: 11 }}>
					<Led size={11} />
					<span
						style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.02em" }}
					>
						my-saas
					</span>
				</span>
				<span
					style={{ fontFamily: fonts.mono, fontSize: 14, color: ink.green }}
				>
					https://my-saas.mybox.dev
				</span>
				<Etch size={11}>LIVE · UP 0M</Etch>
			</div>

			<LoadBar lit={load} />

			<div style={{ display: "flex", gap: 12 }}>
				{MODULES.map((id, i) => {
					const pop = interpolate(
						frame,
						[WELLS_AT + i * 6, WELLS_AT + 6 + i * 6],
						[0, 1],
						{ extrapolateLeft: "clamp", extrapolateRight: "clamp" },
					);
					return (
						<span
							key={id}
							style={{
								flex: 1,
								display: "flex",
								alignItems: "center",
								gap: 8,
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
								}}
							>
								<span style={{ opacity: pop }}>✓</span>
							</span>
							<Etch size={10}>{id}</Etch>
						</span>
					);
				})}
			</div>

			<div style={{ display: "flex", alignItems: "flex-end", gap: 36 }}>
				{stats.map((s) => (
					<span
						key={s.label}
						style={{ display: "flex", flexDirection: "column", gap: 3 }}
					>
						<Etch size={10}>{s.label}</Etch>
						<span
							style={{
								fontFamily: fonts.mono,
								fontSize: 17,
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
				<span style={{ marginLeft: "auto" }}>
					<Etch size={10}>5 MODULES · WIRED ONCE · 0 CONFIG COPIED</Etch>
				</span>
			</div>
		</div>
	);
}

export function ActBirth() {
	const frame = useCurrentFrame();
	return (
		<ConsoleFrame
			mode={frame >= CARD_IN && frame < PROMPT_BACK ? "LIVE" : "DEPLOY"}
		>
			<AbsoluteFill>
				<BootTerminal frame={frame} />
				{frame >= CARD_IN && frame < PROMPT_BACK && <LiveCard frame={frame} />}
			</AbsoluteFill>
		</ConsoleFrame>
	);
}
