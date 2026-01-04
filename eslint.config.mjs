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
        {
          object: "Easing",
          property: "expo",
          message:
            "Invalid: Easing.expo does not exist in Remotion Easing. Use Easing.exp (e.g., Easing.out(Easing.exp)) or omit easing.",
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
            {
              group: ["@remotion/google-fonts/*"],
              message:
                "Do not import @remotion/google-fonts/* in scenes. Use theme.fonts.* (system fonts) to avoid module-name guessing and font-loading timeouts.",
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
        {
          selector: "Property[key.name='easing'] > Identifier[name='spring']",
          message:
            "Invalid: easing: spring. The spring() API is not an easing function. Use Easing.* or (t)=>... instead.",
        },
        {
          selector: "MemberExpression[object.property.name='fonts'][property.name='data']",
          message:
            "Invalid: theme.fonts.data does not exist. Use theme.fonts.mono (for data/code) or theme.fonts.body.",
        },
        {
          selector:
            "JSXOpeningElement[name.name='Text'] JSXAttribute[name.name='font'] > JSXExpressionContainer > MemberExpression[object.property.name='fonts']",
          message:
            "Invalid: <Text font={theme.fonts.*}>. Drei/Troika Text 'font' expects a font URL/file, not a CSS font-family string. Omit 'font' or provide a real font URL.",
        },
      ],
    },
  },
];
