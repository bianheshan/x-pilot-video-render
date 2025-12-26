import React from "react";
import { useCurrentFrame, interpolate, spring } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";

export interface NetworkNode {
  id: string;
  type: "router" | "switch" | "server" | "cloud" | "client";
  label: string;
  x: number;
  y: number;
}

export interface NetworkLink {
  from: string;
  to: string;
  bandwidth?: string;
  status?: "active" | "slow" | "down";
}

export interface TechNetworkTopologyProps {
  nodes?: NetworkNode[];
  links?: NetworkLink[];
  showTraffic?: boolean;
  animateConnections?: boolean;
}

export const TechNetworkTopology: React.FC<TechNetworkTopologyProps> = ({
  nodes = [
    { id: "cloud", type: "cloud", label: "Internet", x: 540, y: 100 },
    { id: "router1", type: "router", label: "Router", x: 540, y: 250 },
    { id: "switch1", type: "switch", label: "Switch 1", x: 300, y: 400 },
    { id: "switch2", type: "switch", label: "Switch 2", x: 780, y: 400 },
    { id: "server1", type: "server", label: "Web Server", x: 150, y: 550 },
    { id: "server2", type: "server", label: "DB Server", x: 450, y: 550 },
    { id: "client1", type: "client", label: "Client 1", x: 630, y: 550 },
    { id: "client2", type: "client", label: "Client 2", x: 930, y: 550 },
  ],
  links = [
    { from: "cloud", to: "router1", bandwidth: "1 Gbps", status: "active" },
    { from: "router1", to: "switch1", bandwidth: "1 Gbps", status: "active" },
    { from: "router1", to: "switch2", bandwidth: "1 Gbps", status: "active" },
    { from: "switch1", to: "server1", bandwidth: "100 Mbps", status: "active" },
    { from: "switch1", to: "server2", bandwidth: "100 Mbps", status: "active" },
    { from: "switch2", to: "client1", bandwidth: "100 Mbps", status: "active" },
    { from: "switch2", to: "client2", bandwidth: "100 Mbps", status: "slow" },
  ],
  showTraffic = true,
  animateConnections = true,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();
  const fps = 30;

  // 节点图标
  const nodeIcons = {
    router: "🔀",
    switch: "🔄",
    server: "🖥️",
    cloud: "☁️",
    client: "💻",
  };

  const nodeColors = {
    router: "#FF6B6B",
    switch: "#4ECDC4",
    server: "#45B7D1",
    cloud: "#96CEB4",
    client: "#FFEAA7",
  };

  const statusColors = {
    active: "#4EC9B0",
    slow: "#FFCC00",
    down: "#F48771",
  };

  // 节点动画
  const nodeScale = spring({
    frame,
    fps,
    config: {
      damping: 15,
      stiffness: 100,
    },
  });

  // 渲染节点
  const renderNode = (node: NetworkNode, index: number) => {
    const delay = index * 10;
    const opacity = interpolate(frame - delay, [0, 20], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    const pulseScale =
      1 + Math.sin((frame + index * 10) * 0.1) * 0.05;

    return (
      <g
        key={node.id}
        transform={`translate(${node.x}, ${node.y}) scale(${nodeScale * pulseScale})`}
        style={{ opacity }}
      >
        {/* 节点圆圈 */}
        <circle
          r={node.type === "cloud" ? 50 : 40}
          fill={nodeColors[node.type]}
          stroke={theme.colors.text}
          strokeWidth="2"
          opacity="0.9"
        />

        {/* 节点图标 */}
        <text
          y="10"
          fill="#FFFFFF"
          fontSize={node.type === "cloud" ? "40" : "30"}
          textAnchor="middle"
        >
          {nodeIcons[node.type]}
        </text>

        {/* 节点标签 */}
        <text
          y={node.type === "cloud" ? 70 : 60}
          fill={theme.colors.text}
          fontSize="14"
          fontWeight="bold"
          textAnchor="middle"
          fontFamily="'Fira Code', monospace"
        >
          {node.label}
        </text>

        {/* 状态指示灯 */}
        <circle
          cx="30"
          cy="-30"
          r="5"
          fill="#4EC9B0"
          opacity={interpolate(frame % 60, [0, 30, 60], [0.3, 1, 0.3])}
        />
      </g>
    );
  };

  // 渲染连接线
  const renderLink = (link: NetworkLink, index: number) => {
    const fromNode = nodes.find((n) => n.id === link.from);
    const toNode = nodes.find((n) => n.id === link.to);

    if (!fromNode || !toNode) return null;

    const delay = nodes.length * 10 + index * 15;
    const opacity = interpolate(frame - delay, [0, 20], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    const status = link.status || "active";

    // 数据包动画
    const packetProgress = ((frame * 2 + index * 20) % 100) / 100;
    const packetX = fromNode.x + (toNode.x - fromNode.x) * packetProgress;
    const packetY = fromNode.y + (toNode.y - fromNode.y) * packetProgress;

    return (
      <g key={`${link.from}-${link.to}`} style={{ opacity }}>
        {/* 连接线 */}
        <line
          x1={fromNode.x}
          y1={fromNode.y}
          x2={toNode.x}
          y2={toNode.y}
          stroke={statusColors[status]}
          strokeWidth="3"
          strokeDasharray={status === "slow" ? "5,5" : "none"}
          opacity="0.6"
        />

        {/* 带宽标签 */}
        {link.bandwidth && (
          <text
            x={(fromNode.x + toNode.x) / 2}
            y={(fromNode.y + toNode.y) / 2 - 10}
            fill={theme.colors.text}
            fontSize="11"
            textAnchor="middle"
            opacity="0.7"
            fontFamily="'Fira Code', monospace"
          >
            {link.bandwidth}
          </text>
        )}

        {/* 数据包 */}
        {showTraffic && status === "active" && (
          <circle
            cx={packetX}
            cy={packetY}
            r="5"
            fill={statusColors[status]}
          >
            <animate
              attributeName="r"
              values="5;8;5"
              dur="1s"
              repeatCount="indefinite"
            />
          </circle>
        )}
      </g>
    );
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.colors.background,
      }}
    >
      <svg width="1080" height="720">
        {/* 标题 */}
        <text
          x="540"
          y="40"
          fill={theme.colors.text}
          fontSize="28"
          fontWeight="bold"
          textAnchor="middle"
          fontFamily="'Fira Code', monospace"
        >
          🌐 Network Topology
        </text>

        {/* 渲染连接线 */}
        {links.map((link, index) => renderLink(link, index))}

        {/* 渲染节点 */}
        {nodes.map((node, index) => renderNode(node, index))}

        {/* 图例 */}
        <g transform="translate(50, 650)">
          <text
            x="0"
            y="0"
            fill={theme.colors.text}
            fontSize="12"
            fontWeight="bold"
            fontFamily="'Fira Code', monospace"
          >
            Status:
          </text>
          <circle cx="70" cy="-4" r="5" fill={statusColors.active} />
          <text
            x="80"
            y="0"
            fill={theme.colors.text}
            fontSize="11"
            fontFamily="'Fira Code', monospace"
          >
            Active
          </text>
          <circle cx="140" cy="-4" r="5" fill={statusColors.slow} />
          <text
            x="150"
            y="0"
            fill={theme.colors.text}
            fontSize="11"
            fontFamily="'Fira Code', monospace"
          >
            Slow
          </text>
          <circle cx="200" cy="-4" r="5" fill={statusColors.down} />
          <text
            x="210"
            y="0"
            fill={theme.colors.text}
            fontSize="11"
            fontFamily="'Fira Code', monospace"
          >
            Down
          </text>
        </g>
      </svg>
    </div>
  );
};
