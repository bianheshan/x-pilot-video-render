#!/usr/bin/env python3
"""测试导入是否成功"""

import sys
from pathlib import Path

# 添加父目录到路径
sys.path.insert(0, str(Path(__file__).parent.parent))

try:
    from push_scene import ScenePusher
    print("✅ push_scene.py 导入成功！")
    
    # 测试初始化
    pusher = ScenePusher(str(Path(__file__).parent.parent))
    print("✅ ScenePusher 初始化成功！")
    
    # 测试加载 manifest
    manifest = pusher._load_manifest()
    print(f"✅ Manifest 加载成功！场景数: {len(manifest.get('scenes', []))}")
    
    print("\n🎉 所有测试通过！服务器应该可以正常启动了。")
    print("\n现在可以运行:")
    print("  cd web-uploader")
    print("  python3 server.py")
    
except Exception as e:
    print(f"❌ 错误: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
