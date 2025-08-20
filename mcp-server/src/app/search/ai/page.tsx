"use client";

import { useState } from "react";

export default function AiSearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    const res = await fetch(`/api/ai-search?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    setResults(data);
    setLoading(false);
  };

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">✨ 意味検索（openAI）</h1>
      <input
        type="text"
        className="border p-2 w-full max-w-lg mb-4"
        placeholder="意味で検索！"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button
        onClick={handleSearch}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-6"
        disabled={loading}
      >
        {loading ? "検索中..." : "検索"}
      </button>
      <ul className="space-y-4">
        {results.map((item, idx) => (
          <li key={idx}>
            <a href={`/knowledge/${item.slug}`} className="text-blue-600 hover:underline text-lg">
              {item.title}
            </a>
            <p className="text-sm text-gray-600 line-clamp-2">{item.summary}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}