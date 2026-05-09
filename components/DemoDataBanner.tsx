"use client";

interface DemoDataBannerProps {
  onLoadDemo: () => void;
  onClear?: () => void;
}

export default function DemoDataBanner({
  onLoadDemo,
  onClear,
}: DemoDataBannerProps) {
  return (
    <div className="rounded-3xl border border-blue-200 bg-blue-50 p-5">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h3 className="text-base font-bold text-blue-950">
            Modo demostración
          </h3>
          <p className="mt-1 text-sm leading-6 text-blue-800">
            Carga información ficticia de una organización para mostrar
            rápidamente cómo funciona el análisis BIA, DLP y DRP durante la
            presentación.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          {onClear && (
            <button
              type="button"
              onClick={onClear}
              className="rounded-xl border border-blue-300 bg-white px-4 py-2 text-sm font-semibold text-blue-800 transition hover:bg-blue-100"
            >
              Limpiar
            </button>
          )}

          <button
            type="button"
            onClick={onLoadDemo}
            className="rounded-xl bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-800"
          >
            Cargar demo
          </button>
        </div>
      </div>
    </div>
  );
}