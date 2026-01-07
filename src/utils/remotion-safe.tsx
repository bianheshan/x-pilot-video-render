/* eslint-disable */

import React from "react";
import { useTheme } from "../contexts/ThemeContext";

// Re-export everything from the real Remotion module.
// Webpack aliases `remotion-original` to `node_modules/remotion/dist/esm/index.mjs`.
export * from "remotion-original";

const hashString = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
};

const escapeXml = (s: string) => {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");
};

const trimText = (s: string, max: number) => {
  const clean = String(s ?? "").trim();
  if (!clean) return "";
  return clean.length > max ? clean.slice(0, Math.max(0, max - 1)) + "…" : clean;
};

const makeFallbackSvgDataUri = (opts: {
  failedSrc: string;
  label?: string;
  themePrimary?: string;
  themeSecondary?: string;
  themeAccent?: string;
}) => {
  const failedSrc = String(opts.failedSrc ?? "");

  // Theme-aware colors (fallback to stable hash-based gradient).
  const h = hashString(failedSrc);
  const hue = h % 360;
  const hue2 = (hue + 40) % 360;

  const primary = opts.themePrimary || `hsl(${hue}, 80%, 22%)`;
  const secondary = opts.themeSecondary || `hsl(${hue2}, 85%, 14%)`;
  const accent = opts.themeAccent || "rgba(255,255,255,0.75)";

  const label = trimText(opts.label || "", 72);
  const shortSrc = trimText(failedSrc, 90);

  const httpHint = failedSrc.startsWith("http://")
    ? "Hint: http:// on an https page may be blocked (Mixed Content)."
    : "Hint: Prefer HTTPS or let the platform download and serve from public/.";

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${escapeXml(primary)}"/>
      <stop offset="100%" stop-color="${escapeXml(secondary)}"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="12" stdDeviation="22" flood-color="#000" flood-opacity="0.38"/>
    </filter>
  </defs>

  <rect width="1920" height="1080" fill="url(#g)"/>

  <!-- Subtle grid -->
  <g opacity="0.12">
    <path d="M0 120H1920 M0 240H1920 M0 360H1920 M0 480H1920 M0 600H1920 M0 720H1920 M0 840H1920 M0 960H1920" stroke="#fff" stroke-width="2"/>
    <path d="M120 0V1080 M240 0V1080 M360 0V1080 M480 0V1080 M600 0V1080 M720 0V1080 M840 0V1080 M960 0V1080 M1080 0V1080 M1200 0V1080 M1320 0V1080 M1440 0V1080 M1560 0V1080 M1680 0V1080 M1800 0V1080" stroke="#fff" stroke-width="2"/>
  </g>

  <!-- Card -->
  <g filter="url(#shadow)">
    <rect x="220" y="230" width="1480" height="620" rx="38" fill="rgba(0,0,0,0.36)" stroke="rgba(255,255,255,0.22)" stroke-width="2"/>
    <rect x="220" y="230" width="1480" height="620" rx="38" fill="none" stroke="${escapeXml(accent)}" stroke-opacity="0.22" stroke-width="6"/>
  </g>

  <!-- Icon (broken image) -->
  <g transform="translate(350, 360)" fill="none" stroke="#fff" stroke-width="10" opacity="0.95">
    <rect x="0" y="0" width="130" height="130" rx="28"/>
    <path d="M30 95 L55 70 L78 93"/>
    <path d="M38 50 L52 64"/>
    <path d="M52 50 L38 64"/>
  </g>

  <text x="520" y="410" fill="#fff" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto" font-size="56" font-weight="850">Image unavailable</text>
  <text x="520" y="476" fill="rgba(255,255,255,0.86)" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto" font-size="28">Rendering continues with a placeholder.</text>

  ${label ? `<text x="520" y="555" fill="rgba(255,255,255,0.92)" font-family="ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto" font-size="30" font-weight="700">${escapeXml(label)}</text>` : ""}

  <text x="520" y="610" fill="rgba(255,255,255,0.72)" font-family="ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace" font-size="22">${escapeXml(shortSrc)}</text>
  <text x="520" y="660" fill="rgba(255,255,255,0.55)" font-family="ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace" font-size="20">${escapeXml(httpHint)}</text>
</svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

/**
 * Safe `Img` replacement.
 *
 * Why:
 * - Remotion's built-in `<Img>` calls `cancelRender()` after retry exhaustion.
 * - That cancellation happens in an event handler, so React ErrorBoundaries cannot catch it.
 * - In cloud environments (E2B), remote images can fail due to mixed-content, hotlink protection,
 *   expiring signed URLs, or different egress rules.
 *
 * This shim keeps scenes running and swaps to a theme-aware, semantic placeholder.
 */
export const Img = React.forwardRef<HTMLImageElement, any>((props, ref) => {
  const theme = useTheme();

  const {
    src,
    onError,

    // Remotion-Img-only props (strip to avoid React "unknown prop" warnings)
    maxRetries: _maxRetries,
    pauseWhenLoading: _pauseWhenLoading,
    delayRenderRetries: _delayRenderRetries,
    delayRenderTimeoutInMilliseconds: _delayRenderTimeoutInMilliseconds,
    onImageFrame: _onImageFrame,

    ...rest
  } = props ?? {};

  const [failed, setFailed] = React.useState(false);
  const [failedSrc, setFailedSrc] = React.useState<string>("");

  if (!src) {
    // Match Remotion behavior: fail early if no src.
    throw new Error('No "src" prop was passed to <Img>.');
  }

  // "Semantic" label for perfect placeholders.
  // Encourage generators to always set alt/title/aria-label or data-caption.
  const semanticLabel =
    rest?.["data-caption"] ??
    rest?.["data-label"] ??
    rest?.["aria-label"] ??
    rest?.title ??
    rest?.alt ??
    "";

  const handleError: React.ReactEventHandler<HTMLImageElement> = (e) => {
    const target = e?.currentTarget;
    const currentFailedSrc =
      target?.currentSrc || target?.src || (typeof src === "string" ? src : String(src));

    // Avoid infinite loops in case the placeholder fails for some reason.
    if (!failed) {
      setFailed(true);
      setFailedSrc(currentFailedSrc);

      const payload = {
        schemaVersion: 1,
        kind: "asset_load_error",
        assetType: "image",
        src: currentFailedSrc,
        label: String(semanticLabel || "") || null,
        themeId: theme?.id ?? null,
        at: new Date().toISOString(),
      };

      // Single-line JSON event for upstream ingestion.
      console.error(`[E2B_ASSET_LOAD_ERROR] ${JSON.stringify(payload)}`);
    }

    // Allow user-provided handler.
    try {
      onError?.(e);
    } catch (err) {
      // Never let custom handlers crash the render.
      console.error("[SafeImg] onError handler threw:", err);
    }
  };

  // Default: reduce hotlink/cookie/referrer coupling.
  // If a source requires referer/cookies, the management platform should download
  // and push it into `public/` and use `staticFile()` instead.
  const referrerPolicy = rest.referrerPolicy ?? "no-referrer";

  const actualSrc = failed
    ? makeFallbackSvgDataUri({
        failedSrc: failedSrc || String(src),
        label: String(semanticLabel || ""),
        themePrimary: theme?.colors?.primary,
        themeSecondary: theme?.colors?.secondary,
        themeAccent: theme?.colors?.accent,
      })
    : src;

  return (
    <img
      ref={ref}
      {...rest}
      src={actualSrc}
      onError={handleError}
      referrerPolicy={referrerPolicy}
    />
  );
});

Img.displayName = "SafeImg";
