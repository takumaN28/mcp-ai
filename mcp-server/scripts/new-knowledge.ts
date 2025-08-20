const fs = require("fs");
const path = require("path");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function prompt(question: string): Promise<string> {
  return new Promise((resolve) => rl.question(question, resolve));
}

(async () => {
  const today = new Date().toISOString().split("T")[0];
  const title = await prompt("タイトル: ");
  const slugInput = await prompt("slug（空で自動生成）: ");
  const tagsInput = await prompt("タグ（カンマ区切り）: ");

  const slug =
    slugInput.trim() ||
    `${today}-${title
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, "-")}`;

  const tags = tagsInput
    .split(",")
    .map((t) => t.trim())
    .filter((t) => t.length > 0);

  const filename = `${slug}.md`;
  const filepath = path.join("content", "knowledge", filename);

  const template = `---
title: ${title}
slug: ${slug}
tags:
${tags.map((tag) => `  - ${tag}`).join("\n")}
created: ${today}
---

## Context

（どんな状況で？）

## Intent

（何を解決したかった？）

## Knowledge

（調査・検証・試行錯誤）

## Decision / Result

（採用した対応、結果・反省点など）
`;

  fs.writeFileSync(filepath, template);
  console.log(`✅ ナレッジテンプレートを作成しました: ${filepath}`);

  rl.close();
})();