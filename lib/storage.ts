import type { AssessmentAnswers } from "@/lib/types";

const STORAGE_KEY = "cyberresilience-assessment";

export function saveAssessment(answers: AssessmentAnswers) {
  if (typeof window === "undefined") return;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
}

export function loadAssessment(): AssessmentAnswers {
  if (typeof window === "undefined") return {};

  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) return {};

  try {
    return JSON.parse(raw) as AssessmentAnswers;
  } catch {
    return {};
  }
}

export function clearAssessment() {
  if (typeof window === "undefined") return;

  localStorage.removeItem(STORAGE_KEY);
}