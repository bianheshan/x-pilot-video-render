import React from "react";
import { useCurrentFrame, interpolate, spring } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";

interface IndBuildingGrowthProps {
  floors?: number;
  showConstruction?: boolean;
  showWorkers?: boolean;
}

/**
 * IndBuildingGrowth - 建筑生长动画
 * 
 * 展示建筑物从地基到完工的全过程
 * 
 * 特性：
 * - 逐层建造动画
 * - 施工设备模拟
 * - 工人活动
 * - 材料运输
 * - 进度百分比
 */
export const IndBuildingGrowth: React.FC<IndBuildingGrowthProps> = ({
  floors = 20,
  showConstruction = true,
  showWorkers = true,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();
  const fps = 30;

  // 建筑参数
  const buildingWidth = 200;
  const floorHeight = 20;
  const buildingX = 540;
  const buildingY = 600;

  // 建造进度（0-1）
  const buildProgress = interpolate(frame, [0, fps * 10], [0, 1], {
    extrapolateRight: "clamp",
  });

  // 当前建造到的楼层
  const currentFloor = Math.floor(buildProgress * floors);
  const currentHeight = currentFloor * floorHeight;
  const floorProgress = (buildProgress * floors) % 1;

  // 塔吊位置
  const craneHeight = spring({
    frame: frame - currentFloor * 15,
    fps,
    config: {
      damping: 200,
    },
  });

  const craneY = buildingY - currentHeight - 100 - craneHeight * 50;

  // 工人位置
  const workers = React.useMemo(() => {
    const result: Array<{ x: number; y: number; action: string }> = [];
    if (!showWorkers) return result;

    for (let i = 0; i < 5; i++) {
      const workerFloor = Math.max(0, currentFloor - i);
      const x = buildingX - buildingWidth / 2 + (i * buildingWidth) / 5;
      const y = buildingY - workerFloor * floorHeight - 10;
      const actions = ["搬运", "焊接", "测量", "安装", "检查"];
      result.push({
        x,
        y,
        action: actions[i % actions.length],
      });
    }

    return result;
  }, [currentFloor, showWorkers]);

  // 材料堆
  const materials = [
    { name: "钢筋", x: buildingX - 300, y: buildingY, count: 50 },
    { name: "水泥", x: buildingX - 200, y: buildingY, count: 30 },
    { name: "砖块", x: buildingX - 100, y: buildingY, count: 100 },
  ];

  // 渲染地基
  const renderFoundation = () => {
    return (
      <g>
        {/* 地面 */}
        <line
          x1="200"
          y1={buildingY}
          x2="880"
          y2={buildingY}
          stroke={theme.colors.text}
          strokeWidth="3"
        />

        {/* 地基 */}
        <rect
          x={buildingX - buildingWidth / 2 - 20}
          y={buildingY}
          width={buildingWidth + 40}
          height="30"
          fill="#8B7355"
          stroke={theme.colors.text}
          strokeWidth="2"
        />

        {/* 地基纹理 */}
        {Array.from({ length: 10 }).map((_, i) => (
          <line
            key={`foundation-line-${i}`}
            x1={buildingX - buildingWidth / 2 - 20 + i * 26}
            y1={buildingY}
            x2={buildingX - buildingWidth / 2 - 20 + i * 26}
            y2={buildingY + 30}
            stroke={theme.colors.text}
            strokeWidth="1"
            opacity="0.3"
          />
        ))}
      </g>
    );
  };

  // 渲染建筑主体
  const renderBuilding = () => {
    return (
      <g>
        {/* 已完成的楼层 */}
        {Array.from({ length: currentFloor }).map((_, floor) => {
          const y = buildingY - (floor + 1) * floorHeight;
          const isComplete = floor < currentFloor - 1;

          return (
            <g key={`floor-${floor}`}>
              {/* 楼层主体 */}
              <rect
                x={buildingX - buildingWidth / 2}
                y={y}
                width={buildingWidth}
                height={floorHeight}
                fill={isComplete ? theme.colors.primary : theme.colors.surface}
                stroke={theme.colors.text}
                strokeWidth="2"
                opacity={isComplete ? 0.9 : 0.6}
              />

              {/* 楼层分隔线 */}
              <line
                x1={buildingX - buildingWidth / 2}
                y1={y}
                x2={buildingX + buildingWidth / 2}
                y2={y}
                stroke={theme.colors.text}
                strokeWidth="1"
              />

              {/* 窗户 */}
              {isComplete &&
                Array.from({ length: 8 }).map((_, window) => (
                  <rect
                    key={`window-${floor}-${window}`}
                    x={buildingX - buildingWidth / 2 + 15 + window * 23}
                    y={y + 5}
                    width="15"
                    height="10"
                    fill="#87CEEB"
                    opacity="0.7"
                  />
                ))}

              {/* 楼层编号 */}
              <text
                x={buildingX - buildingWidth / 2 - 30}
                y={y + floorHeight / 2 + 5}
                fill={theme.colors.text}
                fontSize="12"
                textAnchor="end"
              >
                {floor + 1}F
              </text>
            </g>
          );
        })}

        {/* 正在建造的楼层 */}
        {floorProgress > 0 && currentFloor < floors && (
          <rect
            x={buildingX - buildingWidth / 2}
            y={buildingY - currentHeight - floorHeight * floorProgress}
            width={buildingWidth * floorProgress}
            height={floorHeight * floorProgress}
            fill={theme.colors.accent}
            stroke={theme.colors.text}
            strokeWidth="2"
            opacity="0.5"
          />
        )}
      </g>
    );
  };

  // 渲染塔吊
  const renderCrane = () => {
    if (!showConstruction) return null;

    const craneArmLength = 250;
    const hookX = buildingX + Math.sin(frame * 0.05) * 100;

    return (
      <g>
        {/* 塔吊主体 */}
        <line
          x1={buildingX + buildingWidth / 2 + 50}
          y1={buildingY}
          x2={buildingX + buildingWidth / 2 + 50}
          y2={craneY}
          stroke={theme.colors.accent}
          strokeWidth="4"
        />

        {/* 塔吊臂 */}
        <line
          x1={buildingX + buildingWidth / 2 + 50 - craneArmLength}
          y1={craneY}
          x2={buildingX + buildingWidth / 2 + 50 + craneArmLength}
          y2={craneY}
          stroke={theme.colors.accent}
          strokeWidth="3"
        />

        {/* 吊钩 */}
        <line
          x1={hookX}
          y1={craneY}
          x2={hookX}
          y2={buildingY - currentHeight - 30}
          stroke={theme.colors.text}
          strokeWidth="2"
          strokeDasharray="5,5"
        />

        {/* 吊钩头 */}
        <circle
          cx={hookX}
          cy={buildingY - currentHeight - 30}
          r="5"
          fill={theme.colors.accent}
        />

        {/* 材料箱 */}
        <rect
          x={hookX - 15}
          y={buildingY - currentHeight - 50}
          width="30"
          height="20"
          fill="#8B7355"
          stroke={theme.colors.text}
          strokeWidth="1"
        />
      </g>
    );
  };

  // 渲染工人
  const renderWorkers = () => {
    if (!showWorkers) return null;

    return workers.map((worker, i) => (
      <g key={`worker-${i}`}>
        {/* 工人身体 */}
        <circle cx={worker.x} cy={worker.y} r="4" fill="#FFD700" />
        <line
          x1={worker.x}
          y1={worker.y}
          x2={worker.x}
          y2={worker.y + 10}
          stroke="#FFD700"
          strokeWidth="2"
        />
        <line
          x1={worker.x}
          y1={worker.y + 4}
          x2={worker.x - 5}
          y2={worker.y + 8}
          stroke="#FFD700"
          strokeWidth="2"
        />
        <line
          x1={worker.x}
          y1={worker.y + 4}
          x2={worker.x + 5}
          y2={worker.y + 8}
          stroke="#FFD700"
          strokeWidth="2"
        />

        {/* 工人标签 */}
        <text
          x={worker.x}
          y={worker.y - 10}
          fill={theme.colors.text}
          fontSize="10"
          textAnchor="middle"
        >
          {worker.action}
        </text>
      </g>
    ));
  };

  // 渲染材料堆
  const renderMaterials = () => {
    return materials.map((material, i) => (
      <g key={`material-${i}`}>
        {/* 材料堆 */}
        <rect
          x={material.x - 30}
          y={material.y - 40}
          width="60"
          height="40"
          fill={theme.colors.surface}
          stroke={theme.colors.text}
          strokeWidth="2"
        />

        {/* 材料标签 */}
        <text
          x={material.x}
          y={material.y - 50}
          fill={theme.colors.text}
          fontSize="12"
          textAnchor="middle"
        >
          {material.name}
        </text>
        <text
          x={material.x}
          y={material.y - 20}
          fill={theme.colors.text}
          fontSize="14"
          textAnchor="middle"
          fontWeight="bold"
        >
          {material.count}
        </text>
      </g>
    ));
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
        <rect width="1080" height="720" fill="#E8F4F8" />

        {/* 天空 */}
        <rect width="1080" height="600" fill="#87CEEB" opacity="0.3" />

        {/* 标题 */}
        <text
          x="540"
          y="40"
          fill={theme.colors.text}
          fontSize="32"
          fontWeight="bold"
          textAnchor="middle"
        >
          建筑生长动画
        </text>

        {/* 进度信息 */}
        <g transform="translate(50, 80)">
          <rect
            width="250"
            height="140"
            fill={theme.colors.surface}
            opacity="0.9"
            rx="8"
          />
          <text x="15" y="30" fill={theme.colors.text} fontSize="16" fontWeight="bold">
            施工进度
          </text>
          <text x="15" y="55" fill={theme.colors.text} fontSize="14">
            总楼层: {floors}
          </text>
          <text x="15" y="75" fill={theme.colors.text} fontSize="14">
            已完成: {currentFloor} 层
          </text>
          <text x="15" y="95" fill={theme.colors.text} fontSize="14">
            完成度: {(buildProgress * 100).toFixed(1)}%
          </text>
          <text x="15" y="115" fill={theme.colors.text} fontSize="14">
            工人数: {workers.length}
          </text>
        </g>

        {/* 进度条 */}
        <g transform="translate(50, 240)">
          <rect
            width="250"
            height="30"
            fill={theme.colors.surface}
            stroke={theme.colors.text}
            strokeWidth="2"
            rx="4"
          />
          <rect
            width={250 * buildProgress}
            height="30"
            fill={theme.colors.primary}
            rx="4"
          />
          <text
            x="125"
            y="20"
            fill={theme.colors.text}
            fontSize="14"
            textAnchor="middle"
            fontWeight="bold"
          >
            {(buildProgress * 100).toFixed(0)}%
          </text>
        </g>

        {/* 材料堆 */}
        {renderMaterials()}

        {/* 地基 */}
        {renderFoundation()}

        {/* 建筑主体 */}
        {renderBuilding()}

        {/* 塔吊 */}
        {renderCrane()}

        {/* 工人 */}
        {renderWorkers()}

        {/* 建筑高度标注 */}
        <g>
          <line
            x1={buildingX + buildingWidth / 2 + 20}
            y1={buildingY}
            x2={buildingX + buildingWidth / 2 + 20}
            y2={buildingY - currentHeight}
            stroke={theme.colors.accent}
            strokeWidth="2"
            strokeDasharray="5,5"
          />
          <text
            x={buildingX + buildingWidth / 2 + 30}
            y={buildingY - currentHeight / 2}
            fill={theme.colors.text}
            fontSize="14"
          >
            {currentHeight}m
          </text>
        </g>
      </svg>
    </div>
  );
};
