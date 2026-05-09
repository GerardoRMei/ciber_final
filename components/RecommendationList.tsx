import type { Recommendation } from "@/lib/types";
import RiskBadge from "./RiskBadge";

interface RecommendationListProps {
  title?: string;
  recommendations: Recommendation[];
}

export default function RecommendationList({
  title = "Recomendaciones priorizadas",
  recommendations,
}: RecommendationListProps) {
  if (recommendations.length === 0) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm">
        <h3 className="text-lg font-bold text-slate-900">
          Sin recomendaciones críticas
        </h3>
        <p className="mt-2 text-sm text-slate-500">
          No se detectaron riesgos relevantes con la información ingresada.
        </p>
      </div>
    );
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="mb-5 text-lg font-bold text-slate-900">{title}</h3>

      <div className="space-y-4">
        {recommendations.map((item) => (
          <article
            key={item.id}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
          >
            <div className="mb-3 flex flex-col justify-between gap-3 md:flex-row md:items-start">
              <div>
                <span className="mb-2 inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                  {item.area}
                </span>

                <h4 className="text-base font-bold text-slate-900">
                  {item.title}
                </h4>
              </div>

              <RiskBadge level={item.priority} />
            </div>

            <p className="text-sm leading-6 text-slate-600">
              {item.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}