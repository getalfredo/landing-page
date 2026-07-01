import {
	AbsoluteFill,
	Easing,
	interpolate,
	Sequence,
	useCurrentFrame,
	useVideoConfig,
} from "remotion";

const SANS =
	'"Inter", system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

// Smooth, slightly-overshooting ease used for every entrance.
const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);

const Background: React.FC = () => {
	const frame = useCurrentFrame();
	const { durationInFrames } = useVideoConfig();

	// Two glows drift slowly across the whole clip so the frame never feels static.
	const driftA = interpolate(frame, [0, durationInFrames], [-60, 60]);
	const driftB = interpolate(frame, [0, durationInFrames], [40, -40]);

	return (
		<AbsoluteFill
			style={{
				background:
					"radial-gradient(circle at 50% 32%, #1e1b4b 0%, #0b0b14 58%, #050509 100%)",
			}}
		>
			<AbsoluteFill
				style={{
					translate: `${driftA}px -40px`,
					background:
						"radial-gradient(420px circle at 32% 30%, rgba(129,140,248,0.35), transparent 70%)",
					filter: "blur(40px)",
				}}
			/>
			<AbsoluteFill
				style={{
					translate: `${driftB}px 60px`,
					background:
						"radial-gradient(460px circle at 70% 72%, rgba(34,211,238,0.22), transparent 70%)",
					filter: "blur(40px)",
				}}
			/>
		</AbsoluteFill>
	);
};

const Headline: React.FC = () => {
	const frame = useCurrentFrame();

	const opacity = interpolate(frame, [0, 18], [0, 1], {
		extrapolateRight: "clamp",
		easing: EASE_OUT,
	});
	const scale = interpolate(frame, [0, 22], [0.9, 1], {
		extrapolateRight: "clamp",
		easing: EASE_OUT,
	});
	const translateY = interpolate(frame, [0, 22], [24, 0], {
		extrapolateRight: "clamp",
		easing: EASE_OUT,
	});

	return (
		<div
			style={{
				opacity,
				scale,
				translate: `0px ${translateY}px`,
				fontFamily: SANS,
				fontSize: 184,
				fontWeight: 800,
				letterSpacing: "-0.04em",
				lineHeight: 1,
				backgroundImage:
					"linear-gradient(135deg, #e9d5ff 0%, #818cf8 45%, #22d3ee 100%)",
				backgroundClip: "text",
				WebkitBackgroundClip: "text",
				color: "transparent",
			}}
		>
			Alfredo
		</div>
	);
};

const AccentLine: React.FC = () => {
	const frame = useCurrentFrame();

	const scaleX = interpolate(frame, [0, 26], [0, 1], {
		extrapolateRight: "clamp",
		easing: EASE_OUT,
	});
	const opacity = interpolate(frame, [0, 10], [0, 1], {
		extrapolateRight: "clamp",
	});

	return (
		<div
			style={{
				opacity,
				scale: `${scaleX} 1`,
				width: 360,
				height: 5,
				borderRadius: 999,
				background: "linear-gradient(90deg, #818cf8, #22d3ee)",
			}}
		/>
	);
};

const Tagline: React.FC = () => {
	const frame = useCurrentFrame();

	const opacity = interpolate(frame, [0, 20], [0, 1], {
		extrapolateRight: "clamp",
		easing: EASE_OUT,
	});
	const translateY = interpolate(frame, [0, 20], [24, 0], {
		extrapolateRight: "clamp",
		easing: EASE_OUT,
	});

	return (
		<div
			style={{
				opacity,
				translate: `0px ${translateY}px`,
				fontFamily: SANS,
				fontSize: 52,
				fontWeight: 500,
				letterSpacing: "-0.01em",
				color: "rgba(226,232,240,0.92)",
			}}
		>
			Ship your new SaaS in minutes.
		</div>
	);
};

export const AlfredoIntro: React.FC = () => {
	return (
		<AbsoluteFill>
			<Sequence>
				<Background />
			</Sequence>
			<AbsoluteFill
				style={{
					justifyContent: "center",
					alignItems: "center",
					gap: 40,
				}}
			>
				<Sequence layout="none">
					<Headline />
				</Sequence>
				<Sequence from={12} layout="none">
					<AccentLine />
				</Sequence>
				<Sequence from={24} layout="none">
					<Tagline />
				</Sequence>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
