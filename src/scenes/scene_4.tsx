import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { AnimatedSplitScreen, LogicFlowPath, CardGlassmorphism, Subtitle } from "../components";
import { useTheme } from "../contexts/ThemeContext";

/**
 * Scene 4: Agile and Resource Management
 * Target: Discuss Agile and Resource Management.
 * Layout: Split Screen Vertical (Top/Bottom)
 * Duration: 11s (330 frames)
 */
export default function Scene4() {
  const theme = useTheme();
  const frame = useCurrentFrame();

  // Animation for Bottom Content (Resource Management)
  // Starts at 5.0s (150 frames)
  const bottomOpacity = interpolate(frame, [150, 180], [0, 1]);
  const bottomY = interpolate(frame, [150, 180], [50, 0]);

  // Agile Loop Animation (Top) - Starts at 0s
  // We'll animate the flow path connections progressively
  
  return (
    <AbsoluteFill style={{ 
      background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)"
    }}>
      <AnimatedSplitScreen
        direction="vertical"
        ratio={0.55} // Give slightly more space to the flow chart
        showDivider={true}
        animation="slide"
        animationDuration={40}
        
        // Top Pane: Agile Sprint Cycle
        left={
          <div style={{ 
            height: "100%", 
            width: "100%", 
            display: "flex", 
            flexDirection: "column", 
            justifyContent: "center", 
            padding: 40 
          }}>
            <h2 style={{ 
              textAlign: "center", 
              color: theme.colors.primary, 
              fontSize: 36,
              marginBottom: 20,
              fontWeight: 700
            }}>
              Agile Sprint Cycle
            </h2>
            
            {/* Constrain height for LogicFlowPath to prevent overflow */}
            <div style={{ flex: 1, position: "relative", minHeight: 0 }}>
              <LogicFlowPath
                title=""
                steps={[
                  { 
                    id: "plan", 
                    label: "Plan", 
                    type: "start",
                    style: { background: "#3b82f6", color: "white" } 
                  },
                  { 
                    id: "design", 
                    label: "Design", 
                    type: "process",
                    style: { border: `2px solid ${theme.colors.secondary}` }
                  },
                  { 
                    id: "develop", 
                    label: "Develop", 
                    type: "process",
                    style: { background: "#2563eb", color: "white" }
                  },
                  { 
                    id: "test", 
                    label: "Test", 
                    type: "process" 
                  },
                  { 
                    id: "deploy", 
                    label: "Deploy", 
                    type: "end",
                    style: { background: theme.colors.accent, color: "white" }
                  }
                ]}
                connections={[
                  { from: "plan", to: "design", animated: frame > 15 },
                  { from: "design", to: "develop", animated: frame > 45 },
                  { from: "develop", to: "test", animated: frame > 75 },
                  { from: "test", to: "deploy", animated: frame > 105 },
                  // The iterative loop back
                  { 
                    from: "deploy", 
                    to: "plan", 
                    label: "Iterate", 
                    dashed: true, 
                    animated: frame > 135,
                    style: { stroke: theme.colors.accent }
                  }
                ]}
                layout="auto-grid"
                columns={3} // Creates a nice cycle layout
              />
            </div>
          </div>
        }
        
        // Bottom Pane: Resource Management
        right={
          <div style={{ 
            height: "100%", 
            width: "100%",
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center", 
            padding: 40,
            opacity: bottomOpacity,
            transform: `translateY(${bottomY}px)`
          }}>
            <CardGlassmorphism
              title="Resource Management"
              description="Prevent burnout and optimize team utilization."
              icon="users"
              accentColor={theme.colors.accent}
              eyebrow="Team Health"
              statLabel="Capacity"
              statValue="100%"
              style={{ maxWidth: 600, width: "100%" }}
            />
          </div>
        }
      />

      {/* Subtitles synced with global timeline */}
      {/* S4_SUB1: 35.0s - 40.0s (Global) -> 0s - 5s (Local) */}
      <Subtitle
        text="Software teams thrive with Agile tools like Jira and Monday.com to track sprints."
        startFrame={0}
        durationInFrames={150}
      />

      {/* S4_SUB2: 40.0s - 46.0s (Global) -> 5s - 11s (Local) */}
      <Subtitle
        text="Simultaneously, tools like Resource Guru help you manage team capacity and prevent burnout."
        startFrame={150}
        durationInFrames={180}
      />
    </AbsoluteFill>
  );
}
