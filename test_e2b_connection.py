#!/usr/bin/env python3
"""
E2B 连接测试脚本
用于验证 API key 和连接是否正常
"""

import os
import sys
from e2b import Sandbox

def test_connection():
    """测试 E2B 连接"""
    
    # 从环境变量或直接设置获取 API key
    API_KEY = os.getenv("E2B_API_KEY")
    
    if not API_KEY:
        print("❌ 错误: 未找到 E2B_API_KEY 环境变量")
        print("\n请设置 API key:")
        print("  Linux/Mac: export E2B_API_KEY='your-api-key'")
        print("  Windows:   set E2B_API_KEY=your-api-key")
        print("\n或者直接修改脚本中的 API_KEY 变量")
        return False
    
    print("🔌 测试 E2B 连接...")
    print(f"📋 API Key: {API_KEY[:10]}...{API_KEY[-4:]}")
    print()
    
    try:
        # 创建测试 Sandbox（使用基础模板）
        print("1️⃣ 创建测试 Sandbox...")
        print("   💡 提示: 如果项目在 Git 仓库，可以使用:")
        print("      Sandbox.from_template('https://github.com/...', api_key=API_KEY)")
        print()
        sandbox = Sandbox(
            template="base",  # 使用基础模板进行测试
            api_key=API_KEY
        )
        
        print(f"   ✅ Sandbox 已创建")
        print(f"   📦 Sandbox ID: {sandbox.id}")
        print()
        
        # 测试执行命令
        print("2️⃣ 测试命令执行...")
        process = sandbox.process.start("echo", ["Hello from E2B!"])
        process.wait()
        output = process.stdout.read()
        print(f"   ✅ 命令执行成功")
        print(f"   📝 输出: {output.strip()}")
        print()
        
        # 测试文件系统
        print("3️⃣ 测试文件系统...")
        test_file = "/tmp/test.txt"
        test_content = "E2B connection test successful!"
        
        sandbox.filesystem.write(test_file, test_content)
        read_content = sandbox.filesystem.read(test_file)
        
        if read_content == test_content:
            print(f"   ✅ 文件读写正常")
        else:
            print(f"   ⚠️  文件内容不匹配")
        print()
        
        # 关闭 Sandbox
        print("4️⃣ 关闭 Sandbox...")
        sandbox.close()
        print(f"   ✅ Sandbox 已关闭")
        print()
        
        print("=" * 50)
        print("✅ 所有测试通过！E2B 连接正常")
        print("=" * 50)
        print()
        print("📚 下一步:")
        print("   1. 查看 E2B_QUICKSTART.md 了解如何使用")
        print("   2. 运行 generate_video.py 生成第一个视频")
        print("   3. 查看 E2B_ARCHITECTURE.md 了解架构")
        
        return True
        
    except Exception as e:
        print("=" * 50)
        print("❌ 测试失败")
        print("=" * 50)
        print(f"错误信息: {e}")
        print()
        print("🔍 请检查:")
        print("   1. API key 是否正确")
        print("   2. 网络连接是否正常")
        print("   3. E2B 账户是否有效")
        print("   4. 是否有足够的配额")
        return False


if __name__ == "__main__":
    success = test_connection()
    sys.exit(0 if success else 1)

