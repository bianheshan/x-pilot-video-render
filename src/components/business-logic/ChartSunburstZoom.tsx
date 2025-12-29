import React, { useMemo } from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";
import * as d3 from "d3";

export interface SunburstNode {
  name: string;
  value?: number;
  children?: SunburstNode[];
  color?: string;
}

export interface ChartSunburstZoomProps {
  /** 层级数据 */
  data: SunburstNode;
  /** 图表标题 */
  title?: string;
  /** 是否显示标签 */
  showLabels?: boolean;
}

/**
 * 可缩放旭日图 (使用 D3.js)
 * 
 * 多层级的环形图，点击扇区可下钻查看细节
 * 适用场景：文件系统占用、预算分配、组织结构
 * 
 * 教学要点：
 * - 层级数据的径向可视化
 * - 父子关系的空间表达
 * - 交互式数据探索
 */
export const ChartSunburstZoom: React.FC<ChartSunburstZoomProps> = ({
  data,
  title = "层级分布图",
  showLabels = true,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();

  // 错误处理
  if (!data) {
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
        ⚠️ 请提供层级数据 (data)
      </div>
    );
  }

  const width = 1000;
  const height = 800;
  const radius = Math.min(width, height) / 2 - 50;

  // 使用 D3 计算旭日图布局
  const { arcs } = useMemo(() => {
    // 创建层级结构
    const hierarchy = d3.hierarchy(data).sum((d) => (d as SunburstNode).value || 1);

    // 创建分区布局
    const partition = d3.partition<SunburstNode>().size([2 * Math.PI, radius]);

    const rootNode = partition(hierarchy);

    // 创建弧生成器
    interface ArcData {
      x0: number;
      x1: number;
      y0: number;
      y1: number;
    }
    
    const arc = d3
      .arc<ArcData>()
      .startAngle((d) => d.x0)
      .endAngle((d) => d.x1)
      .innerRadius((d) => d.y0)
      .outerRadius((d) => d.y1);

    const arcsData = rootNode.descendants().map((d) => ({
      node: d,
      path: arc({
        x0: d.x0 || 0,
        x1: d.x1 || 0,
        y0: d.y0 || 0,
        y1: d.y1 || 0,
      }),
      x: ((d.x0 || 0) + (d.x1 || 0)) / 2,
      y: ((d.y0 || 0) + (d.y1 || 0)) / 2,
      depth: d.depth,
      name: d.data.name,
      color: d.data.color,
    }));

    return { arcs: arcsData };
  }, [data, radius]);

  // 旋转动画
  const rotation = interpolate(frame, [0, 300], [0, 360], {
    extrapolateRight: "wrap",
  });

  // 进入动画
  const scale = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  const colors = [
    theme.colors.primary,
    theme.colors.secondary,
    theme.colors.success,
    theme.colors.warning,
    theme.colors.error,
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
      {/* 标题 */}
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

      {/* SVG 画布 */}
      <svg
        width={width}
        height={height}
        style={{
          transform: `scale(${scale}) rotate(${rotation * 0.1}deg)`,
        }}
      >
        <g transform={`translate(${width / 2}, ${height / 2})`}>
          {arcs.map((arc, index) => {
            // 跳过根节点
            if (arc.depth === 0) return null;

            const color = arc.color || colors[arc.depth % colors.length];
            const angleSpan = arc.node.x1 - arc.node.x0;

            return (
              <g key={index}>
                {/* 扇区路径 */}
                <path
                  d={arc.path || ""}
                  fill={color}
                  stroke={theme.colors.background}
                  strokeWidth={2}
                  opacity={0.8}
                  style={{
                    filter: `drop-shadow(0 2px 4px ${color}40)`,
                    cursor: "pointer",
                  }}
                />

                {/* 标签 */}
                {showLabels && angleSpan > 0.15 && arc.depth <= 2 && (
                  <text
                    transform={`
                      rotate(${(arc.x * 180) / Math.PI - 90})
                      translate(${arc.y}, 0)
                      rotate(${arc.x > Math.PI ? 180 : 0})
                    `}
                    dy="0.35em"
                    x={arc.x > Math.PI ? -6 : 6}
                    textAnchor={arc.x > Math.PI ? "end" : "start"}
                    fill="white"
                    fontSize={12}
                    fontWeight="bold"
                    style={{
                      fontFamily: theme.fonts.body,
                      pointerEvents: "none",
                    }}
                  >
                    {arc.name}
                  </text>
                )}
              </g>
            );
          })}

          {/* 中心圆 */}
          <circle r={80} fill={theme.colors.surface} />
          <circle
            r={80}
            fill="none"
            stroke={theme.colors.primary}
            strokeWidth={3}
          />
          <text
            textAnchor="middle"
            dominantBaseline="middle"
            fill={theme.colors.text}
            fontSize={24}
            fontWeight="bold"
            style={{ fontFamily: theme.fonts.heading }}
          >
            {data.name}
          </text>
        </g>
      </svg>

      {/* 说明 */}
      <div
        style={{
          marginTop: 30,
          fontSize: 18,
          color: theme.colors.textSecondary,
          textAlign: "center",
        }}
      >
        从内到外展示层级关系，扇区大小代表占比
      </div>
    </div>
  );
};
