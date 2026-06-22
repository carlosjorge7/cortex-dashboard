const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://100.73.5.37:8000";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY ?? "";

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { "X-API-Key": API_KEY, "Content-Type": "application/json", ...init?.headers },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${path}`);
  return res.json() as Promise<T>;
}

export type Lead = {
  id: string;
  company_name: string;
  website: string | null;
  description: string;
  fit_score: number | null;
  pain_points: string[] | null;
  why_cortex_fits: string | null;
  suggested_pitch: string | null;
  email_sent: boolean;
  email_sent_at: string | null;
  resend_email_id: string | null;
  email_opened: boolean;
  email_opened_at: string | null;
  created_at: string;
  analyzed_at: string | null;
};

export type LeadListResponse = {
  items: Lead[];
  total: number;
  limit: number;
  offset: number;
};

export type Stats = {
  total_leads: number;
  avg_fit_score: number | null;
  leads_email_sent: number;
  leads_with_embedding: number;
  score_distribution: { low: number; medium: number; high: number };
};

export type Schedule = {
  id: string;
  query: string;
  max_results: number;
  interval_hours: number;
  enabled: boolean;
  last_run_at: string | null;
  created_at: string;
};

export type ScheduleCreate = {
  query: string;
  max_results: number;
  interval_hours: number;
};

export const api = {
  stats: () => apiFetch<Stats>("/stats"),

  leads: (params?: { limit?: number; offset?: number; min_score?: number }) => {
    const q = new URLSearchParams();
    if (params?.limit) q.set("limit", String(params.limit));
    if (params?.offset) q.set("offset", String(params.offset));
    if (params?.min_score) q.set("min_score", String(params.min_score));
    return apiFetch<LeadListResponse>(`/leads?${q}`);
  },

  lead: (id: string) => apiFetch<Lead>(`/leads/${id}`),

  schedules: () => apiFetch<Schedule[]>("/schedules"),

  createSchedule: (body: ScheduleCreate) =>
    apiFetch<Schedule>("/schedules", { method: "POST", body: JSON.stringify(body) }),

  toggleSchedule: (id: string) =>
    apiFetch<Schedule>(`/schedules/${id}/toggle`, { method: "PATCH" }),

  deleteSchedule: (id: string) =>
    fetch(`${BASE}/schedules/${id}`, { method: "DELETE", headers: { "X-API-Key": API_KEY } }),
};
