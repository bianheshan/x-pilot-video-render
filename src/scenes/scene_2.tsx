import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Sequence } from "remotion";
import { 
  AnimatedSplitScreen, 
  LogicFlowPath, 
  CardGlassmorphism, 
  Subtitle 
} from "../components";
import { useTheme } from "../contexts/ThemeContext";

/**
 * Scene 2: Explain grammatical category (Modal Verb).
 * Layout: Split Screen Vertical (Top: Structure, Bottom: Definition)
 * Duration: 8.5 seconds (255 frames)
 */
export default function Scene2() {
  const theme = useTheme();
  const frame = useCurrentFrame();

  // Color Palette from JSON
  const primaryColor = "#3498db";
  const secondaryColor = "#2ecc71";
  const accentColor = "#e74c3c";
  const textPrimary = "#2c3e50";

  // Subtitles Data
  const subtitles = [
    { text: "The word should is a modal verb.", start: 0, end: 3.0 },
    { text: "A modal verb helps another verb.", start: 3.0, end: 5.5 },
    { text: "Should tells us what is a good idea.", start: 5.5, end: 8.5 },
  ];

  // Top Content: Grammar Structure Schematic
  // Using LogicFlowPath to represent: Subject -> Modal Verb (Should) -> Main Verb
  const TopContent = () => (
    <div style={{ 
      width: "100%", 
      height: "100%", 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center",
      padding: 40 
    }}>
      <LogicFlowPath 
        steps={[
          { id: "1", label: "Subject", type: "start" },
          { id: "2", label: "Modal Verb\n(Should)", type: "process" },
          { id: "3", label: "Main Verb", type: "end" }
        ]}
        connections={[
          { from: "1", to: "2" },
          { from: "2", to: "3" }
        ]}
      />
    </div>
  );

  // Bottom Content: Helper/Definition Quote
  // Using CardGlassmorphism for the "Grammar Rule"
  const BottomContent = () => (
    <div style={{ 
      width: "100%", 
      height: "100%", 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center",
      padding: 60 
    }}>
      <CardGlassmorphism 
        title="Grammar Rule"
        content="A modal verb helps another verb."
        icon="📘"
      />
    </div>
  );

  return (
    <AbsoluteFill style={{ 
      background: "linear-gradient(to bottom, #ffffff, #e6e9f0)" 
    }}>
      {/* Main Layout: Vertical Split Screen */}
      <Sequence from={0} durationInFrames={255}>
        <AnimatedSplitScreen 
          left={<TopContent />}   // In vertical mode, 'left' is typically Top
          right={<BottomContent />} // In vertical mode, 'right' is typically Bottom
          direction="vertical"
          ratio={0.5}
          animation="slide"
          animationDuration={30}
          dividerColor="rgba(44, 62, 80, 0.1)"
        />
      </Sequence>

      {/* Subtitles Overlay */}
      {subtitles.map((sub, index) => {
        const startFrame = sub.start * 30;
        const durationFrames = (sub.end - sub.start) * 30;
        return (
          <Sequence key={index} from={startFrame} durationInFrames={durationFrames}>
            <Subtitle 
              text={sub.text}
              startFrame={0} // Relative to Sequence
              durationInFrames={durationFrames}
            />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
}
