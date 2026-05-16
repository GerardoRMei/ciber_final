import { analyzeAssessment } from "@/lib/scoring";
import type {
  AiReportAnalysis,
  AnalysisApiResponse,
  AssessmentAnswers,
} from "@/lib/types";

const DEFAULT_MODEL = process.env.OPENAI_MODEL ?? "gpt-4.1-mini";
const DEFAULT_TIMEOUT_MS = Number(process.env.OPENAI_TIMEOUT_MS ?? "20000");

const CONTEXT_FIELDS = new Set([
  "general_concerns",
  "bia_impact_scenario",
  "dlp_data_flow",
  "drp_scenario_response",
]);

function isAssessmentAnswers(value: unknown): value is AssessmentAnswers {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;

  return Object.entries(value).every(([key, item]) => {
    if (typeof item !== "string") return false;
    if (CONTEXT_FIELDS.has(key)) return true;
    return item.trim().length > 0;
  });
}

function getFallbackAnalysis(
  report: ReturnType<typeof analyzeAssessment>["report"]
): AiReportAnalysis {
  return {
    executiveSummary: report.executiveSummary,
    keyFindings: [
      `Nivel general de riesgo: ${report.generalLevel} (${report.generalScore}/100).`,
      `BIA: ${report.biaScore}/100, DLP: ${report.dlpScore}/100, DRP: ${report.drpScore}/100.`,
      `Se detectaron ${report.risks.length} riesgos prioritarios para atención inmediata.`,
    ],
    priorityActions: report.risks
      .slice(0, 5)
      .map((risk) => `[${risk.area}] ${risk.title}: ${risk.description}`),
    roadmap30_60_90: {
      d30: [
        "Formalizar responsables y alcance para mitigar los riesgos críticos detectados.",
        "Definir indicadores de seguimiento para BIA, DLP y DRP.",
      ],
      d60: [
        "Implementar controles prioritarios y documentar procedimientos operativos.",
        "Validar avances con revisiones quincenales del equipo responsable.",
      ],
      d90: [
        "Ejecutar simulacro integral de continuidad y recuperación.",
        "Actualizar el plan de mejora continua con resultados de la evaluación.",
      ],
    },
    conclusion: `La organización presenta un nivel de riesgo ${report.generalLevel} con un puntaje general de ${report.generalScore}/100. Se recomienda priorizar los controles críticos identificados en BIA (${report.biaScore}/100), DLP (${report.dlpScore}/100) y DRP (${report.drpScore}/100), documentar los procedimientos y establecer revisiones periódicas para fortalecer la continuidad del negocio.`,
  };
}

function cleanStringArray(value: unknown, max = 8): string[] {
  if (!Array.isArray(value)) return [];

  return value
    .filter((item) => typeof item === "string")
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
    .slice(0, max);
}

function normalizeAnalysis(value: unknown): AiReportAnalysis | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;

  const raw = value as Record<string, unknown>;
  const executiveSummary =
    typeof raw.executiveSummary === "string" ? raw.executiveSummary.trim() : "";
  const conclusion =
    typeof raw.conclusion === "string" ? raw.conclusion.trim() : "";

  const roadmapRaw =
    raw.roadmap30_60_90 &&
    typeof raw.roadmap30_60_90 === "object" &&
    !Array.isArray(raw.roadmap30_60_90)
      ? (raw.roadmap30_60_90 as Record<string, unknown>)
      : {};

  const analysis: AiReportAnalysis = {
    executiveSummary,
    keyFindings: cleanStringArray(raw.keyFindings),
    priorityActions: cleanStringArray(raw.priorityActions),
    roadmap30_60_90: {
      d30: cleanStringArray(roadmapRaw.d30),
      d60: cleanStringArray(roadmapRaw.d60),
      d90: cleanStringArray(roadmapRaw.d90),
    },
    conclusion,
  };

  if (!analysis.executiveSummary) return null;
  if (analysis.keyFindings.length === 0) return null;
  if (analysis.priorityActions.length === 0) return null;

  return analysis;
}

function extractJsonObject(content: string): string {
  const trimmed = content.trim();
  if (trimmed.startsWith("{") && trimmed.endsWith("}")) return trimmed;

  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fenced?.[1]) return fenced[1].trim();

  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start >= 0 && end > start) return trimmed.slice(start, end + 1);

  return trimmed;
}

function buildContextSection(answers: AssessmentAnswers): string {
  const lines: string[] = [];

  if (answers.general_concerns?.trim()) {
    lines.push(`Mayor preocupación de seguridad actual: ${answers.general_concerns.trim()}`);
  }
  if (answers.bia_impact_scenario?.trim()) {
    lines.push(`Impacto concreto ante 24h de interrupción: ${answers.bia_impact_scenario.trim()}`);
  }
  if (answers.dlp_data_flow?.trim()) {
    lines.push(`Flujo de información sensible: ${answers.dlp_data_flow.trim()}`);
  }
  if (answers.drp_scenario_response?.trim()) {
    lines.push(`Respuesta real ante ransomware o caída total: ${answers.drp_scenario_response.trim()}`);
  }

  return lines.length > 0
    ? `\nRespuestas abiertas de la organización:\n${lines.join("\n")}`
    : "";
}

async function callOpenAiAnalysis(
  answers: AssessmentAnswers,
  localReport: ReturnType<typeof analyzeAssessment>["report"]
): Promise<AiReportAnalysis> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  const contextSection = buildContextSection(answers);

  const prompt = `
Eres consultor senior de ciberseguridad para pymes.
Analiza los datos cuantitativos (puntajes de riesgo) y el contexto cualitativo de la organización.

Responde SOLO JSON válido, sin markdown, con esta estructura exacta:
{
  "executiveSummary": "string",
  "keyFindings": ["string"],
  "priorityActions": ["string"],
  "roadmap30_60_90": {
    "d30": ["string"],
    "d60": ["string"],
    "d90": ["string"]
  },
  "conclusion": "string"
}

Reglas:
- Idioma español neutro.
- Máximo 8 elementos por lista de strings.
- executiveSummary: párrafo que describe el estado general considerando scores y contexto.
- keyFindings: hallazgos concretos derivados de los datos, no genéricos.
- priorityActions: acciones inmediatas ejecutables ordenadas por urgencia.
- roadmap30_60_90: plan escalonado con acciones concretas por período.
- conclusion: párrafo de cierre que sintetiza el estado actual, el camino a seguir y el valor de actuar ahora. Debe sentirse personalizado para esta organización.

Datos de entrada:
- Organización: ${localReport.organizationName} (sector: ${localReport.sector})
- Puntajes: general=${localReport.generalScore}/100, BIA=${localReport.biaScore}/100, DLP=${localReport.dlpScore}/100, DRP=${localReport.drpScore}/100
- Nivel general de riesgo: ${localReport.generalLevel}
- Riesgos detectados: ${JSON.stringify(localReport.risks)}${contextSection}
`.trim();

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT_MS);

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        temperature: 0.3,
        messages: [
          {
            role: "system",
            content:
              "Eres un analista de ciberresiliencia. Responde exclusivamente JSON válido sin markdown.",
          },
          { role: "user", content: prompt },
        ],
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const raw = await response.text();
      const error = new Error(`OpenAI error ${response.status}: ${raw}`);
      (error as Error & { status?: number }).status = response.status;
      throw error;
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("OpenAI returned empty content.");
    }

    const payload = JSON.parse(extractJsonObject(content));
    const analysis = normalizeAnalysis(payload);
    if (!analysis) {
      throw new Error("OpenAI response shape is invalid.");
    }

    return analysis;
  } finally {
    clearTimeout(timeout);
  }
}

function shouldRetry(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const status = (error as { status?: number }).status;
  if (typeof status === "number") {
    return status === 429 || status >= 500;
  }

  const message =
    error instanceof Error ? error.message.toLowerCase() : String(error);
  return message.includes("abort") || message.includes("timeout");
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { ok: false, error: "Invalid JSON payload." },
      { status: 400 }
    );
  }

  const answers = (body as { answers?: unknown })?.answers;
  if (!isAssessmentAnswers(answers)) {
    return Response.json(
      { ok: false, error: "answers must be a non-empty object of strings." },
      { status: 400 }
    );
  }

  const base = analyzeAssessment(answers);
  const fallback = getFallbackAnalysis(base.report);

  const warnings: string[] = [];
  let analysis: AiReportAnalysis | null = null;
  let lastError: unknown;

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      analysis = await callOpenAiAnalysis(answers, base.report);
      break;
    } catch (error) {
      lastError = error;

      if (attempt < 3 && shouldRetry(error)) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 500));
        continue;
      }
      break;
    }
  }

  if (!analysis) {
    const warningMessage =
      lastError instanceof Error
        ? `OpenAI unavailable, fallback activated: ${lastError.message}`
        : "OpenAI unavailable, fallback activated.";
    warnings.push(warningMessage);

    return Response.json(
      { ok: true, analysis: fallback, source: "local-fallback", warnings },
      { status: 200 }
    );
  }

  return Response.json(
    {
      ok: true,
      analysis,
      source: "openai",
      warnings: warnings.length > 0 ? warnings : undefined,
    },
    { status: 200 }
  );
}
