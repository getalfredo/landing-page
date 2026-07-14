// Web Console tokens (identity v2, wayfinder #11) for the Remotion act videos.
import { loadFont as loadPlexMono } from "@remotion/google-fonts/IBMPlexMono";
import { loadFont as loadGrotesk } from "@remotion/google-fonts/SpaceGrotesk";
import { loadFont as loadVT323 } from "@remotion/google-fonts/VT323";

const grotesk = loadGrotesk("normal", {
	weights: ["400", "500", "700"],
	subsets: ["latin"],
});
const plexMono = loadPlexMono("normal", {
	weights: ["400", "500"],
	subsets: ["latin"],
});
const vt323 = loadVT323("normal", {
	weights: ["400"],
	subsets: ["latin"],
});

export const fonts = {
	display: grotesk.fontFamily,
	mono: plexMono.fontFamily,
	terminal: vt323.fontFamily,
};

export { ink } from "../../lib/console-tokens";
