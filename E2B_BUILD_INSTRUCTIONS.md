# E2B 模板构建说明

## 📋 前置要求

在构建 E2B 模板之前，请确保：

1. ✅ **Docker Desktop 已安装并运行**
   - 下载：https://www.docker.com/products/docker-desktop
   - 安装后启动 Docker Desktop
   - 等待 Docker 状态变为 "Running"

2. ✅ **Node.js 20+ 与项目依赖已安装**
   - 运行：`npm install`

3. ✅ **E2B API Key 已准备**
   - `.env` 中添加：`E2B_API_KEY=e2b_b2345ea59ce87270a8a1468204d25129023fb593`


## 🚀 构建步骤

```bash
# 1. 确保 Docker Desktop 正在运行
docker ps

# 2. 安装依赖（首次或依赖更新后执行）
cd c:\Users\bianh\x-pilot-video-render
npm install

# 3. （可选）临时设置 API Key
# PowerShell:
$env:E2B_API_KEY = "e2b_b2345ea59ce87270a8a1468204d25129023fb593"
# CMD:
# set E2B_API_KEY=e2b_b2345ea59ce87270a8a1468204d25129023fb593

# 4. 构建模板（Template SDK v2）
npm run e2b:build:prod

# 5. （可选）构建开发版别名
npm run e2b:build:dev
```



## 📝 构建过程说明

构建过程包括以下步骤：

1. **读取 Template SDK 配置** - `x-pilot-remotion-template/template.ts` 定义构建指令（从 `node:20-slim`、APT 依赖、npm/pip 安装等）
2. **Docker 构建** - SDK 调用 Docker 构建镜像（可能需要 5-10 分钟）
3. **上传镜像** - 自动上传到 E2B 平台
4. **创建模板** - 在 E2B 平台注册/更新 `x-pilot-remotion-template`


### 预期输出

```
npm run e2b:build:prod

> x-pilot-remotion-template@1.0.0 e2b:build:prod
> cd x-pilot-remotion-template && npx tsx build.prod.ts

🚀 Build started (alias: x-pilot-remotion-template)
[info] Uploading sources (respecting .dockerignore)
[info] Base image: node:20-slim
[info] Step 1/6 aptInstall ffmpeg python3 ...
[info] Step 2/6 npm ci --legacy-peer-deps
[info] Step 3/6 pip3 install --no-cache-dir -r web-uploader/requirements.txt
[info] Step 4/6 copy project files
[info] Step 5/6 set environment + start cmd
[info] Step 6/6 exporting layers
✅ Template created successfully!
Template ID: tpl_xxxxxxxxxx
Alias: x-pilot-remotion-template
```


## ⚠️ 常见问题

### 问题 1: Docker 未运行

**错误信息**：
```
error during connect: ... The system cannot find the file specified.
```

**解决方案**：
1. 启动 Docker Desktop
2. 等待 Docker 完全启动（任务栏图标显示 "Docker Desktop is running"）
3. 重新运行构建脚本

### 问题 2: 缺少 E2B_API_KEY

**错误信息**：
```
Error: E2B_API_KEY is required. Please set it in your environment or .env file.
```

**解决方案**：
1. 检查 `.env` 是否包含 `E2B_API_KEY=...`
2. PowerShell 会话中执行：`$env:E2B_API_KEY="your-key"`
3. CMD 会话中执行：`set E2B_API_KEY=your-key`
4. 重新运行 `npm run e2b:build:prod`


### 问题 3: Docker 构建失败

**可能原因**：
- 网络连接问题（无法下载依赖）
- 磁盘空间不足
- Dockerfile 语法错误

**解决方案**：
1. 检查网络连接
2. 清理 Docker 缓存：`docker system prune -a`
3. 查看详细错误日志

### 问题 4: npm ci 失败

**错误信息**：
```
npm ERR! peer dependency issues
```

**解决方案**：
已在 Dockerfile 中使用 `--legacy-peer-deps`，应该不会出现此问题。
如果仍有问题，可以尝试使用 `npm install` 替代 `npm ci`。

## 📊 构建时间估计

| 步骤 | 预计时间 |
|------|---------|
| 下载基础镜像 (node:20-slim) | 1-2 分钟 |
| 安装系统依赖 (ffmpeg, python) | 2-3 分钟 |
| 安装 npm 依赖 | 3-5 分钟 |
| 安装 Python 依赖 | 1 分钟 |
| 复制文件和最终构建 | 1 分钟 |
| 上传到 E2B | 1-2 分钟 |
| **总计** | **约 10-15 分钟** |

## ✅ 验证模板

构建完成后，验证模板是否可用：

```bash
# 方式 A: 直接查看构建日志中的模板 ID（推荐）
# 方式 B: 登录 https://e2b.dev/dashboard 检查 Templates 页面
# 方式 C: 使用 SDK 
node -e "import { Sandbox } from 'e2b'; (async () => console.log(await Sandbox.list()))();"
```


## 🔄 更新模板

如果需要更新模板（修改了 Dockerfile 或代码）：

```bash
# 重新构建并覆盖同名模板
npm run e2b:build:prod

# 或者快速验证开发版
npm run e2b:build:dev
```


## 📚 下一步

模板构建成功后：

1. ✅ 记录模板 ID
2. ✅ 参考 `E2B_SERVER_GUIDE.md` 创建服务端项目
3. ✅ 在服务端代码中使用模板 ID 创建沙箱

## 💡 提示

- **首次构建**：会比较慢，因为需要下载所有依赖
- **后续构建**：Docker 会缓存层，速度会快很多
- **网络问题**：如果下载慢，可以配置 Docker 镜像加速器
- **磁盘空间**：确保至少有 5GB 可用空间

## 🆘 需要帮助？

如果遇到问题：

1. 检查 Docker Desktop 是否正常运行
2. 查看详细错误信息
3. 参考 [E2B 官方文档](https://e2b.dev/docs/template)
4. 在项目 Issues 中提问

---

准备好了吗？运行 `npm run e2b:build:prod` 开始构建！🚀
