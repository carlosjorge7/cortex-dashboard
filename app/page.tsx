import Link from "next/link";
import { api } from "@/lib/api";
import ScoreChart from "@/components/ScoreChart";
import RecentLeads from "@/components/RecentLeads";
import ScoreBadge from "@/components/ScoreBadge";

export const revalidate = 60;

export default async function DashboardPage() {
  const [stats, leadsData, pendingData] = await Promise.all([
    api.stats(),
    api.leads({ limit: 5 }),
    api.leads({ limit: 10, status: "pending_review" }),
  ]);

  const statCards = [
    { label: "Total leads", value: stats.total_leads, sub: "encontrados" },
    {
      label: "Score medio",
      value: stats.avg_fit_score ? stats.avg_fit_score.toFixed(1) : "—",
      sub: "sobre 100",
    },
    {
      label: "Emails enviados",
      value: stats.leads_email_sent,
      sub: `${stats.total_leads ? Math.round((stats.leads_email_sent / stats.total_leads) * 100) : 0}% del total`,
    },
    { label: "Con embeddings", value: stats.leads_with_embedding, sub: "indexados" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">Estado del pipeline de leads</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {statCards.map((s) => (
          <div key={s.label} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <p className="text-slate-400 text-xs uppercase tracking-wide">{s.label}</p>
            <p className="text-2xl md:text-3xl font-bold mt-1">{s.value}</p>
            <p className="text-slate-500 text-xs mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      {pendingData.items.length > 0 && (
        <div className="bg-slate-900 border border-yellow-800/60 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-sm text-yellow-300">En revisión ({pendingData.total})</h2>
            <Link href="/leads?status=pending_review" className="text-xs text-blue-400 hover:text-blue-300">
              Ver todos →
            </Link>
          </div>
          <ul className="space-y-2">
            {pendingData.items.map((lead) => (
              <li key={lead.id}>
                <Link
                  href={`/leads/${lead.id}`}
                  className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 hover:bg-slate-800 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium leading-snug truncate">{lead.company_name}</p>
                    {lead.website && (
                      <p className="text-xs text-slate-500 truncate">{lead.website.replace(/^https?:\/\//, "")}</p>
                    )}
                  </div>
                  <ScoreBadge score={lead.fit_score} />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <h2 className="font-semibold mb-4 text-sm">Distribución de scores</h2>
          <ScoreChart distribution={stats.score_distribution} />
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-sm">Últimos leads</h2>
            <Link href="/leads" className="text-xs text-blue-400 hover:text-blue-300">
              Ver todos →
            </Link>
          </div>
          <RecentLeads leads={leadsData.items} />
        </div>
      </div>
    </div>
  );
}
