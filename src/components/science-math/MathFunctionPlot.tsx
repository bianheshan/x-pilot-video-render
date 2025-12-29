import React, { useEffect, useMemo, useRef } from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { useTheme } from "../../contexts/ThemeContext";

type Token =
  | { t: "num"; v: number }
  | { t: "var"; n: string }
  | { t: "op"; o: "+" | "-" | "*" | "/" | "^" | "neg" }
  | { t: "func"; n: string; argc: number };

type ParseResult = { ok: true; rpn: Token[] } | { ok: false; error: string };

type EvalFn = (x: number, params: Record<string, number>) => number | null;

const isAlpha = (c: string) => /[a-zA-Z_]/.test(c);
const isAlnum = (c: string) => /[a-zA-Z0-9_]/.test(c);
const isDigit = (c: string) => /[0-9]/.test(c);

const normalizeExpression = (expr: string) => expr.replaceAll("Math.", "");

const getOpPrec = (o: "+" | "-" | "*" | "/" | "^" | "neg") => {
  switch (o) {
    case "neg":
      return 4;
    case "^":
      return 3;
    case "*":
    case "/":
      return 2;
    case "+":
    case "-":
      return 1;
  }
};

const isRightAssoc = (o: "+" | "-" | "*" | "/" | "^" | "neg") => o === "^" || o === "neg";

const allowedFunctions: Record<string, { argc: number; fn: (...args: number[]) => number }> = {
  sin: { argc: 1, fn: (a) => Math.sin(a) },
  cos: { argc: 1, fn: (a) => Math.cos(a) },
  tan: { argc: 1, fn: (a) => Math.tan(a) },
  asin: { argc: 1, fn: (a) => Math.asin(a) },
  acos: { argc: 1, fn: (a) => Math.acos(a) },
  atan: { argc: 1, fn: (a) => Math.atan(a) },
  sqrt: { argc: 1, fn: (a) => Math.sqrt(a) },
  abs: { argc: 1, fn: (a) => Math.abs(a) },
  exp: { argc: 1, fn: (a) => Math.exp(a) },
  log: { argc: 1, fn: (a) => Math.log(a) },
  log10: { argc: 1, fn: (a) => Math.log10(a) },
  pow: { argc: 2, fn: (a, b) => Math.pow(a, b) },
  min: { argc: 2, fn: (a, b) => Math.min(a, b) },
  max: { argc: 2, fn: (a, b) => Math.max(a, b) },
};

type LexToken =
  | { t: "num"; v: number }
  | { t: "ident"; n: string }
  | { t: "op"; o: "+" | "-" | "*" | "/" | "^" }
  | { t: "lparen" }
  | { t: "rparen" }
  | { t: "comma" };

const lex = (raw: string): { ok: true; tokens: LexToken[] } | { ok: false; error: string } => {
  const s = normalizeExpression(raw);
  const tokens: LexToken[] = [];

  let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (c === " " || c === "\t" || c === "\n" || c === "\r") {
      i++;
      continue;
    }

    if (isDigit(c) || (c === "." && isDigit(s[i + 1] || ""))) {
      let j = i + 1;
      while (j < s.length && (isDigit(s[j]) || s[j] === ".")) j++;
      const n = Number(s.slice(i, j));
      if (!Number.isFinite(n)) return { ok: false, error: `Invalid number at ${i}` };
      tokens.push({ t: "num", v: n });
      i = j;
      continue;
    }

    if (isAlpha(c)) {
      let j = i + 1;
      while (j < s.length && isAlnum(s[j])) j++;
      tokens.push({ t: "ident", n: s.slice(i, j) });
      i = j;
      continue;
    }

    if (c === "+" || c === "-" || c === "*" || c === "/" || c === "^") {
      tokens.push({ t: "op", o: c });
      i++;
      continue;
    }

    if (c === "(") {
      tokens.push({ t: "lparen" });
      i++;
      continue;
    }

    if (c === ")") {
      tokens.push({ t: "rparen" });
      i++;
      continue;
    }

    if (c === ",") {
      tokens.push({ t: "comma" });
      i++;
      continue;
    }

    return { ok: false, error: `Unexpected character '${c}' at ${i}` };
  }

  return { ok: true, tokens };
};

const parseToRpn = (expr: string): ParseResult => {
  const lexed = lex(expr);
  if (!lexed.ok) return { ok: false, error: lexed.error };

  const output: Token[] = [];
  const stack: (Token | { t: "lparen" })[] = [];

  let prev: LexToken | null = null;

  const pushOp = (op: "+" | "-" | "*" | "/" | "^" | "neg") => {
    const p = getOpPrec(op);
    while (stack.length > 0) {
      const top = stack[stack.length - 1];
      if (top.t !== "op") break;
      const p2 = getOpPrec(top.o);
      if (p2 > p || (p2 === p && !isRightAssoc(op))) {
        output.push(stack.pop() as Token);
      } else {
        break;
      }
    }
    stack.push({ t: "op", o: op });
  };

  for (let i = 0; i < lexed.tokens.length; i++) {
    const tok = lexed.tokens[i];

    if (tok.t === "num") {
      output.push({ t: "num", v: tok.v });
      prev = tok;
      continue;
    }

    if (tok.t === "ident") {
      const next = lexed.tokens[i + 1];
      const isCall = next?.t === "lparen";

      const name = tok.n;
      if (isCall) {
        const fn = allowedFunctions[name];
        if (!fn) return { ok: false, error: `Unsupported function: ${name}` };
        stack.push({ t: "func", n: name, argc: fn.argc });
      } else {
        const lower = name.toLowerCase();
        if (lower === "pi") output.push({ t: "num", v: Math.PI });
        else if (lower === "e") output.push({ t: "num", v: Math.E });
        else if (name === "x") output.push({ t: "var", n: "x" });
        else output.push({ t: "var", n: name });
      }

      prev = tok;
      continue;
    }

    if (tok.t === "op") {
      const unary =
        tok.o === "-" &&
        (!prev || prev.t === "op" || prev.t === "lparen" || prev.t === "comma");

      pushOp(unary ? "neg" : tok.o);
      prev = tok;
      continue;
    }

    if (tok.t === "lparen") {
      stack.push({ t: "lparen" });
      prev = tok;
      continue;
    }

    if (tok.t === "comma") {
      while (stack.length > 0 && stack[stack.length - 1].t !== "lparen") {
        output.push(stack.pop() as Token);
      }
      if (stack.length === 0) return { ok: false, error: "Misplaced comma" };
      prev = tok;
      continue;
    }

    if (tok.t === "rparen") {
      while (stack.length > 0 && stack[stack.length - 1].t !== "lparen") {
        output.push(stack.pop() as Token);
      }
      if (stack.length === 0) return { ok: false, error: "Mismatched parentheses" };
      stack.pop();

      const top = stack[stack.length - 1];
      if (top?.t === "func") {
        output.push(stack.pop() as Token);
      }

      prev = tok;
      continue;
    }
  }

  while (stack.length > 0) {
    const t = stack.pop()!;
    if (t.t === "lparen") return { ok: false, error: "Mismatched parentheses" };
    output.push(t);
  }

  return { ok: true, rpn: output };
};

const compile = (expr: string): { ok: true; fn: EvalFn } | { ok: false; error: string } => {
  const parsed = parseToRpn(expr);
  if (!parsed.ok) return parsed;

  const rpn = parsed.rpn;

  const fn: EvalFn = (x, params) => {
    const st: number[] = [];

    for (const t of rpn) {
      if (t.t === "num") {
        st.push(t.v);
        continue;
      }

      if (t.t === "var") {
        if (t.n === "x") st.push(x);
        else {
          const v = params[t.n];
          if (!Number.isFinite(v)) return null;
          st.push(v);
        }
        continue;
      }

      if (t.t === "op") {
        if (t.o === "neg") {
          const a = st.pop();
          if (a === undefined) return null;
          st.push(-a);
          continue;
        }

        const b = st.pop();
        const a = st.pop();
        if (a === undefined || b === undefined) return null;

        switch (t.o) {
          case "+":
            st.push(a + b);
            break;
          case "-":
            st.push(a - b);
            break;
          case "*":
            st.push(a * b);
            break;
          case "/":
            st.push(a / b);
            break;
          case "^":
            st.push(Math.pow(a, b));
            break;
        }
        continue;
      }

      if (t.t === "func") {
        const spec = allowedFunctions[t.n];
        const args: number[] = [];
        for (let k = 0; k < t.argc; k++) {
          const v = st.pop();
          if (v === undefined) return null;
          args.unshift(v);
        }
        const out = spec.fn(...args);
        if (!Number.isFinite(out)) return null;
        st.push(out);
        continue;
      }

      return null;
    }

    if (st.length !== 1) return null;
    const out = st[0];
    return Number.isFinite(out) ? out : null;
  };

  return { ok: true, fn };
};

export interface MathFunctionPlotProps {
  /** 函数表达式（变量名为 x；支持 sin/cos/tan/sqrt/abs/exp/log/pow 等，支持常量 pi/e） */
  expression: string;
  /** 函数名称 */
  functionName?: string;
  /** X 轴范围 */
  xRange?: [number, number];
  /** Y 轴范围 */
  yRange?: [number, number];
  /** 是否显示网格 */
  showGrid?: boolean;
  /** 动画参数 (如 a, b, c 等) */
  animatedParams?: Record<string, { from: number; to: number }>;
  /** 参数动画时长（帧） */
  paramsDurationInFrames?: number;
  /** 采样点数量（越大越精细，但更慢） */
  samples?: number;
  /** 画布尺寸（默认 1000x600） */
  canvasWidth?: number;
  canvasHeight?: number;
}

/**
 * 数学函数绘图仪（安全表达式 + 帧驱动参数动画）
 * - 不使用 new Function（更安全、可控）
 * - 适合教学视频：表达式可解释、输出可复现
 */
export const MathFunctionPlot: React.FC<MathFunctionPlotProps> = ({
  expression = "sin(x)",
  functionName = "y = sin(x)",
  xRange = [-10, 10],
  yRange = [-5, 5],
  showGrid = true,
  animatedParams = {},
  paramsDurationInFrames = 120,
  samples = 800,
  canvasWidth = 1000,
  canvasHeight = 600,
}) => {
  const frame = useCurrentFrame();
  const theme = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const params = useMemo(() => {
    const out: Record<string, number> = {};
    for (const [key, { from, to }] of Object.entries(animatedParams)) {
      out[key] = interpolate(frame, [0, paramsDurationInFrames], [from, to], {
        extrapolateRight: "clamp",
      });
    }
    return out;
  }, [animatedParams, frame, paramsDurationInFrames]);

  const compiled = useMemo(() => compile(expression), [expression]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.fillStyle = theme.colors.background;
    ctx.fillRect(0, 0, width, height);

    const xToCanvas = (x: number) => ((x - xRange[0]) / (xRange[1] - xRange[0])) * width;
    const yToCanvas = (y: number) => height - ((y - yRange[0]) / (yRange[1] - yRange[0])) * height;

    if (showGrid) {
      ctx.strokeStyle = theme.colors.surfaceLight;
      ctx.lineWidth = 1;

      for (let x = Math.ceil(xRange[0]); x <= xRange[1]; x++) {
        const cx = xToCanvas(x);
        ctx.beginPath();
        ctx.moveTo(cx, 0);
        ctx.lineTo(cx, height);
        ctx.stroke();
      }

      for (let y = Math.ceil(yRange[0]); y <= yRange[1]; y++) {
        const cy = yToCanvas(y);
        ctx.beginPath();
        ctx.moveTo(0, cy);
        ctx.lineTo(width, cy);
        ctx.stroke();
      }
    }

    ctx.strokeStyle = theme.colors.text;
    ctx.lineWidth = 2;

    if (yRange[0] <= 0 && yRange[1] >= 0) {
      const y0 = yToCanvas(0);
      ctx.beginPath();
      ctx.moveTo(0, y0);
      ctx.lineTo(width, y0);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(width - 10, y0 - 5);
      ctx.lineTo(width, y0);
      ctx.lineTo(width - 10, y0 + 5);
      ctx.stroke();
    }

    if (xRange[0] <= 0 && xRange[1] >= 0) {
      const x0 = xToCanvas(0);
      ctx.beginPath();
      ctx.moveTo(x0, 0);
      ctx.lineTo(x0, height);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(x0 - 5, 10);
      ctx.lineTo(x0, 0);
      ctx.lineTo(x0 + 5, 10);
      ctx.stroke();
    }

    if (!compiled.ok) {
      ctx.fillStyle = theme.colors.error || "#ef4444";
      ctx.font = `16px ${theme.fonts.mono}`;
      ctx.textAlign = "left";
      ctx.fillText(`Expression error: ${compiled.error}`, 20, 30);
      return;
    }

    const evalFn = compiled.fn;

    ctx.strokeStyle = theme.colors.primary;
    ctx.lineWidth = 3;

    ctx.beginPath();

    let started = false;
    const safeSamples = Math.max(100, Math.min(3000, Math.floor(samples)));

    for (let i = 0; i <= safeSamples; i++) {
      const x = xRange[0] + (i / safeSamples) * (xRange[1] - xRange[0]);
      const y = evalFn(x, params);

      if (y !== null && y >= yRange[0] && y <= yRange[1]) {
        const cx = xToCanvas(x);
        const cy = yToCanvas(y);

        if (!started) {
          ctx.moveTo(cx, cy);
          started = true;
        } else {
          ctx.lineTo(cx, cy);
        }
      } else {
        started = false;
      }
    }

    ctx.stroke();

    ctx.fillStyle = theme.colors.text;
    ctx.font = `14px ${theme.fonts.mono}`;

    ctx.textAlign = "center";
    for (let x = Math.ceil(xRange[0]); x <= xRange[1]; x++) {
      if (x === 0) continue;
      const cx = xToCanvas(x);
      const cy = yToCanvas(0);
      ctx.fillText(x.toString(), cx, Math.min(Math.max(cy + 20, 20), height - 5));
    }

    ctx.textAlign = "right";
    for (let y = Math.ceil(yRange[0]); y <= yRange[1]; y++) {
      if (y === 0) continue;
      const cx = xToCanvas(0);
      const cy = yToCanvas(y);
      ctx.fillText(y.toString(), Math.min(Math.max(cx - 10, 30), width - 10), cy + 5);
    }
  }, [canvasHeight, canvasWidth, compiled, expression, params, samples, showGrid, theme, xRange, yRange]);

  const opacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 40,
        fontFamily: theme.fonts.body,
        backgroundColor: theme.colors.background,
        opacity,
      }}
    >
      <h2
        style={{
          fontSize: 48,
          fontWeight: 800,
          color: theme.colors.text,
          marginBottom: 20,
          fontFamily: theme.fonts.heading,
        }}
      >
        函数绘图仪
      </h2>

      <div
        style={{
          fontSize: 32,
          color: theme.colors.primary,
          marginBottom: 30,
          fontFamily: theme.fonts.mono,
          fontWeight: 800,
        }}
      >
        {functionName}
      </div>

      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
        style={{
          border: `2px solid ${theme.colors.surfaceLight}`,
          borderRadius: 8,
          boxShadow: `0 4px 20px ${theme.colors.surfaceLight}40`,
        }}
      />

      {Object.keys(animatedParams).length > 0 && (
        <div
          style={{
            marginTop: 20,
            display: "flex",
            gap: 20,
            fontSize: 18,
            color: theme.colors.textSecondary,
            fontFamily: theme.fonts.mono,
            flexWrap: "wrap",
            justifyContent: "center",
            maxWidth: 1100,
          }}
        >
          {Object.entries(params).map(([key, value]) => (
            <div key={key}>
              {key} = {value.toFixed(2)}
            </div>
          ))}
        </div>
      )}

      {!compiled.ok && (
        <div
          style={{
            marginTop: 14,
            fontSize: 14,
            color: theme.colors.error || "#ef4444",
            fontFamily: theme.fonts.mono,
          }}
        >
          {compiled.error}
        </div>
      )}
    </div>
  );
};
