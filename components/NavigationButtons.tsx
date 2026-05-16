"use client";

interface NavigationButtonsProps {
  onBack?: () => void;
  onNext?: () => void;
  onGenerate?: () => void;
  backLabel?: string;
  nextLabel?: string;
  showBack?: boolean;
  showGenerate?: boolean;
  isGenerating?: boolean;
}

export default function NavigationButtons({
  onBack,
  onNext,
  onGenerate,
  backLabel = "Anterior",
  nextLabel = "Siguiente",
  showBack = true,
  showGenerate = false,
  isGenerating = false,
}: NavigationButtonsProps) {
  return (
    <div className="mt-8 flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-between">
      <div>
        {showBack && (
          <button
            type="button"
            onClick={onBack}
            disabled={isGenerating}
            className="w-full cursor-pointer rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
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
            disabled={isGenerating}
            className="relative flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-xl px-6 py-3 text-sm font-semibold text-white transition-all sm:w-auto disabled:cursor-not-allowed
              bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-600"
          >
            {isGenerating ? (
              <>
                <span className="relative flex h-4 w-4 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-60" />
                  <span className="relative inline-flex h-4 w-4 rounded-full bg-white opacity-90" />
                </span>
                <span className="animate-pulse">Analizando con IA...</span>
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-4 w-4 shrink-0"
                >
                  <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
                </svg>
                Generar análisis
              </>
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={onNext}
            className="w-full cursor-pointer rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 sm:w-auto"
          >
            {nextLabel}
          </button>
        )}
      </div>
    </div>
  );
}
