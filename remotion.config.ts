import path from "node:path";
import { Config } from "@remotion/cli/config";
import { enableTailwind } from "@remotion/tailwind-v4";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setStudioPort(3001); // Vite dev owns 3000

Config.overrideWebpackConfig((currentConfig) =>
  enableTailwind({
    ...currentConfig,
    resolve: {
      ...currentConfig.resolve,
      alias: {
        ...currentConfig.resolve?.alias,
        "@": path.join(process.cwd(), "src"),
      },
    },
  }),
);
