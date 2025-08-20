import "dotenv/config";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { getEmbedding } from "../src/lib/embedding";

// ✅ 複数ディレクトリを対象に
const contentDirs = [
  path.join(process.cwd(), "content/knowledge"),
  path.join(process.cwd(), "content/notion"),
];

const outputPath = path.join(process.cwd(), "src/data/embeddings.json");

async function run() {
  const all = [];

  for (const dir of contentDirs) {
    if (!fs.existsSync(dir)) continue;

    const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));

    for (const file of files) {
      const fullPath = path.join(dir, file);
      const raw = fs.readFileSync(fullPath, "utf-8");
      const { data, content } = matter(raw);

      const slug = file.replace(/\.md$/, "");
      const title = data.title || slug;
      const summary = content.slice(0, 200).replace(/\n/g, " ");
      const input = `${title}\n${summary}`;

      console.log(`📄 Embedding: ${file}`);
      const embedding = await getEmbedding(input);

      all.push({
        slug,
        title,
        summary,
        embedding,
      });
    }
  }

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(all, null, 2));
  console.log(`✅ Embedding出力完了: ${outputPath}`);
}

run().catch((err) => {
  console.error("❌ エラー:", err);
});