import fs from "node:fs";
import path from "node:path";
import * as ts from "typescript";

const projectRoot = process.cwd();
const manifestPath = path.join(projectRoot, "src", "scenes", "manifest.json");
const registryOutPath = path.join(projectRoot, "src", "scene-registry.generated.tsx");
const reportPath = path.join(projectRoot, "out", "scene-preflight-report.json");

const toPosix = (p) => p.replace(/\\/g, "/");

const normalizeComponent = (componentPath) => {
  const s = String(componentPath ?? "").trim();
  return s
    .replace(/^\.\//, "")
    .replace(/^scenes\//, "")
    .replace(/^src\/scenes\//, "")
    .replace(/\.tsx?$/i, "");
};

const safeReadJson = (p) => {
  try {
    const raw = fs.readFileSync(p, "utf8");
    return JSON.parse(raw);
  } catch (e) {
    return { __error: e };
  }
};

const formatDiagnostic = (sourceFile, diag) => {
  const msg = ts.flattenDiagnosticMessageText(diag.messageText, "\n");
  const start = diag.start ?? 0;
  const { line, character } = ts.getLineAndCharacterOfPosition(sourceFile, start);
  return {
    message: msg,
    line: line + 1,
    column: character + 1,
    tsCode: diag.code,
  };
};

const checkSyntax = (absFilePath) => {
  const code = fs.readFileSync(absFilePath, "utf8");
  const sourceFile = ts.createSourceFile(
    absFilePath,
    code,
    ts.ScriptTarget.ESNext,
    true,
    ts.ScriptKind.TSX
  );

  const diags = sourceFile.parseDiagnostics ?? [];
  if (diags.length === 0) return { ok: true };

  const first = formatDiagnostic(sourceFile, diags[0]);
  return { ok: false, firstDiagnostic: first };
};

const nowIso = () => new Date().toISOString();

/**
 * 统一的错误码（便于 E2B 管理平台分类/聚合/告警/回传）。
 */
const IssueCode = {
  MANIFEST_READ_ERROR: "MANIFEST_READ_ERROR",
  INVALID_COMPONENT_PATH: "INVALID_COMPONENT_PATH",
  SCENE_MISSING_FILE: "SCENE_MISSING_FILE",
  SCENE_SYNTAX_ERROR: "SCENE_SYNTAX_ERROR",
  SCENE_LOAD_ERROR: "SCENE_LOAD_ERROR",
  SCENE_EXPORT_ERROR: "SCENE_EXPORT_ERROR",
  SCENE_NOT_REGISTERED: "SCENE_NOT_REGISTERED",
};

const manifestJson = safeReadJson(manifestPath);
if (manifestJson.__error) {
  const report = {
    schemaVersion: 1,
    kind: "scene_preflight_report",
    createdAt: nowIso(),
    ok: false,
    manifestPath: toPosix(path.relative(projectRoot, manifestPath)),
    issues: [
      {
        code: IssueCode.MANIFEST_READ_ERROR,
        detail: String(manifestJson.__error?.message ?? manifestJson.__error),
      },
    ],
  };

  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), "utf8");
  console.log(`[E2B_SCENE_PREFLIGHT_REPORT] ${JSON.stringify(report)}`);

  console.error(`[scene-preflight] Failed to read manifest.json: ${manifestPath}`);
  console.error(manifestJson.__error);
  process.exit(1);
}

const scenes = Array.isArray(manifestJson.scenes) ? manifestJson.scenes : [];

const issues = [];
const cases = [];

for (const scene of scenes) {
  const sceneId = String(scene?.id ?? "");
  const componentRaw = String(scene?.component ?? "");
  const clean = normalizeComponent(componentRaw);

  if (!clean) {
    const detail = "Empty component path";
    issues.push({
      code: IssueCode.INVALID_COMPONENT_PATH,
      sceneId,
      component: componentRaw,
      detail,
    });

    cases.push({
      clean,
      kind: "invalid",
      sceneId,
      componentRaw,
      issue: { code: IssueCode.INVALID_COMPONENT_PATH, detail },
    });
    continue;
  }

  const absTsxPath = path.join(projectRoot, "src", "scenes", `${clean}.tsx`);
  const relTsxPath = toPosix(path.relative(projectRoot, absTsxPath));

  if (!fs.existsSync(absTsxPath)) {
    const detail = `Missing file: ${relTsxPath}`;

    issues.push({
      code: IssueCode.SCENE_MISSING_FILE,
      sceneId,
      component: componentRaw,
      file: relTsxPath,
      detail,
    });

    cases.push({
      clean,
      kind: "missing",
      sceneId,
      componentRaw,
      issue: { code: IssueCode.SCENE_MISSING_FILE, detail },
    });
    continue;
  }

  const syntax = checkSyntax(absTsxPath);
  if (!syntax.ok) {
    const d = syntax.firstDiagnostic;
    const detail = `${relTsxPath}:${d.line}:${d.column} TS${d.tsCode}: ${d.message}`;

    issues.push({
      code: IssueCode.SCENE_SYNTAX_ERROR,
      sceneId,
      component: componentRaw,
      file: relTsxPath,
      line: d.line,
      column: d.column,
      tsCode: d.tsCode,
      detail,
    });

    cases.push({
      clean,
      kind: "syntax",
      sceneId,
      componentRaw,
      issue: { code: IssueCode.SCENE_SYNTAX_ERROR, detail },
    });
    continue;
  }

  cases.push({
    clean,
    kind: "ok",
    sceneId,
    componentRaw,
    relRequire: `./scenes/${clean}`,
  });
}

const report = {
  schemaVersion: 1,
  kind: "scene_preflight_report",
  createdAt: nowIso(),
  ok: issues.length === 0,
  manifestPath: toPosix(path.relative(projectRoot, manifestPath)),
  registryOutPath: toPosix(path.relative(projectRoot, registryOutPath)),
  reportPath: toPosix(path.relative(projectRoot, reportPath)),
  sceneCount: scenes.length,
  issueCount: issues.length,
  issues,
};

fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), "utf8");
console.log(`[E2B_SCENE_PREFLIGHT_REPORT] ${JSON.stringify(report)}`);

const generated = `/* eslint-disable */
/*
 * AUTO-GENERATED by scripts/scene-preflight.mjs
 *
 * Goal:
 * - Avoid webpack context-importing ALL files under src/scenes (which would make ONE broken TSX crash startup)
 * - If a scene file is missing or has TSX syntax errors, we DO NOT import it at all; we render a placeholder instead.
 */

import React from "react";
import { AbsoluteFill } from "remotion";

export type SceneIssueCode =
  | "${IssueCode.INVALID_COMPONENT_PATH}"
  | "${IssueCode.SCENE_MISSING_FILE}"
  | "${IssueCode.SCENE_SYNTAX_ERROR}"
  | "${IssueCode.SCENE_LOAD_ERROR}"
  | "${IssueCode.SCENE_EXPORT_ERROR}"
  | "${IssueCode.SCENE_NOT_REGISTERED}";

export type SceneLoadIssue = {
  code: SceneIssueCode;
  detail: string;
};

export type SceneLoadResult = {
  Component: React.ComponentType<Record<string, unknown>>;
  issue?: SceneLoadIssue;
};

const normalizeComponent = (componentPath: string) => {
  return String(componentPath ?? "")
    .trim()
    .replace(/^\\.\\//, "")
    .replace(/^scenes\\//, "")
    .replace(/^src\\/scenes\\//, "")
    .replace(/\\.tsx?$/i, "");
};

const makePlaceholder = (title: string, detail: string): React.ComponentType<Record<string, unknown>> => {
  return () => (
    <AbsoluteFill
      style={{
        backgroundColor: "#0b1020",
        color: "#ffffff",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto",
        padding: 60,
      }}
    >
      <div style={{ maxWidth: 1500 }}>
        <div style={{ fontSize: 44, fontWeight: 900, marginBottom: 12 }}>{title}</div>
        <div
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 16,
            padding: 20,
            fontSize: 18,
            lineHeight: 1.5,
            whiteSpace: "pre-wrap",
          }}
        >
          {detail}
        </div>
        <div style={{ marginTop: 16, fontSize: 16, opacity: 0.85 }}>
          说明：这是模板项目级兜底。请修复生成 Prompt（\`generator-scene-code.md\`）避免再次生成错误。
        </div>
      </div>
    </AbsoluteFill>
  );
};

const pickComponent = (moduleExports: any): { Component: React.ComponentType<Record<string, unknown>>; exported: boolean } => {
  const maybeDefault = moduleExports?.default;
  if (typeof maybeDefault === "function") return { Component: maybeDefault, exported: true };

  if (moduleExports && typeof moduleExports === "object") {
    for (const k of Object.keys(moduleExports)) {
      const v = moduleExports[k];
      if (typeof v === "function") return { Component: v, exported: true };
    }
  }

  return {
    Component: makePlaceholder(
      "Scene Export Error",
      "The module loaded, but it did not export a React component."
    ),
    exported: false,
  };
};

export const getSceneComponent = (componentPath: string): SceneLoadResult => {
  const clean = normalizeComponent(componentPath);

  switch (clean) {
${cases
  .map((c) => {
    if (c.kind === "ok") {
      return `    case ${JSON.stringify(c.clean)}: {\n      try {\n        // eslint-disable-next-line @typescript-eslint/no-require-imports\n        const m = require(${JSON.stringify(c.relRequire)});\n        const picked = pickComponent(m);\n        if (!picked.exported) {\n          return { Component: picked.Component, issue: { code: \"${IssueCode.SCENE_EXPORT_ERROR}\", detail: \"No React component export\" } };\n        }\n        return { Component: picked.Component };\n      } catch (e) {\n        const msg = e instanceof Error ? (e.stack ?? e.message) : String(e);\n        return { Component: makePlaceholder(\"Scene Load Error\", msg), issue: { code: \"${IssueCode.SCENE_LOAD_ERROR}\", detail: msg } };\n      }\n    }`;
    }

    const issue = c.issue ?? { code: IssueCode.SCENE_NOT_REGISTERED, detail: "Unknown" };

    // invalid/missing/syntax
    const titleMap = {
      [IssueCode.INVALID_COMPONENT_PATH]: "Scene Invalid Component",
      [IssueCode.SCENE_MISSING_FILE]: "Scene Missing",
      [IssueCode.SCENE_SYNTAX_ERROR]: "Scene Syntax Error",
    };

    const title = titleMap[issue.code] ?? "Scene Error";

    return `    case ${JSON.stringify(c.clean)}: {\n      const detail = ${JSON.stringify(issue.detail)};\n      return { Component: makePlaceholder(${JSON.stringify(title)}, detail), issue: { code: ${JSON.stringify(issue.code)}, detail } };\n    }`;
  })
  .filter(Boolean)
  .join("\n")}

    default: {
      const detail = "Unregistered scene component: " + componentPath;
      return {
        Component: makePlaceholder("Scene Not Registered", detail),
        issue: { code: "${IssueCode.SCENE_NOT_REGISTERED}", detail },
      };
    }
  }
};
`;

fs.mkdirSync(path.dirname(registryOutPath), { recursive: true });
fs.writeFileSync(registryOutPath, generated, "utf8");

if (issues.length > 0) {
  console.warn(
    `\n[scene-preflight] Found ${issues.length} scene issue(s). Generated registry will show placeholders for them:`
  );
  for (const i of issues) {
    console.warn(
      `- ${i.sceneId || "(no-id)"} (${i.component}): ${i.code}: ${i.detail}`
    );
  }
  console.warn("");
} else {
  console.log("[scene-preflight] All scenes passed syntax/missing-file checks.");
}

const strict = process.env.SCENES_STRICT === "1";
if (strict && issues.length > 0) {
  process.exit(1);
}
