#!/usr/bin/env python3
"""
主题系统使用示例
演示如何使用不同主题生成视频
"""

import sys
sys.path.append('..')

from push_scene import ScenePusher

def create_tech_theme_video():
    """创建科技主题视频"""
    pusher = ScenePusher()
    
    # 场景 1: 科技开场
    scene1_code = '''
import React from "react";
import { AbsoluteFill } from "remotion";
import { TitleCinematicIntro } from "@/components";

export const Scene1: React.FC = () => {
  return (
    <AbsoluteFill>
      <TitleCinematicIntro 
        text="TECHNOLOGY" 
        subtitle="Powering the Future"
      />
    </AbsoluteFill>
  );
};
'''
    
    pusher.push(
        scene_id="scene-1",
        scene_name="Tech Opening",
        duration=90,
        code_content=scene1_code,
        theme="tech"  # 使用科技主题
    )
    
    # 场景 2: 特性展示
    scene2_code = '''
import React from "react";
import { AbsoluteFill } from "remotion";
import { CardGlassmorphism } from "@/components";

export const Scene2: React.FC = () => {
  return (
    <AbsoluteFill>
      <CardGlassmorphism
        title="AI Innovation"
        content="Revolutionizing the way we create content with artificial intelligence"
        icon="🤖"
      />
    </AbsoluteFill>
  );
};
'''
    
    pusher.push(
        scene_id="scene-2",
        scene_name="Features",
        duration=120,
        code_content=scene2_code
        # 不指定 theme，继续使用之前的主题
    )
    
    print("✅ 科技主题视频创建完成！")

def create_cyberpunk_theme_video():
    """创建赛博朋克主题视频"""
    pusher = ScenePusher()
    
    scene_code = '''
import React from "react";
import { AbsoluteFill } from "remotion";
import { TitleKineticGlitch, CardHolographic } from "@/components";

export const CyberpunkScene: React.FC = () => {
  return (
    <AbsoluteFill>
      <TitleKineticGlitch 
        text="NEON CITY" 
        intensity={1.5}
      />
    </AbsoluteFill>
  );
};
'''
    
    pusher.push(
        scene_id="scene-1",
        scene_name="Cyberpunk Intro",
        duration=90,
        code_content=scene_code,
        theme="cyberpunk"  # 使用赛博朋克主题
    )
    
    print("✅ 赛博朋克主题视频创建完成！")

def create_multi_theme_video():
    """创建多主题混合视频"""
    pusher = ScenePusher()
    
    themes_and_scenes = [
        ("tech", "Technology", "🚀"),
        ("cyberpunk", "Gaming", "🎮"),
        ("elegant", "Business", "💼"),
        ("nature", "Environment", "🌿"),
        ("warm", "Lifestyle", "☀️"),
        ("minimal", "Design", "✨"),
    ]
    
    for i, (theme, title, icon) in enumerate(themes_and_scenes, 1):
        scene_code = f'''
import React from "react";
import {{ AbsoluteFill }} from "remotion";
import {{ CardGlassmorphism }} from "@/components";

export const Scene{i}: React.FC = () => {{
  return (
    <AbsoluteFill>
      <CardGlassmorphism
        title="{title}"
        content="This scene uses the {theme} theme"
        icon="{icon}"
      />
    </AbsoluteFill>
  );
}};
'''
        
        pusher.push(
            scene_id=f"scene-{i}",
            scene_name=f"{title} Section",
            duration=60,
            code_content=scene_code,
            theme=theme
        )
        
        print(f"✅ 场景 {i} ({theme} 主题) 创建完成")
    
    print("✅ 多主题视频创建完成！")

def main():
    """主函数"""
    print("=== 主题系统示例 ===\n")
    
    print("选择示例:")
    print("1. 科技主题视频")
    print("2. 赛博朋克主题视频")
    print("3. 多主题混合视频")
    
    choice = input("\n请输入选项 (1-3): ").strip()
    
    if choice == "1":
        create_tech_theme_video()
    elif choice == "2":
        create_cyberpunk_theme_video()
    elif choice == "3":
        create_multi_theme_video()
    else:
        print("❌ 无效选项")

if __name__ == "__main__":
    main()
