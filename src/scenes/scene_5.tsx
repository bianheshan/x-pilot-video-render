import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Sequence, Img } from "remotion";
import { 
  LogicComparisonSlider, 
  CardGlassmorphism, 
  Subtitle 
} from "../components";
import { useTheme } from "../contexts/ThemeContext";

/**
 * Scene 5: Bursectomy Step
 * Target: Do: Observe the Bursectomy step.
 * Duration: 7.0s (210 frames)
 * 
 * Visual Strategy:
 * - Use LogicComparisonSlider to simulate the "cleaning" action of the bursectomy.
 * - "Before" side represents the inflamed tissue (red overlay).
 * - "After" side represents the clean anatomical view.
 * - The slider movement mimics the shaver tool removing the tissue.
 */
export default function Scene5() {
  const theme = useTheme();
  const frame = useCurrentFrame();
  
  // Constants
  const DURATION = 210; // 7 seconds
  const BG_IMAGE = "https://cdn.shopify.com/s/files/1/0604/3536/5939/files/release_ant_480x480.jpg?v=1732546396";
  const PRIMARY_COLOR = "#0077B6";
  const ACCENT_COLOR = "#E63946";
  
  // Animation for the card entry
  const cardOpacity = interpolate(frame, [10, 30], [0, 1], { extrapolateRight: "clamp" });
  const cardSlide = interpolate(frame, [10, 30], [50, 0], { extrapolateRight: "clamp" });

  // Custom "Before" content: Image with red inflamed overlay
  const InflamedView = () => (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <Img 
        src={BG_IMAGE} 
        style={{ width: "100%", height: "100%", objectFit: "cover" }} 
      />
      <div style={{ 
        position: "absolute", 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        backgroundColor: ACCENT_COLOR, 
        opacity: 0.4,
        mixBlendMode: "multiply",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div style={{
          color: "white",
          fontWeight: "bold",
          fontSize: 32,
          textShadow: "0 2px 4px rgba(0,0,0,0.5)",
          opacity: 0.8
        }}>
          Inflamed Tissue
        </div>
      </div>
    </div>
  );

  // Custom "After" content: Clean image
  const CleanView = () => (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <Img 
        src={BG_IMAGE} 
        style={{ width: "100%", height: "100%", objectFit: "cover" }} 
      />
      <div style={{
        position: "absolute",
        bottom: 200,
        right: 60,
        color: "white",
        fontWeight: "bold",
        fontSize: 24,
        textShadow: "0 2px 4px rgba(0,0,0,0.5)",
        opacity: 0.6
      }}>
        Clean Surface
      </div>
    </div>
  );

  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.background }}>
      
      {/* 1. Main Visual: Comparison Slider mimicking the Shaver Tool */}
      {/* The slider wipes from left to right, "removing" the red inflamed layer */}
      <Sequence from={0} durationInFrames={DURATION}>
        <LogicComparisonSlider 
          title="" // Hide default title to use custom card
          beforeContent={<InflamedView />}
          afterContent={<CleanView />}
          beforeLabel="Inflamed Bursa"
          afterLabel="Decompressed"
          initialPosition={0.05} // Start mostly covered (red)
          autoAnimate={true} // Automatically animates to 100%
          handleColor={theme.colors.text}
        />
      </Sequence>

      {/* 2. Info Card: Step Description */}
      <Sequence from={10} durationInFrames={DURATION - 10}>
        <div style={{
          position: "absolute",
          top: 60,
          left: 60,
          opacity: cardOpacity,
          transform: `translateY(${cardSlide}px)`,
          zIndex: 10
        }}>
          <CardGlassmorphism 
            title="Step 1: Bursectomy"
            content="Removal of inflamed bursal tissue to visualize the rotator cuff."
            icon="trash-2"
            accentColor={ACCENT_COLOR}
            eyebrow="Surgical Procedure"
            cardStyle={{
              backdropFilter: "blur(12px)",
              backgroundColor: "rgba(255, 255, 255, 0.85)",
              border: `1px solid ${PRIMARY_COLOR}40`,
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)"
            }}
          />
        </div>
      </Sequence>

      {/* 3. Subtitles */}
      <Sequence from={0} durationInFrames={DURATION}>
        <Subtitle 
          text="First, a bursectomy is performed. A shaver carefully removes the inflamed tissue to clear the view."
          startFrame={0}
          durationInFrames={210} // Full scene duration
        />
      </Sequence>
      
    </AbsoluteFill>
  );
}
