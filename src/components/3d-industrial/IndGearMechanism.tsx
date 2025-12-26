import React, { useMemo } from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";

export interface Gear {
  /** 齿轮ID */
  id: string;
  /** 齿数 */
  teeth: number;
  /** 半径 */
  radius: number;
  /** 中心位置 X */
  x: number;
  /** 中心位置 Y */
  y: number;
  /** 颜色 */
  color: string;
  /** 是否为驱动齿轮 */
  isDriving?: boolean;
}

export interface IndGearMechanismProps {
  /** 标题 */
  title?: string;
  /** 齿轮配置 */
  gears?: Gear[];
  /** 驱动速度 (RPM) */
  drivingSpeed?: number;
  /** 是否显示齿数 */
  showTeethCount?: boolean;
  /** 是否显示转速 */
  showRPM?: boolean;
}

/**
 * 齿轮传动原理
 * 
 * 展示多级齿轮咬合转动，演示减速/加速比
 * 
 * 机械原理：
 * - 齿轮传动比：i = n₁/n₂ = z₂/z₁
 * - 角速度关系：ω₁z₁ = ω₂z₂
 * - 扭矩关系：T₁/T₂ = z₂/z₁
 * 
 * 教学要点：
 * - 齿轮传动的基本原理
 * - 传动比的计算
 * - 减速器和增速器的应用
 * - 机械效率
 */
export const IndGearMechanism: React.FC<IndGearMechanismProps> = ({
  title = "齿轮传动机构",
  gears = [
    { id: "gear1", teeth: 20, radius: 80, x: 200, y: 360, color: "#4A90E2", isDriving: true },
    { id: "gear2", teeth: 40, radius: 160, x: 400, y: 360, color: "#E27B58" },
    { id: "gear3", teeth: 30, radius: 120, x: 680, y: 360, color: "#50C878" },
    { id: "gear4", teeth: 15, radius: 60, x: 880, y: 360, color: "#FFD700" },
  ],
  drivingSpeed = 60, // RPM
  showTeethCount = true,
  showRPM = true,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();

  // 计算每个齿轮的转速和旋转角度
  const gearStates = useMemo(() => {
    const states = new Map<string, { rpm: number; angle: number; direction: number }>();
    
    // 找到驱动齿轮
    const drivingGear = gears.find(g => g.isDriving);
    if (!drivingGear) return states;

    // 设置驱动齿轮的状态
    const drivingRPM = drivingSpeed;
    const drivingAngle = (frame / 30) * (drivingRPM / 60) * 360; // 度
    states.set(drivingGear.id, { rpm: drivingRPM, angle: drivingAngle, direction: 1 });

    // 计算其他齿轮的状态（简化：假设相邻齿轮啮合）
    for (let i = 0; i < gears.length - 1; i++) {
      const gear1 = gears[i];
      const gear2 = gears[i + 1];
      
      const state1 = states.get(gear1.id);
      if (state1) {
        // 传动比：i = z₂/z₁
        const ratio = gear2.teeth / gear1.teeth;
        const rpm2 = state1.rpm / ratio;
        const direction2 = -state1.direction; // 相邻齿轮反向旋转
        const angle2 = (frame / 30) * (rpm2 / 60) * 360 * direction2;
        
        states.set(gear2.id, { rpm: Math.abs(rpm2), angle: angle2, direction: direction2 });
      }
    }

    return states;
  }, [frame, gears, drivingSpeed]);

  // 绘制单个齿轮
  const renderGear = (gear: Gear) => {
    const state = gearStates.get(gear.id);
    if (!state) return null;

    const { angle } = state;
    const toothHeight = 15;

    return (
      <g key={gear.id} transform={`rotate(${angle} ${gear.x} ${gear.y})`}>
        {/* 齿轮主体 */}
        <circle
          cx={gear.x}
          cy={gear.y}
          r={gear.radius}
          fill={gear.color}
          stroke="#333"
          strokeWidth={3}
          style={{
            filter: `drop-shadow(0 4px 8px ${gear.color}40)`,
          }}
        />

        {/* 齿轮齿 */}
        {Array.from({ length: gear.teeth }).map((_, i) => {
          const toothAngle = (i / gear.teeth) * 360;
          const toothX1 = gear.x + gear.radius * Math.cos((toothAngle * Math.PI) / 180);
          const toothY1 = gear.y + gear.radius * Math.sin((toothAngle * Math.PI) / 180);
          const toothX2 = gear.x + (gear.radius + toothHeight) * Math.cos((toothAngle * Math.PI) / 180);
          const toothY2 = gear.y + (gear.radius + toothHeight) * Math.sin((toothAngle * Math.PI) / 180);

          return (
            <line
              key={`tooth-${i}`}
              x1={toothX1}
              y1={toothY1}
              x2={toothX2}
              y2={toothY2}
              stroke="#333"
              strokeWidth={8}
              strokeLinecap="round"
            />
          );
        })}

        {/* 中心轴 */}
        <circle
          cx={gear.x}
          cy={gear.y}
          r={20}
          fill="#333"
          stroke="#666"
          strokeWidth={2}
        />

        {/* 中心孔 */}
        <circle
          cx={gear.x}
          cy={gear.y}
          r={10}
          fill="#000"
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
      <svg width={1100} height={600} style={{ overflow: "visible" }}>
        <defs>
          {/* 金属质感渐变 */}
          <linearGradient id="metalGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#CCCCCC" />
            <stop offset="50%" stopColor="#999999" />
            <stop offset="100%" stopColor="#666666" />
          </linearGradient>
        </defs>

        {/* 绘制连接线（传动链） */}
        {gears.map((gear, index) => {
          if (index < gears.length - 1) {
            const nextGear = gears[index + 1];
            return (
              <line
                key={`connection-${index}`}
                x1={gear.x}
                y1={gear.y}
                x2={nextGear.x}
                y2={nextGear.y}
                stroke="#666"
                strokeWidth={2}
                strokeDasharray="5,5"
                opacity={0.5}
              />
            );
          }
          return null;
        })}

        {/* 绘制所有齿轮 */}
        {gears.map(gear => renderGear(gear))}

        {/* 齿数标签 */}
        {showTeethCount && gears.map(gear => (
          <text
            key={`teeth-${gear.id}`}
            x={gear.x}
            y={gear.y - gear.radius - 30}
            fill="#FFFFFF"
            fontSize={16}
            fontWeight="bold"
            textAnchor="middle"
            style={{ fontFamily: theme.fonts.body }}
          >
            Z = {gear.teeth}
          </text>
        ))}

        {/* 转速标签 */}
        {showRPM && gears.map(gear => {
          const state = gearStates.get(gear.id);
          return state ? (
            <text
              key={`rpm-${gear.id}`}
              x={gear.x}
              y={gear.y + gear.radius + 40}
              fill="#FFD700"
              fontSize={14}
              fontWeight="bold"
              textAnchor="middle"
              style={{ fontFamily: theme.fonts.body }}
            >
              {state.rpm.toFixed(1)} RPM
            </text>
          ) : null;
        })}
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
        ⚙️ 传动比公式：i = n₁/n₂ = z₂/z₁ | 相邻齿轮反向旋转
      </div>
    </div>
  );
};
