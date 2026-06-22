"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

type Props = { distribution: { low: number; medium: number; high: number } };

const BARS = [
  { key: "low", label: "Bajo (<50)", color: "#ef4444" },
  { key: "medium", label: "Medio (50-69)", color: "#f59e0b" },
  { key: "high", label: "Alto (≥70)", color: "#22c55e" },
];

export default function ScoreChart({ distribution }: Props) {
  const data = BARS.map((b) => ({ name: b.label, value: distribution[b.key as keyof typeof distribution], color: b.color }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} barCategoryGap="30%">
        <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 8 }}
          labelStyle={{ color: "#f8fafc" }}
          itemStyle={{ color: "#94a3b8" }}
        />
        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
          {data.map((d) => <Cell key={d.name} fill={d.color} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
