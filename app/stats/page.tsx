import { api } from "@/lib/api";

export const revalidate = 60;

export default async function StatsPage() {
  const stats = await api.stats();

  const steps = [
    { label: "Total leads", value: stats.total_leads, color: "bg-blue-600" },
    { label: "En revisión", value: stats.leads_pending_review, color: "bg-blue-500" },
    { label: "Enviados", value: stats.leads_email_sent, color: "bg-blue-400" },
    { label: "Abiertos", value: stats.leads_email_opened ?? 0, color: "bg-indigo-400" },
    { label: "Respondidos", value: stats.leads_replied ?? 0, color: "bg-green-500" },
    { label: "Convertidos", value: stats.leads_converted ?? 0, color: "bg-green-400" },
  ];

  const max = Math.max(...steps.map((s) => s.value), 1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-white">Métricas</h1>
        <p className="text-sm text-slate-400 mt-1">Funnel de conversión — actualizado cada 60 s</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 md:p-6 space-y-4">
        <h2 className="text-sm text-slate-400 uppercase tracking-wide font-semibold">Funnel de conversión</h2>

        <div className="space-y-3">
          {steps.map((step, i) => {
            const prev = i === 0 ? null : steps[i - 1].value;
            const pct =
              prev === null
                ? null
                : prev === 0
                ? 0
                : Math.round((step.value / prev) * 100);
            const widthPct = Math.round((step.value / max) * 100);

            return (
              <div key={step.label} className="flex items-center gap-3 md:gap-4">
                {/* Step number */}
                <span className="text-2xl md:text-3xl font-bold text-slate-200 w-10 md:w-14 shrink-0 text-right tabular-nums">
                  {step.value}
                </span>

                {/* Label + bar + pct */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm text-slate-300 font-medium truncate">{step.label}</span>
                    {pct !== null && (
                      <span
                        className={`text-xs font-medium shrink-0 ${
                          pct >= 50 ? "text-green-400" : pct >= 20 ? "text-amber-400" : "text-red-400"
                        }`}
                      >
                        {pct}% del anterior
                      </span>
                    )}
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${step.color}`}
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {steps.map((step) => (
          <div
            key={step.label}
            className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1"
          >
            <p className="text-xs text-slate-500 uppercase tracking-wide font-medium">{step.label}</p>
            <p className="text-2xl font-bold text-white tabular-nums">{step.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
