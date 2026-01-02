import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Sequence, Img } from "remotion";
import { 
  IndCircuitBoard, 
  GridLayout, 
  CardGlassmorphism, 
  Subtitle 
} from "../components";
import { useTheme } from "../contexts/ThemeContext";

/**
 * Scene 5: Analytics, CRM, and Automation
 * Target: Cover Analytics, CRM, and Automation tools.
 * Duration: 240 frames (8 seconds)
 * 
 * Components:
 * - Background: IndCircuitBoard (Visual Metaphor for Data Stream Flow)
 * - Foreground: GridLayout with CardGlassmorphism (The Power Stack)
 */
export default function Scene5() {
  const theme = useTheme();
  const frame = useCurrentFrame();

  // Animation for background opacity
  // Fade in at start, dim slightly when grid appears
  const bgOpacity = interpolate(frame, [0, 30, 120, 150], [0, 1, 1, 0.3], {
    extrapolateRight: "clamp"
  });

  // Grid items configuration
  const tools = [
    {
      caption: "Tableau (Analytics)",
      img: "http://35.232.154.66:5125/files/tools/b222c371-a330-46a1-8449-8e82e8508c69.jpg?timestamp=1767333412&nonce=a80d2d977884fb8e65792025d4257f5d&sign=sX6CEGLWao5jFbWbz9a27T549S3_3rztlhgCTMmCFe0="
    },
    {
      caption: "Salesforce (CRM)",
      img: "http://35.232.154.66:5125/files/tools/1e580c55-a4a2-4176-a2e6-a91a0e71464b.jpg?timestamp=1767333412&nonce=6c96adf26e14c0b9ba5dade1eea7792b&sign=R1bg10XzyadxeuNo__LjcKNtlL7ybl4dZuq4Wjhf-MQ="
    },
    {
      caption: "Zapier (Automation)",
      img: "http://35.232.154.66:5125/files/tools/b68abf58-2f97-4de8-9b0d-3cad0dabb63e.jpg?timestamp=1767333415&nonce=8852ae0f35797acc3f91c1d39a956a4a&sign=DLGL55986SWC8uVmfG0HDbLjpy_-mC82W5nYMKo7Jyk="
    }
  ];

  return (
    <AbsoluteFill style={{ background: "#F0F9FF" }}>
      
      {/* Layer 1: Visual Metaphor - Data Stream Flow (Circuit Board) */}
      <div style={{ 
        position: "absolute", 
        width: "100%", 
        height: "100%", 
        opacity: bgOpacity,
        zIndex: 0
      }}>
        <IndCircuitBoard 
          title=""
          components={[
            { id: "analytics", type: "chip", x: 200, y: 300, label: "DATA" },
            { id: "crm", type: "chip", x: 960, y: 540, label: "CRM" },
            { id: "auto", type: "chip", x: 1720, y: 300, label: "AUTO" }
          ]}
          signals={[
            { from: "analytics", to: "crm", color: theme.colors.primary },
            { from: "crm", to: "auto", color: theme.colors.accent },
            { from: "auto", to: "analytics", color: theme.colors.secondary }
          ]}
          showLabels={false}
          seed="power-stack-flow"
        />
      </div>

      {/* Layer 2: Essential Info - The Power Stack Grid */}
      {/* Starts at 4s (120 frames) */}
      <Sequence from={120}>
        <GridLayout
          columns={3}
          gap={40}
          items={tools.map((tool) => ({
            content: (
              <CardGlassmorphism
                title={tool.caption.split(' ')[0]} // Extract main name
                eyebrow={tool.caption.split('(')[1]?.replace(')', '') || "Tool"} // Extract category
                content={
                  <div style={{ 
                    display: "flex", 
                    justifyContent: "center", 
                    alignItems: "center",
                    height: 200,
                    overflow: "hidden",
                    borderRadius: 12,
                    marginTop: 16
                  }}>
                    <Img 
                      src={tool.img} 
                      style={{ 
                        width: "100%", 
                        height: "100%", 
                        objectFit: "cover" 
                      }} 
                    />
                  </div>
                }
                align="center"
              />
            ),
            animation: "pop",
          }))}
          staggerDelay={10}
        />
      </Sequence>

      {/* Layer 3: Title Overlay (Optional, for context before grid appears) */}
      <Sequence from={0} durationInFrames={120}>
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          opacity: interpolate(frame, [0, 30, 100, 120], [0, 1, 1, 0])
        }}>
          <h1 style={{
            fontSize: 80,
            fontFamily: theme.fonts.heading,
            color: theme.colors.primary,
            marginBottom: 20,
            textShadow: "0 4px 30px rgba(37, 99, 235, 0.2)"
          }}>
            The Power Stack
          </h1>
          <p style={{
            fontSize: 32,
            fontFamily: theme.fonts.body,
            color: theme.colors.textSecondary
          }}>
            Integration & Automation
          </p>
        </div>
      </Sequence>

      {/* Subtitles */}
      <Subtitle 
        text="To scale, integrate Analytics with Tableau, manage clients via Salesforce, and automate workflows using Zapier."
        startFrame={0}
        durationInFrames={240}
      />
    </AbsoluteFill>
  );
}
