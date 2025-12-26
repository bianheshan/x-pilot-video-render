#!/usr/bin/env python3
"""
API 测试脚本 - 测试所有 API 端点
"""

import requests
import json

API_BASE = "http://localhost:8000"

def test_health():
    """测试健康检查"""
    print("🔍 测试健康检查...")
    response = requests.get(f"{API_BASE}/health")
    print(f"   状态码: {response.status_code}")
    print(f"   响应: {response.json()}")
    print()

def test_get_scenes():
    """测试获取场景列表"""
    print("🔍 测试获取场景列表...")
    response = requests.get(f"{API_BASE}/scenes")
    data = response.json()
    print(f"   状态码: {response.status_code}")
    print(f"   场景数量: {len(data.get('scenes', []))}")
    print()

def test_push_scene():
    """测试推送单个场景"""
    print("🔍 测试推送单个场景...")
    
    scene_data = {
        "scene_id": "test-scene-1",
        "scene_name": "测试场景",
        "duration": 90,
        "code_content": '''import React from "react";
import { AbsoluteFill } from "remotion";
import { TitleCard } from "../components";

export default function TestScene() {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0f172a" }}>
      <TitleCard title="测试场景" subtitle="API 测试" />
    </AbsoluteFill>
  );
}''',
        "theme": "tech"
    }
    
    response = requests.post(
        f"{API_BASE}/push",
        json=scene_data,
        headers={"Content-Type": "application/json"}
    )
    
    print(f"   状态码: {response.status_code}")
    print(f"   响应: {response.json()}")
    print()

def test_push_batch():
    """测试批量推送"""
    print("🔍 测试批量推送...")
    
    batch_data = {
        "scenes": [
            {
                "id": "test-batch-1",
                "name": "批量测试 1",
                "duration": 60,
                "content": "import React from 'react';\nexport default function Scene1() { return <div>Test 1</div>; }"
            },
            {
                "id": "test-batch-2",
                "name": "批量测试 2",
                "duration": 90,
                "content": "import React from 'react';\nexport default function Scene2() { return <div>Test 2</div>; }"
            }
        ]
    }
    
    response = requests.post(
        f"{API_BASE}/push-batch",
        json=batch_data,
        headers={"Content-Type": "application/json"}
    )
    
    print(f"   状态码: {response.status_code}")
    print(f"   响应: {response.json()}")
    print()

def test_set_theme():
    """测试设置主题"""
    print("🔍 测试设置主题...")
    
    response = requests.post(
        f"{API_BASE}/set-theme",
        json={"theme": "cyberpunk"},
        headers={"Content-Type": "application/json"}
    )
    
    print(f"   状态码: {response.status_code}")
    print(f"   响应: {response.json()}")
    print()

def test_get_theme():
    """测试获取主题"""
    print("🔍 测试获取主题...")
    response = requests.get(f"{API_BASE}/get-theme")
    print(f"   状态码: {response.status_code}")
    print(f"   响应: {response.json()}")
    print()

def test_delete_scene():
    """测试删除场景"""
    print("🔍 测试删除场景...")
    response = requests.delete(f"{API_BASE}/delete/test-scene-1")
    print(f"   状态码: {response.status_code}")
    print(f"   响应: {response.json()}")
    print()

def main():
    print("=" * 60)
    print("🧪 API 测试脚本")
    print("=" * 60)
    print()
    
    try:
        # 1. 健康检查
        test_health()
        
        # 2. 获取场景列表
        test_get_scenes()
        
        # 3. 推送单个场景
        test_push_scene()
        
        # 4. 批量推送
        test_push_batch()
        
        # 5. 设置主题
        test_set_theme()
        
        # 6. 获取主题
        test_get_theme()
        
        # 7. 获取场景列表（查看新增的场景）
        test_get_scenes()
        
        # 8. 删除测试场景
        test_delete_scene()
        
        print("=" * 60)
        print("✅ 所有测试完成！")
        print("=" * 60)
        
    except requests.exceptions.ConnectionError:
        print("❌ 错误: 无法连接到 API 服务器")
        print("请确保服务器正在运行: python server.py")
    except Exception as e:
        print(f"❌ 错误: {e}")

if __name__ == "__main__":
    main()
