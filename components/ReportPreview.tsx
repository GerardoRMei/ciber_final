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
  const handleDownloadPdf = async () => {
    const { default: jsPDF } = await import("jspdf");

    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const margin = 16;
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const maxW = pageW - margin * 2;
    let y = margin;

    const SLATE_900: [number, number, number] = [15, 23, 42];
    const SLATE_700: [number, number, number] = [51, 65, 85];
    const SLATE_500: [number, number, number] = [100, 116, 139];
    const SLATE_100: [number, number, number] = [241, 245, 249];
    const WHITE: [number, number, number] = [255, 255, 255];
    const EMERALD: [number, number, number] = [16, 185, 129];

    const levelColor: Record<string, [number, number, number]> = {
      Bajo: [34, 197, 94],
      Medio: [234, 179, 8],
      Alto: [249, 115, 22],
      Crítico: [239, 68, 68],
    };

    const needPage = (needed: number) => {
      if (y + needed > pageH - margin) { doc.addPage(); y = margin; }
    };

    const text = (
      str: string,
      size: number,
      color: [number, number, number],
      bold = false,
      indent = 0,
    ) => {
      doc.setFontSize(size);
      doc.setFont("helvetica", bold ? "bold" : "normal");
      doc.setTextColor(...color);
      const lines = doc.splitTextToSize(str, maxW - indent);
      const lineH = size * 0.37;
      needPage(lines.length * lineH + 3);
      doc.text(lines, margin + indent, y);
      y += lines.length * lineH + 3;
    };

    const sectionTitle = (num: number, title: string) => {
      y += 3;
      needPage(12);
      doc.setFillColor(...SLATE_100);
      doc.rect(margin, y - 3, maxW, 10, "F");
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...SLATE_900);
      doc.text(`${num}. ${title}`, margin + 3, y + 4);
      y += 12;
    };

    const bullet = (str: string) => {
      needPage(8);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...SLATE_700);
      const lines = doc.splitTextToSize(str, maxW - 8);
      const lineH = 9 * 0.37;
      doc.text("•", margin + 2, y);
      doc.text(lines, margin + 7, y);
      y += lines.length * lineH + 2;
    };

    const pill = (label: string, color: [number, number, number], px: number) => {
      doc.setFillColor(...color);
      doc.roundedRect(px, y - 4, 22, 6, 2, 2, "F");
      doc.setFontSize(7);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...WHITE);
      doc.text(label, px + 11, y, { align: "center" });
    };

    const scoreBar = (label: string, score: number, level: string) => {
      needPage(14);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...SLATE_700);
      doc.text(label, margin, y);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...SLATE_900);
      doc.text(`${score}/100`, pageW - margin, y, { align: "right" });
      y += 4;
      doc.setFillColor(...SLATE_100);
      doc.rect(margin, y, maxW, 3, "F");
      doc.setFillColor(...(levelColor[level] ?? EMERALD));
      doc.rect(margin, y, (maxW * score) / 100, 3, "F");
      y += 8;
    };

    // ── HEADER ───────────────────────────────────────────────────────────
    doc.setFillColor(...SLATE_900);
    doc.rect(0, 0, pageW, 38, "F");
    doc.setFontSize(15);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...WHITE);
    doc.text("Reporte de Buenas Prácticas BIA · DLP · DRP", margin, 14);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(180, 195, 210);
    doc.text(`${report.organizationName}  ·  ${report.sector}  ·  ${report.date}`, margin, 22);
    doc.text(`Responsable: ${report.responsible}`, margin, 29);

    const lc = levelColor[report.generalLevel] ?? EMERALD;
    doc.setFillColor(...lc);
    doc.roundedRect(pageW - 52, 10, 36, 10, 2, 2, "F");
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...WHITE);
    doc.text(`Riesgo ${report.generalLevel}`, pageW - 34, 17, { align: "center" });

    y = 48;

    // ── SCORES GENERALES ─────────────────────────────────────────────────
    scoreBar("BIA — Análisis de Impacto al Negocio", report.biaScore, getRiskLevel(report.biaScore));
    scoreBar("DLP — Prevención de Pérdida de Datos", report.dlpScore, getRiskLevel(report.dlpScore));
    scoreBar("DRP — Plan de Recuperación ante Desastres", report.drpScore, getRiskLevel(report.drpScore));
    y += 2;

    // ── 1. RESUMEN EJECUTIVO ──────────────────────────────────────────────
    sectionTitle(1, "Resumen ejecutivo");
    text(analysis?.executiveSummary ?? report.executiveSummary, 9, SLATE_700);

    // ── 2. HALLAZGOS CLAVE ────────────────────────────────────────────────
    if (analysis?.keyFindings?.length) {
      sectionTitle(2, "Hallazgos clave");
      analysis.keyFindings.forEach(bullet);
    }

    // ── 3. ACCIONES PRIORITARIAS ──────────────────────────────────────────
    if (analysis?.priorityActions?.length) {
      sectionTitle(3, "Acciones prioritarias");
      analysis.priorityActions.forEach(bullet);
    }

    // ── 4. ROADMAP 30/60/90 DÍAS ──────────────────────────────────────────
    if (analysis?.roadmap30_60_90) {
      sectionTitle(4, "Roadmap 30 / 60 / 90 días");
      const { d30, d60, d90 } = analysis.roadmap30_60_90;
      if (d30.length) { text("Primeros 30 días", 9, SLATE_900, true); d30.forEach(bullet); }
      if (d60.length) { text("60 días", 9, SLATE_900, true); d60.forEach(bullet); }
      if (d90.length) { text("90 días", 9, SLATE_900, true); d90.forEach(bullet); }
    }

    // ── 5. EVALUACIÓN POR ÁREA ────────────────────────────────────────────
    sectionTitle(5, "Evaluación por área");
    scoreBar("BIA", report.biaScore, getRiskLevel(report.biaScore));
    scoreBar("DLP", report.dlpScore, getRiskLevel(report.dlpScore));
    scoreBar("DRP", report.drpScore, getRiskLevel(report.drpScore));

    // ── 6. RIESGOS PRINCIPALES ────────────────────────────────────────────
    sectionTitle(6, "Riesgos principales detectados");
    report.risks.forEach((r) => {
      needPage(18);
      const rowY = y;
      doc.setFillColor(...SLATE_100);
      doc.roundedRect(margin, y - 1, maxW, 14, 2, 2, "F");
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...SLATE_900);
      doc.text(r.title, margin + 3, y + 4);
      pill(r.area, SLATE_500, pageW - margin - 48);
      pill(r.priority, levelColor[r.priority] ?? SLATE_500, pageW - margin - 24);
      y += 8;
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...SLATE_500);
      const desc = doc.splitTextToSize(r.description, maxW - 6);
      doc.text(desc, margin + 3, y);
      y = rowY + 18;
    });

    // ── 7. RECOMENDACIONES ────────────────────────────────────────────────
    sectionTitle(7, "Recomendaciones de buenas prácticas");
    report.recommendations.forEach((r) => {
      needPage(18);
      const rowY = y;
      doc.setFillColor(...SLATE_100);
      doc.roundedRect(margin, y - 1, maxW, 14, 2, 2, "F");
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...SLATE_900);
      doc.text(r.title, margin + 3, y + 4);
      pill(r.area, SLATE_500, pageW - margin - 48);
      pill(r.priority, levelColor[r.priority] ?? SLATE_500, pageW - margin - 24);
      y += 8;
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...SLATE_500);
      const desc = doc.splitTextToSize(r.description, maxW - 6);
      doc.text(desc, margin + 3, y);
      y = rowY + 18;
    });

    // ── 8. CONCLUSIÓN ─────────────────────────────────────────────────────
    sectionTitle(8, "Conclusión");
    text(
      analysis?.conclusion ??
        `La organización cuenta con una base inicial para identificar áreas críticas de mejora. Se recomienda atender primero los riesgos con prioridad alta o crítica, documentar los procedimientos y realizar revisiones periódicas.`,
      9,
      SLATE_700,
    );

    // ── FOOTER en cada página ─────────────────────────────────────────────
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFillColor(...SLATE_100);
      doc.rect(0, pageH - 10, pageW, 10, "F");
      doc.setFontSize(7);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...SLATE_500);
      doc.text("CyberResilience Builder — Generado automáticamente", margin, pageH - 4);
      doc.text(`${i} / ${totalPages}`, pageW - margin, pageH - 4, { align: "right" });
    }

    doc.save(
      `Reporte-CiberResiliencia-${report.organizationName}-${report.date}.pdf`,
    );
  };

  return (
    <div className="space-y-6">
      <div className="no-print flex flex-col justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Vista previa del reporte
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Descarga el reporte como PDF directamente desde el navegador.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={handleDownloadPdf}
            className="cursor-pointer rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Descargar PDF
          </button>
        </div>
      </div>

      {(analysisSource || warnings.length > 0) && (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          {analysisSource && (
            <p>
              Fuente del análisis:{" "}
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
                4. Roadmap 30/60/90 días
              </h2>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <h3 className="font-semibold text-slate-900">30 días</h3>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                    {analysis.roadmap30_60_90.d30.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <h3 className="font-semibold text-slate-900">60 días</h3>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                    {analysis.roadmap30_60_90.d60.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <h3 className="font-semibold text-slate-900">90 días</h3>
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
            5. Evaluación por área
          </h2>

          <div className="space-y-5">
            <ScoreBar
              label="BIA - Análisis de Impacto al Negocio"
              score={report.biaScore}
              level={getRiskLevel(report.biaScore)}
            />

            <ScoreBar
              label="DLP - Prevención de Pérdida de Datos"
              score={report.dlpScore}
              level={getRiskLevel(report.dlpScore)}
            />

            <ScoreBar
              label="DRP - Plan de Recuperación ante Desastres"
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
            7. Recomendaciones de buenas prácticas
          </h2>

          <RecommendationList recommendations={report.recommendations} />
        </section>

        <section>
          <h2 className="mb-3 text-xl font-bold text-slate-900">
            8. Conclusión
          </h2>

          <p className="text-sm leading-7 text-slate-700">
            {analysis?.conclusion ??
              `La organización cuenta con una base inicial para identificar áreas
              críticas de mejora. Se recomienda atender primero los riesgos con
              prioridad alta o crítica, documentar los procedimientos y realizar
              revisiones periódicas para fortalecer la continuidad del negocio, la
              protección de datos y la recuperación ante incidentes.`}
          </p>
        </section>
      </article>
    </div>
  );
}
