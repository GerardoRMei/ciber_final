import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/7628510f-5db6-4615-a71f-179bd21f7aef.svg"
            alt="CyberResilience Builder logo"
            width={40}
            height={40}
          />

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