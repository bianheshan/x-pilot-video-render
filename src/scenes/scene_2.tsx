import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { SafeArea, Subtitle } from "../components";
import { useTheme } from "../contexts/ThemeContext";
import { Users, Settings, BadgeCheck, Package, Tag, MapPin, Megaphone } from "lucide-react";

/**
 * Scene 2: The Marketing Mix (7 Ps)
 * Target: Explain the Marketing Mix (4 Ps + 3 Modern Ps)
 * Duration: 38s (approx 1140 frames at 30fps)
 */
export default function Scene2() {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const theme = useTheme();

  // ------------------------------------------------------------------
  // 1. Configuration & Data
  // ------------------------------------------------------------------
  const SCENE_START_SECONDS = 22.0;
  
  // Colors from config
  const primaryColor = "#0056D2";
  const accentColor = "#00C896";
  const textColor = "#1A1A1A";
  
  // The 4 Ps Data
  const corePs = [
    { 
      id: "product", 
      label: "Product", 
      icon: Package, 
      details: ["Features", "Quality"],
      color: "#3B82F6",
      appearTime: 6.5 // Relative seconds
    },
    { 
      id: "price", 
      label: "Price", 
      icon: Tag, 
      details: ["Strategy", "Value"],
      color: "#10B981",
      appearTime: 10.0 
    },
    { 
      id: "place", 
      label: "Place", 
      icon: MapPin, 
      details: ["Online", "Retail"],
      color: "#F59E0B",
      appearTime: 15.0 
    },
    { 
      id: "promotion", 
      label: "Promotion", 
      icon: Megaphone, 
      details: ["Ads", "Social"],
      color: "#EF4444",
      appearTime: 19.0 
    },
  ];

  // The Extra 3 Ps Data
  const extraPs = [
    { label: "People", icon: Users, sub: "Staff & Culture" },
    { label: "Process", icon: Settings, sub: "Delivery System" },
    { label: "Physical Evidence", icon: BadgeCheck, sub: "Branding" },
  ];

  // ------------------------------------------------------------------
  // 2. Animations
  // ------------------------------------------------------------------
  
  // Root node "Marketing Mix" appears immediately or slightly after start
  const rootScale = spring({
    frame: frame - 10,
    fps,
    config: { damping: 12 },
  });

  // Extra Ps section slide-in time (relative 23s)
  const extraPsStartFrame = 23 * fps;
  const extraPsProgress = spring({
    frame: frame - extraPsStartFrame,
    fps,
    config: { damping: 15 },
  });
  
  const extraPsOpacity = interpolate(frame, [extraPsStartFrame, extraPsStartFrame + 20], [0, 1], { extrapolateRight: "clamp" });
  const extraPsTranslateY = interpolate(extraPsProgress, [0, 1], [100, 0]);

  // ------------------------------------------------------------------
  // 3. Render Helpers
  // ------------------------------------------------------------------

  const renderBranch = (item: typeof corePs[0], index: number) => {
    const startFrame = item.appearTime * fps;
    const progress = spring({
      frame: frame - startFrame,
      fps,
      config: { stiffness: 80, damping: 15 }
    });
    
    // Scale animation for the node
    const scale = interpolate(progress, [0, 1], [0, 1]);
    const opacity = interpolate(progress, [0, 1], [0, 1]);

    // Line drawing animation
    const lineLength = interpolate(progress, [0, 1], [0, 100]);

    return (
      <div 
        key={item.id}
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          opacity,
          transform: `scale(${scale})`,
        }}
      >
        {/* Connector Line (Visual only, simple vertical line from top) */}
        <div style={{
          position: "absolute",
          top: -40,
          left: "50%",
          width: 2,
          height: 40,
          background: "#CBD5E1",
          transformOrigin: "top",
          transform: `scaleY(${lineLength / 100})`,
        }} />

        {/* Card */}
        <div style={{
          background: "white",
          borderRadius: 16,
          padding: 24,
          width: "100%",
          maxWidth: 220,
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          borderTop: `4px solid ${item.color}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
          zIndex: 2
        }}>
          <div style={{
            background: `${item.color}20`,
            padding: 12,
            borderRadius: "50%",
            color: item.color
          }}>
            <item.icon size={32} strokeWidth={2.5} />
          </div>
          <h3 style={{ 
            margin: 0, 
            fontFamily: theme.fonts.heading, 
            fontSize: 24,
            color: textColor 
          }}>
            {item.label}
          </h3>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
            {item.details.map(d => (
              <span key={d} style={{
                fontSize: 14,
                fontFamily: theme.fonts.body,
                background: "#F1F5F9",
                padding: "4px 8px",
                borderRadius: 4,
                color: "#64748B"
              }}>
                {d}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <AbsoluteFill style={{ 
      background: "linear-gradient(to bottom, #f0f4f8, #ffffff)",
      overflow: "hidden"
    }}>
      <SafeArea padding={60} paddingBottom={160} style={{ display: "flex", flexDirection: "column" }}>
        
        {/* TOP HALF: The 4 Ps (Mindmap Tree) */}
        <div style={{ 
          flex: 1.2, // Takes up more space initially
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center",
          justifyContent: "center",
          gap: 40
        }}>
          
          {/* Root Node */}
          <div style={{
            transform: `scale(${rootScale})`,
            background: primaryColor,
            color: "white",
            padding: "16px 40px",
            borderRadius: 50,
            fontSize: 36,
            fontFamily: theme.fonts.heading,
            fontWeight: "bold",
            boxShadow: "0 10px 25px rgba(0,86,210,0.3)",
            zIndex: 10,
            position: "relative"
          }}>
            The Marketing Mix
            
            {/* Horizontal Connector Bar */}
            <div style={{
              position: "absolute",
              bottom: -20,
              left: "10%",
              right: "10%",
              height: 2,
              background: "#CBD5E1",
              zIndex: -1
            }} />
            {/* Vertical Connector from Root to Bar */}
            <div style={{
              position: "absolute",
              bottom: -20,
              left: "50%",
              width: 2,
              height: 20,
              background: "#CBD5E1",
              zIndex: -1
            }} />
          </div>

          {/* Branches Row */}
          <div style={{ 
            display: "flex", 
            width: "100%", 
            justifyContent: "space-between",
            gap: 20,
            paddingTop: 20 // Space for connectors
          }}>
            {corePs.map((p, i) => renderBranch(p, i))}
          </div>
        </div>

        {/* BOTTOM HALF: The Extra 3 Ps (Modern Additions) */}
        <div style={{ 
          flex: 0.8,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          opacity: extraPsOpacity,
          transform: `translateY(${extraPsTranslateY}px)`
        }}>
          <div style={{ 
            background: "rgba(255,255,255,0.6)", 
            backdropFilter: "blur(10px)",
            borderRadius: 24,
            padding: 30,
            border: "1px solid rgba(0,0,0,0.05)"
          }}>
            <h2 style={{
              fontFamily: theme.fonts.heading,
              fontSize: 28,
              color: primaryColor,
              marginBottom: 24,
              display: "flex",
              alignItems: "center",
              gap: 12
            }}>
              <span style={{ width: 8, height: 28, background: accentColor, borderRadius: 4 }} />
              Modern Additions
            </h2>

            <div style={{ display: "flex", gap: 30 }}>
              {extraPs.map((p, i) => (
                <div key={p.label} style={{ 
                  flex: 1, 
                  display: "flex", 
                  alignItems: "center", 
                  gap: 16,
                  background: "white",
                  padding: 20,
                  borderRadius: 16,
                  boxShadow: "0 4px 15px rgba(0,0,0,0.03)"
                }}>
                  <div style={{
                    background: "#F0F9FF",
                    padding: 12,
                    borderRadius: 12,
                    color: primaryColor
                  }}>
                    <p.icon size={28} />
                  </div>
                  <div>
                    <div style={{ fontFamily: theme.fonts.heading, fontSize: 20, fontWeight: "bold", color: textColor }}>
                      {p.label}
                    </div>
                    <div style={{ fontFamily: theme.fonts.body, fontSize: 16, color: "#64748B" }}>
                      {p.sub}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </SafeArea>

      {/* Subtitles */}
      {/* 
        S2_SUB1: 22.0 - 28.5 (6.5s) -> 0 - 195 frames
        S2_SUB2: 28.5 - 37.0 (8.5s) -> 195 - 450 frames
        S2_SUB3: 37.0 - 45.0 (8.0s) -> 450 - 690 frames
        S2_SUB4: 45.0 - 55.0 (10.0s) -> 690 - 990 frames
        S2_SUB5: 55.0 - 60.0 (5.0s) -> 990 - 1140 frames
      */}
      <Subtitle 
        text="To build this bridge, marketers use a toolkit known as the Marketing Mix, or the 4 Ps." 
        startFrame={0} 
        durationInFrames={195} 
      />
      <Subtitle 
        text="First is Product: What are you selling and does it solve a problem? Second is Price: Is the value fair?" 
        startFrame={195} 
        durationInFrames={255} 
      />
      <Subtitle 
        text="Third is Place: Where can customers find you? And fourth is Promotion: How do you spread the word?" 
        startFrame={450} 
        durationInFrames={240} 
      />
      <Subtitle 
        text="In the modern world, we often add three more: People, Process, and Physical Evidence, ensuring the entire experience is seamless." 
        startFrame={690} 
        durationInFrames={300} 
      />
      <Subtitle 
        text="When these align, you don't just sell; you serve." 
        startFrame={990} 
        durationInFrames={150} 
      />
    </AbsoluteFill>
  );
}
