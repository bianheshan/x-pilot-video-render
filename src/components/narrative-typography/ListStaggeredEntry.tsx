import React from "react";
import type { ReactNode } from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";

export type ListStaggeredEntryItem =
  | string
  | {
      title: string;
      description?: ReactNode;
      icon?: ReactNode;
      accentColor?: string;
      badge?: string;
    };

export interface ListStaggeredEntryProps {
  items: ListStaggeredEntryItem[];
  title?: string;
  accentColor?: string;
  staggerDelay?: number;
  twoColumns?: boolean;
  align?: "left" | "center";
}

const normalizeItem = (item: ListStaggeredEntryItem): {
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  accentColor?: string;
  badge?: string;
} => (typeof item === "string" ? { title: item } : item);

/**
 * 列表交错进入 - 支持字符串与对象混合，自动生成知识要点卡片。
 */
export const ListStaggeredEntry: React.FC<ListStaggeredEntryProps> = ({
  items,
  title = "Key Points",
  accentColor,
  staggerDelay = 8,
  twoColumns = false,
  align = "center",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();
  const highlightColor = accentColor || theme.colors.primary;
  const normalizedItems = items.map(normalizeItem);

  const titleY = interpolate(frame, [0, 25], [-50, 0], { extrapolateRight: "clamp" });
  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  const columnized = twoColumns
    ? [normalizedItems.filter((_, idx) => idx % 2 === 0), normalizedItems.filter((_, idx) => idx % 2 !== 0)]
    : [normalizedItems];

  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: align === "center" ? "center" : "flex-start",
        background: theme.colors.background,
        padding: 80,
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(circle at 20% 50%, ${highlightColor}11 0%, transparent 55%)`,
        }}
      />

      <h2
        style={{
          fontSize: 56,
          fontWeight: 700,
          color: theme.colors.text,
          marginBottom: 60,
          fontFamily: theme.fonts.heading,
          textTransform: "uppercase",
          letterSpacing: 3,
          textAlign: align,
          textShadow: `0 0 20px ${highlightColor}66`,
          transform: `translateY(${titleY}px)`,
          opacity: titleOpacity,
          width: "100%",
        }}
      >
        {title}
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columnized.length}, minmax(0, 1fr))`,
          gap: 30,
          width: "100%",
          maxWidth: twoColumns ? 1200 : 900,
        }}
      >
        {columnized.map((column, columnIndex) => (
          <div key={`col-${columnIndex}`} style={{ display: "flex", flexDirection: "column", gap: 25 }}>
            {column.map((item, index) => {
              const absoluteIndex = twoColumns ? columnIndex + index * 2 : index;
              const startFrame = 20 + absoluteIndex * staggerDelay;

              const itemSpring = spring({
                frame: frame - startFrame,
                fps,
                config: { damping: 15, mass: 0.5, stiffness: 100 },
              });

              const itemX = interpolate(itemSpring, [0, 1], [-100, 0]);
              const itemOpacity = interpolate(frame, [startFrame, startFrame + 15], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              const itemScale = interpolate(itemSpring, [0, 1], [0.85, 1]);

              const numberRotate = interpolate(frame, [startFrame, startFrame + 18], [180, 0], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });

              const isHighlighted = frame >= startFrame && frame < startFrame + 35;
              const highlightOpacity = isHighlighted
                ? interpolate(
                    frame,
                    [startFrame, startFrame + 18, startFrame + 28, startFrame + 35],
                    [0, 1, 1, 0]
                  )
                : 0;

              const chipColor = item.accentColor || highlightColor;

              return (
                <div
                  key={`${item.title}-${absoluteIndex}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 25,
                    transform: `translateX(${itemX}px) scale(${itemScale})`,
                    opacity: itemOpacity,
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      minWidth: 60,
                      height: 60,
                      borderRadius: "50%",
                      background: `linear-gradient(135deg, ${chipColor}, ${chipColor}cc)`,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontSize: 28,
                      fontWeight: 700,
                      color: theme.colors.text,
                      boxShadow: `0 0 20px ${chipColor}66`,
                      transform: `rotate(${numberRotate}deg)`,
                    }}
                  >
                    {item.icon ?? absoluteIndex + 1}
                  </div>

                  <div
                    style={{
                      flex: 1,
                      padding: "20px 30px",
                      background: theme.colors.surface,
                      backdropFilter: "blur(10px)",
                      borderRadius: 18,
                      border: `2px solid ${isHighlighted ? chipColor : theme.colors.surfaceLight}`,
                      boxShadow: isHighlighted
                        ? `0 0 30px ${chipColor}44`
                        : `0 5px 15px ${theme.colors.shadow}`,
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {isHighlighted && (
                      <div
                        aria-hidden
                        style={{
                          position: "absolute",
                          inset: 0,
                          background: `linear-gradient(120deg, transparent, ${chipColor}22, transparent)`,
                          opacity: highlightOpacity,
                        }}
                      />
                    )}

                    <p
                      style={{
                        fontSize: 26,
                        color: theme.colors.text,
                        margin: 0,
                        fontWeight: 600,
                        fontFamily: theme.fonts.body,
                      }}
                    >
                      {item.title}
                      {item.badge && (
                        <span
                          style={{
                            marginLeft: 12,
                            fontSize: 16,
                            padding: "4px 10px",
                            borderRadius: 999,
                            background: `${chipColor}22`,
                            color: chipColor,
                          }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </p>

                    {item.description && (
                      <div
                        style={{
                          marginTop: 10,
                          fontSize: 20,
                          color: theme.colors.textSecondary,
                          lineHeight: 1.5,
                        }}
                      >
                        {item.description}
                      </div>
                    )}
                  </div>

                  {absoluteIndex < normalizedItems.length - 1 && (
                    <div
                      aria-hidden
                      style={{
                        position: "absolute",
                        left: 30,
                        top: 60,
                        width: 2,
                        height: 25,
                        background: `linear-gradient(to bottom, ${chipColor}, transparent)`,
                        opacity: 0.4,
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
