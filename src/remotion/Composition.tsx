import { loadFont } from "@remotion/google-fonts/Inter";
import { AbsoluteFill, Sequence } from "remotion";
import { Backdrop } from "@/components/remocn/backdrop";
import { DynamicGrid } from "@/components/remocn/dynamic-grid";
import { MicroScaleFade } from "@/components/remocn/micro-scale-fade";
import { TrackingIn } from "@/components/remocn/tracking-in";

const inter = loadFont("normal", {
	weights: ["500", "700"],
	subsets: ["latin"],
});

export function AlfredoIntro() {
	return (
		<Backdrop
			padding={0}
			radius={0}
			shadow="none"
			fill={
				<DynamicGrid
					background="#0a0a0a"
					lineColor="rgba(255,255,255,0.05)"
					speed={0.4}
				/>
			}
		>
			<AbsoluteFill
				style={{
					transform: "translateY(-56px)",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<Sequence layout="none">
					<TrackingIn
						text="Alfredo"
						color="#fafafa"
						fontWeight={700}
						fontSize={140}
						fontFamily={inter.fontFamily}
						background="transparent"
					/>
				</Sequence>
			</AbsoluteFill>
			<AbsoluteFill
				style={{
					transform: "translateY(76px)",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<Sequence from={24} layout="none">
					<MicroScaleFade
						text="Ship your new SaaS in minutes."
						color="#fafafa"
						fontWeight={500}
						fontSize={34}
						fontFamily={inter.fontFamily}
					/>
				</Sequence>
			</AbsoluteFill>
		</Backdrop>
	);
}
