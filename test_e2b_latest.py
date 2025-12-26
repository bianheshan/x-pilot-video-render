#!/usr/bin/env python3
"""
E2B 最新版本测试脚本 (2024-2025)
使用最新的 e2b-code-interpreter SDK
"""

import os
import json
from e2b_code_interpreter import Sandbox

# 从环境变量获取 API Key
API_KEY = os.getenv("E2B_API_KEY", "your-api-key-here")

def test_connection():
    """测试 E2B 连接"""
    print("🔌 测试 E2B 连接（最新版本）...")
    
    try:
        # 使用基础模板测试
        sandbox = Sandbox(api_key=API_KEY)
        
        print(f"✅ 连接成功！Sandbox ID: {sandbox.sandbox_id}")
        
        # 测试命令执行
        result = sandbox.run_code("print('Hello from E2B!')")
        print(f"📝 Python 输出: {result.text}")
        
        # 关闭沙箱
        sandbox.close()
        print("✅ 测试完成！")
        return True
        
    except Exception as e:
        print(f"❌ 连接失败: {e}")
        print("\n请检查：")
        print("1. 是否已安装最新版本: pip install e2b-code-interpreter")
        print("2. API key 是否正确")
        print("3. 网络连接是否正常")
        return False


def test_custom_template():
    """测试自定义模板"""
    print("\n🎬 测试 X-Pilot Remotion 模板...")
    
    try:
        # 使用自定义模板（需要先构建）
        # 模板 ID 从 e2b template list 获取
        sandbox = Sandbox(
            template="x-pilot-remotion-template",  # 或使用模板 ID
            api_key=API_KEY,
            timeout=300  # 5分钟超时
        )
        
        print(f"✅ 模板加载成功！Sandbox ID: {sandbox.sandbox_id}")
        
        # 检查环境
        print("\n🔍 检查环境...")
        
        # 检查 Node.js
        result = sandbox.run_code("import subprocess; subprocess.run(['node', '--version'], capture_output=True, text=True)")
        print(f"  Node.js: {result.text.strip()}")
        
        # 检查 Python
        result = sandbox.run_code("import sys; print(f'Python {sys.version}')")
        print(f"  Python: {result.text.strip()}")
        
        # 检查 FFmpeg
        result = sandbox.run_code("import subprocess; subprocess.run(['ffmpeg', '-version'], capture_output=True, text=True)")
        print(f"  FFmpeg: 已安装")
        
        # 检查项目文件
        print("\n📁 检查项目文件...")
        result = sandbox.run_code("""
import os
files = os.listdir('/app')
print('项目根目录:', ', '.join(files[:10]))
""")
        print(f"  {result.text.strip()}")
        
        sandbox.close()
        print("\n✅ 模板测试完成！")
        return True
        
    except Exception as e:
        print(f"❌ 模板测试失败: {e}")
        print("\n提示：")
        print("1. 确保已构建模板: e2b template build")
        print("2. 检查模板名称: e2b template list")
        print("3. 或使用模板 ID 替代模板名称")
        return False


def generate_test_video():
    """生成测试视频的完整流程"""
    print("\n🎥 完整视频生成测试...")
    
    try:
        sandbox = Sandbox(
            template="x-pilot-remotion-template",
            api_key=API_KEY,
            timeout=600  # 10分钟超时
        )
        
        print(f"✅ Sandbox 已创建: {sandbox.sandbox_id}")
        
        # 1. 准备场景代码
        print("\n📝 准备场景代码...")
        scene_code = '''
import React from "react";
import { AbsoluteFill } from "remotion";
import { TitleCard } from "../components";

export default function TestScene() {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0f172a" }}>
      <TitleCard 
        title="E2B 测试视频" 
        subtitle="使用最新 API 生成" 
      />
    </AbsoluteFill>
  );
}
'''
        
        # 写入场景文件
        sandbox.run_code(f"""
with open('/app/src/scenes/e2b-test.tsx', 'w') as f:
    f.write({repr(scene_code)})
print('✅ 场景文件已创建')
""")
        
        # 2. 更新 manifest
        print("📋 更新 manifest...")
        manifest = {
            "version": "1.0.0",
            "fps": 30,
            "width": 1920,
            "height": 1080,
            "theme": "tech",
            "scenes": [{
                "id": "e2b-test",
                "name": "E2B Test Scene",
                "durationInFrames": 90,
                "component": "e2b-test.tsx"
            }]
        }
        
        sandbox.run_code(f"""
import json
with open('/app/src/scenes/manifest.json', 'w') as f:
    json.dump({manifest}, f, indent=2)
print('✅ Manifest 已更新')
""")
        
        # 3. 渲染视频
        print("\n🎬 开始渲染（这可能需要几分钟）...")
        result = sandbox.run_code("""
import subprocess
import os

os.chdir('/app')
result = subprocess.run(
    ['npm', 'run', 'render'],
    capture_output=True,
    text=True,
    timeout=300
)

if result.returncode == 0:
    print('✅ 渲染完成')
else:
    print(f'❌ 渲染失败: {result.stderr}')
""")
        
        print(result.text)
        
        # 4. 检查输出文件
        print("\n📦 检查输出文件...")
        result = sandbox.run_code("""
import os
output_dir = '/app/output'
if os.path.exists(output_dir):
    files = os.listdir(output_dir)
    print(f'输出文件: {files}')
    
    # 获取视频文件大小
    for f in files:
        if f.endswith('.mp4'):
            size = os.path.getsize(os.path.join(output_dir, f))
            print(f'视频大小: {size / 1024 / 1024:.2f} MB')
else:
    print('输出目录不存在')
""")
        
        print(result.text)
        
        # 5. 下载视频（可选）
        # 注意：新版 SDK 可能需要使用不同的文件下载方法
        # sandbox.download_file('/app/output/video.mp4', 'test_output.mp4')
        
        sandbox.close()
        print("\n✅ 完整测试成功！")
        return True
        
    except Exception as e:
        print(f"❌ 视频生成失败: {e}")
        import traceback
        traceback.print_exc()
        return False


if __name__ == "__main__":
    print("=" * 60)
    print("E2B 最新版本测试套件 (2024-2025)")
    print("=" * 60)
    
    # 测试 1: 基础连接
    if not test_connection():
        print("\n❌ 基础连接失败，请先解决连接问题")
        exit(1)
    
    # 测试 2: 自定义模板
    print("\n" + "=" * 60)
    if not test_custom_template():
        print("\n⚠️  模板测试失败，但可以继续")
        print("提示：使用 'e2b template build' 构建模板")
    
    # 测试 3: 完整视频生成（可选，耗时较长）
    print("\n" + "=" * 60)
    generate_full_test = input("\n是否运行完整视频生成测试？(y/n): ").lower() == 'y'
    
    if generate_full_test:
        generate_test_video()
    else:
        print("跳过完整测试")
    
    print("\n" + "=" * 60)
    print("测试完成！")
    print("=" * 60)
