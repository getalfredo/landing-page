import "./styles.css";
import { Composition, Still } from "remotion";
import { ActBirth } from "./ActBirth";
import { ActLife } from "./ActLife";
import { FaviconMark } from "./FaviconMark";
import { OgImage } from "./OgImage";
import { WiringLanes } from "./WiringLanes";
import { WiringPatchBay } from "./WiringPatchBay";

// Both act videos loop on the page: 390 frames = 13s @ 30fps, designed so
// the last frame hands back to the first (bare prompt / dimmed display).
export function RemotionRoot() {
	return (
		<>
			<Composition
				id="ActBirth"
				component={ActBirth}
				durationInFrames={390}
				fps={30}
				width={1280}
				height={720}
			/>
			<Composition
				id="ActLife"
				component={ActLife}
				durationInFrames={390}
				fps={30}
				width={1280}
				height={720}
			/>
			{/* PROTOTYPE (wayfinder #18): wiring-video variants, dim out to loop. */}
			<Composition
				id="WiringPatchBay"
				component={WiringPatchBay}
				durationInFrames={450}
				fps={30}
				width={1280}
				height={720}
			/>
			<Composition
				id="WiringLanes"
				component={WiringLanes}
				durationInFrames={450}
				fps={30}
				width={1280}
				height={720}
			/>
			{/* Build-time share/tab assets (wayfinder #21), rendered by
			    plugins/remotion-assets.ts into public/generated/. */}
			<Still id="OgImage" component={OgImage} width={1200} height={630} />
			<Still
				id="FaviconMark"
				component={FaviconMark}
				width={180}
				height={180}
				defaultProps={{ size: 180 }}
			/>
			<Still
				id="Favicon32"
				component={FaviconMark}
				width={32}
				height={32}
				defaultProps={{ size: 32 }}
			/>
		</>
	);
}
