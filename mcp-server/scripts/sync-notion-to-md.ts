import { Client } from "@notionhq/client";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { NotionToMarkdown } from "notion-to-md";

dotenv.config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });
const databaseId = process.env.NOTION_DATABASE_ID!;
const outputDir = path.join(process.cwd(), "content", "notion");

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

if (fs.existsSync(outputDir)) {
  fs.readdirSync(outputDir).forEach((file) => {
    if (file.endsWith(".md")) {
      fs.unlinkSync(path.join(outputDir, file));
    }
  });
}

(async () => {
  const pages = await notion.databases.query({ database_id: databaseId });
  const n2m = new NotionToMarkdown({ notionClient: notion });

  for (const page of pages.results) {
    if (!("properties" in page)) continue;

    const props = page.properties as any;
    console.log("page.properties.page.title", page.properties.page.title?.[0]?.plain_text)
    // console.log("page.properties", page.properties)
    console.log("page.properties.tags", page.properties.tags)
    console.log("props['ページ']", props["ページ"])
    
    const rawTitle = props["名前"]?.title?.[0]?.plain_text?.trim() ?? "";
    const hasAscii = /[a-zA-Z0-9]/.test(rawTitle);
    const baseSlug = hasAscii
      ? rawTitle.replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").toLowerCase()
      : `${page.id.slice(0, 8)}`;
    const title = page.properties.page.title?.[0]?.plain_text;

    let slug = baseSlug;
    let slugCounter = 1;
    while (fs.existsSync(path.join(outputDir, `${slug}.md`))) {
      slug = `${baseSlug}-${slugCounter}`;
      slugCounter++;
    }
    const tags = props["tags"]?.multi_select?.map((tag: any) => tag.name) || [];
    const created = props["作成日"]?.date?.start ?? new Date().toISOString().split("T")[0];

    const mdBlocks = await n2m.pageToMarkdown(page.id);
    const mdString = n2m.toMarkdownString(mdBlocks);

    const mdContent = `---
title: ${title}
slug: ${slug}
tags:
${tags.map((t) => `  - ${t}`).join("\n")}
created: ${created}
---

${mdString.parent}
`;

    let filePath = path.join(outputDir, `${slug}.md`);
    let counter = 1;
    while (fs.existsSync(filePath)) {
      filePath = path.join(outputDir, `${slug}-${counter}.md`);
      counter++;
    }

    fs.writeFileSync(filePath, mdContent);
    console.log(`✅ Exported: ${path.basename(filePath)}`);
  }
})();