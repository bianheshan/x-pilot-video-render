import React, { useMemo } from "react";
import { random, useCurrentFrame, useVideoConfig } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";
import * as d3 from "d3";

type Seed = string | number;

export interface Component {
  id: string;
  type: "chip" | "resistor" | "capacitor" | "led";
  x?: number;
  y?: number;
  label: string;
}

export interface Signal {
  from: string;
  to: string;
  color?: string;
}

export interface IndCircuitBoardProps {
  components?: Component[];
  signals?: Signal[];
  title?: string;
  showLabels?: boolean;
  /** Deterministic seed (avoid Math.random + SMIL). */
  seed?: Seed;
  /** SVG width/height; defaults derived from video size. */
  width?: number;
  height?: number;
  /** Board background color (PCB). */
  boardColor?: string;
}

/**
 * IndCircuitBoard - 电路板信号传输（确定性、帧驱动）
 * - 不使用 Math.random
 * - 不使用 SVG SMIL（animateTransform），保证 Remotion 渲染可复现
 */
export const IndCircuitBoard: React.FC<IndCircuitBoardProps> = ({
  components = [
    { id: "cpu", type: "chip", label: "CPU" },
    { id: "ram1", type: "chip", label: "RAM1" },
    { id: "ram2", type: "chip", label: "RAM2" },
    { id: "gpu", type: "chip", label: "GPU" },
    { id: "r1", type: "resistor", label: "R1" },
    { id: "r2", type: "resistor", label: "R2" },
    { id: "c1", type: "capacitor", label: "C1" },
    { id: "c2", type: "capacitor", label: "C2" },
    { id: "led1", type: "led", label: "LED1" },
    { id: "led2", type: "led", label: "LED2" },
  ],
  signals = [
    { from: "cpu", to: "ram1" },
    { from: "cpu", to: "ram2" },
    { from: "cpu", to: "gpu" },
    { from: "cpu", to: "r1" },
    { from: "r1", to: "led1" },
    { from: "gpu", to: "r2" },
    { from: "r2", to: "led2" },
    { from: "ram1", to: "c1" },
    { from: "ram2", to: "c2" },
  ],
  title = "电路板信号传输",
  showLabels = true,
  seed,
  width,
  height,
  boardColor,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();
  const { width: videoW, height: videoH } = useVideoConfig();

  const seedBase = (seed ?? "IndCircuitBoard").toString();

  const svgW = width ?? Math.min(1080, videoW);
  const svgH = height ?? Math.min(720, videoH);

  const pcbColor = boardColor ?? "#1a3a1a";

  // Layout regions (relative)
  const titleY = Math.round(svgH * 0.06);
  const leftPanelX = Math.round(svgW * 0.05);
  const leftPanelY = Math.round(svgH * 0.11);
  const rightPanelW = Math.round(svgW * 0.17);
  const rightPanelX = svgW - rightPanelW - Math.round(svgW * 0.05);
  const rightPanelY = leftPanelY;

  const boardX = Math.round(svgW * 0.08);
  const boardY = Math.round(svgH * 0.15);
  const boardW = svgW - boardX * 2;
  const boardH = svgH - boardY - Math.round(svgH * 0.1);

  const layout = useMemo(() => {
    const width = Math.max(200, boardW);
    const height = Math.max(200, boardH);

    const nodes = components.map((comp, idx) => {
      const rx = random(`${seedBase}:node:${comp.id}:x`);
      const ry = random(`${seedBase}:node:${comp.id}:y`);
      return {
        id: comp.id,
        type: comp.type,
        label: comp.label,
        x: comp.x ?? width / 2 + (rx - 0.5) * width * 0.6,
        y: comp.y ?? height / 2 + (ry - 0.5) * height * 0.6,
        _idx: idx,
      };
    });

    const links = signals.map((sig) => ({
      source: sig.from,
      target: sig.to,
      color: sig.color,
    }));

    const simulation = d3
      .forceSimulation(nodes as any)
      .force(
        "link",
        d3
          .forceLink(links)
          .id((d: any) => d.id)
          .distance(Math.max(110, Math.min(170, Math.min(width, height) * 0.22)))
      )
      .force("charge", d3.forceManyBody().strength(-500))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(40))
      .stop();

    for (let i = 0; i < 300; i++) simulation.tick();

    return { nodes, links, width, height };
  }, [boardH, boardW, components, seedBase, signals]);

  const getComponentColor = (type: string) => {
    switch (type) {
      case "chip":
        return theme.colors.primary;
      case "resistor":
        return "#D4AF37";
      case "capacitor":
        return "#4A90E2";
      case "led":
        return "#FF6B6B";
      default:
        return theme.colors.text;
    }
  };

  const getComponentSize = (type: string) => {
    switch (type) {
      case "chip":
        return { width: 60, height: 60 };
      case "resistor":
        return { width: 40, height: 15 };
      case "capacitor":
        return { width: 30, height: 40 };
      case "led":
        return { width: 20, height: 20 };
      default:
        return { width: 30, height: 30 };
    }
  };

  const renderComponent = (node: any) => {
    const size = getComponentSize(node.type);
    const color = getComponentColor(node.type);
    const pulse = 1 + Math.sin(frame * 0.1 + node.id.length) * 0.1;

    switch (node.type) {
      case "chip":
        return (
          <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
            <rect
              x={-size.width / 2}
              y={-size.height / 2}
              width={size.width}
              height={size.height}
              fill={color}
              stroke={theme.colors.accent}
              strokeWidth="2"
              rx="4"
              opacity={0.9}
            />

            {Array.from({ length: 8 }).map((_, i) => {
              const side = Math.floor(i / 2);
              const offset = (i % 2) * 20 - 10;
              const positions = [
                { x: offset, y: -size.height / 2 - 5 },
                { x: size.width / 2 + 5, y: offset },
                { x: offset, y: size.height / 2 + 5 },
                { x: -size.width / 2 - 5, y: offset },
              ];
              const pos = positions[side];
              return <rect key={i} x={pos.x - 2} y={pos.y - 2} width="4" height="4" fill="#C0C0C0" />;
            })}

            <text
              y="5"
              fill={theme.colors.background}
              fontSize="12"
              fontWeight="bold"
              textAnchor="middle"
              fontFamily={theme.fonts.mono}
            >
              {node.label}
            </text>

            <circle
              r={size.width / 2 + 5}
              fill="none"
              stroke={theme.colors.accent}
              strokeWidth="2"
              opacity={0.3 * pulse}
            />
          </g>
        );

      case "resistor":
        return (
          <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
            <rect
              x={-size.width / 2}
              y={-size.height / 2}
              width={size.width}
              height={size.height}
              fill={color}
              stroke={theme.colors.text}
              strokeWidth="2"
              rx="2"
            />

            {[0.3, 0.5, 0.7].map((pos, i) => (
              <line
                key={i}
                x1={-size.width / 2 + size.width * pos}
                y1={-size.height / 2}
                x2={-size.width / 2 + size.width * pos}
                y2={size.height / 2}
                stroke={["#FF0000", "#00FF00", "#0000FF"][i]}
                strokeWidth="2"
              />
            ))}

            <line x1={-size.width / 2 - 10} y1="0" x2={-size.width / 2} y2="0" stroke="#C0C0C0" strokeWidth="2" />
            <line x1={size.width / 2} y1="0" x2={size.width / 2 + 10} y2="0" stroke="#C0C0C0" strokeWidth="2" />

            {showLabels && (
              <text y={size.height / 2 + 15} fill={theme.colors.text} fontSize="10" textAnchor="middle" fontFamily={theme.fonts.mono}>
                {node.label}
              </text>
            )}
          </g>
        );

      case "capacitor":
        return (
          <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
            <line x1="-2" y1={-size.height / 2} x2="-2" y2={size.height / 2} stroke={color} strokeWidth="4" />
            <line x1="2" y1={-size.height / 2} x2="2" y2={size.height / 2} stroke={color} strokeWidth="4" />

            <line x1="-2" y1={-size.height / 2 - 10} x2="-2" y2={-size.height / 2} stroke="#C0C0C0" strokeWidth="2" />
            <line x1="2" y1={size.height / 2} x2="2" y2={size.height / 2 + 10} stroke="#C0C0C0" strokeWidth="2" />

            <text x="-10" y="-5" fill={theme.colors.text} fontSize="14" fontWeight="bold" fontFamily={theme.fonts.mono}>
              +
            </text>

            {showLabels && (
              <text y={size.height / 2 + 25} fill={theme.colors.text} fontSize="10" textAnchor="middle" fontFamily={theme.fonts.mono}>
                {node.label}
              </text>
            )}
          </g>
        );

      case "led": {
        const ledOpacity = 0.8 + Math.sin(frame * 0.2 + node.id.length) * 0.2;
        return (
          <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
            <circle r={size.width / 2} fill={color} stroke={theme.colors.text} strokeWidth="2" opacity={ledOpacity} />

            <circle r={size.width / 2 + 5} fill="none" stroke={color} strokeWidth="2" opacity={0.5 * pulse} />
            <circle r={size.width / 2 + 10} fill="none" stroke={color} strokeWidth="1" opacity={0.3 * pulse} />

            <line x1="0" y1={size.height / 2} x2="0" y2={size.height / 2 + 10} stroke="#C0C0C0" strokeWidth="2" />
            <line x1="0" y1={-size.height / 2} x2="0" y2={-size.height / 2 - 10} stroke="#C0C0C0" strokeWidth="2" />

            {showLabels && (
              <text y={size.height / 2 + 25} fill={theme.colors.text} fontSize="10" textAnchor="middle" fontFamily={theme.fonts.mono}>
                {node.label}
              </text>
            )}
          </g>
        );
      }

      default:
        return null;
    }
  };

  const renderSignals = () => {
    return layout.links.map((link: any, index: number) => {
      const source = layout.nodes.find((n: any) => n.id === link.source.id || n.id === link.source);
      const target = layout.nodes.find((n: any) => n.id === link.target.id || n.id === link.target);

      if (!source || !target) return null;

      const lineGenerator = d3.line().curve(d3.curveBasis);

      const dx = target.x - source.x;
      const dy = target.y - source.y;
      const dr = Math.sqrt(dx * dx + dy * dy);

      const midX = (source.x + target.x) / 2;
      const midY = (source.y + target.y) / 2;

      const offsetX = (random(`${seedBase}:path:${source.id}:${target.id}:x`) - 0.5) * 50;
      const offsetY = (random(`${seedBase}:path:${source.id}:${target.id}:y`) - 0.5) * 50;

      const pathData = lineGenerator([
        [source.x, source.y],
        [midX + offsetX, midY + offsetY],
        [target.x, target.y],
      ] as any);

      const progress = ((frame * 2 + index * 10) % 100) / 100;
      const signalColor = link.color || theme.colors.accent;

      const cx = source.x + (target.x - source.x) * progress;
      const cy = source.y + (target.y - source.y) * progress;
      const pulse = 1 + Math.sin((frame + index * 11) / 6) * 0.25;

      return (
        <g key={`signal-${index}`}>
          <path d={pathData || ""} fill="none" stroke="#CD7F32" strokeWidth="3" opacity="0.6" />

          <g transform={`translate(${cx}, ${cy}) scale(${pulse}) translate(${-cx}, ${-cy})`}>
            <circle cx={cx} cy={cy} r="4" fill={signalColor} />
          </g>

          <path
            d={pathData || ""}
            fill="none"
            stroke={signalColor}
            strokeWidth="2"
            strokeDasharray={`${dr * progress} ${dr * (1 - progress)}`}
            opacity="0.8"
          />
        </g>
      );
    });
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: pcbColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <svg width={svgW} height={svgH} style={{ overflow: "visible" }}>
        <rect width={svgW} height={svgH} fill={pcbColor} />

        <defs>
          <pattern id="pcb-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="0.5" fill="#2a4a2a" />
          </pattern>
        </defs>
        <rect width={svgW} height={svgH} fill="url(#pcb-pattern)" opacity="0.3" />

        <text
          x={svgW / 2}
          y={titleY}
          fill="#FFD700"
          fontSize={Math.round(svgH * 0.045)}
          fontWeight="bold"
          textAnchor="middle"
          fontFamily={theme.fonts.heading}
        >
          {title}
        </text>

        <g transform={`translate(${leftPanelX}, ${leftPanelY})`}>
          <rect width={Math.round(svgW * 0.22)} height={Math.round(svgH * 0.18)} fill={theme.colors.surface} opacity="0.9" rx="8" />
          <text x="15" y="30" fill={theme.colors.text} fontSize="16" fontWeight="bold" fontFamily={theme.fonts.body}>
            电路参数
          </text>
          <text x="15" y="55" fill={theme.colors.text} fontSize="14" fontFamily={theme.fonts.body}>
            组件数: {layout.nodes.length}
          </text>
          <text x="15" y="75" fill={theme.colors.text} fontSize="14" fontFamily={theme.fonts.body}>
            连接数: {layout.links.length}
          </text>
          <text x="15" y="95" fill={theme.colors.text} fontSize="14" fontFamily={theme.fonts.body}>
            布局算法: D3 Force
          </text>
        </g>

        <g transform={`translate(${boardX}, ${boardY})`}>
          {renderSignals()}
          {layout.nodes.map(renderComponent)}
        </g>

        <g transform={`translate(${rightPanelX}, ${rightPanelY})`}>
          <rect width={rightPanelW} height={Math.round(svgH * 0.2)} fill={theme.colors.surface} opacity="0.9" rx="8" />
          <text x="15" y="25" fill={theme.colors.text} fontSize="14" fontWeight="bold" fontFamily={theme.fonts.body}>
            组件类型
          </text>
          {[
            { type: "chip", label: "芯片", color: theme.colors.primary },
            { type: "resistor", label: "电阻", color: "#D4AF37" },
            { type: "capacitor", label: "电容", color: "#4A90E2" },
            { type: "led", label: "LED", color: "#FF6B6B" },
          ].map((item, i) => (
            <g key={i} transform={`translate(15, ${45 + i * 22})`}>
              <rect width="20" height="15" fill={item.color} rx="2" />
              <text x="25" y="12" fill={theme.colors.text} fontSize="12" fontFamily={theme.fonts.body}>
                {item.label}
              </text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
};
