#!/bin/bash

echo "🧪 测试场景推送功能"
echo "===================="

# 测试 1: 推送单个场景（AI 直接传入代码）
echo -e "\n📝 测试 1: 推送单个场景"
python push_scene.py \
  --id "scene-1" \
  --name "DNA Introduction" \
  --duration 90 \
  --content 'import React from "react";
import { AbsoluteFill } from "remotion";
import { TitleCard, Subtitle } from "../components";

export default function Scene1() {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0f172a" }}>
      <TitleCard 
        title="DNA 双链结构" 
        subtitle="生命的蓝图"
      />
      <Subtitle text="欢迎来到 DNA 世界" position="bottom" />
    </AbsoluteFill>
  );
}'

# 测试 2: 推送另一个场景
echo -e "\n📝 测试 2: 推送第二个场景"
python push_scene.py \
  --id "scene-2" \
  --name "DNA Structure" \
  --duration 120 \
  --filename "Scene2.tsx" \
  --content 'import React from "react";
import { AbsoluteFill } from "remotion";
import { CodeBlock } from "../components";

export default function Scene2() {
  return (
    <AbsoluteFill style={{ backgroundColor: "#1e293b" }}>
      <CodeBlock 
        code="const DNA = { adenine: \"A\", thymine: \"T\", guanine: \"G\", cytosine: \"C\" };"
        language="javascript"
      />
    </AbsoluteFill>
  );
}'

# 测试 3: 批量推送
echo -e "\n📝 测试 3: 批量推送场景"
python push_scene.py --batch '{
  "scenes": [
    {
      "id": "scene-3",
      "name": "DNA Replication",
      "duration": 150,
      "content": "import React from \"react\"; import { AbsoluteFill } from \"remotion\"; export default function Scene3() { return <AbsoluteFill style={{ backgroundColor: \"#334155\" }}><h1>DNA Replication</h1></AbsoluteFill>; }"
    },
    {
      "id": "scene-4",
      "name": "Conclusion",
      "duration": 60,
      "content": "import React from \"react\"; import { AbsoluteFill } from \"remotion\"; export default function Scene4() { return <AbsoluteFill style={{ backgroundColor: \"#475569\" }}><h1>Thank You!</h1></AbsoluteFill>; }"
    }
  ]
}'

# 测试 4: 列出所有场景
echo -e "\n📝 测试 4: 列出所有场景"
python push_scene.py --list

echo -e "\n✅ 测试完成！"
echo "现在可以运行 'npm run dev' 查看效果"
