import React from "react";
import type { CSSProperties } from "react";
import { AbsoluteFill } from "remotion";

export interface SafeAreaProps {
  children: React.ReactNode;
  /** Base padding (px). Default 60 for 1080×720 teaching videos. */
  padding?: number;
  /** Axis padding overrides (px). */
  paddingX?: number;
  paddingY?: number;
  /** Side-specific overrides (px). */
  paddingTop?: number;
  paddingRight?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  /** Flex alignment helpers. */
  justifyContent?: CSSProperties["justifyContent"];
  alignItems?: CSSProperties["alignItems"];
  /** Additional styles for the container. */
  style?: CSSProperties;
}

/**
 * SafeArea - Standard safe padding wrapper for Remotion scenes.
 *
 * Use this to avoid text/UI touching the video edges.
 */
export const SafeArea: React.FC<SafeAreaProps> = ({
  children,
  padding = 60,
  paddingX,
  paddingY,
  paddingTop,
  paddingRight,
  paddingBottom,
  paddingLeft,
  justifyContent,
  alignItems,
  style,
}) => {
  const px = paddingX ?? padding;
  const py = paddingY ?? padding;

  const pt = paddingTop ?? py;
  const pr = paddingRight ?? px;
  const pb = paddingBottom ?? py;
  const pl = paddingLeft ?? px;

  return (
    <AbsoluteFill
      style={{
        boxSizing: "border-box",
        paddingTop: pt,
        paddingRight: pr,
        paddingBottom: pb,
        paddingLeft: pl,
        display: "flex",
        justifyContent,
        alignItems,
        ...style,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
