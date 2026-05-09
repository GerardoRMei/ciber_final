"use client";

interface NavigationButtonsProps {
  onBack?: () => void;
  onNext?: () => void;
  onGenerate?: () => void;
  backLabel?: string;
  nextLabel?: string;
  showBack?: boolean;
  showGenerate?: boolean;
}

export default function NavigationButtons({
  onBack,
  onNext,
  onGenerate,
  backLabel = "Anterior",
  nextLabel = "Siguiente",
  showBack = true,
  showGenerate = false,
}: NavigationButtonsProps) {
  return (
    <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-between">
      <div>
        {showBack && (
          <button
            type="button"
            onClick={onBack}
            className="w-full rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:w-auto"
          >
            {backLabel}
          </button>
        )}
      </div>

      <div>
        {showGenerate ? (
          <button
            type="button"
            onClick={onGenerate}
            className="w-full rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 sm:w-auto"
          >
            Generar reporte
          </button>
        ) : (
          <button
            type="button"
            onClick={onNext}
            className="w-full rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 sm:w-auto"
          >
            {nextLabel}
          </button>
        )}
      </div>
    </div>
  );
}