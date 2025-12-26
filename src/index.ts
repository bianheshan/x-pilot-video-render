import { registerRoot } from "remotion";
import { RemotionRoot } from "./Root";

console.log("🚀 Remotion Studio 正在启动...");
console.log("📦 RemotionRoot:", RemotionRoot);

try {
  registerRoot(RemotionRoot);
  console.log("✅ RemotionRoot 已成功注册");
} catch (error) {
  console.error("❌ 注册 RemotionRoot 时出错:", error);
  throw error;
}
