import { NextResponse } from "next/server";
import { getEmbedding } from "@/lib/embedding";
import { searchSimilarDocs } from "@/lib/vectorStore";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") || "";

  if (!query) {
    return NextResponse.json([]);
  }

  try {
    const embedding = await getEmbedding(query);
    const results = await searchSimilarDocs(embedding);
    return NextResponse.json(results);
  } catch (error) {
    console.error("AI検索エラー:", error);
    return NextResponse.json({ error: "検索に失敗しました" }, { status: 500 });
  }
}