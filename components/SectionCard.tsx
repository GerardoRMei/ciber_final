interface SectionCardProps {
  title: string;
  subtitle?: string;
  badge?: string;
  children: React.ReactNode;
}

export default function SectionCard({
  title,
  subtitle,
  badge,
  children,
}: SectionCardProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          {badge && (
            <span className="mb-3 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              {badge}
            </span>
          )}

          <h2 className="text-2xl font-bold text-slate-900">{title}</h2>

          {subtitle && (
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div>{children}</div>
    </section>
  );
}