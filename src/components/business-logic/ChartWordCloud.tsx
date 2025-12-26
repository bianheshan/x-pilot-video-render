import React, { useMemo } from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";
import cloud from "d3-cloud";

export interface WordData {
  text: string;
  value: number;
  color?: string;
}

export interface ChartWordCloudProps {
  data: WordData[];
  title?: string;
}

interface CloudWord {
  text: string;
  size: number;
  x?: number;
  y?: number;
  rotate?: number;
  color?: string;
}

/**
 * 动态词云 (使用 d3-cloud)
 * 关键词汇聚成云，随风缓慢漂浮或旋转
 * 适用场景：关键词分析、热点话题、标签云
 */
export const ChartWordCloud: React.FC<ChartWordCloudProps> = ({
  data = [],
  title = "关键词云",
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();

  if (data.length === 0) {
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
        }}
      >
        ⚠️ 请提供词云数据
      </div>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  // 使用 d3-cloud 计算词云布局
  const words = useMemo(() => {
    const colors = [
      theme.colors.primary,
      theme.colors.secondary,
      theme.colors.success,
      theme.colors.warning,
    ];

    const cloudWords: CloudWord[] = data.map((word, index) => ({
      text: word.text,
      size: (word.value / maxValue) * 80 + 20,
      color: word.color || colors[index % colors.length],
    }));

    let layoutWords: CloudWord[] = [];

    cloud()
      .size([1000, 600])
      .words(cloudWords)
      .padding(5)
      .rotate(() => (Math.random() > 0.7 ? 90 : 0))
      .fontSize((d: any) => d.size)
      .on("end", (words: any[]) => {
        layoutWords = words;
      })
      .start();

    return layoutWords;
  }, [data, maxValue, theme]);

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
          fontWeight: "bold",
          color: theme.colors.text,
          marginBottom: 40,
          fontFamily: theme.fonts.heading,
        }}
      >
        {title}
      </h2>

      <svg width={1000} height={600}>
        <g transform="translate(500, 300)">
          {words.map((word, index) => {
            // 漂浮动画
            const floatX = interpolate(
              frame,
              [0, 120],
              [0, Math.sin(index * 0.5) * 10],
              { extrapolateRight: "wrap" }
            );
            const floatY = interpolate(
              frame,
              [0, 150],
              [0, Math.cos(index * 0.3) * 8],
              { extrapolateRight: "wrap" }
            );

            // 缩放动画
            const scale = interpolate(frame, [0, 30], [0, 1], {
              extrapolateRight: "clamp",
            });

            return (
              <text
                key={index}
                style={{
                  fontSize: word.size,
                  fontFamily: theme.fonts.heading,
                  fontWeight: "bold",
                  fill: word.color,
                  textShadow: `0 2px 8px ${word.color}40`,
                  cursor: "pointer",
                }}
                textAnchor="middle"
                transform={`translate(${(word.x || 0) + floatX}, ${
                  (word.y || 0) + floatY
                }) rotate(${word.rotate || 0}) scale(${scale})`}
              >
                {word.text}
              </text>
            );
          })}
        </g>
      </svg>

      <div
        style={{
          marginTop: 20,
          fontSize: 18,
          color: theme.colors.textSecondary,
        }}
      >
        词汇大小代表权重，随风缓慢漂浮
      </div>
    </div>
  );
};
