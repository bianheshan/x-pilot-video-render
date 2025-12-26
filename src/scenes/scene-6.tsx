
import React from "react";
import { AbsoluteFill } from "remotion";
import { PictureInPicture, AISpeaker, Subtitle } from "../components";

export default function Scene6() {
  return (
    <AbsoluteFill>
      <PictureInPicture
        main={
          <div style={{ padding: 60, color: "white", backgroundColor: "#1e293b" }}>
            <h2 style={{ fontSize: 56, marginBottom: 30 }}>DNA 复制过程</h2>
            <ol style={{ fontSize: 32, lineHeight: 2 }}>
              <li>解旋：双链分离</li>
              <li>配对：新链合成</li>
              <li>连接：形成新 DNA</li>
            </ol>
          </div>
        }
        pip={<AISpeaker name="生物老师" speaking={true} />}
        position="bottom-right"
      />
      <Subtitle text="DNA 如何复制自己" position="bottom" />
    </AbsoluteFill>
  );
}
