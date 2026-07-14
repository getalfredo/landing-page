// Shared Console tokens (identity v2, wayfinder #11) for web sections,
// the OG frame, and the Remotion act videos. Client-bundle safe: no
// @remotion/google-fonts imports; production fonts are self-hosted via
// the @fontsource imports in src/styles.css.

export const ink = {
	bg: "#14150e",
	panel: "#1e1f16",
	panel2: "#24251b",
	surface: "#191a11",
	seam: "rgba(236, 231, 218, 0.1)",
	paper: "#ece7da",
	paperRgb: "236, 231, 218",
	paperSoft: "#97927f",
	led: "#3bd23b",
	ledRgb: "59, 210, 59",
	ledGlow: "rgba(59, 210, 59, 0.75)",
	ledOff: "#3a3b30",
	green: "#58e85c",
	greenRgb: "88, 232, 92",
	greenGlow: "rgba(88, 232, 92, 0.45)",
	amber: "#ffd23c",
	amberRgb: "255, 210, 60",
	amberGlow: "rgba(255, 210, 60, 0.4)",
	displayBg: "#0d0e08",
};

// Keycap material palette (identity v2 keycaps): shared by the shell button
// vocabulary in landing.css and the switchboard keys in showcase.css so
// both render the same bone/amber keycap material from one source.
export const keycap = {
	boneTop: "#f6f3ea",
	boneBottom: "#e4dfd3",
	boneHoverTop: "#fffdf6",
	boneHoverBottom: "#ece7da",
	boneShadow: "#a29a86",
	ink: "#1c1913",
	inkRgb: "28, 25, 19",
	amberTop: "#ffd23c",
	amberBottom: "#eab821",
	amberHoverTop: "#ffe071",
	amberShadow: "#9a7a10",
	ledOn: "#fff8e6",
	ledOnGlowRgb: "255, 246, 220",
};
