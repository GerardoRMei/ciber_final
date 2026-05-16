"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import DemoDataBanner from "@/components/DemoDataBanner";
import Header from "@/components/Header";
import NavigationButtons from "@/components/NavigationButtons";
import PageContainer from "@/components/PageContainer";
import ProgressSteps, {
  type StepStatus,
} from "@/components/ProgressSteps";
import QuestionCard from "@/components/QuestionCard";
import RecommendationList from "@/components/RecommendationList";
import ReportPreview from "@/components/ReportPreview";
import RiskBadge from "@/components/RiskBadge";
import RiskCard from "@/components/RiskCard";
import SectionCard from "@/components/SectionCard";

import { demoAnswers } from "@/data/demoData";
import { assessmentSteps, questionsBySection } from "@/data/questions";
import { analyzeAssessment } from "@/lib/scoring";
import {
  clearAssessment,
  loadAssessment,
  saveAssessment,
} from "@/lib/storage";
import type {
  AiReportAnalysis,
  AnalysisApiResponse,
  AnalysisSource,
  AssessmentAnswers,
  AssessmentSection,
} from "@/lib/types";

const sectionContent: Record<
  AssessmentSection,
  {
    badge: string;
    title: string;
    subtitle: string;
  }
> = {
  general: {
    badge: "Paso 1",
    title: "Datos generales",
    subtitle:
      "Captura la información base de la organización que será incluida en el reporte final.",
  },
  bia: {
    badge: "Paso 2",
    title: "BIA - Análisis de Impacto al Negocio",
    subtitle:
      "Identifica procesos críticos, impacto operativo, tiempos de recuperación y responsables.",
  },
  dlp: {
    badge: "Paso 3",
    title: "DLP - Prevención de Pérdida de Datos",
    subtitle:
      "Evalúa controles para proteger información sensible y reducir riesgos de fuga de datos.",
  },
  drp: {
    badge: "Paso 4",
    title: "DRP - Plan de Recuperación ante Desastres",
    subtitle:
      "Evalúa la capacidad de la organización para recuperar sistemas y datos después de un incidente grave.",
  },
  results: {
    badge: "Paso 5",
    title: "Resultados de la evaluación",
    subtitle:
      "Resumen del nivel de riesgo detectado en BIA, DLP y DRP con recomendaciones priorizadas.",
  },
  report: {
    badge: "Paso 6",
    title: "Reporte generado",
    subtitle:
      "Documento final con diagnóstico, riesgos y buenas prácticas sugeridas.",
  },
};

const orderedSteps: AssessmentSection[] = [
  "general",
  "bia",
  "dlp",
  "drp",
  "results",
  "report",
];

const formSteps: AssessmentSection[] = ["general", "bia", "dlp", "drp"];

export default function AssessmentPage() {
  const [currentStep, setCurrentStep] =
    useState<AssessmentSection>("general");

  const [answers, setAnswers] = useState<AssessmentAnswers>({});
  const [isHydrated, setIsHydrated] = useState(false);
  const initialAnswersRef = useRef<AssessmentAnswers>({});

  const [visitedSteps, setVisitedSteps] = useState<
    Partial<Record<AssessmentSection, boolean>>
  >({});

  const [reportGenerated, setReportGenerated] = useState(false);
  const [isGeneratingAnalysis, setIsGeneratingAnalysis] = useState(false);
  const [analysis, setAnalysis] = useState<AiReportAnalysis | null>(null);
  const [analysisSource, setAnalysisSource] = useState<AnalysisSource | null>(
    null
  );
  const [analysisWarnings, setAnalysisWarnings] = useState<string[]>([]);

  const result = useMemo(() => analyzeAssessment(answers), [answers]);

  const currentQuestions = questionsBySection[currentStep];
  const content = sectionContent[currentStep];

  useEffect(() => {
    initialAnswersRef.current = loadAssessment();
    setAnswers(initialAnswersRef.current);
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    saveAssessment(answers);
  }, [answers, isHydrated]);

  function isFormStep(step: AssessmentSection) {
    return formSteps.includes(step);
  }

  function isSectionComplete(section: AssessmentSection) {
    const questions = questionsBySection[section];

    if (questions.length === 0) return true;

    return questions.every((question) => {
      if (question.optional) return true;

      const value = answers[question.id];

      return value !== undefined && value.trim().length > 0;
    });
  }

  function areFormStepsComplete() {
    return formSteps.every((step) => isSectionComplete(step));
  }

  function getFirstIncompleteStep() {
    return formSteps.find((step) => !isSectionComplete(step));
  }

  function markStepAsVisited(step: AssessmentSection) {
    if (!isFormStep(step)) return;

    setVisitedSteps((prev) => ({
      ...prev,
      [step]: true,
    }));
  }

  function markAllFormStepsAsVisited() {
    setVisitedSteps((prev) => ({
      ...prev,
      general: true,
      bia: true,
      dlp: true,
      drp: true,
    }));
  }

  function canAccessResultsAndReport() {
    return areFormStepsComplete() && reportGenerated;
  }

  const statusByStep = useMemo(() => {
    const statuses: Partial<Record<AssessmentSection, StepStatus>> = {};
    const areFormsComplete = formSteps.every((step) => {
      const questions = questionsBySection[step];

      if (questions.length === 0) return true;

      return questions.every((question) => {
        if (question.optional) return true;
        const value = answers[question.id];
        return value !== undefined && value.trim().length > 0;
      });
    });

    formSteps.forEach((step) => {
      const questions = questionsBySection[step];
      const complete = questions.every((question) => {
        if (question.optional) return true;
        const value = answers[question.id];
        return value !== undefined && value.trim().length > 0;
      });

      if (complete) {
        statuses[step] = "complete";
        return;
      }

      if (visitedSteps[step]) {
        statuses[step] = "incomplete";
        return;
      }

      statuses[step] = "available";
    });

    statuses.results =
      areFormsComplete && reportGenerated ? "available" : "locked";
    statuses.report =
      areFormsComplete && reportGenerated ? "available" : "locked";

    return statuses;
  }, [answers, visitedSteps, reportGenerated]);

  function handleAnswerChange(questionId: string, value: string) {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));

    setReportGenerated(false);
    setAnalysis(null);
    setAnalysisSource(null);
    setAnalysisWarnings([]);
  }

  function handleLoadDemo() {
    setAnswers(demoAnswers);
    setVisitedSteps({});
    setReportGenerated(false);
    setAnalysis(null);
    setAnalysisSource(null);
    setAnalysisWarnings([]);
    setCurrentStep("general");
  }

  function handleClear() {
    setAnswers({});
    setVisitedSteps({});
    setReportGenerated(false);
    setAnalysis(null);
    setAnalysisSource(null);
    setAnalysisWarnings([]);
    clearAssessment();
    setCurrentStep("general");
  }

  function handleStepClick(targetStep: AssessmentSection) {
    markStepAsVisited(currentStep);

    if (isFormStep(targetStep)) {
      setCurrentStep(targetStep);
      return;
    }

    if (!areFormStepsComplete()) {
      markAllFormStepsAsVisited();

      const firstIncompleteStep = getFirstIncompleteStep();

      if (firstIncompleteStep) {
        setCurrentStep(firstIncompleteStep);
      }

      return;
    }

    if (!reportGenerated) {
      setCurrentStep("drp");
      return;
    }

    setCurrentStep(targetStep);
  }

  function handleBack() {
    markStepAsVisited(currentStep);

    const currentIndex = orderedSteps.indexOf(currentStep);

    if (currentIndex <= 0) return;

    setCurrentStep(orderedSteps[currentIndex - 1]);
  }

  function handleNext() {
    markStepAsVisited(currentStep);

    const currentIndex = orderedSteps.indexOf(currentStep);

    if (currentIndex >= orderedSteps.length - 1) return;

    const nextStep = orderedSteps[currentIndex + 1];

    if (nextStep === "results" || nextStep === "report") {
      if (!canAccessResultsAndReport()) return;
    }

    setCurrentStep(nextStep);
  }

  async function handleGenerateReport() {
    markAllFormStepsAsVisited();

    if (!areFormStepsComplete()) {
      setReportGenerated(false);

      const firstIncompleteStep = getFirstIncompleteStep();

      if (firstIncompleteStep) {
        setCurrentStep(firstIncompleteStep);
      }

      return;
    }

    setIsGeneratingAnalysis(true);
    setAnalysisWarnings([]);

    try {
      const response = await fetch("/api/analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answers }),
      });

      if (!response.ok) {
        throw new Error(`Analysis request failed with status ${response.status}`);
      }

      const payload = (await response.json()) as AnalysisApiResponse;

      if (!payload.ok) {
        throw new Error("Analysis API returned an invalid response.");
      }

      setAnalysis(payload.analysis);
      setAnalysisSource(payload.source);
      setAnalysisWarnings(payload.warnings ?? []);
    } catch (error) {
      setAnalysis(null);
      setAnalysisSource(null);
      setAnalysisWarnings([
        error instanceof Error
          ? `No se pudo completar el análisis IA: ${error.message}`
          : "No se pudo completar el análisis IA.",
      ]);
    } finally {
      setIsGeneratingAnalysis(false);
    }

    setReportGenerated(true);
    setCurrentStep("results");
  }

  const showBack = currentStep !== "general";
  const isDrpStep = currentStep === "drp";

  return (
    <>
      <Header />

      <PageContainer>
        <div className="space-y-8">
          <section className="rounded-3xl bg-slate-900 p-8 text-white shadow-sm">
            <div className="max-w-4xl">
              <span className="mb-4 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-slate-200">
                Evaluación BIA · DLP · DRP
              </span>

              <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
                Generador de buenas prácticas de ciberresiliencia
              </h1>

              <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 md:text-base">
                Responde un cuestionario guiado para obtener un diagnóstico
                inicial de riesgos y un reporte con recomendaciones sobre
                impacto al negocio, prevención de fuga de datos y recuperación
                ante desastres.
              </p>
            </div>
          </section>

          <DemoDataBanner onLoadDemo={handleLoadDemo} onClear={handleClear} />

          <ProgressSteps
            steps={assessmentSteps}
            currentStep={currentStep}
            statusByStep={statusByStep}
            onStepClick={handleStepClick}
          />

          {currentStep !== "results" && currentStep !== "report" && (
            <SectionCard
              badge={content.badge}
              title={content.title}
              subtitle={content.subtitle}
            >
              <div className="grid gap-5">
                {currentQuestions.map((question) => (
                  <QuestionCard
                    key={question.id}
                    question={question}
                    value={answers[question.id] ?? ""}
                    onChange={handleAnswerChange}
                  />
                ))}
              </div>

              <NavigationButtons
                showBack={showBack}
                onBack={handleBack}
                onNext={handleNext}
                onGenerate={handleGenerateReport}
                showGenerate={isDrpStep}
                isGenerating={isGeneratingAnalysis}
              />
            </SectionCard>
          )}

          {currentStep === "results" && (
            <SectionCard
              badge={content.badge}
              title={content.title}
              subtitle={content.subtitle}
            >
              <div className="mb-6 rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                      Resultado general
                    </p>

                    <h2 className="mt-2 text-4xl font-bold text-slate-950">
                      {result.generalScore}/100
                    </h2>

                    <p className="mt-2 text-sm text-slate-600">
                      Nivel general detectado:
                    </p>
                  </div>

                  <RiskBadge level={result.generalLevel} />
                </div>
              </div>

              <div className="mb-6 grid gap-5 lg:grid-cols-3">
                <RiskCard
                  title="BIA"
                  description="Impacto al negocio, procesos críticos, RTO, RPO y responsables."
                  score={result.biaScore}
                  level={result.biaLevel}
                />

                <RiskCard
                  title="DLP"
                  description="Clasificación, acceso, cifrado y monitoreo de información sensible."
                  score={result.dlpScore}
                  level={result.dlpLevel}
                />

                <RiskCard
                  title="DRP"
                  description="Respaldos, pruebas, plan documentado y recuperación ante desastres."
                  score={result.drpScore}
                  level={result.drpLevel}
                />
              </div>

              <RecommendationList
                title="Riesgos y recomendaciones principales"
                recommendations={result.recommendations}
              />

              <NavigationButtons
                showBack
                onBack={handleBack}
                onNext={() => setCurrentStep("report")}
                nextLabel="Ver reporte"
              />
            </SectionCard>
          )}

          {currentStep === "report" && (
            <SectionCard
              badge={content.badge}
              title={content.title}
              subtitle={content.subtitle}
            >
              <ReportPreview
                report={result.report}
                analysis={analysis}
                analysisSource={analysisSource}
                warnings={analysisWarnings}
              />

              <NavigationButtons
                showBack
                onBack={handleBack}
                onNext={() => setCurrentStep("general")}
                nextLabel="Volver al inicio"
              />
            </SectionCard>
          )}
        </div>
      </PageContainer>
    </>
  );
}
