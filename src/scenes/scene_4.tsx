import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Sequence, Img } from "remotion";
import { 
  AnimatedSplitScreen, 
  LogicVennDynamic, 
  StatRollingCounter, 
  CardGlassmorphism, 
  Subtitle 
} from "../components";
import { useTheme } from "../contexts/ThemeContext";

/**
 * Scene 4: The Non-Cooperation Movement
 * Target: Explain the Non-Cooperation Movement strategy: Khilafat unity and economic boycott.
 * 
 * Layout: Split Screen (Vertical)
 * - Top: Visual Metaphor for Unity (Venn Diagram merging)
 * - Bottom: Economic Impact (Stats + Image)
 * 
 * Duration: 15 seconds (450 frames)
 */
export default function Scene4() {
  const theme = useTheme();
  const frame = useCurrentFrame();
  
  // Colors from JSON config
  const primaryColor = "#FF9933"; // Saffron
  const secondaryColor = "#138808"; // Green
  const accentColor = "#000080"; // Navy
  const textColor = "#2C2C2C";
  
  // Timeline Control
  // 0-7s: Focus on Unity (Top)
  // 7-15s: Focus on Boycott (Bottom)
  const unityDuration = 210; // 7s
  
  // --- Top Section: Unity Metaphor (Venn Diagram) ---
  // Animate intersection size to simulate merging
  const intersectionSize = interpolate(
    frame,
    [20, 150],
    [0, 50], // From separate to merged
    { extrapolateRight: "clamp" }
  );

  const TopContent = () => (
    <div style={{ 
      width: "100%", 
      height: "100%", 
      display: "flex", 
      flexDirection: "column", 
      justifyContent: "center", 
      alignItems: "center",
      padding: 40
    }}>
      <h2 style={{
        fontFamily: theme.fonts.heading,
        color: textColor,
        fontSize: 32,
        marginBottom: 20,
        opacity: interpolate(frame, [10, 40], [0, 1])
      }}>
        Hindu-Muslim Unity
      </h2>
      <div style={{ width: "100%", height: 300 }}>
        <LogicVennDynamic 
          sets={[
            { name: "Khilafat", size: 100, color: secondaryColor },
            { name: "Swaraj", size: 100, color: primaryColor }
          ]}
          intersections={[
            { sets: [0, 1], size: intersectionSize }
          ]}
        />
      </div>
      <p style={{
        fontFamily: theme.fonts.body,
        color: accentColor,
        fontSize: 24,
        marginTop: 10,
        fontWeight: "bold",
        opacity: interpolate(frame, [100, 130], [0, 1])
      }}>
        Non-Cooperation Alliance
      </p>
    </div>
  );

  // --- Bottom Section: Boycott Impact ---
  // Slide up animation for entrance
  const bottomSlideUp = interpolate(
    frame,
    [unityDuration, unityDuration + 30],
    [100, 0],
    { extrapolateRight: "clamp" }
  );
  
  const bottomOpacity = interpolate(
    frame,
    [unityDuration, unityDuration + 30],
    [0, 1],
    { extrapolateRight: "clamp" }
  );

  const BottomContent = () => (
    <div style={{ 
      width: "100%", 
      height: "100%", 
      display: "flex", 
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-evenly",
      padding: "20px 60px",
      transform: `translateY(${bottomSlideUp}px)`,
      opacity: bottomOpacity
    }}>
      {/* Left: Statistics */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <StatRollingCounter 
          targetValue={57}
          prefix="Rs "
          suffix=" Cr"
          label="Foreign Cloth Imports"
          durationInFrames={90}
          seed="boycott-stats"
        />
        <div style={{ 
          marginTop: 10, 
          color: "#d32f2f", 
          fontFamily: theme.fonts.body,
          fontSize: 18,
          fontWeight: 600,
          background: "rgba(255,255,255,0.8)",
          padding: "4px 12px",
          borderRadius: 4
        }}>
          📉 Dropped from 102 Crore
        </div>
      </div>

      {/* Divider */}
      <div style={{ width: 2, height: "60%", background: "rgba(0,0,0,0.1)", margin: "0 40px" }} />

      {/* Right: Image */}
      <div style={{ flex: 1 }}>
        <CardGlassmorphism 
          title="Economic Boycott"
          content={
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Img 
                src="https://server.x-pilot.ai/static/meta-doc/zip/6848983ab881878abaadf19c18e0cf86/images/48203247492598e425b9506a4d3671493b19efa9813ae0448be492e09e4fbce5.jpg"
                style={{ width: "100%", borderRadius: 8, height: 160, objectFit: "cover" }}
              />
              <span style={{ fontSize: 14, opacity: 0.8 }}>July 1922: Bonfire of foreign cloth</span>
            </div>
          }
          accentColor={primaryColor}
        />
      </div>
    </div>
  );

  return (
    <AbsoluteFill style={{ 
      background: "linear-gradient(to bottom, #F4E4BC, #FFFFFF)"
    }}>
      {/* Main Layout: Vertical Split Screen */}
      <AnimatedSplitScreen 
        left={<TopContent />}
        right={<BottomContent />}
        direction="vertical"
        ratio={0.45} // Top takes 45%, Bottom takes 55%
        animation="slide"
        animationDuration={30}
        showDivider={true}
        labelLeft="Political Unity"
        labelRight="Economic Impact"
      />

      {/* Subtitles */}
      <Subtitle 
        text="To build a broad movement, Gandhi linked the Khilafat issue to Swaraj, uniting Hindus and Muslims."
        startFrame={0}
        durationInFrames={210}
      />
      
      <Subtitle 
        text="The Non-Cooperation Movement began in 1921. Foreign goods were boycotted, and the import of foreign cloth halved."
        startFrame={210}
        durationInFrames={240}
      />
    </AbsoluteFill>
  );
}
