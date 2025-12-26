#!/usr/bin/env python3
"""
E2B 视频生成示例
演示如何使用 E2B 生成 Remotion 视频
"""

import os
import json
import sys
from e2b import Sandbox

def generate_video(api_key: str, template_name: str = None, git_repo: str = None):
    """
    生成视频示例
    
    Args:
        api_key: E2B API key
        template_name: 模板名称（如果已创建）
    """
    
    print("=" * 60)
    print("🎬 E2B Remotion 视频生成示例")
    print("=" * 60)
    print()
    
    # 场景代码示例
    scene_code = """
import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { TitleCard } from "../components";

export default function Scene1() {
  const frame = useCurrentFrame();
  
  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });
  
  return (
    <AbsoluteFill style={{ backgroundColor: "#0f172a" }}>
      <div style={{ opacity, padding: 40 }}>
        <TitleCard 
          title="Hello from E2B!" 
          subtitle="您的第一个 Remotion 视频" 
        />
      </div>
    </AbsoluteFill>
  );
}
"""
    
    print("🚀 步骤 1: 创建 Sandbox...")
    try:
        # 优先使用 Git 仓库（推荐）
        if git_repo:
            print(f"   📦 从 Git 仓库创建: {git_repo}")
            sandbox = Sandbox.from_template(
                template=git_repo,
                api_key=api_key
            )
            print("   ⏳ 等待 Docker 构建（可能需要几分钟）...")
            import time
            time.sleep(30)  # 等待构建
        elif template_name:
            print(f"   📦 使用模板: {template_name}")
            sandbox = Sandbox(
                template=template_name,
                api_key=api_key
            )
        else:
            # 使用基础模板
            print("   📦 使用基础模板")
            sandbox = Sandbox(
                template="base",
                api_key=api_key
            )
        
        print(f"   ✅ Sandbox 已创建: {sandbox.id}")
        print()
    except Exception as e:
        print(f"   ❌ 创建失败: {e}")
        print()
        print("💡 解决方案:")
        print("   1. 如果使用 Git 仓库，确保仓库是公开的或已授权")
        print("   2. 如果使用模板，确保模板名称正确")
        print("   3. 尝试使用 'base' 模板: template_name='base'")
        print("   4. 检查 API key 是否有效")
        print()
        print("📚 查看 E2B_TEMPLATE_GUIDE.md 了解更多方法")
        return False
    
    try:
        # 等待服务启动
        print("⏳ 步骤 2: 等待服务启动...")
        import time
        time.sleep(5)
        print("   ✅ 服务已就绪")
        print()
        
        # 写入场景文件
        print("📝 步骤 3: 写入场景文件...")
        scene_filename = "e2b-test-scene.tsx"
        sandbox.filesystem.write(
            f"/app/src/scenes/{scene_filename}",
            scene_code
        )
        print(f"   ✅ 场景文件已写入: {scene_filename}")
        print()
        
        # 更新 manifest.json
        print("📋 步骤 4: 更新 manifest.json...")
        manifest = {
            "version": "1.0.0",
            "fps": 30,
            "width": 1920,
            "height": 1080,
            "theme": "tech",
            "scenes": [
                {
                    "id": "e2b-test-scene",
                    "name": "E2B Test Scene",
                    "durationInFrames": 90,
                    "component": scene_filename
                }
            ]
        }
        
        sandbox.filesystem.write(
            "/app/src/scenes/manifest.json",
            json.dumps(manifest, indent=2, ensure_ascii=False)
        )
        print("   ✅ manifest.json 已更新")
        print()
        
        # 渲染视频
        print("🎬 步骤 5: 渲染视频...")
        print("   ⏳ 这可能需要几分钟...")
        
        render_process = sandbox.process.start(
            "npm",
            ["run", "render"],
            cwd="/app"
        )
        
        # 实时显示输出
        while True:
            output = render_process.stdout.read()
            if output:
                print(f"   {output}", end="")
            
            if render_process.finished:
                break
        
        # 检查是否成功
        if render_process.exit_code == 0:
            print()
            print("   ✅ 渲染完成")
            print()
        else:
            print()
            print(f"   ⚠️  渲染退出码: {render_process.exit_code}")
            error = render_process.stderr.read()
            if error:
                print(f"   错误: {error}")
            print()
        
        # 获取视频文件
        print("📥 步骤 6: 获取视频文件...")
        try:
            video_data = sandbox.filesystem.read("/app/output/video.mp4")
            
            # 保存到本地
            output_filename = "e2b_output.mp4"
            with open(output_filename, "wb") as f:
                f.write(video_data)
            
            file_size = len(video_data) / (1024 * 1024)  # MB
            print(f"   ✅ 视频已保存: {output_filename}")
            print(f"   📊 文件大小: {file_size:.2f} MB")
            print()
            
        except Exception as e:
            print(f"   ⚠️  获取视频失败: {e}")
            print("   可能原因:")
            print("   1. 渲染未完成")
            print("   2. 输出文件路径不正确")
            print("   3. 文件不存在")
            print()
        
        print("=" * 60)
        print("✅ 完成！")
        print("=" * 60)
        return True
        
    except Exception as e:
        print()
        print("=" * 60)
        print("❌ 生成失败")
        print("=" * 60)
        print(f"错误: {e}")
        import traceback
        traceback.print_exc()
        return False
        
    finally:
        print()
        print("🧹 清理 Sandbox...")
        sandbox.close()
        print("   ✅ Sandbox 已关闭")


if __name__ == "__main__":
    # 获取 API key
    API_KEY = os.getenv("E2B_API_KEY")
    
    if not API_KEY:
        print("❌ 错误: 未找到 E2B_API_KEY 环境变量")
        print()
        print("请设置 API key:")
        print("  export E2B_API_KEY='your-api-key'")
        print()
        print("或直接修改脚本中的 API_KEY 变量")
        sys.exit(1)
    
    # 模板配置（三选一）
    # 选项 1: 使用 Git 仓库（推荐）
    GIT_REPO = os.getenv("E2B_GIT_REPO")  # 例如: "https://github.com/your-username/x-pilot-video-render"
    
    # 选项 2: 使用模板名称
    TEMPLATE_NAME = os.getenv("E2B_TEMPLATE_NAME")  # 例如: "x-pilot-remotion-template"
    
    # 选项 3: 使用基础模板（默认）
    # 如果都不设置，将使用 "base" 模板
    
    # 生成视频
    success = generate_video(API_KEY, TEMPLATE_NAME, GIT_REPO)
    sys.exit(0 if success else 1)

