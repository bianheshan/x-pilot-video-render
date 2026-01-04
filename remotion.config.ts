/**
 * Note: When using the Node.JS APIs, the config file
 * doesn't apply. Instead, pass options directly to the APIs.
 *
 * All configuration options: https://remotion.dev/docs/config
 */

import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);

// -----------------------------------------------------------------------------
// Robustness: prevent bundling failures from guessed Google Fonts subpath imports
// -----------------------------------------------------------------------------
// AI-generated scenes sometimes import non-existent modules like
// `@remotion/google-fonts/FredokaOne`, which breaks bundling BEFORE our runtime
// error boundary can show anything.
//
// We replace all `@remotion/google-fonts/*` imports with a local shim.
// Scenes will still render using system fonts.
Config.overrideWebpackConfig((currentConfiguration) => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const webpack = require("webpack");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const path = require("path");

  const plugins = currentConfiguration.plugins ?? [];
  plugins.push(
    new webpack.NormalModuleReplacementPlugin(
      /^@remotion\/google-fonts\/.*$/,
      path.resolve(process.cwd(), "src/utils/google-fonts-fallback.ts")
    )
  );

  return {
    ...currentConfiguration,
    plugins,
  };
});
