export type RiskLevel = "Bajo" | "Medio" | "Alto" | "Crítico";

export type AssessmentSection = "general" | "bia" | "dlp" | "drp" | "results" | "report";

export type QuestionType = "text" | "textarea" | "select" | "radio" | "number";

export interface QuestionOption {
  label: string;
  value: string;
}

export interface Question {
  id: string;
  section: AssessmentSection;
  title: string;
  description?: string;
  type: QuestionType;
  placeholder?: string;
  options?: QuestionOption[];
  optional?: boolean;
}

export interface ScoreItem {
  label: string;
  score: number;
  level: RiskLevel;
  description: string;
}

export interface Recommendation {
  id: string;
  area: "BIA" | "DLP" | "DRP" | "General";
  title: string;
  description: string;
  priority: RiskLevel;
}

export interface ReportData {
  organizationName: string;
  sector: string;
  responsible: string;
  date: string;
  generalScore: number;
  generalLevel: RiskLevel;
  biaScore: number;
  dlpScore: number;
  drpScore: number;
  executiveSummary: string;
  risks: Recommendation[];
  recommendations: Recommendation[];
}
export type AssessmentAnswers = Record<string, string>;

export interface AiReportAnalysis {
  executiveSummary: string;
  keyFindings: string[];
  priorityActions: string[];
  roadmap30_60_90: {
    d30: string[];
    d60: string[];
    d90: string[];
  };
  conclusion: string;
}

export type AnalysisSource = "openai" | "local-fallback";

export interface AnalysisApiResponse {
  ok: boolean;
  analysis: AiReportAnalysis;
  source: AnalysisSource;
  warnings?: string[];
}

export interface AssessmentStep {
  id: AssessmentSection;
  label: string;
  description?: string;
}
