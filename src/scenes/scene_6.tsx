import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Sequence } from "remotion";
import { 
  SplitScreen, 
  IndTerrainMap, 
  IndRobotArm,
  LogicFlowPath,
  Subtitle,
  TitleCard
} from "../components";
import { useTheme } from "../contexts/ThemeContext";

/**
 * Scene 6: Acromioplasty (Bone smoothing)
 * 
 * 教学目标: 观察肩峰成形术（骨骼平滑）步骤。
 * 核心隐喻: 
 * 1. 地形图 (IndTerrainMap) 从崎岖变平坦 -> 模拟骨刺被磨平。
 * 2. 机械臂 (IndRobotArm) -> 模拟手术磨钻工具。
 * 
 * 时长: 7.0 秒 (210 帧)
 */
export default function Scene6() {
  const theme = useTheme();
  const frame = useCurrentFrame();
  
  // 颜色配置
  const boneColor = "#F5F5F0"; // 骨骼白
  const roughColor = "#E2E8F0"; // 粗糙部分的阴影
  const toolColor = "#94A3B8";  // 工具金属色

  // 动画控制
  // 1. 骨骼表面变化：从粗糙到平滑的交叉淡入淡出
  const smoothingProgress = interpolate(frame, [30, 150], [0, 1], {
    extrapolateRight: "clamp",
  });
  
  // 2. 机械臂运动：模拟磨钻在表面来回移动
  const armMoveX = interpolate(frame, [0, 100, 200], [-50, 50, -50]);
  const armMoveY = interpolate(frame, [0, 100, 200], [10, -10, 10]);

  // 骨骼表面数据 - 崎岖（有骨刺）
  const roughTerrain = [
    [5, 15, 25, 15, 5],
    [10, 30, 45, 30, 10], // 中间突起代表骨刺
    [15, 35, 50, 35, 15],
    [10, 30, 45, 30, 10],
    [5, 15, 25, 15, 5]
  ];

  // 骨骼表面数据 - 平滑（术后）
  const smoothTerrain = [
    [5, 5, 5, 5, 5],
    [5, 5, 5, 5, 5],
    [5, 5, 5, 5, 5],
    [5, 5, 5, 5, 5],
    [5, 5, 5, 5, 5]
  ];

  // 左侧内容：手术模拟视图
  const SimulationView = () => (
    <div style={{ 
      position: "relative",
      width: "100%",
      height: "100%",
      overflow: "hidden", 
      background: "#F1F5F9" 
    }}>
      {/* 标题标记 */}
      <div style={{ 
        position: "absolute", 
        top: 40, 
        left: 40, 
        zIndex: 10,
        background: "rgba(255,255,255,0.8)",
        padding: "8px 16px",
        borderRadius: 8,
        border: `1px solid ${theme.colors.border}`,
        color: theme.colors.textSecondary,
        fontSize: 14,
        fontWeight: "bold"
      }}>
        MICROSCOPIC VIEW: ACROMION SURFACE
      </div>

      {/* 1. 粗糙表面 (Before) - 随进度消失 */}
      <div style={{ 
        position: "absolute", 
        inset: 0, 
        opacity: 1 - smoothingProgress,
        transform: "scale(0.9)" 
      }}>
        <IndTerrainMap 
          heightData={roughTerrain}
          showContours={true}
          colorScheme="magma" // 使用深色对比强调崎岖
        />
      </div>

      {/* 2. 平滑表面 (After) - 随进度出现 */}
      <div style={{ 
        position: "absolute", 
        inset: 0, 
        opacity: smoothingProgress,
        transform: "scale(0.9)" 
      }}>
        <IndTerrainMap 
          heightData={smoothTerrain}
          showContours={false}
          colorScheme="viridis" // 使用清爽色调代表平滑
        />
      </div>

      {/* 3. 手术工具 (机械臂模拟) */}
      <div style={{
        position: "absolute",
        bottom: -100,
        right: -50,
        transform: `translate(${armMoveX}px, ${armMoveY}px) rotate(-15deg)`,
        zIndex: 20,
        filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.2))"
      }}>
        <IndRobotArm 
          joints={[
            { angle: -45, length: 180, color: toolColor }, // 主臂
            { angle: 90, length: 120, color: toolColor },  // 钻头臂
            { angle: 0, length: 40, color: "#E63946" }    // 钻头尖端 (红色强调)
          ]}
          showAxes={false}
        />
      </div>
      
      {/* 4. 碎屑粒子效果 (模拟磨骨) */}
      <Sequence from={30} durationInFrames={120}>
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 200,
          height: 200,
          transform: "translate(-50%, -50%)",
          background: "radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%)",
          opacity: interpolate(frame % 20, [0, 10, 20], [0.3, 0.8, 0.3]), // 闪烁效果
          pointerEvents: "none"
        }} />
      </Sequence>
    </div>
  );

  // 右侧内容：步骤逻辑
  const StepsView = () => (
    <div style={{ 
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      padding: 60 
    }}>
      <div style={{ marginBottom: 40 }}>
        <TitleCard 
          title="Acromioplasty" 
          subtitle="Surgical Bone Smoothing" 
          animation="fade"
        />
      </div>
      
      <div style={{ transform: "scale(0.9)", transformOrigin: "top center" }}>
        <LogicFlowPath 
          title="Procedure Steps"
          subtitle="Removing the impingement source"
          steps={[
            { 
              id: "1", 
              label: "Identify", 
              description: "Locate Bone Spur", 
              type: "start",
              status: frame > 30 ? "completed" : "active"
            },
            { 
              id: "2", 
              label: "Action", 
              description: "Burr Decompression", 
              type: "process",
              status: frame > 90 ? "completed" : (frame > 30 ? "active" : "pending")
            },
            { 
              id: "3", 
              label: "Result", 
              description: "Flat Surface Created", 
              type: "end",
              status: frame > 150 ? "completed" : "pending"
            }
          ]}
          connections={[
            { from: "1", to: "2", animated: true },
            { from: "2", to: "3", animated: true }
          ]}
          layout="timeline"
        />
      </div>
    </div>
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "#F0F8FF" }}>
      <SplitScreen 
        left={<SimulationView />}
        right={<StepsView />}
        ratio={0.55} // 左侧视觉区域稍大
        showDivider={true}
        dividerWidth={2}
        leftStyle={{ borderRight: `1px solid ${theme.colors.border}` }}
      />

      <Subtitle
        text="Next, the undersurface of the acromion is smoothed using a surgical burr to remove bone spurs."
        startFrame={0}
        durationInFrames={210}
      />
    </AbsoluteFill>
  );
}
