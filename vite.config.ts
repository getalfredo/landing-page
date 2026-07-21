import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";

import { tanstackStart } from "@tanstack/react-start/plugin/vite";

import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";
import { fixRolldownExportAll } from "./plugins/fix-rolldown-exportall";
import { remotionAssets } from "./plugins/remotion-assets";

const config = defineConfig({
	resolve: { tsconfigPaths: true },
	plugins: [
		fixRolldownExportAll(),
		remotionAssets(),
		devtools(),
		nitro({ rollupConfig: { external: [/^@sentry\//] } }),
		tailwindcss(),
		tanstackStart(),
		viteReact(),
	],
});

export default config;
