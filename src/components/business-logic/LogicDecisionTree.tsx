import React, { useMemo } from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";
import * as d3 from "d3";

export interface DecisionNode {
  id: string;
  label: string;
  type?: "decision" | "outcome" | "action";
  children?: DecisionNode[];
  value?: number;
}

export interface LogicDecisionTreeProps {
  /** 决策树数据 */
  data: DecisionNode;
  /** 图表标题 */
  title?: string;
  /** 是否显示连接线标签 */
  showEdgeLabels?: boolean;
}

/**
 * 决策树组件 (使用 D3.js Tree Layout)
 * 
 * 展示决策流程和分支逻辑
 * 适用场景：决策分析、流程图、算法可视化
 * 
 * 教学要点：
 * - 树形结构的可视化
 * - 决策路径的展示
 * - 层级关系的表达
 */
export const LogicDecisionTree: React.FC<LogicDecisionTreeProps> = ({
  data,
  title = "决策树",
  showEdgeLabels = true,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();

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
        ⚠️ 请提供决策树数据
      </div>
    );
  }

  const width = 1200;
  const height = 700;

  // 使用 D3 Tree 布局
  const { nodes, links } = useMemo(() => {
    const hierarchy = d3.hierarchy(data);
    const treeLayout = d3.tree<DecisionNode>().size([width - 200, height - 200]);
    const root = treeLayout(hierarchy);

    return {
      nodes: root.descendants(),
      links: root.links(),
    };
  }, [data, width, height]);

  // 进入动画
  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  // 节点逐个出现
  const visibleNodeCount = Math.min(
    Math.floor(interpolate(frame, [0, 60], [0, nodes.length], {
      extrapolateRight: "clamp",
    })),
    nodes.length
  );

  const getNodeColor = (type?: string) => {
    switch (type) {
      case "decision":
        return theme.colors.warning;
      case "outcome":
        return theme.colors.success;
      case "action":
        return theme.colors.secondary;
      default:
        return theme.colors.primary;
    }
  };

  const getNodeShape = (type?: string) => {
    switch (type) {
      case "decision":
        return "diamond";
      case "outcome":
        return "rect";
      default:
        return "circle";
    }
  };

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
      <svg width={width} height={height}>
        <g transform="translate(100, 100)">
          {/* 绘制连接线 */}
          {links.slice(0, visibleNodeCount - 1).map((link, index) => {
            const sourceX = link.source.x || 0;
            const sourceY = link.source.y || 0;
            const targetX = link.target.x || 0;
            const targetY = link.target.y || 0;

            // 贝塞尔曲线路径
            const path = `M ${sourceX} ${sourceY} 
                         C ${sourceX} ${(sourceY + targetY) / 2},
                           ${targetX} ${(sourceY + targetY) / 2},
                           ${targetX} ${targetY}`;

            return (
              <g key={`link-${index}`}>
                <path
                  d={path}
                  fill="none"
                  stroke={theme.colors.surfaceLight}
                  strokeWidth={2}
                  opacity={0.6}
                />
                {showEdgeLabels && link.target.data.value && (
                  <text
                    x={(sourceX + targetX) / 2}
                    y={(sourceY + targetY) / 2}
                    fill={theme.colors.textSecondary}
                    fontSize={12}
                    textAnchor="middle"
                    style={{ fontFamily: theme.fonts.body }}
                  >
                    {link.target.data.value}
                  </text>
                )}
              </g>
            );
          })}

          {/* 绘制节点 */}
          {nodes.slice(0, visibleNodeCount).map((node, index) => {
            const x = node.x || 0;
            const y = node.y || 0;
            const nodeType = node.data.type;
            const color = getNodeColor(nodeType);
            const shape = getNodeShape(nodeType);

            // 节点缩放动画
            const nodeScale = interpolate(
              frame,
              [index * 2, index * 2 + 20],
              [0, 1],
              { extrapolateRight: "clamp" }
            );

            return (
              <g
                key={`node-${index}`}
                transform={`translate(${x}, ${y}) scale(${nodeScale})`}
              >
                {/* 节点形状 */}
                {shape === "circle" && (
                  <circle
                    r={30}
                    fill={color}
                    stroke="white"
                    strokeWidth={3}
                    style={{
                      filter: `drop-shadow(0 4px 8px ${color}40)`,
                    }}
                  />
                )}
                {shape === "rect" && (
                  <rect
                    x={-35}
                    y={-25}
                    width={70}
                    height={50}
                    fill={color}
                    stroke="white"
                    strokeWidth={3}
                    rx={8}
                    style={{
                      filter: `drop-shadow(0 4px 8px ${color}40)`,
                    }}
                  />
                )}
                {shape === "diamond" && (
                  <path
                    d="M 0,-35 L 40,0 L 0,35 L -40,0 Z"
                    fill={color}
                    stroke="white"
                    strokeWidth={3}
                    style={{
                      filter: `drop-shadow(0 4px 8px ${color}40)`,
                    }}
                  />
                )}

                {/* 节点标签 */}
                <text
                  y={5}
                  fill="white"
                  fontSize={14}
                  fontWeight="bold"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{ fontFamily: theme.fonts.body }}
                >
                  {node.data.label}
                </text>

                {/* 节点 ID */}
                <text
                  y={shape === "rect" ? 60 : 50}
                  fill={theme.colors.textSecondary}
                  fontSize={12}
                  textAnchor="middle"
                  style={{ fontFamily: theme.fonts.mono }}
                >
                  {node.data.id}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      {/* 说明 */}
      <div
        style={{
          marginTop: 20,
          fontSize: 18,
          color: theme.colors.textSecondary,
          textAlign: "center",
        }}
      >
        决策树展示分支逻辑和决策路径
      </div>
    </div>
  );
};
