import React, { useMemo } from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";
import * as d3 from "d3";

export interface TreeMapNode {
  name: string;
  value: number;
  color?: string;
}

export interface ChartTreeMapProps {
  data: TreeMapNode[];
  title?: string;
}

/**
 * 矩形树图 (使用 D3.js Treemap)
 * 用面积大小展示占比，支持点击放大
 * 适用场景：市场份额、资源分配、文件大小分布
 */
export const ChartTreeMap: React.FC<ChartTreeMapProps> = ({
  data = [],
  title = "占比分布图",
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
        ⚠️ 请提供树图数据
      </div>
    );
  }

  const width = 1000;
  const height = 600;

  // 使用 D3 Treemap 布局
  interface TreeMapLayoutNode extends d3.HierarchyRectangularNode<any> {
    x0: number;
    x1: number;
    y0: number;
    y1: number;
  }

  const tiles = useMemo(() => {
    const root = d3
      .hierarchy({ name: "root", children: data } as any)
      .sum((d: any) => d.value)
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    const treemapLayout = d3
      .treemap<any>()
      .size([width, height])
      .padding(3)
      .round(true);

    treemapLayout(root);

    return root.leaves() as TreeMapLayoutNode[];
  }, [data, width, height]);

  const total = data.reduce((sum, item) => sum + item.value, 0);
  const scale = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  const colors = [
    theme.colors.primary,
    theme.colors.secondary,
    theme.colors.success,
    theme.colors.warning,
  ];

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

      <svg width={width} height={height} style={{ transform: `scale(${scale})` }}>
        {tiles.map((tile, index) => {
          const node = tile.data as TreeMapNode;
          const color = node.color || colors[index % colors.length];
          const percentage = ((node.value / total) * 100).toFixed(1);
          const rectWidth = tile.x1 - tile.x0;
          const rectHeight = tile.y1 - tile.y0;

          return (
            <g key={index}>
              <rect
                x={tile.x0}
                y={tile.y0}
                width={rectWidth}
                height={rectHeight}
                fill={color}
                stroke={theme.colors.background}
                strokeWidth={3}
                rx={8}
                style={{
                  filter: `drop-shadow(0 4px 8px ${color}40)`,
                  cursor: "pointer",
                }}
              />

              {rectWidth > 80 && rectHeight > 60 && (
                <>
                  <text
                    x={tile.x0 + rectWidth / 2}
                    y={tile.y0 + rectHeight / 2 - 10}
                    fill="white"
                    fontSize={18}
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{ fontFamily: theme.fonts.body }}
                  >
                    {node.name}
                  </text>
                  <text
                    x={tile.x0 + rectWidth / 2}
                    y={tile.y0 + rectHeight / 2 + 15}
                    fill="white"
                    fontSize={16}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{ fontFamily: theme.fonts.mono }}
                  >
                    {node.value.toLocaleString()} ({percentage}%)
                  </text>
                </>
              )}
            </g>
          );
        })}
      </svg>

      <div
        style={{
          marginTop: 20,
          fontSize: 18,
          color: theme.colors.textSecondary,
        }}
      >
        矩形面积代表数值占比
      </div>
    </div>
  );
};
