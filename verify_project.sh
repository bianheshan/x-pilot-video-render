#!/bin/bash
# 项目完整性验证脚本

echo "🔍 Verifying X-Pilot Remotion Template..."
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 计数器
PASSED=0
FAILED=0

# 检查函数
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} $1 (missing)"
        ((FAILED++))
    fi
}

check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $1/"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} $1/ (missing)"
        ((FAILED++))
    fi
}

# 1. 检查配置文件
echo "📦 Checking configuration files..."
check_file "package.json"
check_file "tsconfig.json"
check_file "tailwind.config.js"
check_file "postcss.config.js"
check_file "remotion.config.ts"
check_file ".prettierrc"
check_file ".gitignore"
echo ""

# 2. 检查文档
echo "📚 Checking documentation..."
check_file "README.md"
check_file "QUICKSTART.md"
check_file "PROJECT_GUIDE.md"
check_file "AI_INTEGRATION_GUIDE.md"
check_file "DEPLOYMENT.md"
check_file "CHANGELOG.md"
check_file "PROJECT_OVERVIEW.md"
check_file "SUMMARY.md"
echo ""

# 3. 检查脚本
echo "🔧 Checking scripts..."
check_file "push_scene.py"
check_file "render.js"
check_file "test_push.sh"
echo ""

# 4. 检查示例
echo "📦 Checking examples..."
check_dir "examples"
check_file "examples/example_scene.tsx"
check_file "examples/scenes_config.json"
echo ""

# 5. 检查源代码目录
echo "💻 Checking source directories..."
check_dir "src"
check_dir "src/components"
check_dir "src/components/Layouts"
check_dir "src/scenes"
check_dir "src/assets"
check_dir "src/utils"
check_dir "src/types"
echo ""

# 6. 检查核心文件
echo "🎯 Checking core files..."
check_file "src/index.ts"
check_file "src/Root.tsx"
check_file "src/VideoComposition.tsx"
check_file "src/styles.css"
echo ""

# 7. 检查组件
echo "🧩 Checking components..."
check_file "src/components/index.ts"
check_file "src/components/Subtitle.tsx"
check_file "src/components/TitleCard.tsx"
check_file "src/components/CodeBlock.tsx"
check_file "src/components/AISpeaker.tsx"
check_file "src/components/Layouts/FullScreen.tsx"
check_file "src/components/Layouts/SplitScreen.tsx"
check_file "src/components/Layouts/PictureInPicture.tsx"
echo ""

# 8. 检查工具
echo "🛠️  Checking utilities..."
check_file "src/utils/index.ts"
check_file "src/utils/animations.ts"
check_file "src/utils/assetLoader.ts"
echo ""

# 9. 检查类型
echo "📝 Checking types..."
check_file "src/types/index.ts"
echo ""

# 10. 检查 Node.js
echo "🔍 Checking Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓${NC} Node.js $NODE_VERSION"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} Node.js not found"
    ((FAILED++))
fi
echo ""

# 11. 检查 Python
echo "🔍 Checking Python..."
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version)
    echo -e "${GREEN}✓${NC} $PYTHON_VERSION"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} Python not found"
    ((FAILED++))
fi
echo ""

# 12. 检查依赖
echo "📦 Checking dependencies..."
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} node_modules/ (installed)"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠${NC} node_modules/ (not installed, run: npm install)"
fi
echo ""

# 13. 检查脚本权限
echo "🔐 Checking script permissions..."
if [ -x "push_scene.py" ]; then
    echo -e "${GREEN}✓${NC} push_scene.py (executable)"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠${NC} push_scene.py (not executable)"
fi

if [ -x "test_push.sh" ]; then
    echo -e "${GREEN}✓${NC} test_push.sh (executable)"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠${NC} test_push.sh (not executable)"
fi

if [ -x "render.js" ]; then
    echo -e "${GREEN}✓${NC} render.js (executable)"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠${NC} render.js (not executable)"
fi
echo ""

# 总结
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Verification Summary"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}Passed:${NC} $PASSED"
if [ $FAILED -gt 0 ]; then
    echo -e "${RED}Failed:${NC} $FAILED"
fi
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ Project verification completed successfully!${NC}"
    echo ""
    echo "🚀 Next steps:"
    echo "   1. npm install          # Install dependencies"
    echo "   2. npm run dev          # Start development server"
    echo "   3. bash test_push.sh    # Test scene pushing"
    echo ""
    exit 0
else
    echo -e "${RED}❌ Project verification failed!${NC}"
    echo ""
    echo "Please check the missing files/directories above."
    echo ""
    exit 1
fi
