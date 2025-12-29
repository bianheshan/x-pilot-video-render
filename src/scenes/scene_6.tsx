import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { ListStaggeredEntry, Subtitle } from "../components";
import { useTheme } from "../contexts/ThemeContext";

/**
 * Scene 6: Reiterate general safety rules.
 * Target: Reiterate general safety rules.
 * Layout: main-content.center
 * Duration: 6.0 seconds (180 frames)
 * 
 * Components:
 * - S6_List: General Safety List (Bullet Points)
 * 
 * Timeline:
 * - 0s-6s: List items appear one by one (fade-in-up-staggered)
 */
export default function Scene6() {
  const theme = useTheme();

  return (
    <AbsoluteFill style={{ backgroundColor: "#ffffff" }}>
      {/* 
        Main Content: General Safety List
        Using ListStaggeredEntry to handle the "fade-in-up-staggered" animation intent.
        Mapping JSON icons to emojis for visual consistency within the text component.
      */}
      <Sequence from={0} durationInFrames={180}>
        <div style={{ 
          width: "100%",
          height: "100%",
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center",
          padding: 60
        }}>
          <div style={{ width: "100%", maxWidth: 800 }}>
            <ListStaggeredEntry 
              title="General Safety"
              items={[
                "✅ Wear a helmet",
                "✅ Ride carefully",
                "✅ Follow traffic rules"
              ]}
            />
          </div>
        </div>
      </Sequence>

      {/* Subtitles - Synced with the voiceover and list appearance */}
      <Subtitle 
        text="You should wear a helmet."
        startFrame={0}
        durationInFrames={60}
      />
      <Subtitle 
        text="You should ride carefully."
        startFrame={60}
        durationInFrames={60}
      />
      <Subtitle 
        text="You should follow traffic rules."
        startFrame={120}
        durationInFrames={60}
      />
    </AbsoluteFill>
  );
}
