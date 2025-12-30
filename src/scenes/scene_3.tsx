import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, spring, Img, useVideoConfig, Sequence } from "remotion";
import { CardGlassmorphism, Subtitle } from "../components";
import { useTheme } from "../contexts/ThemeContext";

/**
 * Scene 3: The Rowlatt Act & Jallianwalla Bagh Massacre
 * 
 * Target: Visualize the oppression of the Rowlatt Act and the horror of Jallianwalla Bagh.
 * Layout: Full-screen immersive with transition from info card to annotated visual.
 * Duration: 14.5 seconds (435 frames)
 * 
 * Components:
 * - S3_C1_Rowlatt: Info Card (The Rowlatt Act)
 * - S3_C2_Massacre_Map: Annotated Image (Jallianwalla Bagh)
 */
export default function Scene3() {
  const theme = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Scene Configuration
  const SCENE_DURATION = 435; // 14.5s * 30fps
  const TRANSITION_FRAME = 180; // Switch around 6s
  
  // Colors from JSON config
  const bgDarkRed = "#220000"; 
  const accentColor = "#FF9933"; // Primary Saffron

  // --- Animation 1: Rowlatt Act Card (Slam Down) ---
  // Spring animation for "slam" effect
  const cardEntrance = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100, mass: 2 }
  });

  const cardTranslateY = interpolate(cardEntrance, [0, 1], [-500, 0]);
  const cardOpacity = interpolate(frame, [TRANSITION_FRAME - 20, TRANSITION_FRAME], [1, 0]);
  const cardScale = interpolate(frame, [TRANSITION_FRAME - 20, TRANSITION_FRAME], [1, 0.8]);

  // --- Animation 2: Massacre Map (Zoom In Slow) ---
  // Starts after the card fades out
  const mapStartFrame = TRANSITION_FRAME - 10;
  const mapDuration = SCENE_DURATION - mapStartFrame;
  
  // Relative frame for the map sequence
  const mapFrame = frame - mapStartFrame;
  
  const mapScale = interpolate(
    mapFrame,
    [0, mapDuration],
    [1.1, 1.3], // Slow zoom in (Ken Burns effect)
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const mapOpacity = interpolate(
    mapFrame,
    [0, 20],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Annotation Animations
  const annotationOpacity = interpolate(
    mapFrame,
    [30, 60],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: bgDarkRed }}>
      
      {/* --- Phase 2: Jallianwalla Bagh Map --- */}
      <Sequence from={mapStartFrame} durationInFrames={mapDuration}>
        <AbsoluteFill style={{ overflow: "hidden" }}>
          {/* Background Image with Zoom */}
          <AbsoluteFill style={{ 
            transform: `scale(${mapScale})`,
            opacity: mapOpacity,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Img 
              src="http://35.232.154.66:5125/files/tools/4b9e5ac9-e7e1-4691-bbb5-81188218f74c.jpg?timestamp=1767022370&nonce=0e00c2a59efefdd0881532fc63be4f20&sign=4qISj-r7_igoHLAfo-btj86KINEwTkVqZQKVRhBgyeE="
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                filter: "sepia(0.4) contrast(1.2)" // Historical feel
              }}
            />
          </AbsoluteFill>

          {/* Annotations Overlay */}
          <AbsoluteFill>
            {/* Annotation 1: Exit Blocked (Top Center) */}
            <div style={{
              position: "absolute",
              top: "20%",
              left: "50%",
              transform: "translateX(-50%)",
              opacity: annotationOpacity,
              backgroundColor: "rgba(0,0,0,0.8)",
              padding: "12px 24px",
              borderRadius: 8,
              border: `2px solid ${theme.colors.error || "#ff4d4f"}`,
              display: "flex",
              alignItems: "center",
              gap: 10
            }}>
              <span style={{ fontSize: 24 }}>🚫</span>
              <span style={{ 
                color: "#fff", 
                fontFamily: theme.fonts.heading,
                fontSize: 24,
                fontWeight: "bold"
              }}>
                Exit Blocked
              </span>
            </div>

            {/* Annotation 2: Unarmed Crowd (Center) */}
            <div style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              opacity: annotationOpacity,
              backgroundColor: "rgba(0,0,0,0.6)",
              padding: "10px 20px",
              borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.3)",
              display: "flex",
              alignItems: "center",
              gap: 10
            }}>
              <span style={{ fontSize: 20 }}>👥</span>
              <span style={{ 
                color: "#fff", 
                fontFamily: theme.fonts.body,
                fontSize: 20
              }}>
                Unarmed Crowd
              </span>
            </div>
          </AbsoluteFill>
        </AbsoluteFill>
      </Sequence>

      {/* --- Phase 1: Rowlatt Act Card --- */}
      <Sequence from={0} durationInFrames={TRANSITION_FRAME}>
        <AbsoluteFill style={{ 
          justifyContent: "center", 
          alignItems: "center",
          opacity: cardOpacity,
          transform: `scale(${cardScale})`
        }}>
          <div style={{ transform: `translateY(${cardTranslateY}px)` }}>
            <CardGlassmorphism
              title="The Rowlatt Act (1919)"
              content={
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <p style={{ margin: 0, fontSize: 24, lineHeight: 1.5 }}>
                    Allowed detention of political prisoners without trial for two years.
                  </p>
                  <div style={{ 
                    marginTop: 20, 
                    padding: "10px 20px", 
                    backgroundColor: "rgba(255,0,0,0.1)", 
                    borderRadius: 8,
                    border: "1px solid rgba(255,0,0,0.3)",
                    color: "#ffcccc",
                    textAlign: "center",
                    fontWeight: "bold"
                  }}>
                    ⚠ SUSPENSION OF CIVIL RIGHTS
                  </div>
                </div>
              }
              icon="🔒"
              accentColor={theme.colors.error || "#ff4d4f"}
              style={{
                width: 600,
                backdropFilter: "blur(20px) saturate(180%)",
                backgroundColor: "rgba(30, 0, 0, 0.6)", // Dark glass
                border: "1px solid rgba(255, 50, 50, 0.2)"
              }}
            />
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Subtitles */}
      <Subtitle
        text="1919 saw the repressive Rowlatt Act, allowing detention without trial. On April 13th, the infamous Jallianwalla Bagh incident occurred. General Dyer blocked the exits and opened fire on a peaceful crowd to produce terror."
        startFrame={0}
        durationInFrames={435}
      />
      
      {/* Vignetee Overlay for atmosphere */}
      <AbsoluteFill style={{
        background: "radial-gradient(circle, transparent 40%, #000 100%)",
        pointerEvents: "none",
        opacity: 0.6
      }} />
    </AbsoluteFill>
  );
}
