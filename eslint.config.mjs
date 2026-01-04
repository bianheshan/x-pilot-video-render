import { config as remotionConfig } from "@remotion/eslint-config-flat";

/**
 * Project-level guardrails for AI-generated code under `src/scenes`.
 *
 * Goal: catch common non-determinism and Remotion-API misuse BEFORE runtime.
 */
export default [
  ...remotionConfig,
  {
    files: ["src/scenes/**/*.{ts,tsx}", "src/scenes/**/*.md"],
    rules: {
      // Determinism: prevent non-reproducible renders.
      "no-restricted-properties": [
        "error",
        {
          object: "Math",
          property: "random",
          message: "Do not use Math.random() in scenes. Use random() from remotion instead.",
        },
        {
          object: "Date",
          property: "now",
          message: "Do not use Date.now() in scenes. Use frame-based timing instead.",
        },
      ],
      "no-restricted-globals": [
        "error",
        {
          name: "setTimeout",
          message: "Do not use setTimeout() in scenes. Use frame-based timing instead.",
        },
        {
          name: "setInterval",
          message: "Do not use setInterval() in scenes. Use frame-based timing instead.",
        },
      ],

      // Keep scene runtime controlled: no external CSS imports.
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["*.css", "**/*.css"],
              message:
                "Do not import CSS files in scenes. Use inline styles or existing template styles.",
            },
          ],
        },
      ],

      // Remotion API misuse: `interpolate(..., { easing })` expects a function.
      "no-restricted-syntax": [
        "error",
        {
          selector:
            "Property[key.name='easing'] > CallExpression[callee.name='spring']",
          message:
            "Invalid: easing: spring(...). spring() returns a number, but easing must be a function. Use spring() to compute progress, then interpolate(progress, ...).",
        },
      ],
    },
  },
];
