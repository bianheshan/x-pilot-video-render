# Assets Directory

此目录用于存放内置资产文件：

## 目录结构

- `fonts/` - 字体文件
- `images/` - 图片资源（LOGO、图标等）
- `audio/` - 音频文件（背景音乐、音效等）
- `videos/` - 视频素材

## 使用方式

在组件中导入资产：

```tsx
import logo from "../assets/images/logo.png";
import bgMusic from "../assets/audio/background.mp3";
```

## 注意事项

- 资产文件会被打包到最终视频中
- 建议使用相对路径导入
- 大文件建议使用外部 URL 或动态下载
