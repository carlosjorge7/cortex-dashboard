"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    const form = new FormData(e.currentTarget);
    const new_password = form.get("new_password") as string;
    const confirm = form.get("confirm_password") as string;

    if (new_password !== confirm) {
      setErrorMsg("Las contraseñas no coinciden");
      setStatus("error");
      return;
    }

    // Go through the Next.js rewrite proxy — middleware injects the Bearer token automatically
    const res = await fetch("/cortex/api-proxy/auth/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        current_password: form.get("current_password"),
        new_password,
      }),
    });

    if (res.ok) {
      setStatus("ok");
      (e.target as HTMLFormElement).reset();
    } else {
      const data = await res.json();
      setErrorMsg(data.error ?? "Error al cambiar la contraseña");
      setStatus("error");
    }
  }

  return (
    <div className="max-w-md">
      <h1 className="text-xl font-semibold text-white mb-6">Configuración</h1>

      <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
        <h2 className="text-sm font-medium text-slate-300 mb-4">Cambiar contraseña</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Contraseña actual</label>
            <input
              name="current_password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1">Nueva contraseña</label>
            <input
              name="new_password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1">Confirmar nueva contraseña</label>
            <input
              name="confirm_password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {status === "error" && (
            <p className="text-red-400 text-sm">{errorMsg}</p>
          )}
          {status === "ok" && (
            <p className="text-green-400 text-sm">Contraseña actualizada correctamente.</p>
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold rounded-lg py-2 text-sm transition-colors"
          >
            {status === "loading" ? "Guardando..." : "Cambiar contraseña"}
          </button>
        </form>
      </div>
    </div>
  );
}
