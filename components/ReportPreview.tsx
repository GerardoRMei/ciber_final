"use client";

import { getRiskLevel } from "@/lib/scoring";
import type {
  AiReportAnalysis,
  AnalysisSource,
  ReportData,
} from "@/lib/types";
import RecommendationList from "./RecommendationList";
import RiskBadge from "./RiskBadge";
import ScoreBar from "./ScoreBar";

interface ReportPreviewProps {
  report: ReportData;
  analysis?: AiReportAnalysis | null;
  analysisSource?: AnalysisSource | null;
  warnings?: string[];
}

export default function ReportPreview({
  report,
  analysis,
  analysisSource,
  warnings = [],
}: ReportPreviewProps) {
  const handlePrint = () => {
    window.print();
  };

  const handleCopy = async () => {
    const text = `
Reporte de Buenas Practicas BIA-DLP-DRP

Organizacion: ${report.organizationName}
Sector: ${report.sector}
Responsable: ${report.responsible}
Fecha: ${report.date}

Resumen Ejecutivo:
${analysis?.executiveSummary ?? report.executiveSummary}

Puntaje General: ${report.generalScore}/100
Nivel General: ${report.generalLevel}

BIA: ${report.biaScore}/100
DLP: ${report.dlpScore}/100
DRP: ${report.drpScore}/100

Recomendaciones:
${report.recommendations
  .map((item, index) => `${index + 1}. [${item.area}] ${item.title}: ${item.description}`)
  .join("\n")}
`;

    await navigator.clipboard.writeText(text);
    alert("Reporte copiado al portapapeles.");
  };

  return (
    <div className="space-y-6">
      <div className="no-print flex flex-col justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Vista previa del reporte
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Puedes imprimirlo o guardarlo como PDF desde el navegador.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={handleCopy}
            className="cursor-pointer rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Copiar reporte
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="cursor-pointer rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Imprimir / Guardar PDF
          </button>
        </div>
      </div>

      {(analysisSource || warnings.length > 0) && (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          {analysisSource && (
            <p>
              Fuente del analisis:{" "}
              <span className="font-semibold">
                {analysisSource === "openai"
                  ? "OpenAI"
                  : "Fallback local (sin OpenAI)"}
              </span>
            </p>
          )}
          {warnings.map((warning) => (
            <p key={warning} className="mt-2 text-amber-700">
              {warning}
            </p>
          ))}
        </div>
      )}

      <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm print:border-0 print:shadow-none">
        <header className="mb-8 border-b border-slate-200 pb-6">
          <div className="mb-3 flex flex-col justify-between gap-3 md:flex-row md:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Documento generado automaticamente
              </p>

              <h1 className="mt-2 text-3xl font-bold text-slate-950">
                Reporte de Buenas Practicas BIA-DLP-DRP
              </h1>
            </div>

            <RiskBadge level={report.generalLevel} />
          </div>

          <p className="mt-4 max-w-4xl text-sm leading-6 text-slate-600">
            Este reporte presenta una primera aproximacion al estado de la
            organizacion en terminos de analisis de impacto al negocio,
            prevencion de fuga de datos y recuperacion ante desastres.
          </p>
        </header>

        <section className="mb-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-5">
            <h2 className="mb-3 text-lg font-bold text-slate-900">
              Datos generales
            </h2>

            <dl className="space-y-2 text-sm">
              <div>
                <dt className="font-semibold text-slate-500">Organizacion</dt>
                <dd className="text-slate-900">{report.organizationName}</dd>
              </div>

              <div>
                <dt className="font-semibold text-slate-500">Sector</dt>
                <dd className="text-slate-900">{report.sector}</dd>
              </div>

              <div>
                <dt className="font-semibold text-slate-500">Responsable</dt>
                <dd className="text-slate-900">{report.responsible}</dd>
              </div>

              <div>
                <dt className="font-semibold text-slate-500">Fecha</dt>
                <dd className="text-slate-900">{report.date}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl bg-slate-50 p-5">
            <h2 className="mb-3 text-lg font-bold text-slate-900">
              Resultado general
            </h2>

            <ScoreBar
              label="Puntaje general"
              score={report.generalScore}
              level={report.generalLevel}
            />

            <p className="mt-4 text-sm leading-6 text-slate-600">
              Nivel detectado:{" "}
              <span className="font-bold text-slate-900">
                {report.generalLevel}
              </span>
            </p>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-3 text-xl font-bold text-slate-900">
            1. Resumen ejecutivo
          </h2>

          <p className="text-sm leading-7 text-slate-700">
            {analysis?.executiveSummary ?? report.executiveSummary}
          </p>
        </section>

        {analysis && (
          <>
            <section className="mb-8">
              <h2 className="mb-5 text-xl font-bold text-slate-900">
                2. Hallazgos clave
              </h2>
              <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-slate-700">
                {analysis.keyFindings.map((finding) => (
                  <li key={finding}>{finding}</li>
                ))}
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-5 text-xl font-bold text-slate-900">
                3. Acciones prioritarias
              </h2>
              <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-slate-700">
                {analysis.priorityActions.map((action) => (
                  <li key={action}>{action}</li>
                ))}
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-5 text-xl font-bold text-slate-900">
                4. Roadmap 30/60/90 dias
              </h2>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <h3 className="font-semibold text-slate-900">30 dias</h3>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                    {analysis.roadmap30_60_90.d30.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <h3 className="font-semibold text-slate-900">60 dias</h3>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                    {analysis.roadmap30_60_90.d60.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <h3 className="font-semibold text-slate-900">90 dias</h3>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                    {analysis.roadmap30_60_90.d90.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          </>
        )}

        <section className="mb-8">
          <h2 className="mb-5 text-xl font-bold text-slate-900">
            5. Evaluacion por area
          </h2>

          <div className="space-y-5">
            <ScoreBar
              label="BIA - Analisis de Impacto al Negocio"
              score={report.biaScore}
              level={getRiskLevel(report.biaScore)}
            />

            <ScoreBar
              label="DLP - Prevencion de Perdida de Datos"
              score={report.dlpScore}
              level={getRiskLevel(report.dlpScore)}
            />

            <ScoreBar
              label="DRP - Plan de Recuperacion ante Desastres"
              score={report.drpScore}
              level={getRiskLevel(report.drpScore)}
            />
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-5 text-xl font-bold text-slate-900">
            6. Riesgos principales detectados
          </h2>

          <RecommendationList
            title="Riesgos principales"
            recommendations={report.risks}
          />
        </section>

        <section className="mb-8">
          <h2 className="mb-5 text-xl font-bold text-slate-900">
            7. Recomendaciones de buenas practicas
          </h2>

          <RecommendationList recommendations={report.recommendations} />
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold text-slate-900">
            8. Conclusion
          </h2>

          <p className="text-sm leading-7 text-slate-700">
            La organizacion cuenta con una base inicial para identificar areas
            criticas de mejora. Se recomienda atender primero los riesgos con
            prioridad alta o critica, documentar los procedimientos y realizar
            revisiones periodicas para fortalecer la continuidad del negocio, la
            proteccion de datos y la recuperacion ante incidentes.
          </p>
        </section>
      </article>
    </div>
  );
}
