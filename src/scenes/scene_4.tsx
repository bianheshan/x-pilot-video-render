import React, { useMemo, useRef } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, random } from "remotion";
import { Canvas, useFrame } from '@react-three/fiber';
import { Center, Text3D, Environment, Float } from '@react-three/drei';
import * as THREE from 'three';
import { SafeArea, Subtitle } from "../components";
import { useTheme } from "../contexts/ThemeContext";

// --- Components ---

/**
 * 3D Particle Funnel Simulation
 * Particles fall, converge towards the center, and change color at the bottom
 */
const ParticleFunnel = ({ primaryColor, accentColor }: { primaryColor: string, accentColor: string }) => {
  const count = 400;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const particles = useMemo(() => {
    return new Array(count).fill(0).map(() => ({
      x: (Math.random() - 0.5) * 10, // Wide spread at top
      y: Math.random() * 10 + 5,     // Start above screen
      z: (Math.random() - 0.5) * 4,
      speed: Math.random() * 0.05 + 0.02,
      offset: Math.random() * 100
    }));
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime();

    particles.forEach((particle, i) => {
      // Move down
      particle.y -= particle.speed;

      // Converge logic: As Y gets smaller (closer to 0), X and Z should get closer to 0
      // Funnel shape factor
      const funnelFactor = Math.max(0.2, (particle.y + 5) / 10); 
      
      // Apply convergence
      const currentX = particle.x * funnelFactor;
      const currentZ = particle.z * funnelFactor;

      // Reset if too low
      if (particle.y < -6) {
        particle.y = 8;
        particle.x = (Math.random() - 0.5) * 10;
        particle.z = (Math.random() - 0.5) * 4;
      }

      dummy.position.set(currentX, particle.y, currentZ);
      
      // Rotate particles slightly
      dummy.rotation.x = time + particle.offset;
      dummy.rotation.y = time * 0.5 + particle.offset;
      
      // Scale down as they go deep
      const scale = Math.max(0.1, funnelFactor * 0.3);
      dummy.scale.set(scale, scale, scale);

      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);

      // Color transition: Blue at top, Gold/Green at bottom
      const color = new THREE.Color();
      if (particle.y < -2) {
        // Bottom (Conversion/Loyalty)
        color.set(accentColor); 
      } else {
        // Top (Awareness)
        color.set(primaryColor);
      }
      meshRef.current!.setColorAt(i, color);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <dodecahedronGeometry args={[0.2, 0]} />
      <meshStandardMaterial roughness={0.2} metalness={0.8} />
    </instancedMesh>
  );
};

/**
 * 2D HTML Funnel Visualization
 */
const FunnelLevel = ({ 
  label, 
  index, 
  total, 
  color, 
  widthPercent, 
  delay 
}: { 
  label: string, 
  index: number, 
  total: number, 
  color: string, 
  widthPercent: number, 
  delay: number 
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();

  // Slide up and fade in animation
  const opacity = interpolate(frame, [delay, delay + 20], [0, 1], { extrapolateRight: 'clamp' });
  const translateY = interpolate(frame, [delay, delay + 20], [50, 0], { extrapolateRight: 'clamp', easing: spring({ fps, frame: frame - delay, config: { damping: 12 } }) });

  return (
    <div
      style={{
        width: `${widthPercent}%`,
        height: 80,
        background: color,
        marginBottom: 16,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: 24,
        fontFamily: theme.fonts.body,
        borderRadius: 8,
        opacity,
        transform: `translateY(${translateY}px)`,
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        // Create funnel shape illusion using clip-path could be an option, 
        // but rounded bars with decreasing width is cleaner for modern UI
        position: 'relative',
        zIndex: total - index
      }}
    >
      {label}
    </div>
  );
};

// --- Main Scene ---

export default function Scene4() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();

  // Scene Configuration
  const SCENE_START_TIME = 95.0; // Seconds
  const DURATION_SECONDS = 40.0;
  
  // Colors from config
  const primaryColor = "#0056D2";
  const accentColor = "#00C896";
  const bgColor = "#F4F7F6";

  // Data
  const funnelLevels = [
    { label: "Awareness", width: 100, color: "#80B3FF" }, // Light Blue
    { label: "Interest & Consideration", width: 80, color: "#3385FF" }, // Mid Blue
    { label: "Decision & Purchase", width: 60, color: primaryColor }, // Primary Blue
    { label: "Loyalty & Advocacy", width: 40, color: accentColor }, // Green/Gold equivalent
  ];

  // Subtitles Data
  const subtitles = [
    { text: "Once you know who they are, you take them on a journey. This is called the Marketing Funnel.", start: 95.0, end: 102.5 },
    { text: "At the top is Awareness: They learn you exist. Next is Consideration: They compare you to others.", start: 102.5, end: 110.5 },
    { text: "Then comes the Purchase. But the best marketers know the funnel doesn't end there.", start: 110.5, end: 117.0 },
    { text: "The ultimate goal is Loyalty and Advocacy. Turning a customer into a fan who recommends you to others.", start: 117.0, end: 126.0 },
    { text: "This turns the funnel into a self-sustaining engine of growth.", start: 126.0, end: 132.0 },
    { text: "This is where real brand value is built.", start: 132.0, end: 135.0 }
  ];

  return (
    <AbsoluteFill style={{ background: bgColor, overflow: 'hidden' }}>
      
      {/* Background Layer - Subtle Grid or gradient */}
      <AbsoluteFill style={{ zIndex: 0 }}>
        <div style={{ 
          width: '100%', 
          height: '100%', 
          background: `radial-gradient(circle at 70% 50%, #ffffff 0%, ${bgColor} 70%)` 
        }} />
      </AbsoluteFill>

      <SafeArea padding={60} paddingBottom={160} style={{ zIndex: 1, display: 'flex', flexDirection: 'row', gap: 60 }}>
        
        {/* Left Side: The Funnel Diagram */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          
          <h2 style={{ 
            fontFamily: theme.fonts.heading, 
            color: '#1A1A1A', 
            fontSize: 48, 
            marginBottom: 40,
            opacity: interpolate(frame, [10, 30], [0, 1], { extrapolateRight: 'clamp' })
          }}>
            The Marketing Funnel
          </h2>

          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {funnelLevels.map((level, index) => (
              <FunnelLevel 
                key={index}
                index={index}
                total={funnelLevels.length}
                label={level.label}
                widthPercent={level.width}
                color={level.color}
                delay={20 + index * 15} // Staggered entry
              />
            ))}
          </div>

          {/* Self-sustaining loop arrow indicator (appears late) */}
          <div style={{ 
            marginTop: 30, 
            display: 'flex', 
            alignItems: 'center', 
            gap: 10,
            opacity: interpolate(frame, [fps * 31, fps * 32], [0, 1], { extrapolateRight: 'clamp' }) // Appears around 126s (31s into scene)
          }}>
             <div style={{ width: 40, height: 40, borderRadius: '50%', background: accentColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
                </svg>
             </div>
             <span style={{ fontFamily: theme.fonts.body, color: accentColor, fontWeight: 'bold' }}>Growth Engine</span>
          </div>
        </div>

        {/* Right Side: 3D Particle Simulation */}
        <div style={{ flex: 1, position: 'relative', borderRadius: 24, overflow: 'hidden', boxShadow: 'inset 0 0 40px rgba(0,0,0,0.05)' }}>
          <AbsoluteFill>
            <Canvas camera={{ position: [0, 0, 12], fov: 45 }}>
              <ambientLight intensity={0.7} />
              <pointLight position={[10, 10, 10]} intensity={1} color={primaryColor} />
              <pointLight position={[-10, -10, 10]} intensity={1} color={accentColor} />
              
              <ParticleFunnel primaryColor={primaryColor} accentColor={accentColor} />
              
              <Environment preset="city" />
            </Canvas>
          </AbsoluteFill>
          
          {/* Overlay Label for Simulation */}
          <div style={{ 
            position: 'absolute', 
            bottom: 30, 
            width: '100%', 
            textAlign: 'center', 
            fontFamily: theme.fonts.body,
            color: 'rgba(26, 26, 26, 0.5)',
            fontSize: 14,
            letterSpacing: 1
          }}>
            CUSTOMER JOURNEY FLOW
          </div>
        </div>

      </SafeArea>

      {/* Subtitles */}
      {subtitles.map((sub, index) => {
        // Calculate relative frames
        const startFrame = Math.max(0, Math.round((sub.start - SCENE_START_TIME) * fps));
        const durationFrames = Math.max(1, Math.round((sub.end - sub.start) * fps));
        
        return (
          <Subtitle 
            key={index}
            text={sub.text}
            startFrame={startFrame}
            durationInFrames={durationFrames}
          />
        );
      })}
    </AbsoluteFill>
  );
}
