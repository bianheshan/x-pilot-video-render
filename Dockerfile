# X-Pilot Remotion Template - E2B Dockerfile
# 用于在 E2B Sandbox 环境中运行 Remotion 视频生成项目

# 使用 Node.js 20 LTS 作为基础镜像（Remotion 4.0 需要 Node.js 18+）
FROM node:20-slim

# 安装系统依赖和构建工具
# Remotion 需要 ffmpeg 进行视频渲染
# Python 用于运行 push_scene.py 脚本
RUN apt-get update && apt-get install -y \
    # 视频处理工具
    ffmpeg \
    # Python 3 和 pip
    python3 \
    python3-pip \
    # 构建工具（某些 npm 包需要）
    build-essential \
    python3-dev \
    # 字体支持（Remotion 可能需要）
    fonts-liberation \
    fonts-dejavu-core \
    # 清理缓存
    && rm -rf /var/lib/apt/lists/*

# 设置工作目录
WORKDIR /app

# 复制 package 文件（利用 Docker 缓存层）
COPY package.json package-lock.json ./

# 安装 Node.js 依赖
# 使用 --legacy-peer-deps 以处理 React 19 的 peer dependency 问题
RUN npm ci --legacy-peer-deps

# 复制 Python 依赖文件（如果有）
COPY web-uploader/requirements.txt ./web-uploader/requirements.txt

# 安装 Python 依赖
RUN pip3 install --no-cache-dir -r web-uploader/requirements.txt

# 复制项目文件
COPY . .

# 创建必要的目录
RUN mkdir -p output src/scenes src/assets/images src/assets/fonts src/assets/audio src/assets/videos

# 设置环境变量
ENV NODE_ENV=production
ENV PYTHONUNBUFFERED=1
ENV DISPLAY=:99

# 暴露端口
# 3000: Remotion Studio
# 5000: Web Uploader (Flask)
EXPOSE 3000 5000

# 默认启动命令 - 启动 Remotion Studio
CMD ["npm", "run", "dev"]


