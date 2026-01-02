import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Sequence } from "remotion";
import { 
  SplitScreen, 
  ListBulletPoints, 
  IndRobotArm, 
  Subtitle,
  Title3DFloating
} from "../components";
import { useTheme } from "../contexts/ThemeContext";

/**
 * Scene 2: Mechanism of Impingement
 * 
 * Target: Know: Understand the mechanism of impingement.
 * Layout: SplitScreen (Visual Metaphor Left / Essential Info Right)
 * Duration: 7.5 seconds (225 frames)
 * 
 * Visual Logic:
 * - Left: Uses IndRobotArm to simulate the mechanics of arm abduction (lifting).
 * - Overlay: A red pulsating gradient represents the inflammation/pain point where the "bone" rubs the "tendon".
 * - Right: Bullet points explaining the syndrome.
 */
export default function Scene2() {
  const theme = useTheme();
  const frame = useCurrentFrame();

  // Configuration from JSON
  const colors = {
    primary: "#0077B6",
    secondary: "#90E0EF",
    accent: "#E63946",
    text: "#333333",
    background: "linear-gradient(to bottom, #F0F8FF, #E0F7FA)"
  };

  // Animation: Arm lifting simulation (Abduction 0 -> 90 degrees)
  // Moves slowly throughout the scene to show the process
  const armLiftAngle = interpolate(
    frame,
    [0, 150],
    [0, -80], // Negative to lift up in standard coordinate systems often used in 2D/3D rigs
    { extrapolateRight: "clamp" }
  );

  // Animation: Inflammation Pulse (Simulating the "Red Glow" on contact)
  // Starts appearing as the arm reaches a certain height (frame 45+)
  const painOpacity = interpolate(
    frame,
    [45, 90, 135, 180, 225],
    [0, 0.8, 0.4, 0.9, 0.5], // Pulsing effect
    { extrapolateRight: "clamp" }
  );

  const painScale = interpolate(
    frame,
    [45, 90],
    [0.5, 1.5],
    { extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ background: colors.background }}>
      
      {/* Main Layout */}
      <SplitScreen
        ratio={0.55} // Give slightly more space to the visual
        left={
          <div style={{ 
            position: "relative", 
            width: "100%", 
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column"
          }}>
            {/* Visual Metaphor: Mechanical Arm representing Skeletal Mechanics */}
            <div style={{ width: 400, height: 400, position: "relative" }}>
              <IndRobotArm
                joints={[
                  { angle: 0, length: 140 },    // 'Torso/Scapula' base
                  { angle: armLiftAngle, length: 160 }, // 'Humerus' lifting
                  { angle: 15, length: 80 }     // 'Forearm'
                ]}
                showAxes={false}
              />
              
              {/* Inflammation Overlay: The "Contact Point" */}
              <div style={{
                position: "absolute",
                top: "45%", // Approximate joint location
                left: "50%",
                width: 120,
                height: 120,
                borderRadius: "50%",
                background: `radial-gradient(circle, ${colors.accent} 0%, transparent 70%)`,
                opacity: painOpacity,
                transform: `translate(-50%, -50%) scale(${painScale})`,
                pointerEvents: "none",
                mixBlendMode: "multiply"
              }} />
              
              {/* Label for the visual metaphor */}
              <div style={{
                position: "absolute",
                top: "45%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                opacity: painOpacity,
                color: colors.accent,
                fontWeight: "bold",
                textShadow: "0 0 10px white"
              }}>
                IMPINGEMENT
              </div>
            </div>

            <div style={{ 
              marginTop: 20, 
              color: colors.primary, 
              fontFamily: theme.fonts.mono,
              fontSize: 14,
              opacity: 0.7 
            }}>
              Fig 2.1: Mechanical Abduction Simulation
            </div>
          </div>
        }
        right={
          <div style={{ padding: 50, height: "100%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <ListBulletPoints
              title="Impingement Syndrome"
              items={[
                { 
                  text: "Narrowed Subacromial Space", 
                  description: "Reduced clearance for movement",
                  icon: "⬇️",
                  accentColor: colors.primary
                },
                { 
                  text: "Bone Rubbing Tendon", 
                  description: "Acromion friction against Rotator Cuff",
                  icon: "⚠️",
                  accentColor: colors.accent
                },
                { 
                  text: "Painful Inflammation", 
                  description: "Resulting in bursitis and tendinitis",
                  icon: "🔥",
                  accentColor: colors.accent 
                }
              ]}
              showIndex={true}
              highlightColor={colors.secondary}
            />
          </div>
        }
        animation="slide" // Slide-in animation for the split screen
        animationDuration={30}
        showDivider={true}
        labelLeft="Mechanism"
        labelRight="Pathology"
      />

      {/* Subtitle */}
      <Subtitle
        text="In impingement syndrome, the subacromial space narrows, causing the acromion to rub against the rotator cuff."
        startFrame={10} // Slight delay to let scene settle
        durationInFrames={215}
        emphasisWords={["narrows", "rub", "rotator cuff"]}
        variant="solid"
      />
    </AbsoluteFill>
  );
}
