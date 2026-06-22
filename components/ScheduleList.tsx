"use client";

import { useState } from "react";
import type { Schedule, ScheduleCreate } from "@/lib/api";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function ScheduleList({ schedules: initial }: { schedules: Schedule[] }) {
  const [schedules, setSchedules] = useState(initial);
  const [form, setForm] = useState<ScheduleCreate>({ query: "", max_results: 8, interval_hours: 24 });
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  async function toggle(id: string) {
    setLoading(id);
    const updated = await api.toggleSchedule(id);
    setSchedules((prev) => prev.map((s) => (s.id === id ? updated : s)));
    setLoading(null);
  }

  async function remove(id: string) {
    setLoading(id);
    await api.deleteSchedule(id);
    setSchedules((prev) => prev.filter((s) => s.id !== id));
    setLoading(null);
  }

  async function create(e: React.FormEvent) {
    e.preventDefault();
    if (!form.query.trim()) return;
    setLoading("new");
    const created = await api.createSchedule(form);
    setSchedules((prev) => [created, ...prev]);
    setForm({ query: "", max_results: 8, interval_hours: 24 });
    setLoading(null);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <form onSubmit={create} className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <p className="font-semibold text-sm">Nueva búsqueda</p>
        <div className="flex gap-3">
          <input
            value={form.query}
            onChange={(e) => setForm((f) => ({ ...f, query: e.target.value }))}
            placeholder="ej: despacho abogados Madrid"
            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <input
            type="number"
            value={form.max_results}
            onChange={(e) => setForm((f) => ({ ...f, max_results: Number(e.target.value) }))}
            min={1}
            max={20}
            className="w-20 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-center focus:outline-none focus:ring-1 focus:ring-blue-500"
            title="Resultados máximos"
          />
          <button
            type="submit"
            disabled={loading === "new"}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm px-4 py-2 rounded-lg transition-colors"
          >
            {loading === "new" ? "…" : "Añadir"}
          </button>
        </div>
      </form>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        {schedules.length === 0 && (
          <p className="text-slate-500 text-sm p-5">No hay búsquedas configuradas.</p>
        )}
        {schedules.map((s) => (
          <div key={s.id} className="flex items-center gap-3 px-4 py-3 border-b border-slate-800/50 last:border-0">
            <button
              onClick={() => toggle(s.id)}
              disabled={loading === s.id}
              className={`w-8 h-5 rounded-full transition-colors shrink-0 ${s.enabled ? "bg-green-500" : "bg-slate-700"}`}
              title={s.enabled ? "Deshabilitar" : "Habilitar"}
            >
              <span className={`block w-3.5 h-3.5 rounded-full bg-white mx-auto transition-transform ${s.enabled ? "translate-x-1.5" : "-translate-x-1.5"}`} />
            </button>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium truncate ${s.enabled ? "text-white" : "text-slate-500"}`}>{s.query}</p>
              <p className="text-xs text-slate-500">
                {s.max_results} resultados · Último run:{" "}
                {s.last_run_at ? new Date(s.last_run_at).toLocaleDateString("es", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : "nunca"}
              </p>
            </div>
            <button
              onClick={() => remove(s.id)}
              disabled={loading === s.id}
              className="text-slate-600 hover:text-red-400 transition-colors text-xs disabled:opacity-30"
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
