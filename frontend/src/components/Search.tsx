import { useEffect, useState } from "react";
import Card from "./Card";
import { useLazySearchQuery } from "../api/api";

export default function Search() {
  const [type, setType] = useState<"medicine" | "illness">("medicine");
  const [q, setQ] = useState("");
  const [trigger, { data, isFetching }] = useLazySearchQuery();

  useEffect(() => {
    if (q.trim()) trigger({ type, q });
  }, [q, trigger, type]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    trigger({ type, q: q.trim() });
  };

  return (
    <Card>
      <h3 className="text-lg font-semibold mb-3">Search</h3>
      <form onSubmit={onSubmit} className="flex flex-wrap gap-2 items-center">
        <select
          className="input w-40"
          value={type}
          onChange={(e) => setType(e.target.value as "medicine" | "illness")}
        >
          <option value="medicine">By Medicine</option>
          <option value="illness">By Illness</option>
        </select>
        <input
          className="input flex-1 min-w-[240px]"
          placeholder={
            type === "medicine" ? "e.g., Abroma Augusta" : "e.g., Fever"
          }
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold px-5 py-2 rounded-lg shadow-md transition">
          Search
        </button>
      </form>

      {isFetching && (
        <p className="mt-3 text-sm text-slate-500">Searching...</p>
      )}

      {data && (
        <div className="mt-4 grid md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold mb-2">
              Matches ({data.matches.length})
            </h4>
            <ul className="space-y-1">
              {data.matches.map((m) => (
                <li key={m.id} className="chip">
                  {m.name}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">
              Related ({data.related.length})
            </h4>
            <ul className="space-y-1">
              {data.related.map((r) => (
                <li key={r.id} className="chip">
                  {r.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </Card>
  );
}
