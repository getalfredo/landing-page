// Favicon / tab mark for wayfinder #21: Space Grotesk bold "A" in paper on
// an anodize-charcoal rounded square, LED-green dot vertically centered,
// layered in front of the letter at the right edge ("front · right").
// Registered as two separate stills (180×180 apple-touch-icon, 32×32
// favicon) so the 32px asset renders at its own size with integer-rounded
// proportions instead of a non-integer downscale of the 180px mark.
// Fonts come from the loadFont-bound `fonts` in console/theme.ts so the
// headless render loads the real typeface.
import { fonts, ink } from "./console/theme";

// Proportions from the approved 64px reference in the variant-w page.
const BASE = 64;

export function FaviconMark({ size }: { size: number }) {
	const s = size / BASE;
	const dotSize = Math.round(16 * s);
	const radius = Math.round(14 * s);
	const fontSize = Math.round(46 * s);
	const dotRight = Math.round(10 * s);
	return (
		<div
			style={{
				width: size,
				height: size,
				borderRadius: radius,
				background: ink.bg,
				border: `1px solid ${ink.seam}`,
				position: "relative",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				overflow: "hidden",
			}}
		>
			<span
				style={{
					position: "absolute",
					width: dotSize,
					height: dotSize,
					top: Math.round(size / 2 - dotSize / 2),
					left: size - dotRight - dotSize,
					borderRadius: "50%",
					background: ink.led,
					boxShadow: `0 0 ${Math.round(8 * s)}px ${ink.ledGlow}`,
					zIndex: 2,
				}}
			/>
			<span
				style={{
					fontFamily: fonts.display,
					fontWeight: 700,
					fontSize,
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
