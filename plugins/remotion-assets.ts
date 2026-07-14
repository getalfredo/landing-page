// Build-time Remotion asset pipeline (promotion of the validated Shape B
// prototype, .prototypes/remotion-build-vite-plugin.ts): drives
// @remotion/bundler + @remotion/renderer programmatically to render the two
// act videos, their posters and reduced-motion frames, the OG still, and the
// favicon PNGs into public/generated/. Bundles once and shares one Chromium
// across every render.
//
// Also runnable standalone (the Docker escape hatch, prebuild assets and set
// SKIP_REMOTION_RENDER=1): `bun run assets:render`.
import { existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { bundle } from "@remotion/bundler";
import {
	openBrowser,
	renderMedia,
	renderStill,
	selectComposition,
} from "@remotion/renderer";
import type { Plugin } from "vite";
import { remotionWebpackOverride } from "../src/remotion/webpack-override";

const ROOT = join(import.meta.dirname, "..");
const ENTRY = join(ROOT, "src/remotion/index.ts");
const OUT_DIR = join(ROOT, "public/generated");

// Reduced-motion frames are claim-carrying (issue-15 §4): PatchBay at the
// second deploy with both REUSED and STARTED wire tags visible, Lanes at the
// retirement beat with the LANES KEEP RUNNING etch visible. Frame 380 sits
// after each composition's last reveal (PatchBay LIVE2=352 + tag fades,
// Lanes RETIRE=324 + note at ~350) and before the dim-out at 420.
const VIDEO_ASSETS = [
	{ id: "WiringPatchBay", slug: "wiring-patchbay", reducedMotionFrame: 380 },
	{ id: "WiringLanes", slug: "wiring-lanes", reducedMotionFrame: 380 },
] as const;

const STILL_ASSETS = [
	{ id: "OgImage", file: "og.png" },
	{ id: "FaviconMark", file: "apple-touch-icon.png" },
	{ id: "Favicon32", file: "favicon-32.png" },
] as const;

const EXPECTED_OUTPUTS = [
	...VIDEO_ASSETS.flatMap((v) => [
		`${v.slug}.mp4`,
		`${v.slug}-poster.jpg`,
		`${v.slug}-reduced-motion.jpg`,
	]),
	...STILL_ASSETS.map((s) => s.file),
];

function missingOutputs(): string[] {
	return EXPECTED_OUTPUTS.filter((f) => !existsSync(join(OUT_DIR, f)));
}

// Verifies the prebuilt assets when SKIP_REMOTION_RENDER=1 short-circuits a
// render: the build must fail loudly rather than ship 404 video/OG links.
function assertOutputsPresent() {
	const missing = missingOutputs();
	if (missing.length > 0) {
		const cause =
			process.env.SKIP_REMOTION_RENDER === "1"
				? "SKIP_REMOTION_RENDER=1 but"
				: "render did not run or was skipped and";
		throw new Error(
			`[remotion-assets] ${cause} ${missing.length} expected output(s) are missing from public/generated/:\n` +
				missing.map((f) => `  - ${f}`).join("\n") +
				"\nPrebuild them with `bun run assets:render` or unset SKIP_REMOTION_RENDER.",
		);
	}
}

export async function renderAssets() {
	mkdirSync(OUT_DIR, { recursive: true });
	console.log("[remotion-assets] render pass starting (bundle once, one Chromium)");

	const serveUrl = await bundle({
		entryPoint: ENTRY,
		webpackOverride: remotionWebpackOverride,
	});
	const browser = await openBrowser("chrome");
	try {
		for (const v of VIDEO_ASSETS) {
			const composition = await selectComposition({
				serveUrl,
				id: v.id,
				inputProps: {},
				puppeteerInstance: browser,
			});
			await renderMedia({
				composition,
				serveUrl,
				codec: "h264",
				outputLocation: join(OUT_DIR, `${v.slug}.mp4`),
				puppeteerInstance: browser,
			});
			console.log(`[remotion-assets] rendered ${v.slug}.mp4`);
			await renderStill({
				composition,
				serveUrl,
				output: join(OUT_DIR, `${v.slug}-poster.jpg`),
				frame: 0,
				imageFormat: "jpeg",
				puppeteerInstance: browser,
			});
			await renderStill({
				composition,
				serveUrl,
				output: join(OUT_DIR, `${v.slug}-reduced-motion.jpg`),
				frame: v.reducedMotionFrame,
				imageFormat: "jpeg",
				puppeteerInstance: browser,
			});
			console.log(
				`[remotion-assets] rendered ${v.slug}-poster.jpg + ${v.slug}-reduced-motion.jpg`,
			);
		}
		for (const s of STILL_ASSETS) {
			const composition = await selectComposition({
				serveUrl,
				id: s.id,
				inputProps: {},
				puppeteerInstance: browser,
			});
			await renderStill({
				composition,
				serveUrl,
				output: join(OUT_DIR, s.file),
				imageFormat: "png",
				puppeteerInstance: browser,
			});
			console.log(`[remotion-assets] rendered ${s.file}`);
		}
	} finally {
		await browser.close({ silent: true });
	}
	console.log("[remotion-assets] render pass complete");
}

// buildStart fires once per Vite environment (client/ssr/nitro here), so the
// render is guarded by sharedDuringBuild + a module-level once-flag to make
// exactly one pass per build invocation (the build log is the acceptance
// gate: it must show a single "render pass starting" line).
let renderedThisBuild = false;

export function remotionAssets(): Plugin {
	let command: "build" | "serve" = "serve";
	return {
		name: "remotion-assets",
		sharedDuringBuild: true,
		configResolved(config) {
			command = config.command;
		},
		async buildStart() {
			// Dev renders via configureServer instead (buildStart also fires
			// under `vite dev`, where we only want the render-when-missing path).
			if (command !== "build") return;
			if (renderedThisBuild) return;
			// Fallback for the once-flag in case the shared instance misbehaves
			// and separate per-environment module copies get their own flags.
			if (this.environment && this.environment.name !== "client") return;
			renderedThisBuild = true;
			if (process.env.SKIP_REMOTION_RENDER === "1") {
				assertOutputsPresent();
				console.log(
					"[remotion-assets] SKIP_REMOTION_RENDER=1, all outputs present, skipping render",
				);
				return;
			}
			await renderAssets();
		},
		// Postcondition check independent of the once-flag / environment-name
		// gate above: if renderAssets() never ran this build (e.g. the
		// "client" environment name the gate relies on gets renamed or
		// dropped), fail the build loudly here instead of shipping 404
		// asset links.
		async closeBundle() {
			if (command !== "build") return;
			assertOutputsPresent();
		},
		async configureServer() {
			if (process.env.SKIP_REMOTION_RENDER === "1") {
				assertOutputsPresent();
				return;
			}
			// Dev path only checks existence, so stale assets keep serving old
			// videos in dev until you delete public/generated/.
			if (missingOutputs().length > 0) {
				await renderAssets();
			}
		},
	};
}

// Standalone entry for `bun run assets:render` (tsx plugins/remotion-assets.ts).
const invokedDirectly =
	process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (invokedDirectly) {
	renderAssets().catch((err) => {
		console.error(err);
		process.exit(1);
	});
}
