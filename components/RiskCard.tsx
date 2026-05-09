import type { RiskLevel } from "@/lib/types";
import RiskBadge from "./RiskBadge";
import ScoreBar from "./ScoreBar";

interface RiskCardProps {
  title: string;
  description: string;
  score: number;
  level: RiskLevel;
}

export default function RiskCard({
  title,
  description,
  score,
  level,
}: RiskCardProps) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            {description}
          </p>
        </div>

        <RiskBadge level={level} />
      </div>

      <ScoreBar label="Puntaje de riesgo" score={score} level={level} />
    </article>
  );
}