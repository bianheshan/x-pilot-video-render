import React from "react";
import { useCurrentFrame, interpolate, random } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";

export interface Server {
  id: string;
  name: string;
  load: number; // 0-100
  status: "active" | "warning" | "error" | "idle";
}

export interface TechServerRackProps {
  servers?: Server[];
  showMetrics?: boolean;
  animateLights?: boolean;
}

export const TechServerRack: React.FC<TechServerRackProps> = ({
  servers = [
    { id: "web-01", name: "Web Server 01", load: 85, status: "active" },
    { id: "web-02", name: "Web Server 02", load: 72, status: "active" },
    { id: "db-01", name: "Database 01", load: 95, status: "warning" },
    { id: "db-02", name: "Database 02", load: 45, status: "active" },
    { id: "cache-01", name: "Cache Server", load: 30, status: "active" },
    { id: "backup-01", name: "Backup Server", load: 15, status: "idle" },
  ],
  showMetrics = true,
  animateLights = true,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();

  const statusColors = {
    active: "#4EC9B0",
    warning: "#FFCC00",
    error: "#F48771",
    idle: "#858585",
  };

  // 服务器灯光闪烁
  const getLightOpacity = (serverId: string, lightIndex: number) => {
    if (!animateLights) return 1;

    const seed = `${serverId}-${lightIndex}`;
    const frequency = random(seed) * 20 + 10;
    return interpolate(
      (frame + random(seed) * 30) % frequency,
      [0, frequency / 2, frequency],
      [0.3, 1, 0.3]
    );
  };

  // 渲染单个服务器
  const renderServer = (server: Server, index: number) => {
    const y = 100 + index * 100;
    const loadBarWidth = (server.load / 100) * 200;

    // 入场动画
    const entryProgress = interpolate(frame - index * 10, [0, 30], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    return (
      <g
        key={server.id}
        transform={`translate(${interpolate(entryProgress, [0, 1], [-300, 100])}, ${y})`}
        style={{ opacity: entryProgress }}
      >
        {/* 服务器机箱 */}
        <rect
          width="800"
          height="80"
          fill="#2D2D30"
          stroke={statusColors[server.status]}
          strokeWidth="2"
          rx="4"
        />

        {/* 前面板 */}
        <rect
          x="10"
          y="10"
          width="60"
          height="60"
          fill="#1E1E1E"
          rx="2"
        />

        {/* 状态指示灯 */}
        {[0, 1, 2, 3].map((lightIndex) => (
          <circle
            key={lightIndex}
            cx={25 + lightIndex * 15}
            cy={25}
            r="4"
            fill={statusColors[server.status]}
            opacity={getLightOpacity(server.id, lightIndex)}
          />
        ))}

        {/* 硬盘指示灯 */}
        {[0, 1, 2, 3, 4, 5].map((diskIndex) => (
          <rect
            key={diskIndex}
            x={15 + diskIndex * 8}
            y={45}
            width="6"
            height="15"
            fill={diskIndex < server.load / 20 ? "#4EC9B0" : "#3E3E42"}
            rx="1"
          />
        ))}

        {/* 服务器名称 */}
        <text
          x="90"
          y="30"
          fill={theme.colors.text}
          fontSize="16"
          fontWeight="bold"
          fontFamily="'Fira Code', monospace"
        >
          {server.name}
        </text>

        {/* 状态标签 */}
        <rect
          x="90"
          y="40"
          width="80"
          height="20"
          fill={statusColors[server.status]}
          opacity="0.2"
          rx="3"
        />
        <text
          x="130"
          y="54"
          fill={statusColors[server.status]}
          fontSize="12"
          textAnchor="middle"
          fontFamily="'Fira Code', monospace"
        >
          {server.status.toUpperCase()}
        </text>

        {/* 负载条 */}
        {showMetrics && (
          <>
            <text
              x="200"
              y="30"
              fill={theme.colors.text}
              fontSize="12"
              opacity="0.7"
              fontFamily="'Fira Code', monospace"
            >
              Load:
            </text>
            <rect
              x="250"
              y="15"
              width="200"
              height="20"
              fill="#1E1E1E"
              stroke={theme.colors.text}
              strokeWidth="1"
              opacity="0.3"
              rx="3"
            />
            <rect
              x="250"
              y="15"
              width={loadBarWidth * entryProgress}
              height="20"
              fill={
                server.load > 90
                  ? "#F48771"
                  : server.load > 70
                  ? "#FFCC00"
                  : "#4EC9B0"
              }
              rx="3"
            />
            <text
              x="460"
              y="30"
              fill={theme.colors.text}
              fontSize="14"
              fontWeight="bold"
              fontFamily="'Fira Code', monospace"
            >
              {server.load}%
            </text>
          </>
        )}

        {/* CPU/内存指标 */}
        {showMetrics && (
          <>
            <text
              x="500"
              y="30"
              fill={theme.colors.text}
              fontSize="11"
              opacity="0.7"
              fontFamily="'Fira Code', monospace"
            >
              CPU: {Math.floor(server.load * 0.8)}%
            </text>
            <text
              x="500"
              y="50"
              fill={theme.colors.text}
              fontSize="11"
              opacity="0.7"
              fontFamily="'Fira Code', monospace"
            >
              MEM: {Math.floor(server.load * 0.6)}%
            </text>
            <text
              x="620"
              y="30"
              fill={theme.colors.text}
              fontSize="11"
              opacity="0.7"
              fontFamily="'Fira Code', monospace"
            >
              NET: {Math.floor(random(server.id) * 1000)} Mbps
            </text>
            <text
              x="620"
              y="50"
              fill={theme.colors.text}
              fontSize="11"
              opacity="0.7"
              fontFamily="'Fira Code', monospace"
            >
              DISK: {Math.floor(random(`${server.id}-disk`) * 500)} MB/s
            </text>
          </>
        )}

        {/* 散热风扇 */}
        <g transform="translate(750, 40)">
          <circle
            cx="0"
            cy="0"
            r="15"
            fill="none"
            stroke={theme.colors.text}
            strokeWidth="1"
            opacity="0.3"
          />
          {[0, 1, 2, 3].map((blade) => (
            <line
              key={blade}
              x1="0"
              y1="0"
              x2={Math.cos((blade * Math.PI) / 2 + (frame * 0.1)) * 12}
              y2={Math.sin((blade * Math.PI) / 2 + (frame * 0.1)) * 12}
              stroke={theme.colors.text}
              strokeWidth="2"
              opacity="0.5"
            />
          ))}
        </g>
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
          y="50"
          fill={theme.colors.text}
          fontSize="28"
          fontWeight="bold"
          textAnchor="middle"
          fontFamily="'Fira Code', monospace"
        >
          🖥️ Server Rack Monitor
        </text>

        {/* 机柜框架 */}
        <rect
          x="50"
          y="80"
          width="980"
          height={servers.length * 100 + 40}
          fill="none"
          stroke={theme.colors.text}
          strokeWidth="3"
          opacity="0.3"
          rx="8"
        />

        {/* 渲染所有服务器 */}
        {servers.map((server, index) => renderServer(server, index))}
      </svg>
    </div>
  );
};
