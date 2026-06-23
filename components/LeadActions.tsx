"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api, Lead } from "@/lib/api";

export default function LeadActions({ lead }: { lead: Lead }) {
  const router = useRouter();
  const [pitch, setPitch] = useState(lead.suggested_pitch ?? "");
  const [status, setStatus] = useState(lead.status ?? "");
  const [replied, setReplied] = useState(lead.replied ?? false);
  const [converted, setConverted] = useState(lead.converted ?? false);
  const [savingPitch, setSavingPitch] = useState(false);
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [pitchSaved, setPitchSaved] = useState(false);
  const [markingReplied, setMarkingReplied] = useState(false);
  const [markingConverted, setMarkingConverted] = useState(false);

  async function handleSavePitch() {
    setSavingPitch(true);
    try {
      await api.updatePitch(lead.id, pitch);
      setPitchSaved(true);
      setTimeout(() => setPitchSaved(false), 2000);
    } finally {
      setSavingPitch(false);
    }
  }

  async function handleApprove() {
    setApproving(true);
    try {
      const updated = await api.approveLead(lead.id);
      setStatus(updated.status ?? "sent");
      router.refresh();
    } finally {
      setApproving(false);
    }
  }

  async function handleReject() {
    setRejecting(true);
    try {
      const updated = await api.rejectLead(lead.id);
      setStatus(updated.status ?? "rejected");
      router.refresh();
    } finally {
      setRejecting(false);
    }
  }

  async function handleMarkReplied() {
    setMarkingReplied(true);
    try {
      const updated = await api.markReplied(lead.id);
      setReplied(updated.replied ?? true);
    } finally {
      setMarkingReplied(false);
    }
  }

  async function handleMarkConverted() {
    setMarkingConverted(true);
    try {
      const updated = await api.markConverted(lead.id);
      setConverted(updated.converted ?? true);
    } finally {
      setMarkingConverted(false);
    }
  }

  const hasOriginalPitch =
    lead.original_pitch &&
    lead.original_pitch !== lead.suggested_pitch;

  if (!lead.suggested_pitch && !pitch) return null;

  if (status === "sent") {
    return (
      <div className="bg-slate-900 border border-green-800 rounded-xl p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
          <p className="text-xs text-green-400 uppercase tracking-wide font-semibold">Mensaje de apertura</p>
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs bg-green-900/60 text-green-300 border border-green-700 rounded-full px-2.5 py-0.5 font-medium">
              Email enviado ✓
            </span>
            {replied && (
              <span className="text-xs bg-blue-900/60 text-blue-300 border border-blue-700 rounded-full px-2.5 py-0.5 font-medium">
                Respondió
              </span>
            )}
            {converted && (
              <span className="text-xs bg-green-900/60 text-green-300 border border-green-700 rounded-full px-2.5 py-0.5 font-medium">
                Convirtió ✓
              </span>
            )}
          </div>
        </div>

        <p className="text-slate-200 leading-relaxed whitespace-pre-wrap text-sm md:text-base">{pitch}</p>

        {/* Feedback buttons */}
        <div className="flex flex-wrap gap-2 pt-1">
          {!replied && (
            <button
              onClick={handleMarkReplied}
              disabled={markingReplied}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-700 hover:bg-blue-600 text-white transition-colors disabled:opacity-50"
            >
              {markingReplied ? "Guardando…" : "Respondió"}
            </button>
          )}
          {replied && !converted && (
            <button
              onClick={handleMarkConverted}
              disabled={markingConverted}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-green-700 hover:bg-green-600 text-white transition-colors disabled:opacity-50"
            >
              {markingConverted ? "Guardando…" : "Convirtió"}
            </button>
          )}
        </div>

        {/* Original LLM pitch */}
        {hasOriginalPitch && (
          <div className="border-t border-slate-800 pt-3">
            <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-2">
              Versión original del LLM
            </p>
            <p className="text-slate-500 leading-relaxed whitespace-pre-wrap text-sm">
              {lead.original_pitch}
            </p>
          </div>
        )}
      </div>
    );
  }

  if (status === "rejected") {
    return (
      <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Mensaje de apertura</p>
          <span className="text-xs bg-red-900/60 text-red-300 border border-red-700 rounded-full px-2.5 py-0.5 font-medium">
            Rechazado
          </span>
        </div>
        <p className="text-slate-500 leading-relaxed whitespace-pre-wrap text-sm md:text-base">{pitch}</p>

        {hasOriginalPitch && (
          <div className="border-t border-slate-800 pt-3">
            <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-2">
              Versión original del LLM
            </p>
            <p className="text-slate-500 leading-relaxed whitespace-pre-wrap text-sm">
              {lead.original_pitch}
            </p>
          </div>
        )}
      </div>
    );
  }

  // pending_review (default)
  return (
    <div className="bg-slate-900 border border-green-800 rounded-xl p-4 space-y-3">
      <p className="text-xs text-green-400 uppercase tracking-wide font-semibold">Mensaje de apertura</p>
      <textarea
        value={pitch}
        onChange={(e) => setPitch(e.target.value)}
        rows={8}
        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm text-slate-200 leading-relaxed resize-y focus:outline-none focus:border-green-600 transition-colors"
      />
      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleSavePitch}
          disabled={savingPitch}
          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors disabled:opacity-50"
        >
          {savingPitch ? "Guardando…" : pitchSaved ? "Guardado ✓" : "Guardar pitch"}
        </button>
        <button
          onClick={handleApprove}
          disabled={approving}
          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-green-700 hover:bg-green-600 text-white transition-colors disabled:opacity-50"
        >
          {approving ? "Enviando…" : "Aprobar y enviar email"}
        </button>
        <button
          onClick={handleReject}
          disabled={rejecting}
          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-red-900/60 text-slate-400 hover:text-red-300 border border-slate-700 hover:border-red-700 transition-colors disabled:opacity-50"
        >
          {rejecting ? "Rechazando…" : "Rechazar"}
        </button>
      </div>

      {hasOriginalPitch && (
        <div className="border-t border-slate-800 pt-3">
          <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-2">
            Versión original del LLM
          </p>
          <p className="text-slate-500 leading-relaxed whitespace-pre-wrap text-sm">
            {lead.original_pitch}
          </p>
        </div>
      )}
    </div>
  );
}
