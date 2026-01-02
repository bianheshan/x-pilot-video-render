import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";

export interface FlowStep {
  id: string;
  label: string;
  description?: string;
  type?: "start" | "process" | "decision" | "end";
  next?: string[];
  x?: number;
  y?: number;
  icon?: string;
}

export interface FlowConnection {
  from: string;
  to: string;
  label?: string;
  dashed?: boolean;
}

export interface LogicFlowPathProps {
  steps: FlowStep[];
  connections?: FlowConnection[];
  title?: string;
  subtitle?: string;
  layout?: "auto-grid" | "timeline" | "custom";
  columns?: number;
  nodeSize?: { width: number; height: number };
}

const TYPE_COLORS: Record<NonNullable<FlowStep["type"]>, (theme: ReturnType<typeof useTheme>) => string> = {
  start: (theme) => theme.colors.success,
  process: (theme) => theme.colors.primary,
  decision: (theme) => theme.colors.warning,
  end: (theme) => theme.colors.error,
};

export const LogicFlowPath: React.FC<LogicFlowPathProps> = ({
  steps = [],
  connections,
  title = "流程图",
  subtitle,
  layout = "auto-grid",
  columns = 3,
  nodeSize = { width: 220, height: 110 },
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();

  const computedRows = Math.max(1, Math.ceil(steps.length / columns));

  const nodes = steps.map((step, index) => {
    const col = layout === "timeline" ? index : index % columns;
    const row = layout === "timeline" ? 0 : Math.floor(index / columns);
    const x = layout === "custom" && step.x !== undefined ? step.x : col * (nodeSize.width + 140);
    const y = layout === "custom" && step.y !== undefined ? step.y : row * (nodeSize.height + 120);
    return { ...step, x, y };
  });

  const nodeMap = new Map(nodes.map((node) => [node.id, node]));
  const derivedConnections: FlowConnection[] =
    connections ||
    nodes
      .flatMap((node) => node.next?.map((target) => ({ from: node.id, to: target })) || [])
      .filter((conn): conn is FlowConnection => Boolean(conn.to && conn.from));

  const opacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 40,
        opacity,
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 30 }}>
        <h2 style={{ fontSize: 48, fontWeight: 800, color: theme.colors.text, margin: 0 }}>{title}</h2>
        {subtitle && (
          <p style={{ color: theme.colors.textSecondary, marginTop: 12 }}>{subtitle}</p>
        )}
      </div>

      <svg width={columns * (nodeSize.width + 200)} height={computedRows * (nodeSize.height + 200)}>
        <defs>
          <marker
            id="arrowhead"
            markerWidth="12"
            markerHeight="12"
            refX="10"
            refY="6"
            orient="auto"
            fill={theme.colors.text}
          >
            <path d="M0,0 L0,12 L12,6 z" />
          </marker>
        </defs>

        {/* Connections */}
        {derivedConnections.map((connection, idx) => {
          const from = nodeMap.get(connection.from);
          const to = nodeMap.get(connection.to);
          if (!from || !to) {
            return null;
          }
          const dash = connection.dashed ? "10,6" : undefined;
          const animatedDash = 160 - (frame % 160);
          return (
            <g key={`conn-${idx}`}>
              <path
                d={`M ${from.x! + nodeSize.width / 2} ${from.y! + nodeSize.height / 2} C ${from.x! +
                  nodeSize.width + 60} ${from.y! + nodeSize.height / 2}, ${to.x! - 60} ${to.y! +
                  nodeSize.height / 2}, ${to.x! + nodeSize.width / 2} ${to.y! + nodeSize.height / 2}`}
                fill="none"
                stroke={theme.colors.text}
                strokeWidth={3}
                strokeDasharray={dash}
                strokeDashoffset={connection.dashed ? animatedDash : undefined}
                markerEnd="url(#arrowhead)"
                opacity={0.75}
              />
              {connection.label && (
                <text
                  x={(from.x! + to.x!) / 2 + nodeSize.width / 2}
                  y={(from.y! + to.y!) / 2 + nodeSize.height / 2 - 10}
                  fill={theme.colors.textSecondary}
                  fontSize={18}
                  textAnchor="middle"
                >
                  {connection.label}
                </text>
              )}
            </g>
          );
        })}

        {/* Nodes */}
        {nodes.map((node, index) => {
          const appear = interpolate(frame, [index * 5, index * 5 + 20], [0, 1], {
            extrapolateRight: "clamp",
          });
          const fill = node.type ? TYPE_COLORS[node.type]?.(theme) ?? theme.colors.primary : theme.colors.primary;
          const radius = node.type === "decision" ? 0 : 18;
          const shape = node.type === "decision" ? (
            <polygon
              points={`${node.x! + nodeSize.width / 2},${node.y!} ${node.x! + nodeSize.width},${node.y! +
                nodeSize.height / 2} ${node.x! + nodeSize.width / 2},${node.y! +
                nodeSize.height} ${node.x!},${node.y! + nodeSize.height / 2}`}
              fill={fill}
              opacity={0.9}
            />
          ) : (
            <rect
              x={node.x}
              y={node.y}
              width={nodeSize.width}
              height={nodeSize.height}
              rx={radius}
              ry={radius}
              fill={fill}
              opacity={0.9}
            />
          );

          return (
            <g key={node.id} opacity={appear}>
              {shape}
              <text
                x={node.x! + nodeSize.width / 2}
                y={node.y! + nodeSize.height / 2 - 8}
                fill="#fff"
                fontSize={20}
                fontWeight={700}
                textAnchor="middle"
              >
                {node.label}
              </text>
              {node.description && (
                <text
                  x={node.x! + nodeSize.width / 2}
                  y={node.y! + nodeSize.height / 2 + 24}
                  fill="rgba(255,255,255,0.8)"
                  fontSize={16}
                  textAnchor="middle"
                >
                  {node.description}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};
