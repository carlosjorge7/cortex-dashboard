"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={logout}
      className="text-sm text-slate-400 hover:text-white transition-colors whitespace-nowrap ml-auto"
    >
      Salir
    </button>
  );
}
