# Cortex Dashboard — Claude Code Instructions

## Qué es este proyecto

Dashboard de acción para el sistema cortex-lead-hunter. Permite revisar los leads encontrados por el pipeline, editar el pitch generado por el LLM, aprobar/rechazar, y ver métricas de conversión.

**Owner:** Carlos Jorge — Senior Software Engineer, jacinto.jorge@tecnofun.es  
**Empresa:** tecnofun.es

## Infraestructura

| Entorno | Detalles |
|---|---|
| Desarrollo | Mac — `/Users/carlosjorgech7/Desktop/Cortex/cortex-dashboard` |
| Producción | Raspberry Pi 5 — `/home/c3jota/cortex-dashboard` |
| Servicio | `cortex-dashboard.service` (systemd, puerto 3000) |
| URL pública | `https://raspberrypi.tail9ae84b.ts.net/cortex` (Tailscale Funnel → nginx → port 3000) |
| GitHub | `github.com/carlosjorge7/cortex-dashboard` |
| API backend | `http://localhost:8000` (en Raspberry) / `http://100.73.5.37:8000` (desde Mac) |
| API key | `cortex-secret-2026` |

**Deploy:**
```bash
rsync -av --exclude='.git' --exclude='node_modules' --exclude='.next' --exclude='.env.local' \
  /Users/carlosjorgech7/Desktop/Cortex/cortex-dashboard/ c3jota@100.73.5.37:/home/c3jota/cortex-dashboard/
ssh c3jota@100.73.5.37 "cd /home/c3jota/cortex-dashboard && npm run build && sudo systemctl restart cortex-dashboard"
```

## Stack

- Next.js 16 App Router + TypeScript
- Tailwind CSS v4 (dark theme, `bg-slate-950` base)
- Recharts para gráficos
- `lib/api.ts` — cliente tipado centralizado, usa `fetch` nativo

## Estructura de páginas

| Ruta | Descripción |
|---|---|
| `/` | Stats cards + gráfico de scores + últimos leads + sección "En revisión" |
| `/leads` | Lista con tabs (Todos/Pendientes/Enviados/Rechazados) + filtro por score |
| `/leads/[id]` | Detalle: pitch editable + aprobar/rechazar + pain points + metadata |
| `/schedules` | Búsquedas programadas — crear/activar/desactivar/eliminar |

## Estado actual del Lead (backend)

El campo `status` puede ser:
- `pending_review` — recién analizado, esperando aprobación manual
- `sent` — aprobado, email enviado
- `rejected` — rechazado por el usuario

## Componentes clave

| Componente | Función |
|---|---|
| `LeadActions` | Cliente — textarea editable del pitch, botones aprobar/rechazar, muestra estado según `status` |
| `ScoreBadge` | Pill de color según score (verde ≥80, amber ≥60, rojo <60) |
| `ScoreChart` | BarChart de Recharts — distribución low/medium/high |
| `RecentLeads` | Lista últimos leads con email icon y score badge |
| `ScheduleList` | Cliente — CRUD de búsquedas programadas con toggle |
| `LeadFilters` | Cliente — select de filtro por score mínimo |

## API client (`lib/api.ts`) — métodos disponibles

```typescript
api.stats()                          // GET /stats
api.leads({ limit, offset, min_score, status })  // GET /leads
api.lead(id)                         // GET /leads/:id
api.approveLead(id)                  // POST /leads/:id/approve
api.rejectLead(id)                   // POST /leads/:id/reject
api.updatePitch(id, pitch)           // PATCH /leads/:id/pitch
api.schedules()                      // GET /schedules
api.createSchedule(body)             // POST /schedules
api.toggleSchedule(id)               // PATCH /schedules/:id/toggle
api.deleteSchedule(id)               // DELETE /schedules/:id
```

## Pendiente / próximos pasos

1. **Funnel de conversión** — página o sección con métricas visuales: total leads → analizados → en revisión → enviados → abiertos → respondidos. Los datos de `stats` ya devuelven `leads_pending_review` y `leads_rejected`, falta la pantalla.

2. **Marcar "respondió / convirtió"** — botón en el detalle del lead para marcar respuesta/conversión manualmente. Requiere añadir `replied: bool` y `converted: bool` al backend.

3. **Historial de ediciones del pitch** — ver la versión original del LLM vs. la versión enviada.

## Working style

- Dark theme siempre — `bg-slate-950` base, `bg-slate-900` cards, `border-slate-800` bordes.
- Sin emojis excepto los que ya existen (📧 👁).
- Responsive: mobile-first, cards en mobile, tabla en desktop (md:).
- Los componentes de acción (botones, forms) son `"use client"`. Las páginas son server components.
- Nunca usar `axios`, siempre `fetch` nativo como en `lib/api.ts`.
- Después de cambios: `npm run build` para verificar, luego deploy con el comando de arriba.
