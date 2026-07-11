// Shared Console chrome for the act videos: bezel frame, etched microlabels,
// LEDs, and load bars — the component vocabulary from identity v2 (#11).
import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill } from "remotion";
import { fonts, ink } from "./theme";

export function Etch({
	children,
	size = 13,
	style,
}: {
	children: ReactNode;
	size?: number;
	style?: CSSProperties;
}) {
	return (
		<span
			style={{
				fontFamily: fonts.mono,
				fontSize: size,
				fontWeight: 400,
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

export function Led({ size = 11, on = true }: { size?: number; on?: boolean }) {
	return (
		<span
			style={{
				display: "inline-block",
				width: size,
				height: size,
				borderRadius: "50%",
				background: on ? ink.led : ink.ledOff,
				boxShadow: on ? `0 0 ${size}px ${ink.ledGlow}` : "none",
				flexShrink: 0,
			}}
		/>
	);
}

export function LoadBar({ lit, segs = 10 }: { lit: number; segs?: number }) {
	return (
		<div style={{ display: "flex", gap: 4 }}>
			{Array.from({ length: segs }, (_, s) => (
				<span
					// biome-ignore lint/suspicious/noArrayIndexKey: fixed-length static row
					key={s}
					style={{
						flex: 1,
						height: 7,
						borderRadius: 2,
						background: s < lit ? ink.led : ink.ledOff,
						boxShadow: s < lit ? "0 0 5px rgba(59, 210, 59, 0.4)" : "none",
					}}
				/>
			))}
		</div>
	);
}

export function ConsoleFrame({
	mode,
	brand = "CONSOLE",
	refrain = "ONE BOX · ONE CONSOLE · N PROJECTS",
	children,
}: {
	mode: string;
	brand?: string;
	refrain?: string;
	children: ReactNode;
}) {
	const bezelRow: CSSProperties = {
		background: ink.panel,
		border: `1px solid ${ink.seam}`,
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		padding: "14px 30px",
	};
	return (
		<AbsoluteFill style={{ background: ink.bg, fontFamily: fonts.display }}>
			<div
				style={{
					position: "absolute",
					inset: 36,
					display: "flex",
					flexDirection: "column",
				}}
			>
				<div
					style={{
						...bezelRow,
						borderRadius: "16px 16px 0 0",
						borderBottom: "none",
					}}
				>
					<Etch>ALFREDO OS 0.1</Etch>
					<Etch>
						{brand} / {mode}
					</Etch>
					<Etch>UNIT 000-001</Etch>
				</div>
				<div
					style={{
						flex: 1,
						background: ink.surface,
						border: `1px solid ${ink.seam}`,
						boxShadow: "inset 0 4px 18px rgba(0, 0, 0, 0.6)",
						position: "relative",
						overflow: "hidden",
					}}
				>
					{children}
				</div>
				<div
					style={{
						...bezelRow,
						borderRadius: "0 0 16px 16px",
						borderTop: "none",
						justifyContent: "center",
					}}
				>
					<Etch size={11} style={{ opacity: 0.8 }}>
						{refrain}
					</Etch>
				</div>
			</div>
		</AbsoluteFill>
	);
}
