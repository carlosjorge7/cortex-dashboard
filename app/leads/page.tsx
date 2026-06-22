import { api } from "@/lib/api";
import ScoreBadge from "@/components/ScoreBadge";
import LeadFilters from "@/components/LeadFilters";

export const revalidate = 0;

const PAGE_SIZE = 20;

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; min_score?: string; email?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const minScore = params.min_score ? Number(params.min_score) : undefined;
  const offset = (page - 1) * PAGE_SIZE;

  const data = await api.leads({ limit: PAGE_SIZE, offset, min_score: minScore });
  const totalPages = Math.ceil(data.total / PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Leads</h1>
          <p className="text-slate-400 text-sm mt-1">{data.total} leads totales</p>
        </div>
        <LeadFilters minScore={params.min_score} emailFilter={params.email} />
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wide">
              <th className="text-left px-4 py-3">Empresa</th>
              <th className="text-left px-4 py-3 hidden md:table-cell">Web</th>
              <th className="text-center px-4 py-3">Score</th>
              <th className="text-center px-4 py-3">Email</th>
              <th className="text-left px-4 py-3 hidden lg:table-cell">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((lead) => (
              <tr key={lead.id} className="border-b border-slate-800/50 hover:bg-slate-800/40 transition-colors">
                <td className="px-4 py-3">
                  <a href={`/leads/${lead.id}`} className="font-medium hover:text-blue-400 transition-colors line-clamp-1">
                    {lead.company_name}
                  </a>
                </td>
                <td className="px-4 py-3 hidden md:table-cell text-slate-400 truncate max-w-[200px]">
                  {lead.website ? (
                    <a href={lead.website} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 truncate block">
                      {lead.website.replace(/^https?:\/\//, "")}
                    </a>
                  ) : "—"}
                </td>
                <td className="px-4 py-3 text-center">
                  <ScoreBadge score={lead.fit_score} />
                </td>
                <td className="px-4 py-3 text-center">
                  {lead.email_sent ? (
                    <span title={lead.email_opened ? `Abierto: ${lead.email_opened_at ? new Date(lead.email_opened_at).toLocaleDateString("es") : ""}` : "Enviado"}>
                      {lead.email_opened ? "👁" : "📧"}
                    </span>
                  ) : (
                    <span className="text-slate-600">—</span>
                  )}
                </td>
                <td className="px-4 py-3 hidden lg:table-cell text-slate-400 text-xs">
                  {new Date(lead.created_at).toLocaleDateString("es", { day: "2-digit", month: "short" })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex gap-2 justify-center">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <a
              key={p}
              href={`/leads?page=${p}${minScore ? `&min_score=${minScore}` : ""}`}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                p === page ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}
            >
              {p}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
