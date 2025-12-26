import React, { useMemo } from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";

export interface RobotJoint {
  /** 关节ID */
  id: string;
  /** 关节角度（度） */
  angle: number;
  /** 臂长 */
  length: number;
  /** 颜色 */
  color: string;
}

export interface IndRobotArmProps {
  /** 标题 */
  title?: string;
  /** 目标位置 X */
  targetX?: number;
  /** 目标位置 Y */
  targetY?: number;
  /** 是否显示轨迹 */
  showTrajectory?: boolean;
  /** 是否显示IK计算 */
  showIK?: boolean;
}

/**
 * 机械臂逆运动学（IK）
 * 
 * 展示多关节机械臂通过逆运动学算法到达目标点
 * 
 * 机器人学原理：
 * - 正运动学（FK）：关节角度 → 末端位置
 * - 逆运动学（IK）：末端位置 → 关节角度
 * - 雅可比矩阵：速度映射
 * - 奇异点：不可达配置
 * 
 * 教学要点：
 * - IK 求解算法
 * - 多解问题
 * - 工作空间
 * - 机械臂控制
 */
export const IndRobotArm: React.FC<IndRobotArmProps> = ({
  title = "机械臂逆运动学",
  targetX = 300,
  targetY = -200,
  showTrajectory = true,
  showIK = true,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();

  // 机械臂基座位置
  const baseX = 540;
  const baseY = 600;

  // 臂长配置
  const armLengths = [150, 120, 100, 80];

  // 目标位置动画
  const animatedTargetX = interpolate(
    frame,
    [0, 60, 120, 180, 240],
    [200, 300, 250, 150, 200],
    { extrapolateRight: "wrap" }
  );
  
  const animatedTargetY = interpolate(
    frame,
    [0, 60, 120, 180, 240],
    [-150, -200, -250, -200, -150],
    { extrapolateRight: "wrap" }
  );

  // 使用动画目标或固定目标
  const finalTargetX = targetX === 300 ? animatedTargetX : targetX;
  const finalTargetY = targetY === -200 ? animatedTargetY : targetY;

  // 逆运动学求解（简化版 - 2D 平面）
  const solveIK = useMemo(() => {
    const target = { x: finalTargetX, y: finalTargetY };
    const joints: RobotJoint[] = [];

    // 使用 CCD (Cyclic Coordinate Descent) 算法
    const angles: number[] = [0, 0, 0, 0];

    // 迭代求解
    for (let iteration = 0; iteration < 10; iteration++) {
      for (let i = armLengths.length - 1; i >= 0; i--) {
        // 计算当前末端位置
        let endX = 0;
        let endY = 0;
        let cumulativeAngle = 0;

        for (let j = 0; j <= i; j++) {
          cumulativeAngle += angles[j];
          endX += armLengths[j] * Math.cos((cumulativeAngle * Math.PI) / 180);
          endY += armLengths[j] * Math.sin((cumulativeAngle * Math.PI) / 180);
        }

        // 计算关节位置
        let jointX = 0;
        let jointY = 0;
        let jointAngle = 0;

        for (let j = 0; j < i; j++) {
          jointAngle += angles[j];
          jointX += armLengths[j] * Math.cos((jointAngle * Math.PI) / 180);
          jointY += armLengths[j] * Math.sin((jointAngle * Math.PI) / 180);
        }

        // 计算到目标的向量
        const toTargetX = target.x - jointX;
        const toTargetY = target.y - jointY;
        const toEndX = endX - jointX;
        const toEndY = endY - jointY;

        // 计算需要旋转的角度
        const targetAngle = Math.atan2(toTargetY, toTargetX) * (180 / Math.PI);
        const currentAngle = Math.atan2(toEndY, toEndX) * (180 / Math.PI);
        let deltaAngle = targetAngle - currentAngle;

        // 归一化角度到 [-180, 180]
        while (deltaAngle > 180) deltaAngle -= 360;
        while (deltaAngle < -180) deltaAngle += 360;

        // 限制旋转速度
        deltaAngle = Math.max(-15, Math.min(15, deltaAngle));

        angles[i] += deltaAngle;
      }
    }

    // 构建关节数据
    let cumulativeAngle = 0;
    const colors = ["#4A90E2", "#E27B58", "#50C878", "#FFD700"];

    for (let i = 0; i < armLengths.length; i++) {
      cumulativeAngle += angles[i];
      joints.push({
        id: `joint-${i}`,
        angle: cumulativeAngle,
        length: armLengths[i],
        color: colors[i],
      });
    }

    return joints;
  }, [finalTargetX, finalTargetY]);

  // 计算末端位置
  const endEffector = useMemo(() => {
    let x = 0;
    let y = 0;

    for (const joint of solveIK) {
      x += joint.length * Math.cos((joint.angle * Math.PI) / 180);
      y += joint.length * Math.sin((joint.angle * Math.PI) / 180);
    }

    return { x, y };
  }, [solveIK]);

  // 轨迹点
  const trajectoryPoints = useMemo(() => {
    const points: { x: number; y: number }[] = [];
    const numPoints = Math.min(frame, 120);

    for (let i = 0; i < numPoints; i++) {
      const x = interpolate(i, [0, 60, 120], [200, 300, 250]);
      const y = interpolate(i, [0, 60, 120], [-150, -200, -250]);
      points.push({ x, y });
    }

    return points;
  }, [frame]);

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
          {/* 金属质感渐变 */}
          <linearGradient id="armGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#CCCCCC" />
            <stop offset="50%" stopColor="#999999" />
            <stop offset="100%" stopColor="#666666" />
          </linearGradient>
          
          {/* 发光效果 */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 工作空间圆 */}
        <circle
          cx={baseX}
          cy={baseY}
          r={armLengths.reduce((a, b) => a + b, 0)}
          fill="none"
          stroke="#333"
          strokeWidth={2}
          strokeDasharray="10,5"
          opacity={0.3}
        />

        {/* 轨迹 */}
        {showTrajectory && trajectoryPoints.length > 1 && (
          <polyline
            points={trajectoryPoints
              .map(p => `${baseX + p.x},${baseY + p.y}`)
              .join(" ")}
            fill="none"
            stroke="#00FFFF"
            strokeWidth={2}
            opacity={0.5}
          />
        )}

        {/* 机械臂基座 */}
        <g>
          <rect
            x={baseX - 40}
            y={baseY}
            width={80}
            height={40}
            fill="#333"
            stroke="#666"
            strokeWidth={3}
          />
          <circle
            cx={baseX}
            cy={baseY}
            r={25}
            fill="url(#armGradient)"
            stroke="#666"
            strokeWidth={3}
          />
        </g>

        {/* 绘制机械臂 */}
        {solveIK.map((joint, index) => {
          // 计算关节起点
          let startX = 0;
          let startY = 0;
          for (let i = 0; i < index; i++) {
            startX += solveIK[i].length * Math.cos((solveIK[i].angle * Math.PI) / 180);
            startY += solveIK[i].length * Math.sin((solveIK[i].angle * Math.PI) / 180);
          }

          // 计算关节终点
          const endX = startX + joint.length * Math.cos((joint.angle * Math.PI) / 180);
          const endY = startY + joint.length * Math.sin((joint.angle * Math.PI) / 180);

          return (
            <g key={joint.id}>
              {/* 臂段 */}
              <line
                x1={baseX + startX}
                y1={baseY + startY}
                x2={baseX + endX}
                y2={baseY + endY}
                stroke={joint.color}
                strokeWidth={20 - index * 3}
                strokeLinecap="round"
                style={{
                  filter: `drop-shadow(0 4px 8px ${joint.color}60)`,
                }}
              />

              {/* 关节 */}
              <circle
                cx={baseX + startX}
                cy={baseY + startY}
                r={15 - index * 2}
                fill="#333"
                stroke={joint.color}
                strokeWidth={3}
              />

              {/* 关节角度标签 */}
              {showIK && (
                <text
                  x={baseX + startX + 25}
                  y={baseY + startY - 10}
                  fill="#FFFFFF"
                  fontSize={12}
                  fontWeight="bold"
                  style={{ fontFamily: theme.fonts.body }}
                >
                  θ{index + 1}: {joint.angle.toFixed(1)}°
                </text>
              )}
            </g>
          );
        })}

        {/* 末端执行器 */}
        <g>
          <circle
            cx={baseX + endEffector.x}
            cy={baseY + endEffector.y}
            r={20}
            fill="#FF0000"
            stroke="#FFFFFF"
            strokeWidth={3}
            filter="url(#glow)"
          />
          {/* 夹爪 */}
          <line
            x1={baseX + endEffector.x - 15}
            y1={baseY + endEffector.y + 20}
            x2={baseX + endEffector.x - 15}
            y2={baseY + endEffector.y + 40}
            stroke="#FFFFFF"
            strokeWidth={4}
            strokeLinecap="round"
          />
          <line
            x1={baseX + endEffector.x + 15}
            y1={baseY + endEffector.y + 20}
            x2={baseX + endEffector.x + 15}
            y2={baseY + endEffector.y + 40}
            stroke="#FFFFFF"
            strokeWidth={4}
            strokeLinecap="round"
          />
        </g>

        {/* 目标点 */}
        <g>
          <circle
            cx={baseX + finalTargetX}
            cy={baseY + finalTargetY}
            r={15}
            fill="none"
            stroke="#00FF00"
            strokeWidth={3}
            strokeDasharray="5,5"
            filter="url(#glow)"
          >
            <animate
              attributeName="r"
              values="15;20;15"
              dur="1s"
              repeatCount="indefinite"
            />
          </circle>
          <line
            x1={baseX + finalTargetX - 20}
            y1={baseY + finalTargetY}
            x2={baseX + finalTargetX + 20}
            y2={baseY + finalTargetY}
            stroke="#00FF00"
            strokeWidth={2}
          />
          <line
            x1={baseX + finalTargetX}
            y1={baseY + finalTargetY - 20}
            x2={baseX + finalTargetX}
            y2={baseY + finalTargetY + 20}
            stroke="#00FF00"
            strokeWidth={2}
          />
        </g>

        {/* 连接线 */}
        <line
          x1={baseX + endEffector.x}
          y1={baseY + endEffector.y}
          x2={baseX + finalTargetX}
          y2={baseY + finalTargetY}
          stroke="#FFD700"
          strokeWidth={2}
          strokeDasharray="5,5"
          opacity={0.5}
        />

        {/* 距离标签 */}
        {showIK && (
          <text
            x={(baseX + endEffector.x + baseX + finalTargetX) / 2}
            y={(baseY + endEffector.y + baseY + finalTargetY) / 2 - 10}
            fill="#FFD700"
            fontSize={14}
            fontWeight="bold"
            textAnchor="middle"
            style={{ fontFamily: theme.fonts.body }}
          >
            误差: {Math.sqrt(
              Math.pow(endEffector.x - finalTargetX, 2) +
              Math.pow(endEffector.y - finalTargetY, 2)
            ).toFixed(1)} px
          </text>
        )}
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
        🤖 逆运动学（IK）求解 | CCD 算法 | 末端位置 → 关节角度
      </div>
    </div>
  );
};
