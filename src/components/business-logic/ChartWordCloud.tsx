import React, { useMemo } from "react";
import { interpolate, random, useCurrentFrame, useVideoConfig } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";

export interface WordData {
  text: string;
  value: number;
  color?: string;
}

type Seed = string | number;

export interface ChartWordCloudProps {
  data: WordData[];
  title?: string;
  /** Deterministic seed (avoid Math.random). */
  seed?: Seed;
  /** Max words to render (performance + readability). */
  maxWords?: number;
  /** Cloud drawing area (defaults derived from video size). */
  width?: number;
  height?: number;
  /** Font size range (px). */
  minFontSize?: number;
  maxFontSize?: number;
  /** Padding between words (px). */
  padding?: number;
  /** Allow 90° rotated words for classic word-cloud feel. */
  allowRotate?: boolean;
}

type PlacedWord = {
  text: string;
  size: number;
  x: number;
  y: number;
  rotate: 0 | 90;
  color: string;
  approxWidth: number;
  approxHeight: number;
};

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

const approxTextBox = (text: string, fontSize: number, rotate: 0 | 90) => {
  // Approximation: stable and fast; avoids canvas measurement during render.
  const baseWidth = Math.max(1, text.length) * fontSize * 0.62;
  const baseHeight = fontSize * 1.05;
  return rotate === 90
    ? { width: baseHeight, height: baseWidth }
    : { width: baseWidth, height: baseHeight };
};

const boxesOverlap = (
  a: { x: number; y: number; w: number; h: number },
  b: { x: number; y: number; w: number; h: number }
) => {
  return !(
    a.x + a.w / 2 < b.x - b.w / 2 ||
    a.x - a.w / 2 > b.x + b.w / 2 ||
    a.y + a.h / 2 < b.y - b.h / 2 ||
    a.y - a.h / 2 > b.y + b.h / 2
  );
};

/**
 * Dynamic word cloud (deterministic, frame-friendly).
 *
 * Why not d3-cloud?
 * - d3-cloud is async / timer-driven, and can be non-deterministic in Remotion renders.
 * - This implementation is synchronous and deterministic (seeded), suitable for teaching videos.
 */
export const ChartWordCloud: React.FC<ChartWordCloudProps> = ({
  data,
  title = "关键词云",
  seed,
  maxWords = 40,
  width,
  height,
  minFontSize = 22,
  maxFontSize = 90,
  padding = 10,
  allowRotate = true,
}) => {
  const frame = useCurrentFrame();
  const { width: videoW, height: videoH } = useVideoConfig();
  const theme = useTheme();

  const cloudW = width ?? Math.min(1100, Math.max(720, videoW - 320));
  const cloudH = height ?? Math.min(680, Math.max(420, videoH - 400));

  const cleaned = (data ?? []).filter((d) => d && d.text && Number.isFinite(d.value));
  if (cleaned.length === 0) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: theme.colors.error || "#ef4444",
          fontSize: 24,
          fontFamily: theme.fonts.body,
          backgroundColor: theme.colors.background,
        }}
      >
        请提供词云数据
      </div>
    );
  }

  const maxValue = Math.max(...cleaned.map((d) => d.value), 1);
  const opacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });

  const words = useMemo<PlacedWord[]>(() => {
    const seedBase = (seed ?? "ChartWordCloud").toString();

    const palette = [
      theme.colors.primary,
      theme.colors.secondary,
      theme.colors.success,
      theme.colors.warning,
      theme.colors.accent,
    ].filter(Boolean) as string[];

    const sorted = [...cleaned]
      .sort((a, b) => b.value - a.value)
      .slice(0, Math.max(1, Math.floor(maxWords)));

    const placed: PlacedWord[] = [];

    for (const w of sorted) {
      const size = clamp((w.value / maxValue) * maxFontSize, minFontSize, maxFontSize);
      const rotate: 0 | 90 = allowRotate && random(`${seedBase}:rot:${w.text}`) > 0.78 ? 90 : 0;
      const color =
        w.color ||
        palette[Math.floor(random(`${seedBase}:color:${w.text}`) * palette.length)] ||
        theme.colors.primary;

      const { width: boxW, height: boxH } = approxTextBox(w.text, size, rotate);

      const maxAttempts = 900;
      let found = false;
      let x = 0;
      let y = 0;

      for (let k = 0; k < maxAttempts; k++) {
        const angle = k * 0.35 + random(`${seedBase}:a:${w.text}`) * Math.PI * 2;
        const radius = 0.6 * k;
        x = Math.cos(angle) * radius;
        y = Math.sin(angle) * radius;

        const bbox = { x, y, w: boxW + padding, h: boxH + padding };

        const fitsBounds =
          Math.abs(x) + bbox.w / 2 < cloudW / 2 - 8 &&
          Math.abs(y) + bbox.h / 2 < cloudH / 2 - 8;

        if (!fitsBounds) continue;

        const collides = placed.some((p) =>
          boxesOverlap(
            { x: p.x, y: p.y, w: p.approxWidth + padding, h: p.approxHeight + padding },
            bbox
          )
        );
        if (!collides) {
          found = true;
          break;
        }
      }

      if (!found) {
        // If we can't place without collision, still place near center for coverage.
        x = (random(`${seedBase}:fallback:x:${w.text}`) - 0.5) * (cloudW * 0.35);
        y = (random(`${seedBase}:fallback:y:${w.text}`) - 0.5) * (cloudH * 0.35);
      }

      placed.push({
        text: w.text,
        size,
        x,
        y,
        rotate,
        color,
        approxWidth: boxW,
        approxHeight: boxH,
      });
    }

    return placed;
  }, [allowRotate, cleaned, cloudH, cloudW, maxFontSize, maxValue, maxWords, minFontSize, padding, seed, theme]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 40,
        fontFamily: theme.fonts.body,
        backgroundColor: theme.colors.background,
        opacity,
      }}
    >
      <h2
        style={{
          fontSize: 48,
          fontWeight: 800,
          color: theme.colors.text,
          marginBottom: 24,
          fontFamily: theme.fonts.heading,
        }}
      >
        {title}
      </h2>

      <svg width={cloudW} height={cloudH} style={{ overflow: "visible" }}>
        <g transform={`translate(${cloudW / 2}, ${cloudH / 2})`}>
          {words.map((word, index) => {
            const wobbleX = Math.sin((frame + index * 17) / 22) * 6;
            const wobbleY = Math.cos((frame + index * 13) / 26) * 5;
            const appear = interpolate(frame, [0, 28], [0, 1], { extrapolateRight: "clamp" });

            return (
              <text
                key={`${word.text}-${index}`}
                textAnchor="middle"
                dominantBaseline="middle"
                style={{
                  fontSize: word.size,
                  fontFamily: theme.fonts.heading,
                  fontWeight: 800,
                  fill: word.color,
                  paintOrder: "stroke",
                  stroke: "rgba(0,0,0,0.25)",
                  strokeWidth: 6,
                }}
                transform={`translate(${word.x + wobbleX}, ${word.y + wobbleY}) rotate(${word.rotate}) scale(${appear})`}
              >
                {word.text}
              </text>
            );
          })}
        </g>
      </svg>

      <div
        style={{
          marginTop: 14,
          fontSize: 18,
          color: theme.colors.textSecondary,
        }}
      >
        字号代表权重（value），布局可复现（seeded）
      </div>
    </div>
  );
};
