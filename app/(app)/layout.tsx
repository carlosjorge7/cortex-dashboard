import Link from "next/link";
import { LogoutButton } from "@/components/LogoutButton";

const NAV = [
  { href: "/", label: "Dashboard" },
  { href: "/leads", label: "Leads" },
  { href: "/schedules", label: "Búsquedas" },
  { href: "/stats", label: "Métricas" },
  { href: "/settings", label: "Ajustes" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav className="border-b border-slate-800 px-4 py-3 flex items-center gap-6">
        <span className="font-semibold text-white tracking-tight shrink-0">⚡ Cortex</span>
        <div className="flex items-center gap-4 overflow-x-auto flex-1">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="text-sm text-slate-400 hover:text-white transition-colors whitespace-nowrap">
              {n.label}
            </Link>
          ))}
        </div>
        <LogoutButton />
      </nav>
      <main className="p-4 md:p-6 max-w-7xl mx-auto">{children}</main>
    </>
  );
}
