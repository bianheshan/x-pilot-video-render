"""
E2B 使用示例 - 展示如何为每个用户创建独立的 Sandbox
"""

from e2b import Sandbox
import json
import time

# ============================================
# 示例 1: 单用户会话（推荐模式）
# ============================================

def single_user_workflow(user_id: str, scenes_data: list):
    """
    为单个用户创建独立的 Sandbox，生成视频
    
    Args:
        user_id: 用户 ID
        scenes_data: 场景数据列表
    """
    print(f"🚀 为用户 {user_id} 创建 Sandbox...")
    
    # 1. 创建独立的 Sandbox 实例（基于 Dockerfile）
    sandbox = Sandbox(
        template="x-pilot-remotion-template",  # 您的 Dockerfile
        api_key="your-e2b-api-key"
    )
    
    try:
        print(f"✅ Sandbox 已创建: {sandbox.id}")
        
        # 2. 等待服务启动
        print("⏳ 等待 Remotion Studio 启动...")
        time.sleep(5)
        
        # 3. 推送场景代码（增量写入）
        print("📝 推送场景代码...")
        for scene in scenes_data:
            scene_code = scene['code']
            scene_id = scene['id']
            filename = f"user-{user_id}-{scene_id}.tsx"
            
            # 写入场景文件（增量）
            sandbox.filesystem.write(
                f"/app/src/scenes/{filename}",
                scene_code
            )
            print(f"   ✅ 已写入: {filename}")
        
        # 4. 更新 manifest.json
        print("📋 更新 manifest.json...")
        manifest_update = {
            "scenes": [
                {
                    "id": scene['id'],
                    "name": scene['name'],
                    "durationInFrames": scene['duration'],
                    "component": f"user-{user_id}-{scene['id']}.tsx"
                }
                for scene in scenes_data
            ],
            "fps": 30,
            "width": 1920,
            "height": 1080,
            "theme": "tech"
        }
        
        sandbox.filesystem.write(
            "/app/src/scenes/manifest.json",
            json.dumps(manifest_update, indent=2)
        )
        
        # 5. 渲染视频
        print("🎬 开始渲染视频...")
        render_process = sandbox.process.start(
            "npm",
            ["run", "render"],
            cwd="/app"
        )
        
        # 等待渲染完成
        render_process.wait()
        print("✅ 视频渲染完成")
        
        # 6. 获取视频文件
        print("📥 获取视频文件...")
        video_data = sandbox.filesystem.read("/app/output/video.mp4")
        
        # 7. 保存视频（示例）
        with open(f"output/user-{user_id}-video.mp4", "wb") as f:
            f.write(video_data)
        
        print(f"✅ 视频已保存: output/user-{user_id}-video.mp4")
        
        return video_data
        
    finally:
        # 8. 清理并关闭 Sandbox
        print("🧹 清理 Sandbox...")
        sandbox.close()
        print("✅ Sandbox 已关闭")


# ============================================
# 示例 2: 使用 Python push_scene.py（推荐）
# ============================================

def use_push_scene_script(user_id: str, scenes_data: list):
    """
    使用项目自带的 push_scene.py 脚本
    """
    sandbox = Sandbox(
        template="x-pilot-remotion-template",
        api_key="your-e2b-api-key"
    )
    
    try:
        # 使用 push_scene.py 批量推送
        scenes_json = json.dumps({
            "scenes": [
                {
                    "content": scene['code'],
                    "id": scene['id'],
                    "name": scene['name'],
                    "duration": scene['duration'],
                    "filename": f"user-{user_id}-{scene['id']}.tsx"
                }
                for scene in scenes_data
            ]
        })
        
        # 执行推送脚本
        push_process = sandbox.process.start(
            "python3",
            ["push_scene.py", "--batch", scenes_json],
            cwd="/app"
        )
        
        push_process.wait()
        print("✅ 场景已推送")
        
        # 渲染视频
        render_process = sandbox.process.start(
            "npm",
            ["run", "render"],
            cwd="/app"
        )
        render_process.wait()
        
        # 获取视频
        return sandbox.filesystem.read("/app/output/video.mp4")
        
    finally:
        sandbox.close()


# ============================================
# 示例 3: Sandbox 池管理（生产环境）
# ============================================

class SandboxPool:
    """
    Sandbox 池，用于复用 Sandbox 实例
    
    ⚠️ 重要：每次归还 Sandbox 前必须完全清理用户数据！
    否则下一个用户会看到上一个用户的数据！
    """
    
    def __init__(self, pool_size: int = 5, api_key: str = None, template: str = "base"):
        self.pool = []
        self.pool_size = pool_size
        self.api_key = api_key
        self.template = template
        self.active_sandboxes = {}
    
    def get_sandbox(self, user_id: str) -> Sandbox:
        """获取 Sandbox（从池中或创建新的）"""
        if self.pool:
            sandbox = self.pool.pop()
            print(f"♻️  复用 Sandbox: {sandbox.id}")
            # 确保是干净的（双重保险）
            self._ensure_clean(sandbox)
        else:
            sandbox = Sandbox(
                template=self.template,
                api_key=self.api_key
            )
            print(f"🆕 创建新 Sandbox: {sandbox.id}")
        
        self.active_sandboxes[user_id] = sandbox
        return sandbox
    
    def _ensure_clean(self, sandbox: Sandbox):
        """确保 Sandbox 处于干净状态（双重保险）"""
        try:
            self._clean_all_user_data(sandbox)
        except Exception as e:
            print(f"⚠️  清理检查失败: {e}")
    
    def _clean_all_user_data(self, sandbox: Sandbox):
        """清理所有用户数据"""
        # 1. 删除所有用户场景文件（不限于特定用户）
        try:
            files = sandbox.filesystem.list("/app/src/scenes")
            for file in files:
                if file.endswith('.tsx') and file != 'scene_1_intro.tsx':  # 保留示例文件（如果有）
                    try:
                        sandbox.filesystem.remove(f"/app/src/scenes/{file}")
                    except:
                        pass
        except:
            pass
        
        # 2. 重置 manifest.json 到初始状态
        default_manifest = {
            "version": "1.0.0",
            "fps": 30,
            "width": 1920,
            "height": 1080,
            "scenes": [],  # 空数组！
            "theme": "tech"
        }
        try:
            sandbox.filesystem.write(
                "/app/src/scenes/manifest.json",
                json.dumps(default_manifest, indent=2, ensure_ascii=False)
            )
        except:
            pass
        
        # 3. 清理输出目录
        try:
            output_files = sandbox.filesystem.list("/app/output")
            for file in output_files:
                if file.endswith(('.mp4', '.mov', '.avi')):
                    try:
                        sandbox.filesystem.remove(f"/app/output/{file}")
                    except:
                        pass
        except:
            pass
    
    def return_sandbox(self, user_id: str):
        """
        归还 Sandbox 到池中
        
        ⚠️ 关键：必须完全清理用户数据！
        """
        if user_id not in self.active_sandboxes:
            return
        
        sandbox = self.active_sandboxes.pop(user_id)
        
        # 清理用户数据（关键步骤！）
        try:
            print(f"🧹 清理 Sandbox {sandbox.id} 的用户数据...")
            self._clean_all_user_data(sandbox)
            print(f"✅ Sandbox {sandbox.id} 已清理干净")
            
            # 验证清理结果（可选但推荐）
            if self._verify_clean(sandbox):
                # 归还到池中
                if len(self.pool) < self.pool_size:
                    self.pool.append(sandbox)
                    print(f"✅ Sandbox 已归还到池中")
                else:
                    sandbox.close()
                    print(f"🔒 池已满，关闭 Sandbox")
            else:
                # 验证失败，不归还，直接关闭
                print(f"❌ 清理验证失败，关闭 Sandbox")
                sandbox.close()
                
        except Exception as e:
            print(f"❌ 清理失败: {e}")
            # 清理失败，不归还到池中，直接关闭
            sandbox.close()
    
    def _verify_clean(self, sandbox: Sandbox) -> bool:
        """验证 Sandbox 是否干净"""
        try:
            # 检查 manifest.json
            manifest_content = sandbox.filesystem.read("/app/src/scenes/manifest.json")
            manifest = json.loads(manifest_content)
            
            if manifest.get("scenes"):
                print(f"⚠️  警告：manifest.json 中还有 {len(manifest['scenes'])} 个场景")
                return False
            
            return True
        except:
            return True  # 如果验证过程出错，假设是干净的
    
    def cleanup_all(self):
        """清理所有 Sandbox"""
        for sandbox in self.pool:
            try:
                sandbox.close()
            except:
                pass
        for sandbox in self.active_sandboxes.values():
            try:
                sandbox.close()
            except:
                pass
        self.pool.clear()
        self.active_sandboxes.clear()
        print("🧹 所有 Sandbox 已清理")


# ============================================
# 示例 4: 并发处理多个用户
# ============================================

import asyncio
from concurrent.futures import ThreadPoolExecutor

async def handle_multiple_users(users_data: list):
    """
    并发处理多个用户的视频生成请求
    """
    pool = SandboxPool(pool_size=10)
    executor = ThreadPoolExecutor(max_workers=5)
    
    async def process_user(user_data):
        user_id = user_data['user_id']
        scenes = user_data['scenes']
        
        # 在线程池中执行（因为 Sandbox 操作是同步的）
        loop = asyncio.get_event_loop()
        result = await loop.run_in_executor(
            executor,
            single_user_workflow,
            user_id,
            scenes
        )
        return result
    
    # 并发处理所有用户
    tasks = [process_user(user_data) for user_data in users_data]
    results = await asyncio.gather(*tasks)
    
    pool.cleanup_all()
    return results


# ============================================
# 使用示例
# ============================================

if __name__ == "__main__":
    # 示例场景数据
    example_scenes = [
        {
            "id": "scene-1",
            "name": "Introduction",
            "duration": 90,
            "code": """
import React from "react";
import { AbsoluteFill } from "remotion";
import { TitleCard } from "../components";

export default function Scene1() {
  return (
    <AbsoluteFill>
      <TitleCard title="Hello World" subtitle="From E2B" />
    </AbsoluteFill>
  );
}
"""
        }
    ]
    
    # 使用示例
    # single_user_workflow("user-123", example_scenes)
    
    print("📚 这是 E2B 使用示例代码")
    print("请根据您的实际需求修改和调用这些函数")

