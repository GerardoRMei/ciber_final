import type { RiskLevel } from "@/lib/types";

interface ScoreBarProps {
  label: string;
  score: number;
  level: RiskLevel;
}

export default function ScoreBar({ label, score, level }: ScoreBarProps) {
  const barStyles: Record<RiskLevel, string> = {
    Bajo: "bg-emerald-500",
    Medio: "bg-yellow-500",
    Alto: "bg-orange-500",
    Crítico: "bg-red-500",
  };

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-700">{label}</span>
        <span className="text-sm font-bold text-slate-900">{score}/100</span>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full transition-all ${barStyles[level]}`}
          style={{ width: `${Math.min(Math.max(score, 0), 100)}%` }}
        />
      </div>
    </div>
  );
}