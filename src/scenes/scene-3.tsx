
import React from "react";
import { AbsoluteFill } from "remotion";
import { Subtitle } from "../components";

export default function Scene3() {
  return (
    <AbsoluteFill style={{ backgroundColor: "#1e293b", justifyContent: "center", alignItems: "center" }}>
      <div style={{ color: "white", fontSize: 48, textAlign: "center" }}>
        <div style={{ marginBottom: 40 }}>A ↔ T</div>
        <div>G ↔ C</div>
      </div>
      <Subtitle text="碱基配对规则" position="bottom" />
    </AbsoluteFill>
  );
}
