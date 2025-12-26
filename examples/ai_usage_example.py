#!/usr/bin/env python3
"""
AI 使用示例 - 展示如何推送场景到项目

这个文件展示了 AI 如何使用 push_scene.py 来推送生成的场景代码
"""

import sys
import os

# 添加父目录到路径
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from push_scene import ScenePusher


def example_single_scene():
    """示例 1: 推送单个场景"""
    
    print("=" * 60)
    print("示例 1: 推送单个场景")
    print("=" * 60)
    
    pusher = ScenePusher()
    
    # AI 生成的场景代码
    scene_code = '''
import React from "react";
import { AbsoluteFill } from "remotion";
import { TitleCard, Subtitle } from "../components";

export default function Scene1() {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0f172a" }}>
      <TitleCard 
        title="DNA 双链结构" 
        subtitle="探索生命的奥秘"
      />
      <Subtitle 
        text="欢迎来到 DNA 的世界" 
        position="bottom" 
        animate={true}
      />
    </AbsoluteFill>
  );
}
'''
    
    # 推送场景
    success = pusher.push(
        scene_id="scene-1",
        scene_name="DNA Introduction",
        duration=90,  # 3秒 @ 30fps
        code_content=scene_code
    )
    
    if success:
        print("\n✅ 场景推送成功！")
    else:
        print("\n❌ 场景推送失败！")


def example_batch_scenes():
    """示例 2: 批量推送 8 个场景"""
    
    print("\n" + "=" * 60)
    print("示例 2: 批量推送 8 个场景（DNA 教学视频）")
    print("=" * 60)
    
    pusher = ScenePusher()
    
    # AI 生成的 8 个场景
    scenes = [
        {
            "id": "scene-1",
            "name": "标题介绍",
            "duration": 90,
            "content": '''
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
'''
        },
        {
            "id": "scene-2",
            "name": "DNA 组成",
            "duration": 150,
            "content": '''
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
'''
        },
        {
            "id": "scene-3",
            "name": "碱基配对",
            "duration": 120,
            "content": '''
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
'''
        },
        {
            "id": "scene-4",
            "name": "代码演示",
            "duration": 180,
            "content": '''
import React from "react";
import { AbsoluteFill } from "remotion";
import { CodeBlock, Subtitle } from "../components";

export default function Scene4() {
  const code = `class DNA {
  constructor() {
    this.pairs = { A: 'T', T: 'A', G: 'C', C: 'G' };
  }
  
  complement(sequence) {
    return sequence.split('').map(b => this.pairs[b]).join('');
  }
}

const dna = new DNA();
console.log(dna.complement('ATGC')); // TACG`;

  return (
    <AbsoluteFill style={{ backgroundColor: "#1e293b" }}>
      <CodeBlock code={code} language="javascript" />
      <Subtitle text="DNA 配对的代码实现" position="bottom" />
    </AbsoluteFill>
  );
}
'''
        },
        {
            "id": "scene-5",
            "name": "双螺旋结构",
            "duration": 150,
            "content": '''
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
'''
        },
        {
            "id": "scene-6",
            "name": "DNA 复制",
            "duration": 150,
            "content": '''
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
'''
        },
        {
            "id": "scene-7",
            "name": "应用场景",
            "duration": 120,
            "content": '''
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
'''
        },
        {
            "id": "scene-8",
            "name": "结束",
            "duration": 90,
            "content": '''
import React from "react";
import { AbsoluteFill } from "remotion";
import { TitleCard } from "../components";

export default function Scene8() {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0f172a" }}>
      <TitleCard title="感谢观看" subtitle="探索更多生命奥秘" />
    </AbsoluteFill>
  );
}
'''
        }
    ]
    
    # 批量推送
    success_count = pusher.push_batch(scenes)
    
    print(f"\n📊 推送结果: {success_count}/{len(scenes)} 成功")
    print(f"📹 总时长: {sum(s['duration'] for s in scenes) / 30:.1f} 秒")


def example_list_scenes():
    """示例 3: 列出所有场景"""
    
    print("\n" + "=" * 60)
    print("示例 3: 列出所有场景")
    print("=" * 60)
    
    pusher = ScenePusher()
    pusher.list_scenes()


if __name__ == "__main__":
    # 运行所有示例
    example_single_scene()
    example_batch_scenes()
    example_list_scenes()
    
    print("\n" + "=" * 60)
    print("✅ 所有示例运行完成！")
    print("💡 现在可以运行 'npm run dev' 查看效果")
    print("=" * 60)
