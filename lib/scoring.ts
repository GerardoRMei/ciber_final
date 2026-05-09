import type {
  AssessmentAnswers,
  Recommendation,
  ReportData,
  RiskLevel,
} from "@/lib/types";
import { priorityWeight, recommendationRules } from "@/data/recommendations";

type Area = "bia" | "dlp" | "drp";

interface ScoringRule {
  area: Area;
  answerId: string;
  weights: Record<string, number>;
  max: number;
}

export interface AssessmentResult {
  biaScore: number;
  dlpScore: number;
  drpScore: number;
  generalScore: number;
  biaLevel: RiskLevel;
  dlpLevel: RiskLevel;
  drpLevel: RiskLevel;
  generalLevel: RiskLevel;
  recommendations: Recommendation[];
  risks: Recommendation[];
  report: ReportData;
}

const scoringRules: ScoringRule[] = [
  {
    area: "bia",
    answerId: "bia_impact",
    weights: {
      Bajo: 10,
      Medio: 25,
      Alto: 35,
      Crítico: 45,
    },
    max: 45,
  },
  {
    area: "bia",
    answerId: "bia_rto_defined",
    weights: {
      Sí: 0,
      Parcialmente: 15,
      No: 25,
    },
    max: 25,
  },
  {
    area: "bia",
    answerId: "bia_rpo_defined",
    weights: {
      Sí: 0,
      Parcialmente: 15,
      No: 25,
    },
    max: 25,
  },
  {
    area: "bia",
    answerId: "bia_responsibles",
    weights: {
      Sí: 0,
      Parcialmente: 10,
      No: 20,
    },
    max: 20,
  },

  {
    area: "dlp",
    answerId: "dlp_sensitive_data",
    weights: {
      "Datos personales": 20,
      "Datos financieros": 25,
      "Información médica": 30,
      "Propiedad intelectual": 25,
      Credenciales: 30,
      "No identificado": 35,
    },
    max: 35,
  },
  {
    area: "dlp",
    answerId: "dlp_data_classification",
    weights: {
      Sí: 0,
      Parcialmente: 20,
      No: 35,
    },
    max: 35,
  },
  {
    area: "dlp",
    answerId: "dlp_access_control",
    weights: {
      Sí: 0,
      Parcialmente: 15,
      No: 30,
    },
    max: 30,
  },
  {
    area: "dlp",
    answerId: "dlp_encryption",
    weights: {
      Sí: 0,
      Parcialmente: 15,
      No: 30,
    },
    max: 30,
  },
  {
    area: "dlp",
    answerId: "dlp_usb_policy",
    weights: {
      Sí: 0,
      Parcialmente: 10,
      No: 20,
    },
    max: 20,
  },
  {
    area: "dlp",
    answerId: "dlp_monitoring",
    weights: {
      Sí: 0,
      Parcialmente: 15,
      No: 25,
    },
    max: 25,
  },

  {
    area: "drp",
    answerId: "drp_backups",
    weights: {
      Sí: 0,
      Parcialmente: 25,
      No: 40,
    },
    max: 40,
  },
  {
    area: "drp",
    answerId: "drp_backup_frequency",
    weights: {
      Diario: 0,
      Semanal: 10,
      Mensual: 20,
      "No definido": 30,
      "No se realizan": 40,
    },
    max: 40,
  },
  {
    area: "drp",
    answerId: "drp_backup_testing",
    weights: {
      Sí: 0,
      Parcialmente: 15,
      No: 30,
    },
    max: 30,
  },
  {
    area: "drp",
    answerId: "drp_documented_plan",
    weights: {
      Sí: 0,
      Parcialmente: 20,
      No: 35,
    },
    max: 35,
  },
  {
    area: "drp",
    answerId: "drp_recovery_order",
    weights: {
      Sí: 0,
      Parcialmente: 10,
      No: 20,
    },
    max: 20,
  },
  {
    area: "drp",
    answerId: "drp_simulations",
    weights: {
      Sí: 0,
      Parcialmente: 10,
      No: 20,
    },
    max: 20,
  },
];

export function getRiskLevel(score: number): RiskLevel {
  if (score >= 80) return "Crítico";
  if (score >= 60) return "Alto";
  if (score >= 31) return "Medio";
  return "Bajo";
}

function calculateAreaScore(answers: AssessmentAnswers, area: Area): number {
  const rules = scoringRules.filter((rule) => rule.area === area);

  const currentScore = rules.reduce((total, rule) => {
    const answer = answers[rule.answerId];
    return total + (rule.weights[answer] ?? 0);
  }, 0);

  const maxScore = rules.reduce((total, rule) => total + rule.max, 0);

  if (maxScore === 0) return 0;

  return Math.round((currentScore / maxScore) * 100);
}

function getRecommendations(answers: AssessmentAnswers): Recommendation[] {
  return recommendationRules
    .filter((rule) => {
      const answer = answers[rule.answerId];
      return rule.triggers.includes(answer);
    })
    .map((rule) => rule.recommendation)
    .sort((a, b) => priorityWeight[b.priority] - priorityWeight[a.priority]);
}

function generateExecutiveSummary(
  answers: AssessmentAnswers,
  generalLevel: RiskLevel,
  biaScore: number,
  dlpScore: number,
  drpScore: number
): string {
  const organization = answers.organization_name || "La organización evaluada";
  const sector = answers.sector || "sector no especificado";

  return `${organization}, perteneciente al sector ${sector}, presenta un nivel general de riesgo ${generalLevel}. El análisis muestra un puntaje de riesgo BIA de ${biaScore}/100, DLP de ${dlpScore}/100 y DRP de ${drpScore}/100. Este resultado indica la necesidad de fortalecer controles relacionados con continuidad del negocio, prevención de fuga de datos y recuperación ante desastres. El presente documento funciona como una primera aproximación para definir buenas prácticas y acciones prioritarias.`;
}

export function analyzeAssessment(
  answers: AssessmentAnswers
): AssessmentResult {
  const biaScore = calculateAreaScore(answers, "bia");
  const dlpScore = calculateAreaScore(answers, "dlp");
  const drpScore = calculateAreaScore(answers, "drp");

  const generalScore = Math.round((biaScore + dlpScore + drpScore) / 3);

  const biaLevel = getRiskLevel(biaScore);
  const dlpLevel = getRiskLevel(dlpScore);
  const drpLevel = getRiskLevel(drpScore);
  const generalLevel = getRiskLevel(generalScore);

  const recommendations = getRecommendations(answers);
  const risks = recommendations.slice(0, 5);

  const executiveSummary = generateExecutiveSummary(
    answers,
    generalLevel,
    biaScore,
    dlpScore,
    drpScore
  );

  const report: ReportData = {
    organizationName: answers.organization_name || "Organización sin nombre",
    sector: answers.sector || "No especificado",
    responsible: answers.responsible || "No especificado",
    date: new Date().toLocaleDateString("es-MX"),
    generalScore,
    generalLevel,
    biaScore,
    dlpScore,
    drpScore,
    executiveSummary,
    risks,
    recommendations,
  };

  return {
    biaScore,
    dlpScore,
    drpScore,
    generalScore,
    biaLevel,
    dlpLevel,
    drpLevel,
    generalLevel,
    recommendations,
    risks,
    report,
  };
}