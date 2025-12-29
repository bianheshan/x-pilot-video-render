import React from "react";
import type { ReactNode } from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";

export type BulletPointItem =
  | string
  | {
      text: ReactNode;
      icon?: ReactNode;
      description?: ReactNode;
      accentColor?: string;
    };

export interface ListBulletPointsProps {
  title?: string;
  items: BulletPointItem[];
  align?: "left" | "center";
  highlightColor?: string;
  showIndex?: boolean;
  gap?: number;
  twoColumns?: boolean;
}

const normalizeItem = (item: BulletPointItem) =>
  typeof item === "string"
    ? { text: item }
    : item;

export const ListBulletPoints: React.FC<ListBulletPointsProps> = ({
  title,
  items,
  align = "left",
  highlightColor,
  showIndex = false,
  gap = 28,
  twoColumns = false,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();
  const normalizedItems = items.map(normalizeItem);

  const baseColor = highlightColor || theme.colors.accent || theme.colors.primary;

  const gridItems = twoColumns
    ? [
        normalizedItems.filter((_, idx) => idx % 2 === 0),
        normalizedItems.filter((_, idx) => idx % 2 === 1),
      ]
    : [normalizedItems];

  return (
    <div
      style={{
        width: "100%",
        color: theme.colors.text,
        fontFamily: theme.fonts.body,
      }}
    >
      {title ? (
        <h3
          style={{
            margin: "0 0 20px",
            fontSize: 36,
            fontFamily: theme.fonts.heading,
            textAlign: align,
            color: theme.colors.text,
          }}
        >
          {title}
        </h3>
      ) : null}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${gridItems.length}, minmax(0, 1fr))`,
          gap: twoColumns ? 24 : 0,
        }}
      >
        {gridItems.map((column, columnIdx) => (
          <div key={`column-${columnIdx}`} style={{ display: "flex", flexDirection: "column", gap }}>
            {column.map((item, index) => {
              const absoluteIndex = twoColumns ? columnIdx + index * 2 : index;
              const start = absoluteIndex * 6;
              const opacity = interpolate(frame, [start, start + 12], [0, 1], {
                extrapolateRight: "clamp",
              });
              const translateY = interpolate(frame, [start, start + 12], [18, 0], {
                extrapolateRight: "clamp",
              });
              const indicatorColor = item.accentColor || baseColor;

              return (
                <div
                  key={`item-${columnIdx}-${index}`}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 18,
                    opacity,
                    transform: `translateY(${translateY}px)`,
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: showIndex ? "12px" : "50%",
                      backgroundColor: `${indicatorColor}22`,
                      border: `2px solid ${indicatorColor}`,
                      color: indicatorColor,
                      fontSize: 20,
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {showIndex ? absoluteIndex + 1 : item.icon || "•"}
                  </div>

                  <div style={{ flex: 1, textAlign: align }}>
                    <div
                      style={{
                        fontSize: 30,
                        fontWeight: 600,
                        lineHeight: 1.4,
                      }}
                    >
                      {item.text}
                    </div>
                    {item.description ? (
                      <div
                        style={{
                          marginTop: 6,
                          fontSize: 22,
                          color: theme.colors.textSecondary,
                          lineHeight: 1.5,
                        }}
                      >
                        {item.description}
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

