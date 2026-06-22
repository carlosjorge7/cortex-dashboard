"use client";

import { useRouter } from "next/navigation";

export default function LeadFilters({ minScore, emailFilter }: { minScore?: string; emailFilter?: string }) {
  const router = useRouter();

  function apply(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const params = new URLSearchParams();
    const score = fd.get("min_score") as string;
    if (score) params.set("min_score", score);
    router.push(`/leads?${params}`);
  }

  return (
    <form onSubmit={apply} className="flex items-center gap-2 flex-wrap">
      <select
        name="min_score"
        defaultValue={minScore ?? ""}
        className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        <option value="">Todos los scores</option>
        <option value="80">Score ≥ 80</option>
        <option value="70">Score ≥ 70</option>
        <option value="60">Score ≥ 60</option>
      </select>
      <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-3 py-1.5 rounded-lg transition-colors">
        Filtrar
      </button>
      {(minScore || emailFilter) && (
        <a href="/leads" className="text-sm text-slate-400 hover:text-white transition-colors">
          Limpiar
        </a>
      )}
    </form>
  );
}
