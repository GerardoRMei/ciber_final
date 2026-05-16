import { analyzeAssessment } from "@/lib/scoring";
import type {
  AiReportAnalysis,
  AnalysisApiResponse,
  AssessmentAnswers,
} from "@/lib/types";

const DEFAULT_MODEL = process.env.OPENAI_MODEL ?? "gpt-4.1-mini";
const DEFAULT_TIMEOUT_MS = Number(process.env.OPENAI_TIMEOUT_MS ?? "20000");

function isAssessmentAnswers(value: unknown): value is AssessmentAnswers {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;

  return Object.values(value).every(
    (item) => typeof item === "string" && item.trim().length > 0
  );
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
  };
}

function cleanStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return value
    .filter((item) => typeof item === "string")
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
    .slice(0, 8);
}

function normalizeAnalysis(value: unknown): AiReportAnalysis | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;

  const raw = value as Record<string, unknown>;
  const executiveSummary =
    typeof raw.executiveSummary === "string"
      ? raw.executiveSummary.trim()
      : "";

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

async function callOpenAiAnalysis(
  answers: AssessmentAnswers,
  localReport: ReturnType<typeof analyzeAssessment>["report"]
): Promise<AiReportAnalysis> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  const prompt = `
Eres consultor senior de ciberseguridad para pymes.
Debes analizar el contexto de la empresa y entregar un plan accionable 30/60/90 días.

Responde SOLO JSON válido, sin markdown, con esta forma exacta:
{
  "executiveSummary": "string",
  "keyFindings": ["string"],
  "priorityActions": ["string"],
  "roadmap30_60_90": {
    "d30": ["string"],
    "d60": ["string"],
    "d90": ["string"]
  }
}

Reglas:
- idioma español neutro.
- máximo 8 elementos por lista.
- acciones concretas y ejecutables.
- usar el contexto del cuestionario y los puntajes para priorizar.

Datos de entrada:
- Respuestas: ${JSON.stringify(answers)}
- Puntajes: general=${localReport.generalScore}, BIA=${localReport.biaScore}, DLP=${localReport.dlpScore}, DRP=${localReport.drpScore}
- Nivel general: ${localReport.generalLevel}
- Riesgos principales: ${JSON.stringify(localReport.risks)}
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
              "Eres un analista de ciberresiliencia. Debes responder exclusivamente JSON válido.",
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

    const response: AnalysisApiResponse = {
      ok: true,
      analysis: fallback,
      source: "local-fallback",
      warnings,
    };

    return Response.json(response, { status: 200 });
  }

  const response: AnalysisApiResponse = {
    ok: true,
    analysis,
    source: "openai",
    warnings: warnings.length > 0 ? warnings : undefined,
  };

  return Response.json(response, { status: 200 });
}
