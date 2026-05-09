import type { RiskLevel } from "@/lib/types";

interface RiskBadgeProps {
  level: RiskLevel;
}

export default function RiskBadge({ level }: RiskBadgeProps) {
  const styles: Record<RiskLevel, string> = {
    Bajo: "bg-emerald-100 text-emerald-800 border-emerald-200",
    Medio: "bg-yellow-100 text-yellow-800 border-yellow-200",
    Alto: "bg-orange-100 text-orange-800 border-orange-200",
    Crítico: "bg-red-100 text-red-800 border-red-200",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${styles[level]}`}
    >
      Riesgo {level}
    </span>
  );
}