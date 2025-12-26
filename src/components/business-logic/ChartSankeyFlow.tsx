import React, { useMemo } from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";
import { 
  sankey, 
  sankeyLinkHorizontal, 
  SankeyNode as D3SankeyNode, 
  SankeyLink as D3SankeyLink 
} from "d3-sankey";

export interface SankeyNodeData {
  id: string;
  name: string;
  color?: string;
}

export interface SankeyLinkData {
  source: string;
  target: string;
  value: number;
  color?: string;
}

export interface ChartSankeyFlowProps {
  /** 节点数组 */
  nodes: SankeyNodeData[];
  /** 连接数组 */
  links: SankeyLinkData[];
  /** 图表标题 */
  title?: string;
  /** 是否显示数值 */
  showValue?: boolean;
  /** 是否启用流动动画 */
  animated?: boolean;
}

/**
 * 桑基能量流图 (使用 D3-Sankey)
 * 
 * 展示资金、能源或流量的分配和流向，线条宽窄代表数量
 * 适用场景：资金流向、能源分配、用户路径分析
 * 
 * 教学要点：
 * - 流量守恒原理的可视化
 * - 多对多关系的展示
 * - 能量/资源分配的直观表达
 */
export const ChartSankeyFlow: React.FC<ChartSankeyFlowProps> = ({
  nodes = [],
  links = [],
  title = "流量分配图",
  showValue = true,
  animated = true,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();

  // 错误处理
  if (nodes.length === 0) {
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
        ⚠️ 请提供节点数据 (nodes)
      </div>
    );
  }

  const chartWidth = 1000;
  const chartHeight = 600;

  // 使用 D3-Sankey 计算布局
  const { sankeyNodes, sankeyLinks } = useMemo(() => {
    // 创建节点映射
    const nodeMap = new Map(nodes.map((n, i) => [n.id, i]));

    // 转换数据格式
    const d3Nodes = nodes.map((n) => ({ ...n }));
    const d3Links = links.map((l) => ({
      source: nodeMap.get(l.source)!,
      target: nodeMap.get(l.target)!,
      value: l.value,
      color: l.color,
    })) as any;

    // 创建 sankey 生成器
    const sankeyGenerator = sankey<SankeyNodeData, SankeyLinkData>()
      .nodeWidth(30)
      .nodePadding(20)
      .extent([
        [50, 50],
        [chartWidth - 50, chartHeight - 50],
      ]);

    // 计算布局
    const graph = sankeyGenerator({
      nodes: d3Nodes,
      links: d3Links,
    });

    return {
      sankeyNodes: graph.nodes as Array<D3SankeyNode<SankeyNodeData, SankeyLinkData>>,
      sankeyLinks: graph.links as Array<D3SankeyLink<SankeyNodeData, SankeyLinkData>>,
    };
  }, [nodes, links, chartWidth, chartHeight]);

  // 流动动画
  const flowOffset = animated
    ? interpolate(frame, [0, 60], [0, 100], { extrapolateRight: "wrap" })
    : 0;

  // 进入动画
  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

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
      <svg width={chartWidth} height={chartHeight} style={{ overflow: "visible" }}>
        <defs>
          {/* 流动渐变 */}
          <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={theme.colors.primary} stopOpacity="0.3" />
            <stop offset="50%" stopColor={theme.colors.primary} stopOpacity="0.8" />
            <stop offset="100%" stopColor={theme.colors.primary} stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {/* 绘制连接线 */}
        <g>
          {sankeyLinks.map((link, index) => {
            const linkData = link as D3SankeyLink<SankeyNodeData, SankeyLinkData> & { color?: string; width?: number };
            const sourceNode = link.source as D3SankeyNode<SankeyNodeData, SankeyLinkData> & { x0?: number; x1?: number; y0?: number; y1?: number };
            const targetNode = link.target as D3SankeyNode<SankeyNodeData, SankeyLinkData> & { x0?: number; x1?: number; y0?: number; y1?: number };
            
            const linkColor = linkData.color || theme.colors.primary;
            const path = sankeyLinkHorizontal()(link);

            return (
              <g key={`link-${index}`}>
                {/* 连接线背景 */}
                <path
                  d={path || ""}
                  fill="none"
                  stroke={linkColor}
                  strokeWidth={Math.max(linkData.width || 1, 1)}
                  opacity={0.4}
                  strokeLinecap="round"
                />

                {/* 流动效果 */}
                {animated && (
                  <path
                    d={path || ""}
                    fill="none"
                    stroke="url(#flowGradient)"
                    strokeWidth={Math.max((linkData.width || 1) * 0.6, 1)}
                    strokeDasharray="20 80"
                    strokeDashoffset={-flowOffset}
                    strokeLinecap="round"
                    opacity={0.8}
                  />
                )}

                {/* 数值标签 */}
                {showValue && (
                  <text
                    x={((sourceNode.x1 || 0) + (targetNode.x0 || 0)) / 2}
                    y={
                      ((sourceNode.y0 || 0) +
                        (sourceNode.y1 || 0) +
                        (targetNode.y0 || 0) +
                        (targetNode.y1 || 0)) / 4
                    }
                    fill={theme.colors.text}
                    fontSize={14}
                    textAnchor="middle"
                    style={{ fontFamily: theme.fonts.body }}
                  >
                    {link.value.toLocaleString()}
                  </text>
                )}
              </g>
            );
          })}
        </g>

        {/* 绘制节点 */}
        <g>
          {sankeyNodes.map((node, index) => {
            const nodeData = node as D3SankeyNode<SankeyNodeData, SankeyLinkData> & { 
              x0?: number; 
              x1?: number; 
              y0?: number; 
              y1?: number;
              color?: string;
              name?: string;
              value?: number;
            };
            
            const nodeColor = nodeData.color || theme.colors.secondary;

            return (
              <g key={`node-${index}`}>
                {/* 节点矩形 */}
                <rect
                  x={nodeData.x0 || 0}
                  y={nodeData.y0 || 0}
                  width={(nodeData.x1 || 0) - (nodeData.x0 || 0)}
                  height={(nodeData.y1 || 0) - (nodeData.y0 || 0)}
                  fill={nodeColor}
                  rx={4}
                  style={{
                    filter: `drop-shadow(0 4px 8px ${nodeColor}40)`,
                  }}
                />

                {/* 节点名称 */}
                <text
                  x={
                    (nodeData.x0 || 0) < chartWidth / 2
                      ? (nodeData.x1 || 0) + 10
                      : (nodeData.x0 || 0) - 10
                  }
                  y={((nodeData.y0 || 0) + (nodeData.y1 || 0)) / 2}
                  fill={theme.colors.text}
                  fontSize={16}
                  fontWeight="bold"
                  textAnchor={
                    (nodeData.x0 || 0) < chartWidth / 2 ? "start" : "end"
                  }
                  dominantBaseline="middle"
                  style={{ fontFamily: theme.fonts.body }}
                >
                  {nodeData.name}
                </text>

                {/* 节点数值 */}
                {showValue && (
                  <text
                    x={
                      (nodeData.x0 || 0) < chartWidth / 2
                        ? (nodeData.x1 || 0) + 10
                        : (nodeData.x0 || 0) - 10
                    }
                    y={((nodeData.y0 || 0) + (nodeData.y1 || 0)) / 2 + 20}
                    fill={theme.colors.textSecondary}
                    fontSize={14}
                    textAnchor={
                      (nodeData.x0 || 0) < chartWidth / 2 ? "start" : "end"
                    }
                    style={{ fontFamily: theme.fonts.body }}
                  >
                    {(nodeData.value || 0).toLocaleString()}
                  </text>
                )}
              </g>
            );
          })}
        </g>
      </svg>

      {/* 说明文字 */}
      <div
        style={{
          marginTop: 30,
          fontSize: 18,
          color: theme.colors.textSecondary,
          textAlign: "center",
        }}
      >
        线条宽度代表流量大小
      </div>
    </div>
  );
};


