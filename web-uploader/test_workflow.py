#!/usr/bin/env python3
"""
快速测试工作流 - API 测试脚本

测试新增的测试工作流相关 API 端点
"""

import requests
import json
import time

API_BASE = "http://localhost:8000"

def print_section(title):
    """打印分隔线"""
    print("\n" + "=" * 60)
    print(f"  {title}")
    print("=" * 60)

def test_health():
    """测试健康检查"""
    print_section("1. 测试健康检查")
    try:
        response = requests.get(f"{API_BASE}/health")
        data = response.json()
        print(f"✅ 状态: {data.get('status')}")
        print(f"✅ 消息: {data.get('message')}")
        return True
    except Exception as e:
        print(f"❌ 错误: {e}")
        return False

def test_validate_code():
    """测试代码验证"""
    print_section("2. 测试代码验证")
    
    # 测试正确的代码
    print("\n📝 测试正确的代码:")
    correct_code = '''import React from "react";
import { AbsoluteFill } from "remotion";
import { TitleCard } from "../components";

export default function TestScene() {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0f172a" }}>
      <TitleCard title="测试" subtitle="验证功能" />
    </AbsoluteFill>
  );
}'''
    
    try:
        response = requests.post(
            f"{API_BASE}/test/validate",
            json={"code_content": correct_code}
        )
        data = response.json()
        print(f"✅ 验证结果: {'通过' if data.get('success') else '失败'}")
        print(f"   错误: {data.get('errors', [])}")
        print(f"   警告: {data.get('warnings', [])}")
    except Exception as e:
        print(f"❌ 错误: {e}")
    
    # 测试错误的代码
    print("\n📝 测试错误的代码:")
    wrong_code = '''function TestScene() {
  return <div>Test</div>;
}'''
    
    try:
        response = requests.post(
            f"{API_BASE}/test/validate",
            json={"code_content": wrong_code}
        )
        data = response.json()
        print(f"✅ 验证结果: {'通过' if data.get('success') else '失败'}")
        print(f"   错误: {data.get('errors', [])}")
        print(f"   警告: {data.get('warnings', [])}")
    except Exception as e:
        print(f"❌ 错误: {e}")

def test_preview_status():
    """测试预览状态检查"""
    print_section("3. 测试预览状态检查")
    try:
        response = requests.get(f"{API_BASE}/test/preview-status")
        data = response.json()
        print(f"✅ 预览运行: {'是' if data.get('is_running') else '否'}")
        print(f"   端口: {data.get('port')}")
        print(f"   URL: {data.get('url')}")
        return data.get('is_running')
    except Exception as e:
        print(f"❌ 错误: {e}")
        return False

def test_start_preview():
    """测试启动预览"""
    print_section("4. 测试启动预览")
    try:
        response = requests.post(f"{API_BASE}/test/start-preview")
        data = response.json()
        print(f"✅ 启动结果: {'成功' if data.get('success') else '失败'}")
        print(f"   消息: {data.get('message')}")
        print(f"   URL: {data.get('url')}")
        print(f"   已运行: {'是' if data.get('already_running') else '否'}")
        if not data.get('already_running'):
            print(f"   等待时间: {data.get('wait_time')} 秒")
    except Exception as e:
        print(f"❌ 错误: {e}")

def test_full_workflow():
    """测试完整工作流"""
    print_section("5. 测试完整工作流")
    
    scene_data = {
        "scene_id": "scene-workflow-test",
        "scene_name": "工作流测试场景",
        "duration": 90,
        "code_content": '''import React from "react";
import { AbsoluteFill } from "remotion";
import { TitleCard } from "../components";

export default function WorkflowTestScene() {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0f172a" }}>
      <TitleCard 
        title="工作流测试" 
        subtitle="自动化测试场景" 
      />
    </AbsoluteFill>
  );
}''',
        "theme": "tech"
    }
    
    try:
        print("\n🚀 执行完整工作流...")
        response = requests.post(
            f"{API_BASE}/test/workflow",
            json=scene_data
        )
        data = response.json()
        print(f"✅ 工作流结果: {'成功' if data.get('success') else '失败'}")
        print(f"   步骤: {data.get('step')}")
        print(f"   消息: {data.get('message')}")
        print(f"   预览运行: {'是' if data.get('preview_running') else '否'}")
        print(f"   预览 URL: {data.get('preview_url')}")
        print(f"   场景 ID: {data.get('scene_id')}")
    except Exception as e:
        print(f"❌ 错误: {e}")

def test_scene_upload():
    """测试场景上传"""
    print_section("6. 测试场景上传")
    
    scene_data = {
        "scene_id": "scene-api-test",
        "scene_name": "API 测试场景",
        "duration": 90,
        "code_content": '''import React from "react";
import { AbsoluteFill } from "remotion";
import { TitleCard } from "../components";

export default function ApiTestScene() {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0f172a" }}>
      <TitleCard title="API 测试" subtitle="验证上传功能" />
    </AbsoluteFill>
  );
}''',
        "theme": "tech"
    }
    
    try:
        response = requests.post(
            f"{API_BASE}/push",
            json=scene_data
        )
        data = response.json()
        print(f"✅ 上传结果: {'成功' if data.get('success') else '失败'}")
        print(f"   消息: {data.get('message')}")
        return data.get('success')
    except Exception as e:
        print(f"❌ 错误: {e}")
        return False

def test_scene_list():
    """测试场景列表"""
    print_section("7. 测试场景列表")
    try:
        response = requests.get(f"{API_BASE}/scenes")
        data = response.json()
        scenes = data.get('scenes', [])
        print(f"✅ 场景总数: {len(scenes)}")
        if scenes:
            print("\n📋 场景列表:")
            for i, scene in enumerate(scenes[-3:], 1):  # 只显示最后3个
                print(f"   {i}. {scene.get('name')} ({scene.get('id')})")
                print(f"      文件: {scene.get('component')}")
                print(f"      时长: {scene.get('durationInFrames')} 帧")
    except Exception as e:
        print(f"❌ 错误: {e}")

def main():
    """主测试流程"""
    print("\n" + "🧪" * 30)
    print("  快速测试工作流 - API 测试")
    print("🧪" * 30)
    
    # 1. 健康检查
    if not test_health():
        print("\n❌ 服务器未运行，请先启动服务器:")
        print("   cd web-uploader && python server.py")
        return
    
    # 2. 测试代码验证
    test_validate_code()
    
    # 3. 测试预览状态
    preview_running = test_preview_status()
    
    # 4. 如果预览未运行，测试启动预览
    if not preview_running:
        test_start_preview()
        print("\n⏳ 等待预览服务器启动...")
        time.sleep(3)
        test_preview_status()
    
    # 5. 测试场景上传
    test_scene_upload()
    
    # 6. 测试场景列表
    test_scene_list()
    
    # 7. 测试完整工作流
    test_full_workflow()
    
    # 总结
    print_section("测试完成")
    print("\n✅ 所有测试已完成！")
    print("\n💡 提示:")
    print("   - 访问 http://localhost:8000 查看 Web 界面")
    print("   - 访问 http://localhost:3000 查看 Remotion 预览")
    print("   - 查看 QUICK_TEST_GUIDE.md 了解详细使用方法")
    print()

if __name__ == "__main__":
    main()
