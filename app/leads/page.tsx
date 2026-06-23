import { api } from "@/lib/api";
import ScoreBadge from "@/components/ScoreBadge";
import LeadFilters from "@/components/LeadFilters";

export const revalidate = 0;

const PAGE_SIZE = 20;

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; min_score?: string; email?: string; status?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const minScore = params.min_score ? Number(params.min_score) : undefined;
  const statusFilter = params.status;
  const offset = (page - 1) * PAGE_SIZE;

  const data = await api.leads({ limit: PAGE_SIZE, offset, min_score: minScore, status: statusFilter });
  const totalPages = Math.ceil(data.total / PAGE_SIZE);

  const tabs = [
    { label: "Todos", value: undefined },
    { label: "Pendientes", value: "pending_review" },
    { label: "Enviados", value: "sent" },
    { label: "Rechazados", value: "rejected" },
  ];

  function tabHref(value: string | undefined) {
    const q = new URLSearchParams();
    if (value) q.set("status", value);
    if (params.min_score) q.set("min_score", params.min_score);
    const qs = q.toString();
    return `/leads${qs ? `?${qs}` : ""}`;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Leads</h1>
          <p className="text-slate-400 text-sm mt-0.5">{data.total} leads totales</p>
        </div>
        <LeadFilters minScore={params.min_score} emailFilter={params.email} />
      </div>

      <div className="flex gap-1 border-b border-slate-800 pb-0">
        {tabs.map((tab) => {
          const active = statusFilter === tab.value;
          return (
            <a
              key={tab.label}
              href={tabHref(tab.value)}
              className={`px-3 py-2 text-sm rounded-t-lg transition-colors border-b-2 -mb-px ${
                active
                  ? "border-blue-500 text-white font-medium"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              {tab.label}
            </a>
          );
        })}
      </div>

      {/* Mobile: cards */}
      <div className="flex flex-col gap-3 md:hidden">
        {data.items.map((lead) => (
          <a
            key={lead.id}
            href={`/leads/${lead.id}`}
            className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-start justify-between gap-3 active:bg-slate-800 transition-colors"
          >
            <div className="min-w-0">
              <p className="font-medium text-sm leading-snug">{lead.company_name}</p>
              {lead.website && (
                <p className="text-xs text-slate-500 truncate mt-0.5">
                  {lead.website.replace(/^https?:\/\//, "")}
                </p>
              )}
              <p className="text-xs text-slate-500 mt-1">
                {new Date(lead.created_at).toLocaleDateString("es", { day: "2-digit", month: "short" })}
                {lead.email_sent && <span className="ml-2">{lead.email_opened ? "👁" : "📧"}</span>}
              </p>
            </div>
            <ScoreBadge score={lead.fit_score} />
          </a>
        ))}
      </div>

      {/* Desktop: table */}
      <div className="hidden md:block bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wide">
              <th className="text-left px-4 py-3">Empresa</th>
              <th className="text-left px-4 py-3">Web</th>
              <th className="text-center px-4 py-3">Score</th>
              <th className="text-center px-4 py-3">Email</th>
              <th className="text-left px-4 py-3 hidden lg:table-cell">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((lead) => (
              <tr key={lead.id} className="border-b border-slate-800/50 hover:bg-slate-800/40 transition-colors">
                <td className="px-4 py-3 max-w-[260px]">
                  <a href={`/leads/${lead.id}`} className="font-medium hover:text-blue-400 transition-colors line-clamp-1">
                    {lead.company_name}
                  </a>
                </td>
                <td className="px-4 py-3 text-slate-400 max-w-[200px]">
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
                    <span title={lead.email_opened ? `Abierto` : "Enviado"}>
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
        <div className="flex gap-2 justify-center flex-wrap">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <a
              key={p}
              href={`/leads?page=${p}${minScore ? `&min_score=${minScore}` : ""}${statusFilter ? `&status=${statusFilter}` : ""}`}
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
