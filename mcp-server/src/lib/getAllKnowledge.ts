import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const knowledgeDirs = [
  path.join(process.cwd(), 'content', 'knowledge'),
  path.join(process.cwd(), 'content', 'notion'),
];

export type KnowledgeMeta = {
  title: string;
  slug: string;
  tags: string[];
  created: string;
};

export async function getAllKnowledge(): Promise<KnowledgeMeta[]> {
  return knowledgeDirs.flatMap((dir) => {
    if (!fs.existsSync(dir)) return [];
    const files = fs.readdirSync(dir);
    return files.map((filename) => {
      const filePath = path.join(dir, filename);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(fileContent);
      
      return {
        title: data.title,
        slug: data.slug,
        tags: data.tags || [],
        created: data.created,
      };
    });
  });
}