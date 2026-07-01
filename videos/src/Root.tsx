import "./index.css";
import { Composition } from "remotion";
import { AlfredoIntro } from "./Composition";

export const RemotionRoot: React.FC = () => {
	return (
		<>
			<Composition
				id="AlfredoIntro"
				component={AlfredoIntro}
				durationInFrames={120}
				fps={30}
				width={1920}
				height={1080}
			/>
		</>
	);
};
