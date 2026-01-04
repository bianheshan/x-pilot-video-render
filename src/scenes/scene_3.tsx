import React, { useMemo, useRef } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, random } from "remotion";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Float } from "@react-three/drei";
import * as THREE from "three";
import { User, UserCircle, Users, Zap } from "lucide-react";
import { SafeArea, Subtitle } from "../components";
import { useTheme } from "../contexts/ThemeContext";

const SCENE_START_SECONDS = 60.0;

/**
 * Scene 3: Explain Target Audience & Segmentation
 * Concept: Chaos (Everyone) -> Order (Specific Persona)
 * Tech: Three.js Particles + HTML Overlay
 */

// --- 3D Components ---

const ParticleShape = ({ frame, fps }: { frame: number; fps: number }) => {
  // 粒子数量
  const count = 2000;
  
  // 动画阶段控制
  // 0-7s: 隐藏/散乱 (Warning Text phase)
  // 7s-15s: 汇聚 (Converge)
  const startConvergeFrame = 7 * fps;
  const convergeDuration = 4 * fps;
  
  const convergeProgress = interpolate(
    frame,
    [startConvergeFrame, startConvergeFrame + convergeDuration],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (t) => t * t * (3 - 2 * t) }
  );

  // 生成粒子数据
  const points = useMemo(() => {
    const initialPositions = new Float32Array(count * 3);
    const targetPositions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // 初始状态：散乱分布的大云团
      const r = 10 * Math.cbrt(random(i) * 10);
      const theta = random(i + 1) * 2 * Math.PI;
      const phi = Math.acos(2 * random(i + 2) - 1);
      
      initialPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      initialPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      initialPositions[i * 3 + 2] = r * Math.cos(phi);

      // 目标状态：人形轮廓 (简化为胶囊体/圆柱体)
      // 头部
      const isHead = i < count * 0.2;
      let tx, ty, tz;
      
      if (isHead) {
        // 球体头部
        const u = random(i + 3);
        const v = random(i + 4);
        const theta2 = 2 * Math.PI * u;
        const phi2 = Math.acos(2 * v - 1);
        const rad = 0.8;
        tx = rad * Math.sin(phi2) * Math.cos(theta2);
        ty = rad * Math.sin(phi2) * Math.sin(theta2) + 2.5; // 头部高度
        tz = rad * Math.cos(phi2);
      } else {
        // 圆柱体身体
        const h = 3.5; // 身高
        const rad = 1.0; // 身体宽度
        const yPos = (random(i + 5) - 0.5) * h; // -1.75 to 1.75
        const angle = random(i + 6) * Math.PI * 2;
        const rPos = Math.sqrt(random(i + 7)) * rad;
        
        tx = rPos * Math.cos(angle);
        ty = yPos; 
        tz = rPos * Math.sin(angle);
      }

      targetPositions[i * 3] = tx;
      targetPositions[i * 3 + 1] = ty;
      targetPositions[i * 3 + 2] = tz;

      // 颜色：从灰色变成强调色 #00C896
      colors[i * 3] = 0.5;     // R
      colors[i * 3 + 1] = 0.5; // G
      colors[i * 3 + 2] = 0.5; // B
    }
    return { initialPositions, targetPositions, colors };
  }, []);

  // 实时更新位置 Ref
  const geometryRef = useRef<THREE.BufferGeometry>(null);

  useFrame(() => {
    if (!geometryRef.current) return;
    
    const positions = geometryRef.current.attributes.position.array as Float32Array;
    const colorAttr = geometryRef.current.attributes.color.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      const iy = i * 3 + 1;
      const iz = i * 3 + 2;

      // 插值位置
      positions[ix] = THREE.MathUtils.lerp(points.initialPositions[ix], points.targetPositions[ix], convergeProgress);
      positions[iy] = THREE.MathUtils.lerp(points.initialPositions[iy], points.targetPositions[iy], convergeProgress);
      positions[iz] = THREE.MathUtils.lerp(points.initialPositions[iz], points.targetPositions[iz], convergeProgress);

      // 简单的噪波运动
      if (convergeProgress < 1) {
          positions[ix] += (Math.random() - 0.5) * 0.05;
          positions[iy] += (Math.random() - 0.5) * 0.05;
          positions[iz] += (Math.random() - 0.5) * 0.05;
      }

      // 颜色插值 (Grey to Green #00C896 rgb(0, 200, 150))
      // 0.5 -> 0.0
      // 0.5 -> 0.78
      // 0.5 -> 0.58
      colorAttr[ix] = THREE.MathUtils.lerp(0.5, 0.0, convergeProgress);
      colorAttr[iy] = THREE.MathUtils.lerp(0.5, 0.78, convergeProgress);
      colorAttr[iz] = THREE.MathUtils.lerp(0.5, 0.58, convergeProgress);
    }
    
    geometryRef.current.attributes.position.needsUpdate = true;
    geometryRef.current.attributes.color.needsUpdate = true;
  });

  return (
    <group rotation={[0, frame * 0.005, 0]}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <Points>
          <bufferGeometry ref={geometryRef}>
            <bufferAttribute
              attach="attributes-position"
              count={count}
              array={points.initialPositions} // 初始占位，会被 useFrame 覆盖
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-color"
              count={count}
              array={points.colors}
              itemSize={3}
            />
          </bufferGeometry>
          <PointMaterial
            transparent
            vertexColors
            size={0.15}
            sizeAttenuation={true}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </Points>
      </Float>
    </group>
  );
};

// --- Main Scene Component ---

export default function Scene3() {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const theme = useTheme();

  // 场景时间轴定义 (Relative Frames)
  const warningDuration = 7 * fps; // 0-7s
  const personaEntryFrame = 23 * fps; // 23s

  // 1. 警告文字动画 (Glitch Effect)
  const showWarning = frame < warningDuration;
  const warningOpacity = interpolate(frame, [warningDuration - 15, warningDuration], [1, 0]);
  
  // Glitch displacement
  const glitchOffset = showWarning ? Math.sin(frame * 0.8) * 10 : 0;
  const glitchSkew = showWarning ? Math.cos(frame * 1.5) * 5 : 0;
  const glitchColor = frame % 4 < 2 ? "#ff4d4d" : "#ffffff";

  // 2. Persona Card 动画
  const cardProgress = spring({
    frame: frame - personaEntryFrame,
    fps,
    config: { damping: 12, stiffness: 100 }
  });
  
  const cardScale = interpolate(cardProgress, [0, 1], [0.8, 1]);
  const cardOpacity = interpolate(cardProgress, [0, 1], [0, 1]);
  const cardY = interpolate(cardProgress, [0, 1], [50, 0]);

  // 字幕数据
  const subtitles = [
    { id: "S3_SUB1", text: "A common mistake is trying to talk to everyone. If you target everyone, you reach no one.", start: 60.0, end: 67.0 },
    { id: "S3_SUB2", text: "Successful marketing starts with Segmentation. You must define your target audience.", start: 67.0, end: 74.0 },
    { id: "S3_SUB3", text: "Look beyond just age and location. Look at Psychographics: What do they value?", start: 74.0, end: 83.0 },
    { id: "S3_SUB4", text: "By building a clear Buyer Persona, your message becomes personal and powerful.", start: 83.0, end: 89.0 },
    { id: "S3_SUB5", text: "You stop shouting at a crowd and start having a conversation.", start: 89.0, end: 95.0 }
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: "#111111", overflow: "hidden" }}>
      
      {/* Layer 0: 3D Background (Particles) */}
      <AbsoluteFill style={{ zIndex: 0 }}>
        <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <ParticleShape frame={frame} fps={fps} />
        </Canvas>
      </AbsoluteFill>

      {/* Layer 1: Content Overlay */}
      <SafeArea padding={60} paddingBottom={160} style={{ zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        
        {/* Phase 1: Warning Text */}
        {showWarning && (
            <div style={{ 
                opacity: warningOpacity,
                transform: `translateX(${glitchOffset}px) skewX(${glitchSkew}deg)`,
                textAlign: 'center',
                position: 'relative'
            }}>
                <div style={{ 
                    fontSize: 120, 
                    fontWeight: 900, 
                    color: glitchColor,
                    fontFamily: theme.fonts.heading,
                    textTransform: 'uppercase',
                    lineHeight: 1,
                    textShadow: '4px 4px 0px rgba(255,0,0,0.5)'
                }}>
                    Don't Target<br/>Everyone
                </div>
                <div style={{
                    marginTop: 20,
                    fontSize: 32,
                    color: '#fff',
                    fontFamily: theme.fonts.body,
                    letterSpacing: 4
                }}>
                    <Zap size={32} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 10, color: '#ff4d4d' }} />
                    FATAL ERROR
                </div>
            </div>
        )}

        {/* Phase 2: Persona Card */}
        <div style={{
            opacity: cardOpacity,
            transform: `scale(${cardScale}) translateY(${cardY}px)`,
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: 24,
            padding: 40,
            maxWidth: 600,
            width: '100%',
            color: 'white',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            display: 'flex',
            flexDirection: 'column',
            gap: 24
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 20 }}>
                <div style={{ 
                    width: 80, height: 80, 
                    borderRadius: '50%', 
                    background: 'linear-gradient(135deg, #00C896 0%, #0056D2 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 0 20px rgba(0, 200, 150, 0.4)'
                }}>
                    <UserCircle size={48} color="white" />
                </div>
                <div>
                    <h2 style={{ margin: 0, fontFamily: theme.fonts.heading, fontSize: 32 }}>Ideal Customer</h2>
                    <span style={{ fontFamily: theme.fonts.body, opacity: 0.7, fontSize: 18 }}>Target Persona Profile</span>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: 20, borderRadius: 12 }}>
                    <h3 style={{ margin: '0 0 10px 0', fontSize: 16, color: '#00C896', textTransform: 'uppercase' }}>Demographics</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 20 }}>
                        <Users size={20} />
                        <span>Age 25-35, Urban</span>
                    </div>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: 20, borderRadius: 12 }}>
                    <h3 style={{ margin: '0 0 10px 0', fontSize: 16, color: '#00C896', textTransform: 'uppercase' }}>Psychographics</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 20 }}>
                        <User size={20} />
                        <span>Eco-conscious, Tech-savvy</span>
                    </div>
                </div>
            </div>
            
            <div style={{ 
                background: 'rgba(0, 200, 150, 0.1)', 
                padding: 15, 
                borderRadius: 8, 
                fontSize: 16, 
                textAlign: 'center',
                border: '1px dashed rgba(0, 200, 150, 0.3)'
            }}>
                "Looking for sustainable solutions that save time."
            </div>
        </div>

      </SafeArea>

      {/* Layer 2: Subtitles */}
      {subtitles.map((sub, index) => {
        // 计算当前场景内的相对帧数
        const startFrame = Math.max(0, Math.round((sub.start - SCENE_START_SECONDS) * fps));
        const durationInFrames = Math.max(1, Math.round((sub.end - sub.start) * fps));
        
        return (
          <Subtitle
            key={sub.id}
            text={sub.text}
            startFrame={startFrame}
            durationInFrames={durationInFrames}
          />
        );
      })}
    </AbsoluteFill>
  );
}
