import React, { useMemo } from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";
import * as d3 from "d3";

export interface OrgNode {
  id: string;
  name: string;
  title: string;
  avatar?: string;
  children?: OrgNode[];
}

export interface LogicOrgChartProps {
  data: OrgNode;
  title?: string;
  showAvatars?: boolean;
}

/**
 * 组织架构图 (使用 D3.js Tree Layout)
 * 展示组织层级和汇报关系
 */
export const LogicOrgChart: React.FC<LogicOrgChartProps> = ({
  data,
  title = "组织架构图",
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();

  const { nodes, links } = useMemo(() => {
    const hierarchy = d3.hierarchy(data);
    const treeLayout = d3.tree<OrgNode>().size([1000, 500]);
    const root = treeLayout(hierarchy);
    return { nodes: root.descendants(), links: root.links() };
  }, [data]);

  const opacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: 40, backgroundColor: theme.colors.background, opacity }}>
      <h2 style={{ fontSize: 48, fontWeight: "bold", color: theme.colors.text, marginBottom: 40 }}>{title}</h2>
      <svg width={1200} height={700}>
        <g transform="translate(100, 100)">
          {links.map((link, i) => (
            <path key={i} d={`M ${link.source.x} ${link.source.y} V ${(link.source.y! + link.target.y!) / 2} H ${link.target.x} V ${link.target.y}`} fill="none" stroke={theme.colors.surfaceLight} strokeWidth={2} />
          ))}
          {nodes.map((node, i) => {
            const scale = interpolate(frame, [i * 3, i * 3 + 20], [0, 1], { extrapolateRight: "clamp" });
            return (
              <g key={i} transform={`translate(${node.x}, ${node.y}) scale(${scale})`}>
                <rect x={-60} y={-30} width={120} height={60} fill={theme.colors.surface} stroke={theme.colors.primary} strokeWidth={2} rx={8} />
                <text y={-5} fill={theme.colors.text} fontSize={14} fontWeight="bold" textAnchor="middle">{node.data.name}</text>
                <text y={15} fill={theme.colors.textSecondary} fontSize={12} textAnchor="middle">{node.data.title}</text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
};
