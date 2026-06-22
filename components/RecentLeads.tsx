import type { Lead } from "@/lib/api";
import ScoreBadge from "./ScoreBadge";

export default function RecentLeads({ leads }: { leads: Lead[] }) {
  return (
    <ul className="space-y-3">
      {leads.map((lead) => (
        <li key={lead.id}>
          <a href={`/leads/${lead.id}`} className="flex items-center justify-between hover:bg-slate-800 rounded-lg p-2 -mx-2 transition-colors">
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{lead.company_name}</p>
              <p className="text-xs text-slate-500 truncate">{lead.website ?? "—"}</p>
            </div>
            <div className="flex items-center gap-2 ml-3 shrink-0">
              {lead.email_sent && (
                <span className="text-xs" title={lead.email_opened ? "Abierto" : "Enviado"}>
                  {lead.email_opened ? "👁" : "📧"}
                </span>
              )}
              <ScoreBadge score={lead.fit_score} />
            </div>
          </a>
        </li>
      ))}
    </ul>
  );
}
