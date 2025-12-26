@echo off
REM 场景上传管理器 - Windows 启动脚本

echo ==================================
echo 🚀 场景上传管理器
echo ==================================
echo.

REM 检查 Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误: 未找到 Python
    echo 请先安装 Python: https://www.python.org/downloads/
    pause
    exit /b 1
)

echo ✅ Python 已安装
echo.

REM 检查并安装依赖
echo 📦 检查依赖...
python -c "import flask" >nul 2>&1
if errorlevel 1 (
    echo 📥 安装依赖...
    pip install -r requirements.txt
) else (
    echo ✅ 依赖已安装
)
echo.

REM 启动服务器
echo 🚀 启动 API 服务器...
echo.
python server.py

pause
