import { api } from "@/lib/api";
import ScoreBadge from "@/components/ScoreBadge";
import LeadActions from "@/components/LeadActions";
import { notFound } from "next/navigation";

export const revalidate = 0;

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let lead;
  try {
    lead = await api.lead(id);
  } catch {
    notFound();
  }

  return (
    <div className="max-w-3xl space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <a href="/leads" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
            ← Volver a leads
          </a>
          <h1 className="text-xl md:text-2xl font-bold mt-2 leading-tight">{lead.company_name}</h1>
          {lead.website && (
            <a href={lead.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-400 hover:text-blue-300 transition-colors break-all">
              {lead.website}
            </a>
          )}
        </div>
        <div className="shrink-0 mt-6">
          <ScoreBadge score={lead.fit_score} />
        </div>
      </div>

      {lead.suggested_pitch && <LeadActions lead={lead} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {lead.why_cortex_fits && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <p className="text-xs text-slate-400 uppercase tracking-wide mb-2 font-semibold">Por qué encaja</p>
            <p className="text-sm text-slate-300 leading-relaxed">{lead.why_cortex_fits}</p>
          </div>
        )}

        {lead.pain_points && lead.pain_points.length > 0 && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <p className="text-xs text-slate-400 uppercase tracking-wide mb-2 font-semibold">Pain points</p>
            <ul className="space-y-1.5">
              {lead.pain_points.map((p, i) => (
                <li key={i} className="text-sm text-slate-300 flex gap-2">
                  <span className="text-slate-600 mt-0.5 shrink-0">•</span>
                  {p}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <p className="text-xs text-slate-400 uppercase tracking-wide mb-2 font-semibold">Descripción original</p>
        <p className="text-sm text-slate-400 leading-relaxed">{lead.description}</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-slate-500 text-xs">Creado</p>
          <p>{new Date(lead.created_at).toLocaleDateString("es", { day: "2-digit", month: "short", year: "numeric" })}</p>
        </div>
        <div>
          <p className="text-slate-500 text-xs">Email</p>
          <p>{lead.email_sent ? (lead.email_opened ? "Abierto 👁" : "Enviado 📧") : "No enviado"}</p>
        </div>
        {lead.email_opened_at && (
          <div>
            <p className="text-slate-500 text-xs">Abierto el</p>
            <p>{new Date(lead.email_opened_at).toLocaleDateString("es")}</p>
          </div>
        )}
        {lead.resend_email_id && (
          <div>
            <p className="text-slate-500 text-xs">Resend ID</p>
            <p className="font-mono text-xs text-slate-400 truncate">{lead.resend_email_id}</p>
          </div>
        )}
      </div>
    </div>
  );
}
