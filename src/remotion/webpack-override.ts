// Single owner of the webpackOverride used by both the Remotion CLI config
// (remotion.config.ts, via Config.overrideWebpackConfig) and the build-time
// asset pipeline's programmatic bundle() call (plugins/remotion-assets.ts).
// bundle() does NOT read remotion.config.ts (only the Remotion CLI loads it),
// so this module is imported directly by both call sites to keep the
// Tailwind + "@" -> src alias invariant in one place.
import { join } from "node:path";
import type { WebpackOverrideFn } from "@remotion/bundler";
import { enableTailwind } from "@remotion/tailwind-v4";

// remotion.config.ts is loaded by the Remotion CLI in a CJS context, where
// `import.meta` is unavailable/empty, so this module resolves the src dir
// from process.cwd() (both entry points are always invoked from the project
// root) rather than import.meta.dirname.
const SRC_DIR = join(process.cwd(), "src");

export const remotionWebpackOverride: WebpackOverrideFn = (config) =>
	enableTailwind({
		...config,
		resolve: {
			...config.resolve,
			alias: {
				...config.resolve?.alias,
				"@": SRC_DIR,
			},
		},
	});
