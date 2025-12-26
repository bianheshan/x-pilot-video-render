
import React from "react";
import { AbsoluteFill } from "remotion";
import { CodeBlock, Subtitle } from "../components";

export default function Scene4() {
  const code = `class DNA {
  constructor() {
    this.pairs = { A: 'T', T: 'A', G: 'C', C: 'G' };
  }
  
  complement(sequence) {
    return sequence.split('').map(b => this.pairs[b]).join('');
  }
}

const dna = new DNA();
console.log(dna.complement('ATGC')); // TACG`;

  return (
    <AbsoluteFill style={{ backgroundColor: "#1e293b" }}>
      <CodeBlock code={code} language="javascript" />
      <Subtitle text="DNA 配对的代码实现" position="bottom" />
    </AbsoluteFill>
  );
}
