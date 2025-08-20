import { getAllKnowledge } from "@/lib/getAllKnowledge";

export default async function HomePage() {
  const knowledge = await getAllKnowledge();

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">📚 ナレッジ一覧</h1>
      <ul className="space-y-4">
        {knowledge.map((item) => (
          <li key={item.slug}>
            <a href={`/knowledge/${item.slug}`} className="text-blue-600 hover:underline">
              {item.title}
            </a>
            <div className="text-sm text-gray-500">
                作成日: {new Date(item.created).toLocaleDateString()}
            </div>
            <div className="text-xs text-gray-400">タグ: {item.tags.join(', ')}</div>
          </li>
        ))}
      </ul>
    </main>
  );
}