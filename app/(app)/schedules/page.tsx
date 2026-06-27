import { api } from "@/lib/api";
import ScheduleList from "@/components/ScheduleList";

export const revalidate = 0;

export default async function SchedulesPage() {
  const schedules = await api.schedules();
  const active = schedules.filter((s) => s.enabled);
  const inactive = schedules.filter((s) => !s.enabled);

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">Búsquedas programadas</h1>
        <p className="text-slate-400 text-sm mt-1">
          {active.length} activas · {inactive.length} deshabilitadas · Ejecución diaria a las 08:00
        </p>
      </div>

      <ScheduleList schedules={schedules} />
    </div>
  );
}
