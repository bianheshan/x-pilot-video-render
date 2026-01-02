import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { SplitScreen, LogicPyramidBuild, ListStaggeredEntry, Subtitle } from "../components";
import { useTheme } from "../contexts/ThemeContext";

/**
 * Scene 6: Selection Framework
 * Target: Provide the Selection Framework (Criteria Pyramid + Process Steps).
 * Layout: Split Screen (Left: Pyramid, Right: Steps)
 * Duration: 13 seconds (approx 390 frames)
 */
export default function Scene6() {
  const theme = useTheme();
  const frame = useCurrentFrame();

  // --- Animations ---

  // Left Side (Pyramid): Enters at 0s
  // "build-up" animation intent -> Fade in + Slide up slightly
  const leftOpacity = interpolate(frame, [0, 30], [0, 1]);
  const leftY = interpolate(frame, [0, 30], [30, 0]);

  // Right Side (Steps): Enters at 6s (180 frames)
  // "slide-in-right" animation intent
  const rightStartFrame = 180;
  const rightOpacity = interpolate(frame, [rightStartFrame, rightStartFrame + 30], [0, 1]);
  const rightX = interpolate(frame, [rightStartFrame, rightStartFrame + 30], [50, 0]);

  return (
    <AbsoluteFill style={{ background: "#FFFFFF" }}>
      <SplitScreen
        ratio={0.5}
        gap={60}
        showDivider={true}
        
        // Left Panel: Criteria Pyramid
        left={
          <div style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: 60,
            opacity: leftOpacity,
            transform: `translateY(${leftY}px)`
          }}>
            <h2 style={{
              fontSize: 42,
              fontWeight: 700,
              color: theme.colors.primary,
              marginBottom: 40,
              textAlign: "center",
              letterSpacing: "-0.02em"
            }}>
              Selection Criteria
            </h2>
            
            <div style={{ 
              flex: 1, 
              maxHeight: 600,
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}>
              <LogicPyramidBuild
                levels={[
                  // Top level
                  { label: "Integration Needs", value: 40, color: "#F59E0B" }, // Accent color for top
                  { label: "Budget", value: 60, color: "#60A5FA" },
                  { label: "Complexity", value: 80, color: "#3B82F6" },
                  // Base level
                  { label: "Team Size", value: 100, color: "#2563EB" } // Primary color base
                ]}
              />
            </div>
            
            <p style={{
              textAlign: "center",
              color: theme.colors.textSecondary,
              marginTop: 20,
              fontSize: 20
            }}>
              Foundation of Decision Making
            </p>
          </div>
        }

        // Right Panel: Selection Process Steps
        right={
          <div style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: 60,
            opacity: rightOpacity,
            transform: `translateX(${rightX}px)`
          }}>
            <ListStaggeredEntry
              title="4-Step Selection Process"
              items={[
                { 
                  title: "1. Assess", 
                  description: "Identify current pain points & bottlenecks.", 
                  icon: "🔍" 
                },
                { 
                  title: "2. Trial", 
                  description: "Test with real projects before committing.", 
                  icon: "🧪" 
                },
                { 
                  title: "3. Scale", 
                  description: "Start with one team, then expand.", 
                  icon: "📈" 
                },
                { 
                  title: "4. Monitor", 
                  description: "Regularly optimize your tool stack.", 
                  icon: "🔄" 
                }
              ]}
              staggerDelay={15} // Stagger internal items
              style={{
                background: "rgba(243, 244, 246, 0.5)", // Light gray backing
                borderRadius: 24,
                padding: 40
              }}
            />
          </div>
        }
      />

      {/* --- Subtitles --- */}
      
      {/* 0s - 5s (approx 150 frames) */}
      <Subtitle
        text="How do you choose? Consider team size, complexity, and budget."
        startFrame={0}
        durationInFrames={150}
        position="bottom"
      />

      {/* 5s - 13s (approx 240 frames) */}
      <Subtitle
        text="Start by assessing needs, running trials, starting small, and monitoring usage to optimize your stack."
        startFrame={150} // Starts right after previous
        durationInFrames={240}
        position="bottom"
      />
    </AbsoluteFill>
  );
}
