"use client";

import type { AssessmentSection } from "@/lib/types";

export type StepStatus = "available" | "complete" | "incomplete" | "locked";

interface Step {
  id: AssessmentSection;
  label: string;
  description?: string;
}

interface ProgressStepsProps {
  steps: Step[];
  currentStep: AssessmentSection;
  statusByStep?: Partial<Record<AssessmentSection, StepStatus>>;
  onStepClick?: (step: AssessmentSection) => void;
}

export default function ProgressSteps({
  steps,
  currentStep,
  statusByStep = {},
  onStepClick,
}: ProgressStepsProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid gap-3 md:grid-cols-6">
        {steps.map((step, index) => {
          const isActive = step.id === currentStep;
          const status = statusByStep[step.id] ?? "available";

          const isComplete = status === "complete";
          const isIncomplete = status === "incomplete";
          const isLocked = status === "locked";

          const buttonStyles = isActive
            ? "border-slate-900 bg-slate-900 text-white"
            : isComplete
              ? "border-emerald-200 bg-emerald-50 text-emerald-900"
              : isIncomplete
                ? "border-red-200 bg-red-50 text-red-900"
                : isLocked
                  ? "border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50";

          const iconStyles = isActive
            ? "bg-white text-slate-900"
            : isComplete
              ? "bg-emerald-600 text-white"
              : isIncomplete
                ? "bg-red-600 text-white"
                : isLocked
                  ? "bg-slate-200 text-slate-400"
                  : "bg-slate-100 text-slate-500";

          function getIcon() {
            if (isComplete) return "✓";
            if (isIncomplete) return "!";
            if (isLocked) return "×";
            return index + 1;
          }

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => onStepClick?.(step.id)}
              className={`rounded-2xl border p-4 text-left transition ${buttonStyles}`}
            >
              <div className="mb-2 flex items-center gap-2">
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${iconStyles}`}
                >
                  {getIcon()}
                </span>

                <span className="text-sm font-bold">{step.label}</span>
              </div>

              {step.description && (
                <p
                  className={`text-xs ${
                    isActive ? "text-slate-200" : ""
                  }`}
                >
                  {step.description}
                </p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}