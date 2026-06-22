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
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={geist.className}>
      <body className="bg-slate-950 text-slate-100 min-h-screen">
        <nav className="border-b border-slate-800 px-6 py-3 flex items-center gap-8">
          <span className="font-semibold text-white tracking-tight">⚡ Cortex</span>
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="text-sm text-slate-400 hover:text-white transition-colors">
              {n.label}
            </Link>
          ))}
        </nav>
        <main className="p-6 max-w-7xl mx-auto">{children}</main>
      </body>
    </html>
  );
}
