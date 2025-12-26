import React, { useMemo } from "react";
import { useCurrentFrame } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";
import * as d3 from "d3";

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
}

/**
 * IndCircuitBoard - 电路板信号传输（使用 D3.js 力导向图）
 * 
 * 使用 D3.js 的力导向图算法自动布局电路板组件
 * 
 * 特性：
 * - D3 力导向布局
 * - 自动避免重叠
 * - 信号路径优化
 * - 动态连接动画
 * - PCB 风格渲染
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
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();

  // 使用 D3 力导向图计算布局
  const layout = useMemo(() => {
    const width = 900;
    const height = 600;

    // 创建节点和边
    const nodes = components.map((comp) => ({
      id: comp.id,
      type: comp.type,
      label: comp.label,
      x: comp.x ?? width / 2 + (Math.random() - 0.5) * 200,
      y: comp.y ?? height / 2 + (Math.random() - 0.5) * 200,
    }));

    const links = signals.map((sig) => ({
      source: sig.from,
      target: sig.to,
      color: sig.color,
    }));

    // 创建力模拟
    const simulation = d3
      .forceSimulation(nodes as any)
      .force(
        "link",
        d3
          .forceLink(links)
          .id((d: any) => d.id)
          .distance(150)
      )
      .force("charge", d3.forceManyBody().strength(-500))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(40))
      .stop();

    // 运行模拟
    for (let i = 0; i < 300; i++) {
      simulation.tick();
    }

    return { nodes, links };
  }, [components, signals]);

  // 获取组件颜色
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

  // 获取组件尺寸
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

  // 渲染组件
  const renderComponent = (node: any) => {
    const size = getComponentSize(node.type);
    const color = getComponentColor(node.type);
    const pulse = 1 + Math.sin(frame * 0.1 + node.id.length) * 0.1;

    switch (node.type) {
      case "chip":
        return (
          <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
            {/* 芯片主体 */}
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
            
            {/* 芯片引脚 */}
            {Array.from({ length: 8 }).map((_, i) => {
              const side = Math.floor(i / 2);
              const offset = (i % 2) * 20 - 10;
              const positions = [
                { x: offset, y: -size.height / 2 - 5 }, // 上
                { x: size.width / 2 + 5, y: offset }, // 右
                { x: offset, y: size.height / 2 + 5 }, // 下
                { x: -size.width / 2 - 5, y: offset }, // 左
              ];
              const pos = positions[side];
              return (
                <rect
                  key={i}
                  x={pos.x - 2}
                  y={pos.y - 2}
                  width="4"
                  height="4"
                  fill="#C0C0C0"
                />
              );
            })}

            {/* 芯片标签 */}
            <text
              y="5"
              fill={theme.colors.background}
              fontSize="12"
              fontWeight="bold"
              textAnchor="middle"
            >
              {node.label}
            </text>

            {/* 发光效果 */}
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
            {/* 电阻主体 */}
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
            
            {/* 色环 */}
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

            {/* 引脚 */}
            <line
              x1={-size.width / 2 - 10}
              y1="0"
              x2={-size.width / 2}
              y2="0"
              stroke="#C0C0C0"
              strokeWidth="2"
            />
            <line
              x1={size.width / 2}
              y1="0"
              x2={size.width / 2 + 10}
              y2="0"
              stroke="#C0C0C0"
              strokeWidth="2"
            />

            {showLabels && (
              <text
                y={size.height / 2 + 15}
                fill={theme.colors.text}
                fontSize="10"
                textAnchor="middle"
              >
                {node.label}
              </text>
            )}
          </g>
        );

      case "capacitor":
        return (
          <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
            {/* 电容极板 */}
            <line
              x1="-2"
              y1={-size.height / 2}
              x2="-2"
              y2={size.height / 2}
              stroke={color}
              strokeWidth="4"
            />
            <line
              x1="2"
              y1={-size.height / 2}
              x2="2"
              y2={size.height / 2}
              stroke={color}
              strokeWidth="4"
            />

            {/* 引脚 */}
            <line
              x1="-2"
              y1={-size.height / 2 - 10}
              x2="-2"
              y2={-size.height / 2}
              stroke="#C0C0C0"
              strokeWidth="2"
            />
            <line
              x1="2"
              y1={size.height / 2}
              x2="2"
              y2={size.height / 2 + 10}
              stroke="#C0C0C0"
              strokeWidth="2"
            />

            {/* 极性标记 */}
            <text
              x="-10"
              y="-5"
              fill={theme.colors.text}
              fontSize="14"
              fontWeight="bold"
            >
              +
            </text>

            {showLabels && (
              <text
                y={size.height / 2 + 25}
                fill={theme.colors.text}
                fontSize="10"
                textAnchor="middle"
              >
                {node.label}
              </text>
            )}
          </g>
        );

      case "led":
        return (
          <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
            {/* LED 主体 */}
            <circle
              r={size.width / 2}
              fill={color}
              stroke={theme.colors.text}
              strokeWidth="2"
              opacity={0.8 + Math.sin(frame * 0.2) * 0.2}
            />

            {/* 发光效果 */}
            <circle
              r={size.width / 2 + 5}
              fill="none"
              stroke={color}
              strokeWidth="2"
              opacity={0.5 * pulse}
            />
            <circle
              r={size.width / 2 + 10}
              fill="none"
              stroke={color}
              strokeWidth="1"
              opacity={0.3 * pulse}
            />

            {/* 引脚 */}
            <line
              x1="0"
              y1={size.height / 2}
              x2="0"
              y2={size.height / 2 + 10}
              stroke="#C0C0C0"
              strokeWidth="2"
            />
            <line
              x1="0"
              y1={-size.height / 2}
              x2="0"
              y2={-size.height / 2 - 10}
              stroke="#C0C0C0"
              strokeWidth="2"
            />

            {showLabels && (
              <text
                y={size.height / 2 + 25}
                fill={theme.colors.text}
                fontSize="10"
                textAnchor="middle"
              >
                {node.label}
              </text>
            )}
          </g>
        );

      default:
        return null;
    }
  };

  // 渲染信号传输
  const renderSignals = () => {
    return layout.links.map((link: any, index) => {
      const source = layout.nodes.find((n) => n.id === link.source.id || n.id === link.source);
      const target = layout.nodes.find((n) => n.id === link.target.id || n.id === link.target);

      if (!source || !target) return null;

      // 使用 D3 生成平滑曲线
      const lineGenerator = d3.line().curve(d3.curveBasis);
      
      // 计算控制点
      const dx = target.x - source.x;
      const dy = target.y - source.y;
      const dr = Math.sqrt(dx * dx + dy * dy);
      
      const midX = (source.x + target.x) / 2;
      const midY = (source.y + target.y) / 2;
      
      // 添加一些随机性使路径更自然
      const offsetX = (Math.random() - 0.5) * 50;
      const offsetY = (Math.random() - 0.5) * 50;

      const pathData = lineGenerator([
        [source.x, source.y],
        [midX + offsetX, midY + offsetY],
        [target.x, target.y],
      ] as any);

      // 信号动画进度
      const progress = ((frame * 2 + index * 10) % 100) / 100;
      const signalColor = link.color || theme.colors.accent;

      return (
        <g key={`signal-${index}`}>
          {/* PCB 走线 */}
          <path
            d={pathData || ""}
            fill="none"
            stroke="#CD7F32"
            strokeWidth="3"
            opacity="0.6"
          />

          {/* 信号脉冲 */}
          <circle
            cx={source.x + (target.x - source.x) * progress}
            cy={source.y + (target.y - source.y) * progress}
            r="4"
            fill={signalColor}
          >
            <animateTransform
              attributeName="transform"
              type="scale"
              values="1;1.5;1"
              dur="1s"
              repeatCount="indefinite"
            />
          </circle>

          {/* 信号轨迹 */}
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
        backgroundColor: "#1a3a1a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <svg width="1080" height="720" style={{ overflow: "visible" }}>
        {/* PCB 背景 */}
        <rect width="1080" height="720" fill="#1a3a1a" />
        
        {/* PCB 纹理 */}
        <defs>
          <pattern
            id="pcb-pattern"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="10" cy="10" r="0.5" fill="#2a4a2a" />
          </pattern>
        </defs>
        <rect width="1080" height="720" fill="url(#pcb-pattern)" opacity="0.3" />

        {/* 标题 */}
        <text
          x="540"
          y="40"
          fill="#FFD700"
          fontSize="32"
          fontWeight="bold"
          textAnchor="middle"
        >
          {title}
        </text>

        {/* 信息面板 */}
        <g transform="translate(50, 80)">
          <rect
            width="220"
            height="120"
            fill={theme.colors.surface}
            opacity="0.9"
            rx="8"
          />
          <text x="15" y="30" fill={theme.colors.text} fontSize="16" fontWeight="bold">
            电路参数
          </text>
          <text x="15" y="55" fill={theme.colors.text} fontSize="14">
            组件数: {layout.nodes.length}
          </text>
          <text x="15" y="75" fill={theme.colors.text} fontSize="14">
            连接数: {layout.links.length}
          </text>
          <text x="15" y="95" fill={theme.colors.text} fontSize="14">
            布局算法: D3 Force
          </text>
        </g>

        {/* 主视图 */}
        <g transform="translate(90, 110)">
          {/* 渲染连接线 */}
          {renderSignals()}

          {/* 渲染组件 */}
          {layout.nodes.map(renderComponent)}
        </g>

        {/* 图例 */}
        <g transform="translate(850, 80)">
          <rect width="180" height="140" fill={theme.colors.surface} opacity="0.9" rx="8" />
          <text x="15" y="25" fill={theme.colors.text} fontSize="14" fontWeight="bold">
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
              <text x="25" y="12" fill={theme.colors.text} fontSize="12">
                {item.label}
              </text>
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
};
