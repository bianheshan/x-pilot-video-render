
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { Subtitle } from "../components";

export default function Scene5() {
  const frame = useCurrentFrame();
  const rotation = interpolate(frame, [0, 150], [0, 360]);
  
  return (
    <AbsoluteFill style={{ backgroundColor: "#334155", justifyContent: "center", alignItems: "center" }}>
      <div style={{ 
        fontSize: 120, 
        transform: `rotate(${rotation}deg)`,
        color: "#3b82f6"
      }}>
        🧬
      </div>
      <Subtitle text="DNA 的双螺旋结构" position="bottom" />
    </AbsoluteFill>
  );
}
