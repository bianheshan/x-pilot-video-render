
import React from "react";
import { AbsoluteFill } from "remotion";
import { Subtitle } from "../components";

export default function Scene7() {
  return (
    <AbsoluteFill style={{ backgroundColor: "#475569", padding: 80 }}>
      <div style={{ color: "white" }}>
        <h2 style={{ fontSize: 56, marginBottom: 40 }}>DNA 的应用</h2>
        <div style={{ fontSize: 36, lineHeight: 2 }}>
          <div>🔬 基因检测</div>
          <div>💊 精准医疗</div>
          <div>🌾 农业育种</div>
          <div>🔍 法医鉴定</div>
        </div>
      </div>
      <Subtitle text="DNA 技术改变世界" position="bottom" />
    </AbsoluteFill>
  );
}
