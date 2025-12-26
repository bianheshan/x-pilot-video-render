import React from "react";
import { useCurrentFrame, interpolate, random } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";

interface IndSmartCityProps {
  buildingCount?: number;
  showTraffic?: boolean;
  showDataFlow?: boolean;
}

interface Building {
  x: number;
  y: number;
  width: number;
  height: number;
  floors: number;
  type: "residential" | "commercial" | "industrial";
}

/**
 * IndSmartCity - 智慧城市可视化
 * 
 * 展示智慧城市的数据流动、交通管理和建筑物联网
 * 
 * 特性：
 * - 3D 建筑群
 * - 实时交通流
 * - 数据网络可视化
 * - IoT 传感器网络
 * - 能源消耗监控
 */
export const IndSmartCity: React.FC<IndSmartCityProps> = ({
  buildingCount = 30,
  showTraffic = true,
  showDataFlow = true,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();

  // 生成建筑物
  const buildings = React.useMemo(() => {
    const result: Building[] = [];
    const gridSize = 6;
    const cellSize = 150;

    for (let i = 0; i < buildingCount; i++) {
      const row = Math.floor(i / gridSize);
      const col = i % gridSize;
      const types: Array<"residential" | "commercial" | "industrial"> = [
        "residential",
        "commercial",
        "industrial",
      ];

      result.push({
        x: col * cellSize + random(`building-x-${i}`) * 50,
        y: row * cellSize + random(`building-y-${i}`) * 50,
        width: 40 + random(`building-w-${i}`) * 30,
        height: 80 + random(`building-h-${i}`) * 150,
        floors: Math.floor(5 + random(`building-f-${i}`) * 15),
        type: types[Math.floor(random(`building-t-${i}`) * 3)],
      });
    }

    return result;
  }, [buildingCount]);

  // 生成交通车辆
  const vehicles = React.useMemo(() => {
    const result: Array<{ x: number; y: number; direction: number }> = [];
    const vehicleCount = 20;

    for (let i = 0; i < vehicleCount; i++) {
      const progress = ((frame + i * 10) % 200) / 200;
      const lane = Math.floor(random(`vehicle-lane-${i}`) * 4);
      const isHorizontal = lane % 2 === 0;

      if (isHorizontal) {
        result.push({
          x: progress * 900,
          y: 150 + lane * 150,
          direction: 0,
        });
      } else {
        result.push({
          x: 150 + lane * 150,
          y: progress * 600,
          direction: 90,
        });
      }
    }

    return result;
  }, [frame]);

  // 生成数据流
  const dataFlows = React.useMemo(() => {
    const result: Array<{ x1: number; y1: number; x2: number; y2: number; progress: number }> = [];
    const flowCount = 15;

    for (let i = 0; i < flowCount; i++) {
      const b1 = buildings[Math.floor(random(`flow-b1-${i}`) * buildings.length)];
      const b2 = buildings[Math.floor(random(`flow-b2-${i}`) * buildings.length)];
      const progress = ((frame + i * 5) % 60) / 60;

      result.push({
        x1: b1.x + b1.width / 2,
        y1: b1.y,
        x2: b2.x + b2.width / 2,
        y2: b2.y,
        progress,
      });
    }

    return result;
  }, [frame, buildings]);

  // 获取建筑物颜色
  const getBuildingColor = (type: string) => {
    switch (type) {
      case "residential":
        return theme.colors.primary;
      case "commercial":
        return theme.colors.accent;
      case "industrial":
        return theme.colors.secondary;
      default:
        return theme.colors.text;
    }
  };

  // 渲染建筑物
  const renderBuilding = (building: Building, index: number) => {
    const growProgress = interpolate(
      frame,
      [index * 2, index * 2 + 30],
      [0, 1],
      { extrapolateRight: "clamp" }
    );

    const currentHeight = building.height * growProgress;
    const floorHeight = 15;

    return (
      <g key={`building-${index}`}>
        {/* 建筑主体 */}
        <rect
          x={building.x}
          y={building.y - currentHeight}
          width={building.width}
          height={currentHeight}
          fill={getBuildingColor(building.type)}
          opacity="0.8"
          stroke={theme.colors.text}
          strokeWidth="1"
        />

        {/* 楼层线 */}
        {Array.from({ length: Math.floor(currentHeight / floorHeight) }).map((_, i) => (
          <line
            key={`floor-${i}`}
            x1={building.x}
            y1={building.y - i * floorHeight}
            x2={building.x + building.width}
            y2={building.y - i * floorHeight}
            stroke={theme.colors.text}
            strokeWidth="0.5"
            opacity="0.3"
          />
        ))}

        {/* 窗户 */}
        {Array.from({ length: Math.floor(currentHeight / floorHeight) }).map((_, floor) =>
          Array.from({ length: Math.floor(building.width / 15) }).map((_, window) => {
            const isLit = random(`light-${index}-${floor}-${window}`) > 0.3;
            return (
              <rect
                key={`window-${floor}-${window}`}
                x={building.x + 5 + window * 15}
                y={building.y - floor * floorHeight - 10}
                width="8"
                height="8"
                fill={isLit ? "#FFD700" : theme.colors.surface}
                opacity={isLit ? 0.8 : 0.3}
              />
            );
          })
        )}

        {/* IoT 传感器 */}
        {growProgress === 1 && (
          <circle
            cx={building.x + building.width / 2}
            cy={building.y - currentHeight - 5}
            r="4"
            fill={theme.colors.accent}
            opacity={0.6 + Math.sin(frame * 0.1 + index) * 0.4}
          >
            <animate
              attributeName="r"
              values="4;6;4"
              dur="2s"
              repeatCount="indefinite"
            />
          </circle>
        )}

        {/* 建筑标签 */}
        {growProgress === 1 && (
          <text
            x={building.x + building.width / 2}
            y={building.y + 15}
            fill={theme.colors.text}
            fontSize="10"
            textAnchor="middle"
            opacity="0.7"
          >
            {building.type === "residential" ? "住宅" : building.type === "commercial" ? "商业" : "工业"}
          </text>
        )}
      </g>
    );
  };

  // 渲染交通车辆
  const renderVehicle = (vehicle: { x: number; y: number; direction: number }, index: number) => {
    return (
      <g
        key={`vehicle-${index}`}
        transform={`translate(${vehicle.x}, ${vehicle.y}) rotate(${vehicle.direction})`}
      >
        <rect
          x="-8"
          y="-4"
          width="16"
          height="8"
          fill={theme.colors.accent}
          rx="2"
        />
        <circle cx="-4" cy="0" r="1.5" fill="#FFD700" />
        <circle cx="4" cy="0" r="1.5" fill="#FF0000" />
      </g>
    );
  };

  // 渲染数据流
  const renderDataFlow = (flow: { x1: number; y1: number; x2: number; y2: number; progress: number }, index: number) => {
    const currentX = flow.x1 + (flow.x2 - flow.x1) * flow.progress;
    const currentY = flow.y1 + (flow.y2 - flow.y1) * flow.progress;

    return (
      <g key={`dataflow-${index}`}>
        {/* 连接线 */}
        <line
          x1={flow.x1}
          y1={flow.y1}
          x2={flow.x2}
          y2={flow.y2}
          stroke={theme.colors.accent}
          strokeWidth="1"
          strokeDasharray="5,5"
          opacity="0.2"
        />
        
        {/* 数据包 */}
        <circle
          cx={currentX}
          cy={currentY}
          r="3"
          fill={theme.colors.accent}
          opacity="0.8"
        />
        
        {/* 数据包光晕 */}
        <circle
          cx={currentX}
          cy={currentY}
          r="6"
          fill="none"
          stroke={theme.colors.accent}
          strokeWidth="1"
          opacity={0.4 * (1 - flow.progress)}
        />
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
        {/* 背景 */}
        <rect width="1080" height="720" fill="#0a0a1a" />

        {/* 标题 */}
        <text
          x="540"
          y="40"
          fill={theme.colors.text}
          fontSize="32"
          fontWeight="bold"
          textAnchor="middle"
        >
          智慧城市可视化
        </text>

        {/* 信息面板 */}
        <g transform="translate(50, 80)">
          <rect
            width="200"
            height="140"
            fill={theme.colors.surface}
            opacity="0.9"
            rx="8"
          />
          <text x="15" y="30" fill={theme.colors.text} fontSize="16" fontWeight="bold">
            城市状态
          </text>
          <text x="15" y="55" fill={theme.colors.text} fontSize="14">
            建筑数: {buildingCount}
          </text>
          <text x="15" y="75" fill={theme.colors.text} fontSize="14">
            车辆数: {vehicles.length}
          </text>
          <text x="15" y="95" fill={theme.colors.text} fontSize="14">
            数据流: {dataFlows.length}
          </text>
          <text x="15" y="115" fill={theme.colors.text} fontSize="14">
            IoT 节点: {buildings.length}
          </text>
        </g>

        {/* 图例 */}
        <g transform="translate(830, 80)">
          <rect width="200" height="100" fill={theme.colors.surface} opacity="0.9" rx="8" />
          <text x="15" y="25" fill={theme.colors.text} fontSize="14" fontWeight="bold">
            建筑类型
          </text>
          <rect x="15" y="35" width="20" height="15" fill={theme.colors.primary} />
          <text x="40" y="47" fill={theme.colors.text} fontSize="12">住宅</text>
          <rect x="15" y="55" width="20" height="15" fill={theme.colors.accent} />
          <text x="40" y="67" fill={theme.colors.text} fontSize="12">商业</text>
          <rect x="15" y="75" width="20" height="15" fill={theme.colors.secondary} />
          <text x="40" y="87" fill={theme.colors.text} fontSize="12">工业</text>
        </g>

        {/* 主视图 */}
        <g transform="translate(90, 250)">
          {/* 道路网格 */}
          {Array.from({ length: 7 }).map((_, i) => (
            <React.Fragment key={`road-h-${i}`}>
              <line
                x1="0"
                y1={i * 150}
                x2="900"
                y2={i * 150}
                stroke={theme.colors.text}
                strokeWidth="2"
                opacity="0.3"
              />
              <line
                x1={i * 150}
                y1="0"
                x2={i * 150}
                y2="600"
                stroke={theme.colors.text}
                strokeWidth="2"
                opacity="0.3"
              />
            </React.Fragment>
          ))}

          {/* 数据流 */}
          {showDataFlow && dataFlows.map(renderDataFlow)}

          {/* 建筑物 */}
          {buildings.map(renderBuilding)}

          {/* 交通车辆 */}
          {showTraffic && vehicles.map(renderVehicle)}
        </g>

        {/* 统计图表 */}
        <g transform="translate(50, 600)">
          <text x="0" y="0" fill={theme.colors.text} fontSize="12">
            能源消耗
          </text>
          {Array.from({ length: 20 }).map((_, i) => {
            const height = 30 + Math.sin((frame + i * 10) * 0.05) * 20;
            return (
              <rect
                key={`bar-${i}`}
                x={i * 15}
                y={50 - height}
                width="12"
                height={height}
                fill={theme.colors.primary}
                opacity="0.7"
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
};
