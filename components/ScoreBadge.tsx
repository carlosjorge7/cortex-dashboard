export default function ScoreBadge({ score }: { score: number | null }) {
  if (score === null) return <span className="text-xs text-slate-500">—</span>;
  const color =
    score >= 80 ? "bg-green-900 text-green-300" :
    score >= 60 ? "bg-amber-900 text-amber-300" :
    "bg-red-900 text-red-300";
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${color}`}>
      {score}
    </span>
  );
}
