import React, { useMemo } from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";

export interface Product {
  /** 产品ID */
  id: string;
  /** 产品类型 */
  type: "phone" | "laptop" | "tablet";
  /** 颜色 */
  color: string;
  /** 当前工位 */
  station: number;
}

export interface IndAssemblyLineProps {
  /** 标题 */
  title?: string;
  /** 流水线速度 */
  speed?: number;
  /** 工位数量 */
  stationCount?: number;
  /** 是否显示机械臂 */
  showRobots?: boolean;
}

/**
 * 流水线装配
 * 
 * 展示自动化生产线的装配过程
 * 
 * 工业原理：
 * - 流水线生产：连续作业
 * - 节拍时间：工位间隔
 * - 自动化装配：机械臂操作
 * - 质量检测：在线监控
 * 
 * 教学要点：
 * - 工业4.0
 * - 智能制造
 * - 生产效率
 * - 自动化控制
 */
export const IndAssemblyLine: React.FC<IndAssemblyLineProps> = ({
  title = "智能流水线装配",
  speed = 1,
  stationCount = 5,
  showRobots = true,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();

  // 传送带位置
  const beltY = 400;
  const beltWidth = 1000;
  const beltX = 40;

  // 传送带移动
  const beltOffset = (frame * speed * 2) % 40;

  // 工位配置
  const stations = useMemo(() => {
    const stationWidth = beltWidth / stationCount;
    return Array.from({ length: stationCount }, (_, i) => ({
      id: `station-${i}`,
      x: beltX + stationWidth * i + stationWidth / 2,
      y: beltY - 150,
      name: ["组装", "焊接", "测试", "包装", "出库"][i] || `工位${i + 1}`,
      color: ["#4A90E2", "#E27B58", "#50C878", "#FFD700", "#9370DB"][i] || "#666",
    }));
  }, [stationCount]);

  // 产品配置
  const products = useMemo(() => {
    const items: Product[] = [];
    const productTypes: ("phone" | "laptop" | "tablet")[] = ["phone", "laptop", "tablet"];
    const colors = ["#4A90E2", "#E27B58", "#50C878"];

    for (let i = 0; i < 8; i++) {
      const progress = ((frame * speed + i * 60) % 360) / 360;
      const station = Math.floor(progress * stationCount);
      
      items.push({
        id: `product-${i}`,
        type: productTypes[i % 3],
        color: colors[i % 3],
        station,
      });
    }

    return items;
  }, [frame, speed, stationCount]);

  // 绘制产品
  const renderProduct = (product: Product, x: number, y: number) => {
    switch (product.type) {
      case "phone":
        return (
          <g key={product.id}>
            <rect
              x={x - 20}
              y={y - 40}
              width={40}
              height={70}
              rx={5}
              fill={product.color}
              stroke="#333"
              strokeWidth={2}
            />
            <rect
              x={x - 15}
              y={y - 35}
              width={30}
              height={50}
              fill="#000"
              opacity={0.3}
            />
            <circle cx={x} cy={y + 25} r={5} fill="#333" />
          </g>
        );
      case "laptop":
        return (
          <g key={product.id}>
            {/* 屏幕 */}
            <rect
              x={x - 35}
              y={y - 50}
              width={70}
              height={45}
              rx={3}
              fill={product.color}
              stroke="#333"
              strokeWidth={2}
            />
            <rect
              x={x - 30}
              y={y - 45}
              width={60}
              height={35}
              fill="#000"
              opacity={0.3}
            />
            {/* 键盘 */}
            <rect
              x={x - 40}
              y={y - 5}
              width={80}
              height={10}
              rx={2}
              fill={product.color}
              stroke="#333"
              strokeWidth={2}
            />
          </g>
        );
      case "tablet":
        return (
          <g key={product.id}>
            <rect
              x={x - 30}
              y={y - 45}
              width={60}
              height={80}
              rx={5}
              fill={product.color}
              stroke="#333"
              strokeWidth={2}
            />
            <rect
              x={x - 25}
              y={y - 40}
              width={50}
              height={65}
              fill="#000"
              opacity={0.3}
            />
            <circle cx={x} cy={y + 30} r={5} fill="#333" />
          </g>
        );
    }
  };

  // 绘制机械臂
  const renderRobot = (station: typeof stations[0], isActive: boolean) => {
    const armAngle = isActive ? Math.sin(frame * 0.1) * 30 : 0;
    
    return (
      <g key={`robot-${station.id}`}>
        {/* 机械臂基座 */}
        <rect
          x={station.x - 15}
          y={station.y}
          width={30}
          height={60}
          fill="#666"
          stroke="#333"
          strokeWidth={2}
        />
        {/* 机械臂 */}
        <g transform={`rotate(${armAngle} ${station.x} ${station.y + 60})`}>
          <rect
            x={station.x - 8}
            y={station.y + 60}
            width={16}
            height={80}
            fill={station.color}
            stroke="#333"
            strokeWidth={2}
          />
          {/* 夹爪 */}
          <line
            x1={station.x - 10}
            y1={station.y + 140}
            x2={station.x - 10}
            y2={station.y + 160}
            stroke="#333"
            strokeWidth={4}
            strokeLinecap="round"
          />
          <line
            x1={station.x + 10}
            y1={station.y + 140}
            x2={station.x + 10}
            y2={station.y + 160}
            stroke="#333"
            strokeWidth={4}
            strokeLinecap="round"
          />
        </g>
        {/* 状态指示灯 */}
        <circle
          cx={station.x}
          cy={station.y + 20}
          r={6}
          fill={isActive ? "#00FF00" : "#666"}
          stroke="#333"
          strokeWidth={2}
          opacity={isActive ? interpolate(frame % 30, [0, 15, 30], [1, 0.3, 1]) : 1}
        />
      </g>
    );
  };

  // 进入动画
  const opacity = interpolate(frame, [0, 20], [0, 1], {
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
        backgroundColor: "#1A1A1A",
        opacity,
      }}
    >
      {/* 标题 */}
      <h2
        style={{
          fontSize: 42,
          fontWeight: "bold",
          color: "#FFFFFF",
          marginBottom: 30,
          fontFamily: theme.fonts.heading,
        }}
      >
        {title}
      </h2>

      {/* 主画布 */}
      <svg width={1080} height={720} style={{ overflow: "visible" }}>
        <defs>
          {/* 传送带纹理 */}
          <pattern
            id="beltPattern"
            x={beltOffset}
            y="0"
            width="40"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <rect width="40" height="20" fill="#333" />
            <line x1="0" y1="10" x2="40" y2="10" stroke="#555" strokeWidth="2" />
          </pattern>
        </defs>

        {/* 传送带 */}
        <g>
          {/* 传送带主体 */}
          <rect
            x={beltX}
            y={beltY}
            width={beltWidth}
            height={80}
            fill="url(#beltPattern)"
            stroke="#666"
            strokeWidth={3}
          />
          {/* 传送带边缘 */}
          <rect
            x={beltX}
            y={beltY}
            width={beltWidth}
            height={10}
            fill="#444"
          />
          <rect
            x={beltX}
            y={beltY + 70}
            width={beltWidth}
            height={10}
            fill="#444"
          />
          {/* 滚轮 */}
          {[beltX, beltX + beltWidth - 40].map((x, i) => (
            <g key={`roller-${i}`}>
              <circle
                cx={x + 20}
                cy={beltY}
                r={20}
                fill="#666"
                stroke="#333"
                strokeWidth={2}
              />
              <circle
                cx={x + 20}
                cy={beltY + 80}
                r={20}
                fill="#666"
                stroke="#333"
                strokeWidth={2}
              />
            </g>
          ))}
        </g>

        {/* 工位 */}
        {stations.map((station, index) => {
          const hasProduct = products.some(p => p.station === index);
          
          return (
            <g key={station.id}>
              {/* 工位标识 */}
              <rect
                x={station.x - 50}
                y={station.y - 40}
                width={100}
                height={40}
                rx={5}
                fill="#333"
                stroke={station.color}
                strokeWidth={3}
              />
              <text
                x={station.x}
                y={station.y - 12}
                fill="#FFFFFF"
                fontSize={16}
                fontWeight="bold"
                textAnchor="middle"
                style={{ fontFamily: theme.fonts.body }}
              >
                {station.name}
              </text>
              
              {/* 机械臂 */}
              {showRobots && renderRobot(station, hasProduct)}
              
              {/* 工位分隔线 */}
              {index < stations.length - 1 && (
                <line
                  x1={station.x + beltWidth / stationCount / 2}
                  y1={beltY - 100}
                  x2={station.x + beltWidth / stationCount / 2}
                  y2={beltY + 100}
                  stroke="#444"
                  strokeWidth={2}
                  strokeDasharray="5,5"
                  opacity={0.5}
                />
              )}
            </g>
          );
        })}

        {/* 产品 */}
        {products.map(product => {
          const progress = ((frame * speed + parseInt(product.id.split("-")[1]) * 60) % 360) / 360;
          const x = beltX + progress * beltWidth;
          const y = beltY + 40;

          return renderProduct(product, x, y);
        })}

        {/* 生产统计 */}
        <g>
          <rect
            x={beltX + beltWidth + 20}
            y={beltY}
            width={180}
            height={120}
            rx={10}
            fill="#333"
            stroke="#4A90E2"
            strokeWidth={3}
          />
          <text
            x={beltX + beltWidth + 110}
            y={beltY + 30}
            fill="#FFFFFF"
            fontSize={18}
            fontWeight="bold"
            textAnchor="middle"
            style={{ fontFamily: theme.fonts.body }}
          >
            生产统计
          </text>
          <text
            x={beltX + beltWidth + 110}
            y={beltY + 60}
            fill="#00FF00"
            fontSize={16}
            textAnchor="middle"
            style={{ fontFamily: theme.fonts.body }}
          >
            产量: {Math.floor(frame * speed / 10)}
          </text>
          <text
            x={beltX + beltWidth + 110}
            y={beltY + 85}
            fill="#FFD700"
            fontSize={16}
            textAnchor="middle"
            style={{ fontFamily: theme.fonts.body }}
          >
            效率: {(speed * 100).toFixed(0)}%
          </text>
          <text
            x={beltX + beltWidth + 110}
            y={beltY + 110}
            fill="#00FFFF"
            fontSize={16}
            textAnchor="middle"
            style={{ fontFamily: theme.fonts.body }}
          >
            良品率: 99.8%
          </text>
        </g>
      </svg>

      {/* 说明文字 */}
      <div
        style={{
          marginTop: 20,
          fontSize: 16,
          color: "#FFFFFF",
          textAlign: "center",
        }}
      >
        🏭 智能制造流水线 | 自动化装配 | 工业4.0
      </div>
    </div>
  );
};
