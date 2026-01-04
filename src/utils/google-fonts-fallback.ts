// A safety shim for AI-generated scenes.
//
// Why: Dify-generated code sometimes guesses Google Fonts module names like
// `@remotion/google-fonts/FredokaOne`, which may not exist in the installed
// `@remotion/google-fonts` version and causes bundling to fail.
//
// This module provides a stable surface that mimics the `@remotion/google-fonts/*`
// API shape enough for our scenes.

export type GoogleFontInfo = {
  fontFamily: string;
};

export const fontFamily =
  "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial";

export const getInfo = (): GoogleFontInfo => ({
  fontFamily: "Fallback",
});

// Match the common API of `@remotion/google-fonts/*` modules.
// We intentionally do NOT delay rendering or fetch remote fonts.
export const loadFont = () => ({
  fontFamily,
});
