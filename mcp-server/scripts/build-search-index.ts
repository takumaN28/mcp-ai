import fs from "fs";
import path from "path";
import matter from "gray-matter";
import lunr from "lunr";

// const knowledgeDir = path.join(process.cwd(), "content", "knowledge");

const knowledgeDirs = [
    path.join(process.cwd(), "content", "knowledge"),
    path.join(process.cwd(), "content", "notion"),
];

const outputPath = path.join(process.cwd(), "public", "search-index.json");

const documents: { id: string; title: string; body: string }[] = [];

knowledgeDirs.forEach((dir) => {
    fs.readdirSync(dir).forEach((filename) => {
        const filePath = path.join(dir, filename);
        const slug = filename.replace(/\.md$/, "");
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const { data, content } = matter(fileContent);

        documents.push({
            id: slug,
            title: data.title || slug,
            body: content,
        });
    });
});

const idx = lunr(function () {
    this.ref("id");
    this.field("title");
    this.field("body");

    documents.forEach((doc) => this.add(doc));
});

fs.writeFileSync(outputPath, JSON.stringify({ index: idx, documents }, null, 2));
console.log("✅ Search index built!");