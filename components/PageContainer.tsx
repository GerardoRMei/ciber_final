interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export default function PageContainer({
  children,
  className = "",
}: PageContainerProps) {
  return (
    <main className={`min-h-screen bg-slate-50 ${className}`}>
      <div className="mx-auto max-w-7xl px-6 py-8">{children}</div>
    </main>
  );
}