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
    const pagePropAny = (props.page ?? props["ページ"] ?? props["名前"] ?? props["Name"]) as any;
    let pageTitleText: string | undefined;
    if (pagePropAny?.type === "title") {
      pageTitleText = pagePropAny.title?.[0]?.plain_text;
    } else if (pagePropAny?.type === "rich_text") {
      pageTitleText = pagePropAny.rich_text?.[0]?.plain_text;
    } else if (props["名前"]?.title?.[0]?.plain_text) {
      pageTitleText = props["名前"].title[0].plain_text;
    } else if (props["Name"]?.title?.[0]?.plain_text) {
      pageTitleText = props["Name"].title[0].plain_text;
    }
    console.log("page title", pageTitleText);
    // console.log("page.properties", page.properties)
    console.log("page.properties.tags", page.properties.tags)
    console.log("props['ページ']", props["ページ"])
    
    const rawTitle = props["名前"]?.title?.[0]?.plain_text?.trim() ?? "";
    const hasAscii = /[a-zA-Z0-9]/.test(rawTitle);
    const baseSlug = hasAscii
      ? rawTitle.replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").toLowerCase()
      : `${page.id.slice(0, 8)}`;
    const title = pageTitleText ?? rawTitle;

    let slug = baseSlug;
    let slugCounter = 1;
    while (fs.existsSync(path.join(outputDir, `${slug}.md`))) {
      slug = `${baseSlug}-${slugCounter}`;
      slugCounter++;
    }
    const tags: string[] = (props["tags"]?.multi_select?.map((tag: any) => String(tag?.name ?? "")) ?? []).filter((n: string) => n.length > 0);
    const created = props["作成日"]?.date?.start ?? new Date().toISOString().split("T")[0];

    const mdBlocks = await n2m.pageToMarkdown(page.id);
    const mdString = n2m.toMarkdownString(mdBlocks);

    const mdContent = `---
title: ${title}
slug: ${slug}
tags:
${tags.map((t: string) => `  - ${t}`).join("\n")}
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