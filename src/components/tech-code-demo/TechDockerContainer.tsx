import React from "react";
import { useCurrentFrame, interpolate, spring } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";

export interface Container {
  id: string;
  name: string;
  image: string;
  status: "running" | "stopped" | "building";
  color: string;
}

export interface TechDockerContainerProps {
  containers?: Container[];
  showLogs?: boolean;
  animateStacking?: boolean;
}

export const TechDockerContainer: React.FC<TechDockerContainerProps> = ({
  containers = [
    {
      id: "web",
      name: "nginx-web",
      image: "nginx:latest",
      status: "running",
      color: "#009639",
    },
    {
      id: "api",
      name: "node-api",
      image: "node:18",
      status: "running",
      color: "#68A063",
    },
    {
      id: "db",
      name: "postgres-db",
      image: "postgres:15",
      status: "running",
      color: "#336791",
    },
    {
      id: "redis",
      name: "redis-cache",
      image: "redis:7",
      status: "running",
      color: "#DC382D",
    },
  ],
  showLogs = true,
  animateStacking = true,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();
  const fps = 30;

  // 集装箱堆叠动画
  const stackProgress = animateStacking
    ? spring({
        frame,
        fps,
        config: {
          damping: 20,
          stiffness: 80,
        },
      })
    : 1;

  // 渲染集装箱
  const renderContainer = (container: Container, index: number) => {
    const targetY = 500 - index * 100;
    const currentY = interpolate(stackProgress, [0, 1], [700, targetY]);

    const statusIcons = {
      running: "▶️",
      stopped: "⏸️",
      building: "🔨",
    };

    return (
      <g
        key={container.id}
        transform={`translate(200, ${currentY})`}
        style={{
          opacity: interpolate(stackProgress, [0, 1], [0, 1]),
        }}
      >
        {/* 集装箱主体 */}
        <rect
          width="680"
          height="90"
          fill={container.color}
          stroke={theme.colors.text}
          strokeWidth="3"
          rx="5"
        />

        {/* 集装箱纹理 */}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <line
            key={i}
            x1={i * 80 + 10}
            y1="10"
            x2={i * 80 + 10}
            y2="80"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="2"
          />
        ))}

        {/* Docker 标志 */}
        <text
          x="20"
          y="50"
          fill="#FFFFFF"
          fontSize="40"
          fontWeight="bold"
        >
          🐳
        </text>

        {/* 容器信息 */}
        <text
          x="80"
          y="35"
          fill="#FFFFFF"
          fontSize="18"
          fontWeight="bold"
          fontFamily="'Fira Code', monospace"
        >
          {container.name}
        </text>
        <text
          x="80"
          y="60"
          fill="#FFFFFF"
          fontSize="13"
          opacity="0.9"
          fontFamily="'Fira Code', monospace"
        >
          {container.image}
        </text>

        {/* 状态指示 */}
        <g transform="translate(600, 30)">
          <rect
            width="60"
            height="30"
            fill="rgba(255,255,255,0.2)"
            rx="15"
          />
          <text
            x="30"
            y="20"
            fill="#FFFFFF"
            fontSize="16"
            textAnchor="middle"
          >
            {statusIcons[container.status]}
          </text>
        </g>

        {/* 运行指示灯 */}
        {container.status === "running" && (
          <circle
            cx="650"
            cy="15"
            r="5"
            fill="#4EC9B0"
            opacity={interpolate(frame % 60, [0, 30, 60], [0.3, 1, 0.3])}
          />
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
          y="50"
          fill={theme.colors.text}
          fontSize="32"
          fontWeight="bold"
          textAnchor="middle"
          fontFamily="'Fira Code', monospace"
        >
          🐳 Docker Container Stack
        </text>

        {/* 地面 */}
        <rect
          x="0"
          y="600"
          width="1080"
          height="120"
          fill={theme.colors.text}
          opacity="0.1"
        />

        {/* 渲染所有集装箱 */}
        {containers.map((container, index) => renderContainer(container, index))}

        {/* 日志输出 */}
        {showLogs && stackProgress >= 1 && (
          <g transform="translate(50, 100)">
            <rect
              width="300"
              height="150"
              fill="#1E1E1E"
              stroke={theme.colors.text}
              strokeWidth="2"
              rx="5"
            />
            <text
              x="10"
              y="25"
              fill="#4EC9B0"
              fontSize="12"
              fontFamily="'Fira Code', monospace"
            >
              $ docker ps
            </text>
            {containers.slice(0, 3).map((container, index) => (
              <text
                key={container.id}
                x="10"
                y={50 + index * 20}
                fill={theme.colors.text}
                fontSize="10"
                fontFamily="'Fira Code', monospace"
              >
                {container.id.padEnd(12)} {container.name.padEnd(15)}{" "}
                {container.status}
              </text>
            ))}
          </g>
        )}

        {/* Docker Compose 图标 */}
        <g transform="translate(900, 100)">
          <rect
            width="120"
            height="120"
            fill={theme.colors.primary}
            stroke={theme.colors.text}
            strokeWidth="2"
            rx="8"
          />
          <text
            x="60"
            y="70"
            fill="#FFFFFF"
            fontSize="50"
            textAnchor="middle"
          >
            🐳
          </text>
          <text
            x="60"
            y="100"
            fill="#FFFFFF"
            fontSize="12"
            textAnchor="middle"
            fontFamily="'Fira Code', monospace"
          >
            Compose
          </text>
        </g>
      </svg>
    </div>
  );
};
