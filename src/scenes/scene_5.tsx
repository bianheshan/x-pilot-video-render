import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring, Img, random } from "remotion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { SafeArea, Subtitle } from "../components";
import { useTheme } from "../contexts/ThemeContext";

/**
 * Scene 5: Digital Marketing & Data (Do: Use tools)
 * Target: Show the modern tools and the flow of data.
 * Duration: ~35 seconds
 */
export default function Scene5() {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const theme = useTheme();

  // ---------------------------------------------------------------------------
  // 1. Configuration & Constants
  // ---------------------------------------------------------------------------
  const SCENE_START_SECONDS = 135.0;
  
  // Colors from config
  const BG_COLOR = "#001f3f"; // Dark Navy
  const ACCENT_COLOR = "#00C896"; // Cyan/Green accent
  const TEXT_COLOR = "#FFFFFF"; // Override global text color for dark background

  // ---------------------------------------------------------------------------
  // 2. Data & Animations
  // ---------------------------------------------------------------------------

  // Grid Data
  const gridItems = [
    {
      id: "seo",
      src: "http://35.232.154.66:5125/files/tools/cdf6936d-bae2-4832-8787-a4725c781f92.jpg?timestamp=1767453824&nonce=4e5ed69ae00f61e3bb668c7ffa045383&sign=Tb1W0QmPiQbGyj1z-hGhmR9vDDNB7FA1kiVjmdgfXWQ=",
      caption: "SEO"
    },
    {
      id: "content",
      src: "http://35.232.154.66:5125/files/tools/a5226b59-a358-4c02-8c4e-70208f74ecaa.jpg?timestamp=1767453823&nonce=3602fa293e0b272725146799b51bf276&sign=FDH3r3sT-TQ-MP3WhXp-NqXdtDhevjS4Kbyhr0d_43Y=",
      caption: "Content"
    },
    {
      id: "social",
      src: "http://35.232.154.66:5125/files/tools/464efc25-1c43-4a64-b4ba-87ef6fbc29e2.jpg?timestamp=1767453823&nonce=55125f68c4d2fc835086b38b7f7b8af1&sign=Kj9aNaWJ0PCdcf7Ztqv5zPiIJhy13tDuBPuV4VJ4yio=",
      caption: "Social"
    }
  ];

  // Chart Data
  const rawChartData = [
    { name: 'Jan', value: 10 },
    { name: 'Feb', value: 45 },
    { name: 'Mar', value: 80 },
    { name: 'Apr', value: 65 }, // Extended for better visual
    { name: 'May', value: 95 },
  ];

  // Animation: Staggered entry for grid items
  const getGridItemStyle = (index: number) => {
    const delay = 15 + index * 10;
    const progress = spring({
      frame: frame - delay,
      fps,
      config: { damping: 12, stiffness: 100 }
    });
    
    return {
      opacity: progress,
      transform: `scale(${progress}) translateY(${interpolate(progress, [0, 1], [50, 0])}px)`
    };
  };

  // Animation: Chart Drawing
  // We animate the data values growing from 0
  const chartStartFrame = fps * 2; // Start chart animation after grid
  const chartProgress = interpolate(frame, [chartStartFrame, chartStartFrame + 60], [0, 1], { extrapolateRight: 'clamp' });
  
  const animatedChartData = rawChartData.map(d => ({
    ...d,
    value: d.value * chartProgress
  }));

  // Animation: Background Data Stream (Simulated Circuit)
  const streamOffset = (frame * 4) % 200;

  // ---------------------------------------------------------------------------
  // 3. Subtitle Handling
  // ---------------------------------------------------------------------------
  const subtitles = [
    { text: "Today, we have powerful digital tools to manage this journey.", start: 135.0, end: 139.5 },
    { text: "SEO helps people find you. Content Marketing educates them. Social Media builds community.", start: 139.5, end: 148.0 },
    { text: "But the biggest advantage of digital marketing is Data.", start: 148.0, end: 153.0 },
    { text: "Unlike a billboard, we can track clicks, engagement, and Return on Investment in real-time.", start: 153.0, end: 162.0 },
    { text: "This allows you to stop guessing and start optimizing.", start: 162.0, end: 167.0 },
    { text: "Data is your compass.", start: 167.0, end: 170.0 }
  ];

  // ---------------------------------------------------------------------------
  // 4. Render
  // ---------------------------------------------------------------------------
  return (
    <AbsoluteFill style={{ backgroundColor: BG_COLOR, overflow: "hidden" }}>
      
      {/* --- Background Layer: Data Stream Effect --- */}
      <AbsoluteFill style={{ zIndex: 0 }}>
        <svg width="100%" height="100%" style={{ opacity: 0.15 }}>
          <defs>
            <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke={ACCENT_COLOR} strokeWidth="1" />
            </pattern>
            <linearGradient id="streamGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={ACCENT_COLOR} stopOpacity="0" />
              <stop offset="50%" stopColor={ACCENT_COLOR} stopOpacity="1" />
              <stop offset="100%" stopColor={ACCENT_COLOR} stopOpacity="0" />
            </linearGradient>
          </defs>
          
          {/* Static Grid */}
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Moving Data Lines */}
          {[1, 2, 3, 4, 5].map((i) => (
            <rect
              key={i}
              x={i * 20 + "%"}
              y={-200 + streamOffset * (1 + i * 0.2)} 
              width="2"
              height="200"
              fill="url(#streamGradient)"
              opacity={0.5}
            />
          ))}
          {[1, 2, 3].map((i) => (
             <rect
              key={`h-${i}`}
              y={i * 25 + "%"}
              x={-200 + streamOffset * (1 + i * 0.3)} 
              height="2"
              width="200"
              fill="url(#streamGradient)"
              opacity={0.3}
              transform="rotate(90)"
            />
          ))}
        </svg>
      </AbsoluteFill>

      {/* --- Main Content Layer --- */}
      <SafeArea padding={60} paddingBottom={160} style={{ zIndex: 1, display: 'flex', flexDirection: 'column', gap: 40 }}>
        
        {/* Top Half: Digital Channels Grid */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ 
            color: TEXT_COLOR, 
            fontFamily: theme.fonts.heading, 
            fontSize: 48, 
            marginBottom: 30,
            textAlign: 'center',
            opacity: interpolate(frame, [0, 20], [0, 1])
          }}>
            Digital Channels
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: 30,
            flex: 1
          }}>
            {gridItems.map((item, index) => (
              <div key={item.id} style={{ 
                ...getGridItemStyle(index),
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: 16,
                padding: 16,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                border: `1px solid rgba(255,255,255,0.2)`
              }}>
                <div style={{ 
                  flex: 1, 
                  width: '100%', 
                  borderRadius: 8, 
                  overflow: 'hidden', 
                  marginBottom: 16,
                  position: 'relative'
                }}>
                  <Img 
                    src={item.src} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <span style={{ 
                  color: ACCENT_COLOR, 
                  fontFamily: theme.fonts.heading, 
                  fontSize: 24, 
                  fontWeight: 'bold' 
                }}>
                  {item.caption}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Half: Real-time ROI Analytics */}
        <div style={{ 
          flex: 1, 
          background: 'rgba(0, 20, 40, 0.6)', 
          border: `1px solid ${ACCENT_COLOR}`,
          borderRadius: 24,
          padding: 30,
          display: 'flex',
          flexDirection: 'column',
          opacity: interpolate(frame, [chartStartFrame, chartStartFrame + 20], [0, 1])
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ color: TEXT_COLOR, fontFamily: theme.fonts.heading, margin: 0 }}>Real-time ROI</h3>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
               <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'red', boxShadow: '0 0 10px red' }} />
               <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>LIVE</span>
            </div>
          </div>
          
          <div style={{ flex: 1, width: '100%', minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={animatedChartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={ACCENT_COLOR} stopOpacity={0.8}/>
                    <stop offset="95%" stopColor={ACCENT_COLOR} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="rgba(255,255,255,0.5)" 
                  tick={{ fill: 'rgba(255,255,255,0.5)' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.5)" 
                  tick={{ fill: 'rgba(255,255,255,0.5)' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke={ACCENT_COLOR} 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </SafeArea>

      {/* --- Subtitles Layer --- */}
      {subtitles.map((sub, index) => {
        const startFrame = Math.round((sub.start - SCENE_START_SECONDS) * fps);
        const durationFrames = Math.round((sub.end - sub.start) * fps);
        
        return (
          <Subtitle
            key={index}
            text={sub.text}
            startFrame={startFrame}
            durationInFrames={durationFrames}
          />
        );
      })}
    </AbsoluteFill>
  );
}
