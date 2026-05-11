import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-sm font-bold text-white">
            CR
          </div>

          <div>
            <h1 className="text-lg font-bold text-slate-900">
              CyberResilience Builder
            </h1>
            <p className="text-xs text-slate-500">
              Generador BIA · DLP · DRP
            </p>
          </div>
        </Link>
      </div>
    </header>
  );
}