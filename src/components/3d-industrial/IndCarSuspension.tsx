import React from "react";
import { useCurrentFrame, spring } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";

interface IndCarSuspensionProps {
  suspensionType?: "soft" | "medium" | "hard";
  roadProfile?: "flat" | "bumpy" | "wavy";
  showForces?: boolean;
}

/**
 * IndCarSuspension - 汽车悬挂系统仿真
 * 
 * 展示汽车悬挂系统的工作原理和动态响应
 * 
 * 特性：
 * - 弹簧阻尼系统
 * - 路面适应
 * - 车身姿态控制
 * - 力学分析
 * - 多种悬挂类型
 */
export const IndCarSuspension: React.FC<IndCarSuspensionProps> = ({
  suspensionType = "medium",
  roadProfile = "bumpy",
  showForces = true,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();
  const fps = 30;

  // 车身参数
  const carX = 540;
  const carY = 300;
  const carWidth = 300;
  const carHeight = 80;

  // 悬挂参数
  const suspensionParams = {
    soft: { stiffness: 50, damping: 10 },
    medium: { stiffness: 100, damping: 20 },
    hard: { stiffness: 200, damping: 40 },
  };

  const { stiffness, damping } = suspensionParams[suspensionType];

  // 路面高度函数
  const getRoadHeight = (x: number): number => {
    const baseY = 500;
    
    switch (roadProfile) {
      case "flat":
        return baseY;
      case "bumpy":
        return baseY + Math.sin(x * 0.05) * 30 + Math.sin(x * 0.1) * 15;
      case "wavy":
        return baseY + Math.sin(x * 0.02) * 40;
      default:
        return baseY;
    }
  };

  // 车轮位置
  const wheelPositions = [
    carX - carWidth / 2 + 50,
    carX + carWidth / 2 - 50,
  ];

  // 计算悬挂压缩量
  const getSuspensionCompression = (wheelX: number): number => {
    const roadY = getRoadHeight(wheelX + (frame * 3) % 1080);
    const restY = carY + carHeight / 2 + 100;
    const compression = Math.max(0, roadY - restY);
    
    const springResponse = spring({
      frame,
      fps,
      config: {
        stiffness,
        damping,
        mass: 1,
      },
    });

    return compression * springResponse;
  };

  const frontCompression = getSuspensionCompression(wheelPositions[0]);
  const rearCompression = getSuspensionCompression(wheelPositions[1]);

  // 车身倾斜角度
  const tiltAngle = ((frontCompression - rearCompression) / carWidth) * (180 / Math.PI);

  // 车身垂直位移
  const bodyDisplacement = (frontCompression + rearCompression) / 2;

  // 渲染路面
  const renderRoad = () => {
    const points: string[] = [];
    const step = 10;

    for (let x = 0; x <= 1080; x += step) {
      const y = getRoadHeight(x + (frame * 3) % 1080);
      points.push(`${x},${y}`);
    }

    return (
      <g>
        <path
          d={`M 0,720 L ${points.join(" L ")} L 1080,720 Z`}
          fill="#555555"
          stroke={theme.colors.text}
          strokeWidth="2"
        />
        
        {/* 路面纹理 */}
        {Array.from({ length: 108 }).map((_, i) => (
          <line
            key={`road-line-${i}`}
            x1={i * 10}
            y1={getRoadHeight(i * 10 + (frame * 3) % 1080)}
            x2={i * 10 + 5}
            y2={getRoadHeight(i * 10 + (frame * 3) % 1080)}
            stroke="#FFFFFF"
            strokeWidth="2"
            opacity="0.3"
          />
        ))}
      </g>
    );
  };

  // 渲染车身
  const renderCarBody = () => {
    const currentY = carY - bodyDisplacement;

    return (
      <g transform={`translate(${carX}, ${currentY}) rotate(${tiltAngle})`}>
        {/* 车身主体 */}
        <rect
          x={-carWidth / 2}
          y={-carHeight / 2}
          width={carWidth}
          height={carHeight}
          fill={theme.colors.primary}
          stroke={theme.colors.text}
          strokeWidth="3"
          rx="10"
        />

        {/* 车窗 */}
        <rect
          x={-carWidth / 2 + 20}
          y={-carHeight / 2 + 10}
          width="80"
          height="30"
          fill="#87CEEB"
          opacity="0.7"
          rx="5"
        />
        <rect
          x={carWidth / 2 - 100}
          y={-carHeight / 2 + 10}
          width="80"
          height="30"
          fill="#87CEEB"
          opacity="0.7"
          rx="5"
        />

        {/* 车灯 */}
        <circle cx={-carWidth / 2 + 10} cy="0" r="5" fill="#FFD700" />
        <circle cx={carWidth / 2 - 10} cy="0" r="5" fill="#FF0000" />

        {/* 重心标记 */}
        <circle cx="0" cy="0" r="5" fill={theme.colors.accent} />
        <text
          x="0"
          y="-15"
          fill={theme.colors.text}
          fontSize="12"
          textAnchor="middle"
        >
          重心
        </text>
      </g>
    );
  };

  // 渲染悬挂系统
  const renderSuspension = (wheelX: number, index: number) => {
    const compression = getSuspensionCompression(wheelX);
    const roadY = getRoadHeight(wheelX + (frame * 3) % 1080);
    const wheelY = roadY - 30;
    const bodyY = carY - bodyDisplacement;

    const springRestLength = 100;
    const springCurrentLength = springRestLength - compression;
    const springCoils = 8;

    return (
      <g key={`suspension-${index}`}>
        {/* 车轮 */}
        <circle
          cx={wheelX}
          cy={wheelY}
          r="30"
          fill="#333333"
          stroke={theme.colors.text}
          strokeWidth="3"
        />
        
        {/* 轮毂 */}
        <circle cx={wheelX} cy={wheelY} r="15" fill="#888888" />
        
        {/* 轮辐 */}
        {Array.from({ length: 6 }).map((_, i) => {
          const angle = (i * 60 + frame * 5) * (Math.PI / 180);
          return (
            <line
              key={`spoke-${i}`}
              x1={wheelX}
              y1={wheelY}
              x2={wheelX + Math.cos(angle) * 20}
              y2={wheelY + Math.sin(angle) * 20}
              stroke={theme.colors.text}
              strokeWidth="2"
            />
          );
        })}

        {/* 弹簧 */}
        <g>
          {Array.from({ length: springCoils }).map((_, i) => {
            const y1 = wheelY - 30 - (i * springCurrentLength) / springCoils;
            const y2 = wheelY - 30 - ((i + 1) * springCurrentLength) / springCoils;
            const offset = i % 2 === 0 ? 10 : -10;

            return (
              <line
                key={`spring-${i}`}
                x1={wheelX + offset}
                y1={y1}
                x2={wheelX - offset}
                y2={y2}
                stroke={theme.colors.accent}
                strokeWidth="3"
              />
            );
          })}
        </g>

        {/* 阻尼器 */}
        <rect
          x={wheelX - 5}
          y={wheelY - 30 - springCurrentLength}
          width="10"
          height={springCurrentLength}
          fill={theme.colors.secondary}
          opacity="0.6"
        />

        {/* 连接到车身 */}
        <line
          x1={wheelX}
          y1={wheelY - 30 - springCurrentLength}
          x2={wheelX}
          y2={bodyY + carHeight / 2}
          stroke={theme.colors.text}
          strokeWidth="2"
          strokeDasharray="5,5"
        />

        {/* 力的显示 */}
        {showForces && (
          <g>
            {/* 弹簧力 */}
            <line
              x1={wheelX}
              y1={wheelY - 30}
              x2={wheelX}
              y2={wheelY - 30 - compression}
              stroke="#FF0000"
              strokeWidth="3"
              markerEnd="url(#arrowhead)"
            />
            <text
              x={wheelX + 15}
              y={wheelY - 30 - compression / 2}
              fill="#FF0000"
              fontSize="12"
            >
              {compression.toFixed(0)}N
            </text>
          </g>
        )}
      </g>
    );
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: theme.colors.background,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <svg width="1080" height="720" style={{ overflow: "visible" }}>
        {/* 箭头标记定义 */}
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="10"
            refX="5"
            refY="5"
            orient="auto"
          >
            <polygon points="0 0, 10 5, 0 10" fill="#FF0000" />
          </marker>
        </defs>

        {/* 背景 */}
        <rect width="1080" height="720" fill="#E8F4F8" />

        {/* 标题 */}
        <text
          x="540"
          y="40"
          fill={theme.colors.text}
          fontSize="32"
          fontWeight="bold"
          textAnchor="middle"
        >
          汽车悬挂系统仿真
        </text>

        {/* 信息面板 */}
        <g transform="translate(50, 80)">
          <rect
            width="250"
            height="160"
            fill={theme.colors.surface}
            opacity="0.9"
            rx="8"
          />
          <text x="15" y="30" fill={theme.colors.text} fontSize="16" fontWeight="bold">
            悬挂参数
          </text>
          <text x="15" y="55" fill={theme.colors.text} fontSize="14">
            类型: {suspensionType === "soft" ? "软" : suspensionType === "medium" ? "中" : "硬"}
          </text>
          <text x="15" y="75" fill={theme.colors.text} fontSize="14">
            刚度: {stiffness} N/m
          </text>
          <text x="15" y="95" fill={theme.colors.text} fontSize="14">
            阻尼: {damping} Ns/m
          </text>
          <text x="15" y="115" fill={theme.colors.text} fontSize="14">
            路面: {roadProfile === "flat" ? "平坦" : roadProfile === "bumpy" ? "颠簸" : "波浪"}
          </text>
          <text x="15" y="135" fill={theme.colors.text} fontSize="14">
            倾角: {tiltAngle.toFixed(2)}°
          </text>
        </g>

        {/* 路面 */}
        {renderRoad()}

        {/* 悬挂系统 */}
        {wheelPositions.map((wheelX, index) => renderSuspension(wheelX, index))}

        {/* 车身 */}
        {renderCarBody()}

        {/* 速度指示 */}
        <g transform="translate(850, 100)">
          <rect width="180" height="80" fill={theme.colors.surface} opacity="0.9" rx="8" />
          <text x="15" y="25" fill={theme.colors.text} fontSize="14" fontWeight="bold">
            行驶状态
          </text>
          <text x="15" y="50" fill={theme.colors.text} fontSize="14">
            速度: 60 km/h
          </text>
          <text x="15" y="70" fill={theme.colors.text} fontSize="14">
            位移: {bodyDisplacement.toFixed(1)} mm
          </text>
        </g>
      </svg>
    </div>
  );
};
