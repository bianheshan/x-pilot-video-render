import React from "react";
import { useCurrentFrame, interpolate, random } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";

export interface TechCpuCoreProps {
  coreCount?: number;
  showCache?: boolean;
  animateSignals?: boolean;
}

export const TechCpuCore: React.FC<TechCpuCoreProps> = ({
  coreCount = 4,
  showCache = true,
  animateSignals = true,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();

  // 信号动画
  const signalProgress = (frame * 2) % 100;

  // 渲染单个核心
  const renderCore = (index: number) => {
    const x = 200 + (index % 2) * 300;
    const y = 200 + Math.floor(index / 2) * 250;

    const load = 50 + random(`core-${index}`) * 50;
    const pulseOpacity = interpolate(
      (frame + index * 15) % 60,
      [0, 30, 60],
      [0.5, 1, 0.5]
    );

    return (
      <g key={index} transform={`translate(${x}, ${y})`}>
        {/* 核心外框 */}
        <rect
          width="250"
          height="200"
          fill={theme.colors.background}
          stroke={theme.colors.primary}
          strokeWidth="3"
          rx="10"
          opacity="0.9"
        />

        {/* 核心标题 */}
        <text
          x="125"
          y="30"
          fill={theme.colors.text}
          fontSize="16"
          fontWeight="bold"
          textAnchor="middle"
          fontFamily="'Fira Code', monospace"
        >
          Core {index}
        </text>

        {/* ALU (算术逻辑单元) */}
        <g transform="translate(30, 50)">
          <rect
            width="80"
            height="60"
            fill={theme.colors.primary}
            stroke={theme.colors.text}
            strokeWidth="2"
            rx="5"
            opacity={pulseOpacity}
          />
          <text
            x="40"
            y="35"
            fill="#FFFFFF"
            fontSize="12"
            fontWeight="bold"
            textAnchor="middle"
            fontFamily="'Fira Code', monospace"
          >
            ALU
          </text>
        </g>

        {/* 寄存器 */}
        <g transform="translate(140, 50)">
          <rect
            width="80"
            height="60"
            fill={theme.colors.accent}
            stroke={theme.colors.text}
            strokeWidth="2"
            rx="5"
          />
          <text
            x="40"
            y="25"
            fill="#FFFFFF"
            fontSize="11"
            fontWeight="bold"
            textAnchor="middle"
            fontFamily="'Fira Code', monospace"
          >
            Registers
          </text>
          {[0, 1, 2].map((i) => (
            <rect
              key={i}
              x="10"
              y={35 + i * 8}
              width="60"
              height="5"
              fill="#FFFFFF"
              opacity="0.7"
            />
          ))}
        </g>

        {/* 控制单元 */}
        <g transform="translate(85, 130)">
          <rect
            width="80"
            height="50"
            fill="#569CD6"
            stroke={theme.colors.text}
            strokeWidth="2"
            rx="5"
          />
          <text
            x="40"
            y="30"
            fill="#FFFFFF"
            fontSize="12"
            fontWeight="bold"
            textAnchor="middle"
            fontFamily="'Fira Code', monospace"
          >
            Control
          </text>
        </g>

        {/* 负载指示 */}
        <g transform="translate(10, 170)">
          <text
            x="0"
            y="15"
            fill={theme.colors.text}
            fontSize="10"
            fontFamily="'Fira Code', monospace"
          >
            Load: {Math.floor(load)}%
          </text>
          <rect
            x="60"
            y="5"
            width="170"
            height="10"
            fill="none"
            stroke={theme.colors.text}
            strokeWidth="1"
            rx="5"
          />
          <rect
            x="60"
            y="5"
            width={(load / 100) * 170}
            height="10"
            fill={load > 80 ? "#F48771" : theme.colors.primary}
            rx="5"
          />
        </g>

        {/* 数据流动画 */}
        {animateSignals && (
          <>
            <circle
              cx={30 + (signalProgress / 100) * 110}
              cy="80"
              r="3"
              fill={theme.colors.accent}
            />
            <circle
              cx={140 + (signalProgress / 100) * 80}
              cy="80"
              r="3"
              fill={theme.colors.primary}
            />
          </>
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
          🔲 CPU Architecture
        </text>

        {/* 渲染所有核心 */}
        {Array.from({ length: coreCount }).map((_, index) => renderCore(index))}

        {/* L3 缓存 (共享) */}
        {showCache && (
          <g transform="translate(800, 200)">
            <rect
              width="200"
              height="400"
              fill="#DCDCAA"
              stroke={theme.colors.text}
              strokeWidth="3"
              rx="10"
              opacity="0.8"
            />
            <text
              x="100"
              y="30"
              fill={theme.colors.background}
              fontSize="18"
              fontWeight="bold"
              textAnchor="middle"
              fontFamily="'Fira Code', monospace"
            >
              L3 Cache
            </text>
            <text
              x="100"
              y="55"
              fill={theme.colors.background}
              fontSize="14"
              textAnchor="middle"
              fontFamily="'Fira Code', monospace"
            >
              (Shared)
            </text>

            {/* 缓存块 */}
            {Array.from({ length: 12 }).map((_, i) => (
              <rect
                key={i}
                x="20"
                y={80 + i * 25}
                width="160"
                height="20"
                fill={
                  random(`cache-${i}`) > 0.5
                    ? theme.colors.primary
                    : theme.colors.background
                }
                stroke={theme.colors.text}
                strokeWidth="1"
                rx="3"
                opacity={random(`cache-${i}`) > 0.5 ? 0.8 : 0.3}
              />
            ))}
          </g>
        )}

        {/* 总线 */}
        <line
          x1="100"
          y1="650"
          x2="980"
          y2="650"
          stroke={theme.colors.primary}
          strokeWidth="5"
        />
        <text
          x="540"
          y="680"
          fill={theme.colors.text}
          fontSize="16"
          fontWeight="bold"
          textAnchor="middle"
          fontFamily="'Fira Code', monospace"
        >
          System Bus
        </text>

        {/* 数据流动画 */}
        {animateSignals && (
          <>
            <circle
              cx={100 + (signalProgress / 100) * 880}
              cy="650"
              r={8 + 4 * (0.5 + 0.5 * Math.sin(frame * 0.2))}
              fill={theme.colors.accent}
            />
          </>
        )}
      </svg>
    </div>
  );
};
