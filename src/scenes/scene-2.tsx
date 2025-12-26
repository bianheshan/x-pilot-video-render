
import React from "react";
import { AbsoluteFill } from "remotion";
import { SplitScreen, AISpeaker, Subtitle } from "../components";

export default function Scene2() {
  return (
    <AbsoluteFill>
      <SplitScreen
        left={
          <div style={{ padding: 40, color: "white" }}>
            <h2 style={{ fontSize: 48 }}>DNA 的组成</h2>
            <ul style={{ fontSize: 32, lineHeight: 2 }}>
              <li>腺嘌呤 (A)</li>
              <li>胸腺嘧啶 (T)</li>
              <li>鸟嘌呤 (G)</li>
              <li>胞嘧啶 (C)</li>
            </ul>
          </div>
        }
        right={<AISpeaker name="生物老师" speaking={true} />}
      />
      <Subtitle text="DNA 由四种碱基组成" position="bottom" />
    </AbsoluteFill>
  );
}
