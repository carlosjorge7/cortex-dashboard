const SERVER_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
// API_KEY is only available server-side (no NEXT_PUBLIC_ prefix). Browser calls use JWT via middleware.
const API_KEY = process.env.API_KEY ?? "";

// On the browser, route through Next.js proxy — middleware injects the JWT Bearer token.
function getBase() {
  if (typeof window !== "undefined") return "/cortex/api-proxy";
  return SERVER_BASE;
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (API_KEY) headers["X-API-Key"] = API_KEY;
  const res = await fetch(`${getBase()}${path}`, {
    ...init,
    headers: { ...headers, ...init?.headers },
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
  original_pitch?: string | null;
  email_sent: boolean;
  email_sent_at: string | null;
  resend_email_id: string | null;
  email_opened: boolean;
  email_opened_at: string | null;
  created_at: string;
  analyzed_at: string | null;
  status?: string;
  replied: boolean;
  converted: boolean;
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
  leads_pending_review: number;
  leads_rejected: number;
  leads_email_opened: number;
  leads_replied: number;
  leads_converted: number;
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

  leads: (params?: { limit?: number; offset?: number; min_score?: number; status?: string }) => {
    const q = new URLSearchParams();
    if (params?.limit) q.set("limit", String(params.limit));
    if (params?.offset) q.set("offset", String(params.offset));
    if (params?.min_score) q.set("min_score", String(params.min_score));
    if (params?.status) q.set("status", params.status);
    return apiFetch<LeadListResponse>(`/leads?${q}`);
  },

  lead: (id: string) => apiFetch<Lead>(`/leads/${id}`),

  approveLead: (id: string) =>
    apiFetch<Lead>(`/leads/${id}/approve`, { method: "POST" }),

  rejectLead: (id: string) =>
    apiFetch<Lead>(`/leads/${id}/reject`, { method: "POST" }),

  updatePitch: (id: string, pitch: string) =>
    apiFetch<Lead>(`/leads/${id}/pitch`, {
      method: "PATCH",
      body: JSON.stringify({ suggested_pitch: pitch }),
    }),

  markReplied: (id: string) =>
    apiFetch<Lead>(`/leads/${id}/mark-replied`, { method: "POST" }),

  markConverted: (id: string) =>
    apiFetch<Lead>(`/leads/${id}/mark-converted`, { method: "POST" }),

  schedules: () => apiFetch<Schedule[]>("/schedules"),

  createSchedule: (body: ScheduleCreate) =>
    apiFetch<Schedule>("/schedules", { method: "POST", body: JSON.stringify(body) }),

  toggleSchedule: (id: string) =>
    apiFetch<Schedule>(`/schedules/${id}/toggle`, { method: "PATCH" }),

  deleteSchedule: (id: string) => {
    const headers: Record<string, string> = {};
    if (API_KEY) headers["X-API-Key"] = API_KEY;
    return fetch(`${getBase()}/schedules/${id}`, { method: "DELETE", headers });
  },
};
