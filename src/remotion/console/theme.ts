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

export const ink = {
	bg: "#14150e",
	panel: "#1e1f16",
	panel2: "#24251b",
	surface: "#191a11",
	seam: "rgba(236, 231, 218, 0.1)",
	paper: "#ece7da",
	paperSoft: "#97927f",
	led: "#3bd23b",
	ledGlow: "rgba(59, 210, 59, 0.75)",
	ledOff: "#3a3b30",
	green: "#58e85c",
	greenGlow: "rgba(88, 232, 92, 0.45)",
	amber: "#ffd23c",
	amberGlow: "rgba(255, 210, 60, 0.4)",
	displayBg: "#0d0e08",
};
