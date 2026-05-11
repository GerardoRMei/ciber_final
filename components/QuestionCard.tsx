"use client";

import type { Question } from "@/lib/types";

interface QuestionCardProps {
  question: Question;
  value: string;
  onChange: (questionId: string, value: string) => void;
}

export default function QuestionCard({
  question,
  value,
  onChange,
}: QuestionCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h3 className="text-base font-bold text-slate-900">{question.title}</h3>

        {question.description && (
          <p className="mt-1 text-sm leading-6 text-slate-500">
            {question.description}
          </p>
        )}
      </div>

      {question.type === "text" && (
        <input
          type="text"
          value={value}
          placeholder={question.placeholder}
          onChange={(event) => onChange(question.id, event.target.value)}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-4 focus:ring-slate-100"
        />
      )}

      {question.type === "number" && (
        <input
          type="number"
          value={value}
          placeholder={question.placeholder}
          onChange={(event) => onChange(question.id, event.target.value)}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition placeholder:text-slate-900 focus:border-slate-900 focus:ring-4 focus:ring-slate-100"
        />
      )}

      {question.type === "textarea" && (
        <textarea
          value={value}
          placeholder={question.placeholder}
          rows={4}
          onChange={(event) => onChange(question.id, event.target.value)}
          className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-4 focus:ring-slate-100"
        />
      )}

      {question.type === "select" && (
        <select
          value={value}
          onChange={(event) => onChange(question.id, event.target.value)}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-100"
        >
          <option value="">Selecciona una opción</option>

          {question.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}

      {question.type === "radio" && (
        <div className="grid gap-3 md:grid-cols-3">
          {question.options?.map((option) => {
            const isSelected = value === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => onChange(question.id, option.value)}
                className={`cursor-pointer rounded-xl border px-4 py-3 text-left text-sm font-medium transition ${
                  isSelected
                    ? "border-slate-900 bg-slate-900 text-white "
                    : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-400 hover:bg-white"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}