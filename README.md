# cortex-dashboard

Control panel for [cortex-lead-hunter](https://github.com/carlosjorge7/cortex-hunter-lead) — visualizes leads, stats, email tracking and scheduled searches in real time.

Built with Next.js 16 App Router and deployed on a Raspberry Pi 5, publicly accessible via Tailscale Funnel.

**Live → [https://raspberrypi.tail9ae84b.ts.net](https://raspberrypi.tail9ae84b.ts.net)**

---

## Screenshots

### Dashboard
Stats overview with score distribution chart and latest leads.

### Leads
Paginated table with score filter and email open tracking indicators.

### Lead detail
LLM-generated pitch front and center, pain points, fit analysis, and Resend tracking info.

### Búsquedas
Toggle, delete and create scheduled daily searches without touching the API directly.

---

## Stack

| Technology | Role |
|---|---|
| Next.js 16 (App Router) | Framework — server components for data fetching, client components for interactivity |
| TypeScript | Full type safety end to end |
| Tailwind CSS v4 | Dark theme utility styling |
| Recharts | Score distribution bar chart |

---

## Pages

| Route | Description |
|---|---|
| `/` | Stats cards + score chart + latest 5 leads |
| `/leads` | Full paginated table, filterable by min score |
| `/leads/[id]` | Lead detail — pitch, pain points, email status |
| `/schedules` | Manage scheduled searches |

---

## Local setup

```bash
git clone https://github.com/carlosjorge7/cortex-dashboard
cd cortex-dashboard
npm install

cp .env.local.example .env.local
# Fill in NEXT_PUBLIC_API_URL and NEXT_PUBLIC_API_KEY

npm run dev
```

Open `http://localhost:3000`.

The dashboard expects [cortex-lead-hunter](https://github.com/carlosjorge7/cortex-hunter-lead) running at `NEXT_PUBLIC_API_URL`.

---

## Environment variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL of the cortex-lead-hunter API (e.g. `http://localhost:8000`) |
| `NEXT_PUBLIC_API_KEY` | Value of the `X-Api-Key` header |

---

## Deployment (Raspberry Pi 5)

The dashboard runs as a systemd service alongside the API on the same Raspberry Pi.

```bash
# From your Mac — copy code, build, restart
rsync -av --exclude='.git' --exclude='node_modules' --exclude='.next' \
  --exclude='.env.local' \
  ./ c3jota@100.73.5.37:/home/c3jota/cortex-dashboard/

ssh c3jota@100.73.5.37 \
  "cd /home/c3jota/cortex-dashboard && \
   npm install && \
   npm run build && \
   sudo systemctl restart cortex-dashboard"
```

Exposed publicly via Tailscale Funnel (HTTPS, no VPN required for visitors):

```bash
ssh c3jota@100.73.5.37 "tailscale funnel --bg 3000"
```

---

## Project structure

```
app/
├── page.tsx              # Dashboard (stats + chart + recent leads)
├── leads/
│   ├── page.tsx          # Leads table with pagination and filter
│   └── [id]/page.tsx     # Lead detail
└── schedules/page.tsx    # Schedule manager

components/
├── ScoreChart.tsx         # Recharts bar chart (client component)
├── ScoreBadge.tsx         # Color-coded score pill
├── RecentLeads.tsx        # Latest leads list for dashboard
├── LeadFilters.tsx        # Score filter form (client component)
└── ScheduleList.tsx       # Schedule CRUD with optimistic updates

lib/
└── api.ts                 # Typed API client for cortex-lead-hunter
```

---

## Related

- **[cortex-lead-hunter](https://github.com/carlosjorge7/cortex-hunter-lead)** — the backend API this dashboard consumes
