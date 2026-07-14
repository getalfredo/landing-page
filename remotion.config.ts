import { Config } from "@remotion/cli/config";
import { remotionWebpackOverride } from "./src/remotion/webpack-override";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setStudioPort(3001); // Vite dev owns 3000

Config.overrideWebpackConfig(remotionWebpackOverride);
