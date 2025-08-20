import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

export async function getKnowledgeBySlug(slug: string) {
  const baseDirs = [
    path.join(process.cwd(), 'content', 'knowledge'),
    path.join(process.cwd(), 'content', 'notion'),
  ];

  let fullPath: string | null = null;

  for (const dir of baseDirs) {
    const tryPath = path.join(dir, `${slug}.md`);
    if (fs.existsSync(tryPath)) {
      fullPath = tryPath;
      break;
    }
  }

  if (!fullPath) {
    throw new Error(`Knowledge file for slug "${slug}" not found in any content directories.`);
  }

  const fileContent = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContent);

  const processedContent = await remark().use(html).process(content);
  const contentHtml = processedContent.toString();

  return {
    title: data.title,
    slug: data.slug,
    tags: data.tags || [],
    created: data.created,
    contentHtml,
  };
}