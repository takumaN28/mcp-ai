import fs from "fs";
import path from "path";
import { getKnowledgeBySlug } from "@/lib/getKnowledgeBySlug";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateStaticParams() {
  const knowledgeDir = path.join(process.cwd(), "content", "knowledge");
  const files = fs.readdirSync(knowledgeDir);

  return files.map((filename) => {
    const slug = filename.replace(/\.md$/, "");
    return { slug };
  });
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `ナレッジ - ${slug}`,
  };
}

export default async function KnowledgeDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const data = await getKnowledgeBySlug(slug);

    return (
      <main className="p-8">
        <h1 className="text-2xl font-bold mb-4">{data.title}</h1>
        <div className="text-sm text-gray-500 mb-2">
          作成日: {new Date(data.created).toLocaleDateString()}
        </div>
        <div className="text-xs text-gray-400 mb-6">
          タグ: {data.tags.join(", ")}
        </div>
        <article
          className="prose prose-neutral max-w-none"
          dangerouslySetInnerHTML={{ __html: data.contentHtml }}
        />
      </main>
    );
  } catch {
    notFound();
  }
}