import "./styles.css";
import { Composition } from "remotion";
import { AlfredoIntro } from "./Composition";

export function RemotionRoot() {
	return (
		<>
			<Composition
				id="AlfredoIntro"
				component={AlfredoIntro}
				durationInFrames={135}
				fps={30}
				width={1280}
				height={720}
			/>
		</>
	);
}
