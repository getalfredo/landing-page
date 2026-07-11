import "./styles.css";
import { Composition } from "remotion";
import { ActBirth } from "./ActBirth";
import { ActLife } from "./ActLife";

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
		</>
	);
}
