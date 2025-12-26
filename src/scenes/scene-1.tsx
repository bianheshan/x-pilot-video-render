
import React from "react";
import { AbsoluteFill } from "remotion";
import { TitleCard } from "../components";

export default function Scene1() {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0f172a" }}>
      <TitleCard title="DNA 双链结构" subtitle="生命的蓝图" />
    </AbsoluteFill>
  );
}
