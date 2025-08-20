import dotenv from "dotenv";

dotenv.config();

export async function getEmbedding(input: string): Promise<number[]> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY が設定されていません");
  }

  const response = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      input,
      model: "text-embedding-3-small" // または "text-embedding-ada-002"
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Embedding APIエラー: ${errorText}`);
  }

  const json = await response.json();
  return json.data[0].embedding;
}