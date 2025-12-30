import React from "react";
import { AbsoluteFill, Img, useCurrentFrame, interpolate, Sequence } from "remotion";
import { 
  GridLayout, 
  TitleHandwritten, 
  Subtitle,
  CardNeumorphism, // Using Neumorphism for a more "paper-like" solid feel fitting historical theme
  SafeArea
} from "../components";
import { useTheme } from "../contexts/ThemeContext";

/**
 * Scene 6: Illustrate cultural nationalism.
 * 
 * Target: Illustrate cultural nationalism through visual symbols (Bharat Mata, Flag) and folklore.
 * Layout: Grid Collage
 * Duration: 15 seconds (450 frames)
 * 
 * Components:
 * - Image Grid (Bharat Mata, Swaraj Flag)
 * - Kinetic Typography ("Reviving Folklore & History")
 */
export default function Scene6() {
  const theme = useTheme();
  const frame = useCurrentFrame();
  
  // Configuration from JSON
  const durationInFrames = 450; // 15s * 30fps
  const backgroundUrl = "https://server.x-pilot.ai/static/meta-doc/zip/6848983ab881878abaadf19c18e0cf86/images/43d1ae4334b23af258398fb5c45e6078a56b90d8f733fa90608e59a177327d84.jpg";
  
  // Colors from palette
  const primaryColor = "#FF9933";
  const secondaryColor = "#138808";
  const accentColor = "#000080";
  const textColor = "#2C2C2C";

  // Animation: Background Parallax (Slow Zoom)
  const bgScale = interpolate(frame, [0, durationInFrames], [1, 1.1]);

  // Animation: Grid Entry (Fade In + Zoom)
  const gridOpacity = interpolate(frame, [10, 40], [0, 1], { extrapolateRight: "clamp" });
  const gridScale = interpolate(frame, [10, 40], [0.9, 1], { extrapolateRight: "clamp" });

  // Animation: Text Entry (Wipe Right / Mask Reveal)
  // We'll use the TitleHandwritten component which has built-in drawing animation, fitting the "ink" theme
  
  return (
    <AbsoluteFill style={{ backgroundColor: "#F4E4BC" }}>
      {/* Background Layer */}
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <Img
          src={backgroundUrl}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${bgScale})`,
            opacity: 0.3, // Lower opacity to let content pop
            filter: "sepia(0.8) contrast(1.1)", // Historical filter
          }}
        />
        {/* Texture Overlay (Simulated with CSS) */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "url('https://www.transparenttextures.com/patterns/aged-paper.png')",
          opacity: 0.4,
          mixBlendMode: "multiply"
        }} />
      </AbsoluteFill>

      <SafeArea>
        {/* Main Content: Image Grid */}
        <Sequence from={15}>
          <div style={{ 
            opacity: gridOpacity, 
            transform: `scale(${gridScale})`,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center"
          }}>
            <h2 style={{
              fontFamily: theme.fonts.heading,
              color: accentColor,
              textAlign: "center",
              fontSize: 42,
              marginBottom: 40,
              textShadow: "1px 1px 2px rgba(0,0,0,0.1)"
            }}>
              Symbols of Unity
            </h2>

            <GridLayout
              columns={2}
              gap={40}
              items={[
                {
                  content: (
                    <CardNeumorphism
                      title="Bharat Mata"
                      content={
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                          <div style={{ 
                            width: "100%", 
                            height: 300, 
                            overflow: "hidden", 
                            borderRadius: 8,
                            border: "2px solid #e5e5e5"
                          }}>
                            <Img 
                              src="https://server.x-pilot.ai/static/meta-doc/zip/6848983ab881878abaadf19c18e0cf86/images/43d1ae4334b23af258398fb5c45e6078a56b90d8f733fa90608e59a177327d84.jpg"
                              style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                          </div>
                          <div style={{ fontSize: 16, color: textColor, fontStyle: "italic", textAlign: "center" }}>
                            Ascetic Figure by Abanindranath Tagore
                          </div>
                        </div>
                      }
                      variant="raised"
                      accentColor={primaryColor}
                      style={{ height: "100%" }}
                    />
                  ),
                  animation: "pop-in",
                  delay: 0
                },
                {
                  content: (
                    <CardNeumorphism
                      title="Swaraj Flag"
                      content={
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                          <div style={{ 
                            width: "100%", 
                            height: 300, 
                            overflow: "hidden", 
                            borderRadius: 8,
                            border: "2px solid #e5e5e5"
                          }}>
                            <Img 
                              src="http://35.232.154.66:5125/files/tools/20fd8118-4a80-4688-8f85-608bc3b8c60c.jpg?timestamp=1767022368&nonce=881a5fef6e3c6f8014452f928ffc9375&sign=3mnbfFvodvGR4dU3a1SMgU6HEe38PeTdFlEhpAGYlCY="
                              style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                          </div>
                          <div style={{ fontSize: 16, color: textColor, fontStyle: "italic", textAlign: "center" }}>
                            Symbol of Defiance & Self-Rule
                          </div>
                        </div>
                      }
                      variant="raised"
                      accentColor={secondaryColor}
                      style={{ height: "100%" }}
                    />
                  ),
                  animation: "pop-in",
                  delay: 15
                }
              ]}
            />
          </div>
        </Sequence>

        {/* Overlay Text: Folklore & History */}
        {/* Using TitleHandwritten to match the "Ink/Sketch" aesthetic */}
        <Sequence from={200} durationInFrames={250}>
          <div style={{
            position: "absolute",
            bottom: 120,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            zIndex: 10
          }}>
            <div style={{
              background: "rgba(255, 255, 255, 0.9)",
              padding: "20px 40px",
              borderRadius: 16,
              boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
              border: `1px solid ${primaryColor}`
            }}>
              <TitleHandwritten
                text="Reviving Folklore & History"
                subtitle="Instilling pride in India's past"
                color={accentColor}
                strokeWidth={3}
                size={50}
              />
            </div>
          </div>
        </Sequence>

        {/* Subtitles */}
        <Subtitle
          text="Nationalism also grew through culture. Abanindranath Tagore painted Bharat Mata as an ascetic figure. Folklore was revived, and the tricolour flag became a symbol of defiance. History was reinterpreted to instill pride in India's past."
          startFrame={0}
          durationInFrames={450}
          variant="solid"
          emphasisWords={["culture", "Bharat Mata", "Folklore", "flag", "pride"]}
        />
      </SafeArea>
    </AbsoluteFill>
  );
}
