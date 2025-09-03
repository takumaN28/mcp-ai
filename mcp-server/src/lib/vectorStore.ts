import knowledgeData from "@/data/embeddings.json";

type KnowledgeEntry = {
  slug: string;
  title: string;
  summary: string;
  embedding: number[];
};

function cosineSimilarity(a: number[], b: number[]): number {
  const dot = a.reduce((acc, val, i) => acc + val * b[i], 0);
  const normA = Math.sqrt(a.reduce((acc, val) => acc + val * val, 0));
  const normB = Math.sqrt(b.reduce((acc, val) => acc + val * val, 0));
  return dot / (normA * normB);
}

export async function searchSimilarDocs(
  queryEmbedding: number[],
  topK: number = 5
): Promise<Omit<KnowledgeEntry, "embedding">[]> {
  const scored = (knowledgeData as KnowledgeEntry[]).map((entry) => {
    return {
      ...entry,
      score: cosineSimilarity(queryEmbedding, entry.embedding),
    };
  });

  const topResults = scored
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map(({ ...rest }) => rest); // embeddingとscoreは返さない

  return topResults;
}