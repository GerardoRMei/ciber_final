"use client";

import type { ReportData } from "@/lib/types";
import RiskBadge from "./RiskBadge";
import ScoreBar from "./ScoreBar";
import RecommendationList from "./RecommendationList";

interface ReportPreviewProps {
  report: ReportData;
}

export default function ReportPreview({ report }: ReportPreviewProps) {
  const handlePrint = () => {
    window.print();
  };

  const handleCopy = async () => {
    const text = `
Reporte de Buenas Prácticas BIA-DLP-DRP

Organización: ${report.organizationName}
Sector: ${report.sector}
Responsable: ${report.responsible}
Fecha: ${report.date}

Resumen Ejecutivo:
${report.executiveSummary}

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

      <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm print:border-0 print:shadow-none">
        <header className="mb-8 border-b border-slate-200 pb-6">
          <div className="mb-3 flex flex-col justify-between gap-3 md:flex-row md:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Documento generado automáticamente
              </p>

              <h1 className="mt-2 text-3xl font-bold text-slate-950">
                Reporte de Buenas Prácticas BIA-DLP-DRP
              </h1>
            </div>

            <RiskBadge level={report.generalLevel} />
          </div>

          <p className="mt-4 max-w-4xl text-sm leading-6 text-slate-600">
            Este reporte presenta una primera aproximación al estado de la
            organización en términos de análisis de impacto al negocio,
            prevención de fuga de datos y recuperación ante desastres.
          </p>
        </header>

        <section className="mb-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-5">
            <h2 className="mb-3 text-lg font-bold text-slate-900">
              Datos generales
            </h2>

            <dl className="space-y-2 text-sm">
              <div>
                <dt className="font-semibold text-slate-500">Organización</dt>
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
            {report.executiveSummary}
          </p>
        </section>

        <section className="mb-8">
          <h2 className="mb-5 text-xl font-bold text-slate-900">
            2. Evaluación por área
          </h2>

          <div className="space-y-5">
            <ScoreBar
              label="BIA - Análisis de Impacto al Negocio"
              score={report.biaScore}
              level={report.biaScore >= 80 ? "Crítico" : report.biaScore >= 60 ? "Alto" : report.biaScore >= 31 ? "Medio" : "Bajo"}
            />

            <ScoreBar
              label="DLP - Prevención de Pérdida de Datos"
              score={report.dlpScore}
              level={report.dlpScore >= 80 ? "Crítico" : report.dlpScore >= 60 ? "Alto" : report.dlpScore >= 31 ? "Medio" : "Bajo"}
            />

            <ScoreBar
              label="DRP - Plan de Recuperación ante Desastres"
              score={report.drpScore}
              level={report.drpScore >= 80 ? "Crítico" : report.drpScore >= 60 ? "Alto" : report.drpScore >= 31 ? "Medio" : "Bajo"}
            />
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-5 text-xl font-bold text-slate-900">
            3. Riesgos principales detectados
          </h2>

          <RecommendationList
            title="Riesgos principales"
            recommendations={report.risks}
          />
        </section>

        <section className="mb-8">
          <h2 className="mb-5 text-xl font-bold text-slate-900">
            4. Recomendaciones de buenas prácticas
          </h2>

          <RecommendationList recommendations={report.recommendations} />
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold text-slate-900">
            5. Conclusión
          </h2>

          <p className="text-sm leading-7 text-slate-700">
            La organización cuenta con una base inicial para identificar áreas
            críticas de mejora. Se recomienda atender primero los riesgos con
            prioridad alta o crítica, documentar los procedimientos y realizar
            revisiones periódicas para fortalecer la continuidad del negocio, la
            protección de datos y la recuperación ante incidentes.
          </p>
        </section>
      </article>
    </div>
  );
}