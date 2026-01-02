import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Sequence } from "remotion";
import { 
  TechBrowserMockup, 
  LogicGanttTimeline, 
  Subtitle,
  ListBulletPoints
} from "../components";
import { useTheme } from "../contexts/ThemeContext";

/**
 * Scene 3: Communication and Scheduling Tools
 * Target: Explain Communication and Scheduling tools (Slack/Teams vs MS Project/Smartsheet).
 * Layout: Full Screen Immersive (Two-stage transition)
 * Duration: 12 seconds (360 frames)
 * 
 * Timeline:
 * - 0-6s: Communication Tools (Slack Simulation)
 * - 6-12s: Scheduling Tools (Gantt Chart Visualization)
 */
export default function Scene3() {
  const theme = useTheme();
  const frame = useCurrentFrame();
  
  // Define colors from config
  const bgBase = "#F0F9FF"; // from JSON
  const primaryColor = "#2563EB";
  
  // Transition timing (midpoint at 6s = 180 frames)
  const transitionFrame = 180;
  
  // Phase 1 Animation: Enter and Exit
  const phase1Opacity = interpolate(
    frame,
    [0, 30, 150, 180],
    [0, 1, 1, 0],
    { extrapolateRight: "clamp" }
  );
  
  const phase1TranslateY = interpolate(
    frame,
    [0, 30, 150, 180],
    [50, 0, 0, -50],
    { extrapolateRight: "clamp" }
  );

  // Phase 2 Animation: Enter
  const phase2Opacity = interpolate(
    frame,
    [180, 210],
    [0, 1],
    { extrapolateRight: "clamp" }
  );
  
  const phase2Scale = interpolate(
    frame,
    [180, 210],
    [0.9, 1],
    { extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ background: bgBase }}>
      
      {/* Phase 1: Communication Simulation (0-6s) */}
      <Sequence from={0} durationInFrames={180}>
        <AbsoluteFill style={{ 
          justifyContent: "center", 
          alignItems: "center",
          opacity: phase1Opacity,
          transform: `translateY(${phase1TranslateY}px)`
        }}>
          <div style={{ width: "80%", maxWidth: 1000 }}>
            <h2 style={{ 
              textAlign: "center", 
              marginBottom: 40,
              fontSize: 48,
              color: theme.colors.text,
              fontFamily: theme.fonts.heading
            }}>
              Real-time Collaboration
            </h2>
            
            <TechBrowserMockup
              url="https://slack.com/app/project-alpha"
              deviceType="desktop"
              showDevTools={false}
              content={
                <div style={{ padding: 40, background: "white", height: "100%" }}>
                  <div style={{ marginBottom: 20, borderBottom: "1px solid #eee", paddingBottom: 10 }}>
                    <strong style={{ color: "#333" }}># project-updates</strong>
                  </div>
                  <ListBulletPoints 
                    items={[
                      { 
                        title: "Project Manager", 
                        description: "Update on the timeline? We need to ship by Friday.",
                        icon: "👤",
                        accentColor: primaryColor
                      },
                      { 
                        title: "Developer Lead", 
                        description: "Backend is ready. Waiting for QA sign-off.",
                        icon: "👨‍💻",
                        accentColor: theme.colors.success
                      },
                      { 
                        title: "QA Team", 
                        description: "Testing in progress. Found 2 minor bugs.",
                        icon: "🔍",
                        accentColor: theme.colors.warning
                      }
                    ]}
                    style={{ gap: 20 }}
                  />
                </div>
              }
            />
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Phase 2: Gantt Chart Visualization (6-12s) */}
      <Sequence from={180} durationInFrames={180}>
        <AbsoluteFill style={{ 
          justifyContent: "center", 
          alignItems: "center",
          opacity: phase2Opacity,
          transform: `scale(${phase2Scale})`
        }}>
          <div style={{ width: "85%", maxWidth: 1100 }}>
            <h2 style={{ 
              textAlign: "center", 
              marginBottom: 40,
              fontSize: 48,
              color: theme.colors.text,
              fontFamily: theme.fonts.heading
            }}>
              Complex Dependency Management
            </h2>
            
            <div style={{ 
              background: "white", 
              padding: 40, 
              borderRadius: 20,
              boxShadow: "0 10px 30px rgba(0,0,0,0.05)"
            }}>
              <LogicGanttTimeline 
                tasks={[
                  { id: "1", name: "Requirements", start: 0, duration: 20, color: "#3B82F6" },
                  { id: "2", name: "Design Phase", start: 15, duration: 25, color: "#8B5CF6" },
                  { id: "3", name: "Development", start: 35, duration: 40, color: "#10B981" },
                  { id: "4", name: "Testing", start: 70, duration: 20, color: "#F59E0B" },
                  { id: "5", name: "Deployment", start: 85, duration: 10, color: "#EF4444" }
                ]}
              />
              <div style={{ 
                marginTop: 20, 
                textAlign: "center", 
                color: theme.colors.textSecondary,
                fontSize: 18
              }}>
                Visualizing Critical Path & Dependencies
              </div>
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Subtitles */}
      <Subtitle 
        text="For communication, Slack and Microsoft Teams are essential for real-time collaboration."
        startFrame={0}
        durationInFrames={150}
      />
      <Subtitle 
        text="But for complex timelines, you need Gantt tools like Microsoft Project or Smartsheet to visualize dependencies."
        startFrame={150}
        durationInFrames={210}
      />
    </AbsoluteFill>
  );
}
