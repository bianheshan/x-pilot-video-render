#!/usr/bin/env node
/**
 * Node.js 渲染脚本
 * 使用 Remotion Node.js API 渲染视频
 */

const { bundle } = require("@remotion/bundler");
const { renderMedia, selectComposition } = require("@remotion/renderer");
const path = require("path");
const fs = require("fs");

const compositionId = "MainVideo";
const outputLocation = path.join(__dirname, "output", "video.mp4");

const render = async () => {
  console.log("🎬 Starting video render...");
  console.time("Total render time");

  try {
    // 确保输出目录存在
    const outputDir = path.dirname(outputLocation);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // 1. 打包项目
    console.log("📦 Bundling project...");
    const bundleLocation = await bundle({
      entryPoint: path.join(__dirname, "src", "index.ts"),
      webpackOverride: (config) => config,
    });
    console.log("✅ Bundle created:", bundleLocation);

    // 2. 获取合成信息
    console.log("🔍 Getting composition...");
    const composition = await selectComposition({
      serveUrl: bundleLocation,
      id: compositionId,
    });
    console.log("✅ Composition found:", composition.id);
    console.log(`   Duration: ${composition.durationInFrames} frames`);
    console.log(`   Size: ${composition.width}x${composition.height}`);
    console.log(`   FPS: ${composition.fps}`);

    // 3. 渲染视频
    console.log("🎥 Rendering video...");
    await renderMedia({
      composition,
      serveUrl: bundleLocation,
      codec: "h264",
      outputLocation,
      onProgress: ({ progress, renderedFrames, encodedFrames }) => {
        const percentage = (progress * 100).toFixed(1);
        process.stdout.write(
          `\r⏳ Progress: ${percentage}% (${renderedFrames}/${composition.durationInFrames} frames)`
        );
      },
    });

    console.log("\n✅ Video rendered successfully!");
    console.log(`📁 Output: ${outputLocation}`);
    console.timeEnd("Total render time");

    // 显示文件信息
    const stats = fs.statSync(outputLocation);
    const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
    console.log(`📊 File size: ${fileSizeMB} MB`);
  } catch (error) {
    console.error("\n❌ Render failed:", error);
    process.exit(1);
  }
};

render();
