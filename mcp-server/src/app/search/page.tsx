"use client";

import { useEffect, useState } from "react";
import lunr from "lunr";
import Link from "next/link";

type Document = {
  id: string;
  title: string;
  body: string;
};

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Document[]>([]);
  const [idx, setIdx] = useState<lunr.Index | null>(null);
  const [documents, setDocuments] = useState<Record<string, Document>>({});

  useEffect(() => {
    fetch("/search-index.json")
      .then((res) => res.json())
      .then((data) => {
        const index = lunr.Index.load(data.index);
        const docs: Record<string, Document> = {};
        data.documents.forEach((doc: Document) => {
          docs[doc.id] = doc;
        });
        setIdx(index);
        setDocuments(docs);
        console.log(index)
        console.log(docs)
        console.log("🔍 index fields:", ((data.index as unknown) as { fields?: unknown })?.fields ?? "(unknown)");
        console.log("🧾 document ids:", Object.keys(docs));
        console.log("📝 example doc:", docs[Object.keys(docs)[0]]);
      });
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value.toLowerCase().trim();
    setQuery(q);
    if (!idx) return;

    const hits = idx.search(q);
    console.log(q)
    console.log(hits)
    const found = hits.map((h) => documents[h.ref]);
    setResults(found);
  };

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">🔍 ナレッジ検索（生成AIに移行予定）</h1>
      <input
        type="text"
        className="border p-2 w-full max-w-lg mb-4"
        placeholder="検索キーワードを入力"
        value={query}
        onChange={handleSearch}
      />
      <ul className="space-y-4">
        {results.map((doc) => (
          <li key={doc.id}>
            <Link href={`/knowledge/${doc.id}`}>
              <span className="text-blue-600 hover:underline text-lg">{doc.title}</span>
            </Link>
            <p className="text-sm text-gray-600 line-clamp-2">{doc.body.slice(0, 100)}...</p>
          </li>
        ))}
      </ul>
    </main>
  );
}