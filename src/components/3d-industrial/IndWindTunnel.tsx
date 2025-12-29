import React, { useMemo } from "react";
import { useCurrentFrame } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";
import * as d3 from "d3";

export interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export interface IndWindTunnelProps {
  windSpeed?: number;
  particleCount?: number;
  showPressure?: boolean;
  showForces?: boolean;
}

/**
 * IndWindTunnel - 风洞测试（使用 D3.js 流线生成）
 * 
 * 使用 D3.js 的曲线生成器创建流畅的流线
 * 
 * 特性：
 * - D3 曲线生成
 * - 流线可视化
 * - 压力分布
 * - 颜色比例尺
 * - 力的可视化
 */
export const IndWindTunnel: React.FC<IndWindTunnelProps> = ({
  windSpeed = 50,
  particleCount = 100,
  showPressure = true,
  showForces = true,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();

  // 车辆参数
  const carX = 400;
  const carY = 360;
  const carWidth = 200;
  const carHeight = 80;

  // 使用 D3 颜色比例尺表示压力
  const pressureScale = useMemo(() => {
    return d3
      .scaleSequential(d3.interpolateRdYlBu)
      .domain([2, 0]); // 高压到低压
  }, []);

  // 生成粒子
  const particles = useMemo(() => {
    const result: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      result.push({
        id: i,
        x: 50 + (frame * windSpeed * 0.1 + i * 10) % 1000,
        y: 200 + (i % 10) * 40,
        vx: windSpeed,
        vy: 0,
      });
    }
    return result;
  }, [frame, particleCount, windSpeed]);

  // 计算流线路径
  const streamlines = useMemo(() => {
    const lines: Array<{ points: [number, number][]; pressure: number }> = [];
    
    for (let i = 0; i < 10; i++) {
      const startY = 200 + i * 40;
      const points: [number, number][] = [];
      
      for (let x = 50; x <= 1000; x += 10) {
        let y = startY;
        
        // 计算车辆周围的流场扰动
        const dx = x - carX;
        const dy = y - carY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < carWidth) {
          // 车辆周围的流线偏移
          const angle = Math.atan2(dy, dx);
          const deflection = (carWidth - dist) / carWidth * 50;
          y += Math.sin(angle) * deflection;
        }
        
        points.push([x, y]);
      }
      
      // 计算平均压力
      const avgPressure = 1 + Math.sin(i * 0.5) * 0.5;
      lines.push({ points, pressure: avgPressure });
    }
    
    return lines;
  }, [carX, carY, carWidth]);

  // 使用 D3 曲线生成器
  const lineGenerator = useMemo(() => {
    return d3.line().curve(d3.curveCardinal.tension(0.5));
  }, []);

  // 渲染流线
  const renderStreamlines = () => {
    return streamlines.map((line, i) => {
      const pathData = lineGenerator(line.points);
      if (!pathData) return null;

      return (
        <path
          key={`streamline-${i}`}
          d={pathData}
          fill="none"
          stroke={pressureScale(line.pressure)}
          strokeWidth="2"
          opacity="0.6"
        />
      );
    });
  };

  // 渲染粒子
  const renderParticles = () => {
    return particles.map((particle) => {
      // 检查粒子是否在车辆附近
      const dx = particle.x - carX;
      const dy = particle.y - carY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      const isNearCar = dist < carWidth * 1.5;
      
      return (
        <circle
          key={`particle-${particle.id}`}
          cx={particle.x}
          cy={particle.y}
          r={(isNearCar ? 3 : 2) + (isNearCar ? 2 : 1) * (0.5 + 0.5 * Math.sin((frame + particle.id * 7) * 0.2))}
          fill={isNearCar ? theme.colors.accent : theme.colors.primary}
          opacity={isNearCar ? 0.8 : 0.5}
        />
      );
    });
  };

  // 渲染压力分布
  const renderPressure = () => {
    if (!showPressure) return null;

    const pressurePoints: Array<{ x: number; y: number; pressure: number }> = [];
    
    // 在车辆周围采样压力点
    for (let angle = 0; angle < 360; angle += 30) {
      const rad = (angle * Math.PI) / 180;
      const x = carX + Math.cos(rad) * (carWidth / 2 + 20);
      const y = carY + Math.sin(rad) * (carHeight / 2 + 20);
      
      // 计算压力（前方高压，后方低压）
      const pressure = angle < 180 ? 1.5 : 0.5;
      pressurePoints.push({ x, y, pressure });
    }

    return pressurePoints.map((point, i) => (
      <circle
        key={`pressure-${i}`}
        cx={point.x}
        cy={point.y}
        r="8"
        fill={pressureScale(point.pressure)}
        opacity="0.7"
      />
    ));
  };

  // 渲染力的箭头
  const renderForces = () => {
    if (!showForces) return null;

    // 阻力
    const dragForce = windSpeed * 0.5;
    // 升力
    const liftForce = windSpeed * 0.2;

    return (
      <g>
        {/* 阻力箭头 */}
        <defs>
          <marker
            id="arrowhead-drag"
            markerWidth="10"
            markerHeight="10"
            refX="5"
            refY="5"
            orient="auto"
          >
            <polygon points="0 0, 10 5, 0 10" fill="#FF0000" />
          </marker>
          <marker
            id="arrowhead-lift"
            markerWidth="10"
            markerHeight="10"
            refX="5"
            refY="5"
            orient="auto"
          >
            <polygon points="0 0, 10 5, 0 10" fill="#00FF00" />
          </marker>
        </defs>

        {/* 阻力 */}
        <line
          x1={carX + carWidth / 2}
          y1={carY}
          x2={carX + carWidth / 2 + dragForce}
          y2={carY}
          stroke="#FF0000"
          strokeWidth="3"
          markerEnd="url(#arrowhead-drag)"
        />
        <text
          x={carX + carWidth / 2 + dragForce + 10}
          y={carY + 5}
          fill="#FF0000"
          fontSize="14"
          fontWeight="bold"
        >
          阻力: {dragForce.toFixed(1)}N
        </text>

        {/* 升力 */}
        <line
          x1={carX}
          y1={carY}
          x2={carX}
          y2={carY - liftForce}
          stroke="#00FF00"
          strokeWidth="3"
          markerEnd="url(#arrowhead-lift)"
        />
        <text
          x={carX + 10}
          y={carY - liftForce - 10}
          fill="#00FF00"
          fontSize="14"
          fontWeight="bold"
        >
          升力: {liftForce.toFixed(1)}N
        </text>
      </g>
    );
  };

  // 计算空气动力学系数
  const dragCoefficient = 0.3;
  const liftCoefficient = 0.1;
  const reynoldsNumber = (windSpeed * carWidth) / 15; // 简化计算

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
          风洞测试仿真
        </text>

        {/* 信息面板 */}
        <g transform="translate(50, 80)">
          <rect width="250" height="180" fill={theme.colors.surface} opacity="0.9" rx="8" />
          <text x="15" y="30" fill={theme.colors.text} fontSize="16" fontWeight="bold">
            测试参数
          </text>
          <text x="15" y="55" fill={theme.colors.text} fontSize="14">
            风速: {windSpeed} m/s
          </text>
          <text x="15" y="75" fill={theme.colors.text} fontSize="14">
            粒子数: {particleCount}
          </text>
          <text x="15" y="95" fill={theme.colors.text} fontSize="14">
            阻力系数: {dragCoefficient}
          </text>
          <text x="15" y="115" fill={theme.colors.text} fontSize="14">
            升力系数: {liftCoefficient}
          </text>
          <text x="15" y="135" fill={theme.colors.text} fontSize="14">
            雷诺数: {reynoldsNumber.toFixed(0)}
          </text>
          <text x="15" y="155" fill={theme.colors.text} fontSize="14">
            流线: D3 Cardinal
          </text>
        </g>

        {/* 压力图例 */}
        {showPressure && (
          <g transform="translate(810, 80)">
            <rect width="220" height="140" fill={theme.colors.surface} opacity="0.9" rx="8" />
            <text x="15" y="25" fill={theme.colors.text} fontSize="14" fontWeight="bold">
              压力分布
            </text>
            {[
              { pressure: 2, label: "高压" },
              { pressure: 1.5, label: "中高压" },
              { pressure: 1, label: "标准压" },
              { pressure: 0.5, label: "低压" },
            ].map((item, i) => (
              <g key={i} transform={`translate(15, ${45 + i * 22})`}>
                <rect width="20" height="15" fill={pressureScale(item.pressure)} />
                <text x="30" y="12" fill={theme.colors.text} fontSize="12">
                  {item.label}
                </text>
              </g>
            ))}
          </g>
        )}

        {/* 风洞主体 */}
        <g>
          {/* 风洞壁 */}
          <rect
            x="50"
            y="150"
            width="980"
            height="420"
            fill="none"
            stroke={theme.colors.text}
            strokeWidth="3"
            strokeDasharray="10,5"
            opacity="0.3"
          />

          {/* 流线 */}
          {renderStreamlines()}

          {/* 粒子 */}
          {renderParticles()}

          {/* 压力分布 */}
          {renderPressure()}

          {/* 车辆 */}
          <g>
            {/* 车身 */}
            <ellipse
              cx={carX}
              cy={carY}
              rx={carWidth / 2}
              ry={carHeight / 2}
              fill={theme.colors.primary}
              stroke={theme.colors.accent}
              strokeWidth="3"
              opacity="0.8"
            />
            
            {/* 车窗 */}
            <ellipse
              cx={carX - 30}
              cy={carY - 10}
              rx="40"
              ry="20"
              fill="#87CEEB"
              opacity="0.6"
            />

            {/* 车轮 */}
            <circle cx={carX - 60} cy={carY + 40} r="20" fill="#333333" />
            <circle cx={carX + 60} cy={carY + 40} r="20" fill="#333333" />
          </g>

          {/* 力的箭头 */}
          {renderForces()}
        </g>

        {/* 公式说明 */}
        <g transform="translate(50, 600)">
          <text x="0" y="0" fill={theme.colors.text} fontSize="14" fontWeight="bold">
            空气动力学公式
          </text>
          <text x="0" y="20" fill={theme.colors.text} fontSize="12">
            阻力: F_d = ½ρv²AC_d
          </text>
          <text x="0" y="40" fill={theme.colors.text} fontSize="12">
            升力: F_l = ½ρv²AC_l
          </text>
          <text x="0" y="60" fill={theme.colors.text} fontSize="12">
            雷诺数: Re = ρvL/μ
          </text>
        </g>
      </svg>
    </div>
  );
};
