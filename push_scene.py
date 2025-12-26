#!/usr/bin/env python3
"""
场景推送脚本 - AI 直接推送场景文件和 manifest

核心功能:
1. 写入场景文件到 src/scenes/
2. 更新 manifest.json

使用方法:
    # 推送单个场景（AI 直接传入代码内容）
    python push_scene.py --content "场景代码" --id scene-1 --name "Introduction" --duration 90
    
    # 推送多个场景（AI 传入 JSON 配置）
    python push_scene.py --batch '{"scenes": [...]}'
"""

import json
from pathlib import Path
from typing import Any, Optional


class ScenePusher:
    """场景推送器 - 简单直接"""
    
    def __init__(self, project_root: str = ".") -> None:
        self.scenes_dir: Path = Path(project_root) / "src" / "scenes"
        self.manifest_path: Path = self.scenes_dir / "manifest.json"
        self.scenes_dir.mkdir(parents=True, exist_ok=True)
    
    def _load_manifest(self):
        """加载 manifest，不存在则返回默认配置"""
        if self.manifest_path.exists():
            return json.loads(self.manifest_path.read_text(encoding='utf-8'))
        return {
            "version": "1.0.0",
            "fps": 30,
            "width": 1920,
            "height": 1080,
            "theme": "tech",  # 默认主题
            "scenes": []
        }
    
    def _save_manifest(self, manifest) -> None:
        """保存 manifest"""
        _ = self.manifest_path.write_text(
            json.dumps(manifest, indent=2, ensure_ascii=False),
            encoding='utf-8'
        )
    
    def push(
        self,
        scene_id: str,
        scene_name: str,
        duration: int,
        code_content: str,
        filename: Optional[str] = None,
        props: Optional[dict] = None,
        theme: Optional[str] = None  # 新增：主题参数
    ) -> bool:
        """
        推送场景
        
        Args:
            scene_id: 场景ID (如 "scene-1")
            scene_name: 场景名称 (如 "DNA Introduction")
            duration: 持续帧数 (如 90)
            code_content: 场景代码内容
            filename: 文件名 (可选，默认为 {scene_id}.tsx)
            props: 场景属性 (可选)
            theme: 主题ID (可选，如 "tech", "cyberpunk", "elegant" 等)
        """
        try:
            # 1. 写入场景文件
            if not filename:
                filename = f"{scene_id}.tsx"
            
            scene_path = self.scenes_dir / filename
            _ = scene_path.write_text(code_content, encoding='utf-8')
            print(f"✅ 场景文件已写入: {scene_path}")
            
            # 2. 更新 manifest
            manifest = self._load_manifest()
            
            # 更新主题（如果提供）
            if theme:
                manifest["theme"] = theme
                print(f"🎨 设置主题: {theme}")
            
            # 查找是否已存在
            scene_index = next(
                (i for i, s in enumerate(manifest["scenes"]) if s["id"] == scene_id),
                None
            )
            
            scene_info = {
                "id": scene_id,
                "name": scene_name,
                "durationInFrames": duration,
                "component": filename
            }
            
            if props:
                scene_info["props"] = props
            
            if scene_index is not None:
                manifest["scenes"][scene_index] = scene_info
                print(f"🔄 更新场景: {scene_name}")
            else:
                manifest["scenes"].append(scene_info)
                print(f"➕ 新增场景: {scene_name}")
            
            self._save_manifest(manifest)
            print(f"✅ Manifest 已更新")
            
            return True
            
        except Exception as e:
            print(f"❌ 推送失败: {e}")
            return False
    
    def push_batch(self, scenes) -> int:
        """
        批量推送场景
        
        Args:
            scenes: 场景列表，每个包含: id, name, duration, content, filename?, props?
        
        Returns:
            成功推送的数量
        """
        success = 0
        for scene in scenes:
            if self.push(
                scene_id=str(scene["id"]),
                scene_name=str(scene["name"]),
                duration=int(scene["duration"]),
                code_content=str(scene["content"]),
                filename=str(scene["filename"]) if scene.get("filename") else None,
                props=scene.get("props")
            ):
                success += 1
        
        print(f"\n📊 批量推送完成: {success}/{len(scenes)} 成功")
        return success
    
    def list_scenes(self) -> None:
        """列出所有场景"""
        manifest = self._load_manifest()
        scenes = manifest.get("scenes", [])
        
        if not scenes:
            print("📭 暂无场景")
            return
        
        print(f"\n📋 当前场景列表 (主题: {manifest.get('theme', 'tech')}):")
        print("-" * 80)
        for i, scene in enumerate(scenes, 1):
            print(f"{i}. [{scene['id']}] {scene['name']}")
            print(f"   持续: {scene['durationInFrames']} 帧")
            print(f"   文件: {scene['component']}")
            if scene.get("props"):
                print(f"   属性: {scene['props']}")
            print()
    
    def set_theme(self, theme: str) -> bool:
        """
        设置视频主题
        
        Args:
            theme: 主题ID (如 "tech", "cyberpunk", "elegant", "nature", "warm", "minimal")
        
        Returns:
            是否成功
        """
        try:
            manifest = self._load_manifest()
            manifest["theme"] = theme
            self._save_manifest(manifest)
            print(f"🎨 主题已设置为: {theme}")
            return True
        except Exception as e:
            print(f"❌ 设置主题失败: {e}")
            return False
    
    def get_theme(self) -> str:
        """获取当前主题"""
        manifest = self._load_manifest()
        return manifest.get("theme", "tech")
        
        print(f"\n📋 共 {len(scenes)} 个场景")
        print(f"🎬 视频配置: {manifest['width']}x{manifest['height']} @ {manifest['fps']}fps\n")
        
        for i, scene in enumerate(scenes, 1):
            print(f"{i}. {scene['name']} (ID: {scene['id']})")
            print(f"   文件: {scene['component']}")
            print(f"   时长: {scene['durationInFrames']} 帧")
            if "props" in scene:
                print(f"   属性: {scene['props']}")
            print()


def main() -> None:
    import argparse
    
    parser = argparse.ArgumentParser(description="推送 AI 生成的场景到项目")
    _ = parser.add_argument("--project-root", default=".", help="项目根目录")
    
    # 单个场景推送
    _ = parser.add_argument("--content", help="场景代码内容")
    _ = parser.add_argument("--id", help="场景ID")
    _ = parser.add_argument("--name", help="场景名称")
    _ = parser.add_argument("--duration", type=int, help="持续帧数")
    _ = parser.add_argument("--filename", help="文件名（可选）")
    _ = parser.add_argument("--props", help="场景属性 JSON（可选）")
    
    # 批量推送
    _ = parser.add_argument("--batch", help="批量推送 JSON 配置")
    
    # 查看
    _ = parser.add_argument("--list", action="store_true", help="列出所有场景")
    
    args = parser.parse_args()
    pusher = ScenePusher(args.project_root)
    
    if args.list:
        pusher.list_scenes()
        return
    
    if args.batch:
        config = json.loads(args.batch)
        _ = pusher.push_batch(config["scenes"])
        return
    
    if args.content and args.id and args.name and args.duration:
        props = json.loads(args.props) if args.props else None
        _ = pusher.push(
            scene_id=args.id,
            scene_name=args.name,
            duration=args.duration,
            code_content=args.content,
            filename=args.filename,
            props=props
        )
        return
    
    parser.print_help()


if __name__ == "__main__":
    main()

