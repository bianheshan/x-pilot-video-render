#!/bin/bash

# 场景上传管理器 - 启动脚本

echo "=================================="
echo "🚀 场景上传管理器"
echo "=================================="
echo ""

# 检查 Python
if ! command -v python3 &> /dev/null; then
    echo "❌ 错误: 未找到 Python 3"
    echo "请先安装 Python 3: https://www.python.org/downloads/"
    exit 1
fi

echo "✅ Python 版本: $(python3 --version)"
echo ""

# 检查并安装依赖
echo "📦 检查依赖..."
if ! python3 -c "import flask" 2>/dev/null; then
    echo "📥 安装依赖..."
    pip3 install -r requirements.txt
else
    echo "✅ 依赖已安装"
fi
echo ""

# 启动服务器
echo "🚀 启动 API 服务器..."
echo ""
python3 server.py
