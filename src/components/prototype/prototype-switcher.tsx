// PROTOTYPE — throwaway switcher for the visual-identity exploration (wayfinder #3).
// Delete together with the variant components once a direction wins.
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export type VariantKey = "d" | "f" | "h";

export const VARIANTS: Record<VariantKey, string> = {
	d: "The Machine (v1 baseline)",
	f: "Big Readout",
	h: "The Console",
};

const ORDER: VariantKey[] = ["d", "f", "h"];

export function PrototypeSwitcher({ current }: { current: VariantKey }) {
	const navigate = useNavigate();

	const go = (dir: 1 | -1) => {
		const idx = ORDER.indexOf(current);
		const next = ORDER[(idx + dir + ORDER.length) % ORDER.length];
		navigate({ to: "/", search: { variant: next }, replace: true });
	};

	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			const t = e.target as HTMLElement | null;
			if (
				t &&
				(t.tagName === "INPUT" ||
					t.tagName === "TEXTAREA" ||
					t.isContentEditable)
			) {
				return;
			}
			if (e.key === "ArrowLeft") go(-1);
			if (e.key === "ArrowRight") go(1);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	});

	if (import.meta.env.PROD) return null;

	return (
		<div
			style={{
				position: "fixed",
				bottom: 16,
				left: "50%",
				transform: "translateX(-50%)",
				zIndex: 9999,
				display: "flex",
				alignItems: "center",
				gap: 12,
				background: "#111",
				color: "#fff",
				borderRadius: 999,
				padding: "8px 14px",
				boxShadow: "0 4px 16px rgba(0,0,0,0.35)",
				fontFamily: "system-ui, sans-serif",
				fontSize: 13,
			}}
		>
			<button
				type="button"
				onClick={() => go(-1)}
				aria-label="Previous variant"
				style={arrowStyle}
			>
				←
			</button>
			<span style={{ minWidth: 150, textAlign: "center" }}>
				{current.toUpperCase()} — {VARIANTS[current]}
			</span>
			<button
				type="button"
				onClick={() => go(1)}
				aria-label="Next variant"
				style={arrowStyle}
			>
				→
			</button>
		</div>
	);
}

const arrowStyle: React.CSSProperties = {
	background: "#333",
	color: "#fff",
	border: "none",
	borderRadius: 999,
	width: 28,
	height: 28,
	cursor: "pointer",
	lineHeight: 1,
};
