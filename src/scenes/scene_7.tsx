import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { Check, CheckCircle } from "lucide-react";
import { SafeArea, Subtitle } from "../components";
import { useTheme } from "../contexts/ThemeContext";

/**
 * Scene 7: Summary & CTA
 * Target: Recap main points and close
 * Duration: 22s (200.0s - 222.0s)
 */
export default function Scene7() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = useTheme();

  // Scene configuration
  const sceneStartSeconds = 200.0;
  const points = [
    { text: "Marketing is Connection", icon: "connection" },
    { text: "Master the 4 Ps", icon: "grid" },
    { text: "Know Your Audience", icon: "users" },
    { text: "Measure Everything", icon: "chart" },
  ];

  // Colors from config
  const primaryColor = "#0056D2";
  const accentColor = "#00C896";
  const textColor = "#1A1A1A";

  // Title Animation
  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const titleY = interpolate(frame, [0, 20], [20, 0], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        background: "radial-gradient(circle, #ffffff, #e6e6e6)",
        overflow: "hidden",
      }}
    >
      {/* Background Decoration (Subtle rings) */}
      <AbsoluteFill style={{ zIndex: 0 }}>
        <svg width="100%" height="100%" style={{ opacity: 0.05 }}>
          <circle cx="50%" cy="50%" r="400" stroke={primaryColor} strokeWidth="2" fill="none" />
          <circle cx="50%" cy="50%" r="600" stroke={primaryColor} strokeWidth="2" fill="none" />
        </svg>
      </AbsoluteFill>

      <SafeArea padding={60} paddingBottom={160} style={{ zIndex: 1 }}>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 60,
          }}
        >
          {/* Title */}
          <div
            style={{
              opacity: titleOpacity,
              transform: `translateY(${titleY}px)`,
              textAlign: "center",
            }}
          >
            <h1
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontSize: 72,
                fontWeight: 800,
                color: primaryColor,
                margin: 0,
                marginBottom: 16,
              }}
            >
              Marketing 101 Recap
            </h1>
            <div
              style={{
                width: 120,
                height: 6,
                background: accentColor,
                margin: "0 auto",
                borderRadius: 3,
              }}
            />
          </div>

          {/* Bullet Points */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 32,
              width: "100%",
              maxWidth: 800,
            }}
          >
            {points.map((point, index) => {
              // Staggered animation for each point
              const delay = 20 + index * 15;
              const progress = spring({
                frame: frame - delay,
                fps,
                config: { damping: 12, stiffness: 100 },
              });

              const opacity = interpolate(progress, [0, 1], [0, 1]);
              const translateX = interpolate(progress, [0, 1], [-50, 0]);
              const scale = interpolate(progress, [0, 1], [0.9, 1]);

              return (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    background: "rgba(255, 255, 255, 0.8)",
                    backdropFilter: "blur(10px)",
                    padding: "24px 32px",
                    borderRadius: 16,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                    borderLeft: `8px solid ${accentColor}`,
                    opacity,
                    transform: `translateX(${translateX}px) scale(${scale})`,
                  }}
                >
                  <div
                    style={{
                      background: `${primaryColor}15`, // 15 = low opacity hex
                      padding: 12,
                      borderRadius: "50%",
                      marginRight: 24,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: primaryColor,
                    }}
                  >
                    <CheckCircle size={32} strokeWidth={2.5} />
                  </div>
                  <span
                    style={{
                      fontFamily: "Open Sans, sans-serif",
                      fontSize: 36,
                      fontWeight: 600,
                      color: textColor,
                    }}
                  >
                    {point.text}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </SafeArea>

      {/* Subtitles */}
      <Subtitle
        text="So, define your product, understand your audience, and choose your channels wisely."
        startFrame={Math.round((200.0 - sceneStartSeconds) * fps)}
        durationInFrames={Math.round((207.0 - 200.0) * fps)}
      />
      <Subtitle
        text="Marketing is not a one-time event; it is a cycle of listening, creating, and improving."
        startFrame={Math.round((207.0 - sceneStartSeconds) * fps)}
        durationInFrames={Math.round((215.0 - 207.0) * fps)}
      />
      <Subtitle
        text="Start building your bridge today."
        startFrame={Math.round((215.0 - sceneStartSeconds) * fps)}
        durationInFrames={Math.round((218.0 - 215.0) * fps)}
      />
      <Subtitle
        text="Thanks for watching."
        startFrame={Math.round((218.0 - sceneStartSeconds) * fps)}
        durationInFrames={Math.round((222.0 - 218.0) * fps)}
      />
    </AbsoluteFill>
  );
}
