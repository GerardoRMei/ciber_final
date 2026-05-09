import type {
  AssessmentSection,
  AssessmentStep,
  Question,
} from "@/lib/types";

export const assessmentSteps: AssessmentStep[] = [
  {
    id: "general",
    label: "General",
    description: "Datos base",
  },
  {
    id: "bia",
    label: "BIA",
    description: "Impacto al negocio",
  },
  {
    id: "dlp",
    label: "DLP",
    description: "Protección de datos",
  },
  {
    id: "drp",
    label: "DRP",
    description: "Recuperación",
  },
  {
    id: "results",
    label: "Resultados",
    description: "Diagnóstico",
  },
  {
    id: "report",
    label: "Reporte",
    description: "Documento final",
  },
];

export const generalQuestions: Question[] = [
  {
    id: "organization_name",
    section: "general",
    title: "Nombre de la organización",
    description: "Nombre de la empresa, institución o área evaluada.",
    type: "text",
    placeholder: "Ej. Tienda Digital MX",
  },
  {
    id: "sector",
    section: "general",
    title: "Sector de la organización",
    description: "Indica el giro principal de la organización.",
    type: "select",
    options: [
      { label: "Educación", value: "Educación" },
      { label: "Salud", value: "Salud" },
      { label: "Finanzas", value: "Finanzas" },
      { label: "Comercio electrónico", value: "Comercio electrónico" },
      { label: "Gobierno", value: "Gobierno" },
      { label: "Manufactura", value: "Manufactura" },
      { label: "Otro", value: "Otro" },
    ],
  },
  {
    id: "responsible",
    section: "general",
    title: "Responsable de la evaluación",
    description: "Persona o equipo encargado de responder el cuestionario.",
    type: "text",
    placeholder: "Ej. Equipo de TI",
  },
  {
    id: "employees",
    section: "general",
    title: "Número aproximado de empleados",
    description: "Ayuda a dimensionar la organización.",
    type: "select",
    options: [
      { label: "1 - 10", value: "1 - 10" },
      { label: "11 - 50", value: "11 - 50" },
      { label: "51 - 250", value: "51 - 250" },
      { label: "Más de 250", value: "Más de 250" },
    ],
  },
  {
    id: "main_systems",
    section: "general",
    title: "Sistemas principales",
    description:
      "Lista los sistemas más importantes para la operación de la organización.",
    type: "textarea",
    placeholder: "Ej. ERP, CRM, plataforma web, base de datos de clientes...",
  },
];

export const biaQuestions: Question[] = [
  {
    id: "bia_critical_processes",
    section: "bia",
    title: "Procesos críticos del negocio",
    description:
      "Indica los procesos que no pueden detenerse sin afectar gravemente la operación.",
    type: "textarea",
    placeholder: "Ej. Ventas en línea, facturación, atención al cliente...",
  },
  {
    id: "bia_impact",
    section: "bia",
    title: "Impacto de una interrupción",
    description:
      "Evalúa qué tan grave sería que los procesos críticos dejaran de funcionar.",
    type: "radio",
    options: [
      { label: "Bajo", value: "Bajo" },
      { label: "Medio", value: "Medio" },
      { label: "Alto", value: "Alto" },
      { label: "Crítico", value: "Crítico" },
    ],
  },
  {
    id: "bia_rto_defined",
    section: "bia",
    title: "¿Existe un RTO definido?",
    description:
      "El RTO indica el tiempo máximo tolerable para recuperar un proceso o sistema.",
    type: "radio",
    options: [
      { label: "Sí", value: "Sí" },
      { label: "Parcialmente", value: "Parcialmente" },
      { label: "No", value: "No" },
    ],
  },
  {
    id: "bia_rpo_defined",
    section: "bia",
    title: "¿Existe un RPO definido?",
    description:
      "El RPO indica la cantidad máxima de datos que la organización puede perder.",
    type: "radio",
    options: [
      { label: "Sí", value: "Sí" },
      { label: "Parcialmente", value: "Parcialmente" },
      { label: "No", value: "No" },
    ],
  },
  {
    id: "bia_responsibles",
    section: "bia",
    title: "¿Hay responsables asignados para procesos críticos?",
    description:
      "Evalúa si cada proceso importante tiene una persona o equipo responsable.",
    type: "radio",
    options: [
      { label: "Sí", value: "Sí" },
      { label: "Parcialmente", value: "Parcialmente" },
      { label: "No", value: "No" },
    ],
  },
];

export const dlpQuestions: Question[] = [
  {
    id: "dlp_sensitive_data",
    section: "dlp",
    title: "Tipo de información sensible",
    description:
      "Selecciona el tipo principal de información que maneja la organización.",
    type: "select",
    options: [
      { label: "Datos personales", value: "Datos personales" },
      { label: "Datos financieros", value: "Datos financieros" },
      { label: "Información médica", value: "Información médica" },
      { label: "Propiedad intelectual", value: "Propiedad intelectual" },
      { label: "Credenciales o contraseñas", value: "Credenciales" },
      { label: "No se ha identificado", value: "No identificado" },
    ],
  },
  {
    id: "dlp_data_classification",
    section: "dlp",
    title: "¿La información está clasificada?",
    description:
      "Por ejemplo: pública, interna, confidencial y crítica.",
    type: "radio",
    options: [
      { label: "Sí", value: "Sí" },
      { label: "Parcialmente", value: "Parcialmente" },
      { label: "No", value: "No" },
    ],
  },
  {
    id: "dlp_access_control",
    section: "dlp",
    title: "¿Existen controles de acceso?",
    description:
      "Evalúa si solo usuarios autorizados pueden consultar o modificar información sensible.",
    type: "radio",
    options: [
      { label: "Sí", value: "Sí" },
      { label: "Parcialmente", value: "Parcialmente" },
      { label: "No", value: "No" },
    ],
  },
  {
    id: "dlp_encryption",
    section: "dlp",
    title: "¿Se usa cifrado para información sensible?",
    description:
      "Puede incluir cifrado en almacenamiento, respaldos, dispositivos o transmisión.",
    type: "radio",
    options: [
      { label: "Sí", value: "Sí" },
      { label: "Parcialmente", value: "Parcialmente" },
      { label: "No", value: "No" },
    ],
  },
  {
    id: "dlp_usb_policy",
    section: "dlp",
    title: "¿Existe control sobre dispositivos USB?",
    description:
      "Evalúa si hay políticas para evitar extracción de información por medios externos.",
    type: "radio",
    options: [
      { label: "Sí", value: "Sí" },
      { label: "Parcialmente", value: "Parcialmente" },
      { label: "No", value: "No" },
    ],
  },
  {
    id: "dlp_monitoring",
    section: "dlp",
    title: "¿Se monitorean transferencias o correos?",
    description:
      "Evalúa si existen controles para detectar fuga de datos por correo, nube o archivos.",
    type: "radio",
    options: [
      { label: "Sí", value: "Sí" },
      { label: "Parcialmente", value: "Parcialmente" },
      { label: "No", value: "No" },
    ],
  },
];

export const drpQuestions: Question[] = [
  {
    id: "drp_backups",
    section: "drp",
    title: "¿Existen respaldos?",
    description:
      "Evalúa si la organización realiza copias de seguridad de sus sistemas o datos críticos.",
    type: "radio",
    options: [
      { label: "Sí", value: "Sí" },
      { label: "Parcialmente", value: "Parcialmente" },
      { label: "No", value: "No" },
    ],
  },
  {
    id: "drp_backup_frequency",
    section: "drp",
    title: "Frecuencia de respaldos",
    description:
      "Indica cada cuánto se realizan los respaldos principales.",
    type: "select",
    options: [
      { label: "Diario", value: "Diario" },
      { label: "Semanal", value: "Semanal" },
      { label: "Mensual", value: "Mensual" },
      { label: "No definido", value: "No definido" },
      { label: "No se realizan", value: "No se realizan" },
    ],
  },
  {
    id: "drp_backup_testing",
    section: "drp",
    title: "¿Se han probado los respaldos?",
    description:
      "No basta con tener respaldos; es necesario validar que puedan restaurarse.",
    type: "radio",
    options: [
      { label: "Sí", value: "Sí" },
      { label: "Parcialmente", value: "Parcialmente" },
      { label: "No", value: "No" },
    ],
  },
  {
    id: "drp_documented_plan",
    section: "drp",
    title: "¿Existe un plan documentado de recuperación?",
    description:
      "Evalúa si hay procedimientos escritos para actuar después de un desastre o incidente grave.",
    type: "radio",
    options: [
      { label: "Sí", value: "Sí" },
      { label: "Parcialmente", value: "Parcialmente" },
      { label: "No", value: "No" },
    ],
  },
  {
    id: "drp_recovery_order",
    section: "drp",
    title: "¿Existe un orden de recuperación de sistemas?",
    description:
      "Indica si la organización sabe qué sistemas debe recuperar primero.",
    type: "radio",
    options: [
      { label: "Sí", value: "Sí" },
      { label: "Parcialmente", value: "Parcialmente" },
      { label: "No", value: "No" },
    ],
  },
  {
    id: "drp_simulations",
    section: "drp",
    title: "¿Se realizan simulacros de recuperación?",
    description:
      "Los simulacros ayudan a comprobar si el plan funcionaría ante un incidente real.",
    type: "radio",
    options: [
      { label: "Sí", value: "Sí" },
      { label: "Parcialmente", value: "Parcialmente" },
      { label: "No", value: "No" },
    ],
  },
];

export const questionsBySection: Record<AssessmentSection, Question[]> = {
  general: generalQuestions,
  bia: biaQuestions,
  dlp: dlpQuestions,
  drp: drpQuestions,
  results: [],
  report: [],
};