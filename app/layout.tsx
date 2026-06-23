import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cortex Dashboard",
  description: "Lead Hunter Control Panel",
};

const NAV = [
  { href: "/", label: "Dashboard" },
  { href: "/leads", label: "Leads" },
  { href: "/schedules", label: "Búsquedas" },
  { href: "/stats", label: "Métricas" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={geist.className}>
      <body className="bg-slate-950 text-slate-100 min-h-screen">
        <nav className="border-b border-slate-800 px-4 py-3 flex items-center gap-6">
          <span className="font-semibold text-white tracking-tight shrink-0">⚡ Cortex</span>
          <div className="flex items-center gap-4 overflow-x-auto">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="text-sm text-slate-400 hover:text-white transition-colors whitespace-nowrap">
                {n.label}
              </Link>
            ))}
          </div>
        </nav>
        <main className="p-4 md:p-6 max-w-7xl mx-auto">{children}</main>
      </body>
    </html>
  );
}
