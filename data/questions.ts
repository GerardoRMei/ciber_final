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
  {
    id: "general_concerns",
    section: "general",
    title: "¿Cuál es la mayor preocupación de seguridad de la organización actualmente?",
    description:
      "Incidentes recientes, amenazas percibidas, proyectos en curso o cualquier factor que consideres relevante.",
    type: "textarea",
    placeholder:
      "Ej. Hemos recibido intentos de phishing frecuentes, no sabemos qué tan expuestos estamos, planeamos migrar a la nube y no tenemos plan de seguridad...",
    optional: true,
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
    id: "bia_rto_defined",
    section: "bia",
    title: "¿Existe un RTO definido?",
    description:
      "El RTO (Recovery Time Objective) indica el tiempo máximo tolerable para recuperar un proceso o sistema.",
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
      "El RPO (Recovery Point Objective) indica la cantidad máxima de datos que la organización puede perder ante una interrupción.",
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
      "Evalúa si cada proceso importante tiene una persona o equipo responsable de su continuidad.",
    type: "radio",
    options: [
      { label: "Sí", value: "Sí" },
      { label: "Parcialmente", value: "Parcialmente" },
      { label: "No", value: "No" },
    ],
  },
  {
    id: "bia_dependencies",
    section: "bia",
    title: "¿Depende de proveedores o servicios externos críticos?",
    description:
      "Evalúa si la operación depende de terceros cuya falla detendría el negocio: internet, nube, SaaS, proveedor único de hardware.",
    type: "radio",
    options: [
      { label: "Sí, sin alternativas", value: "Sin alternativas" },
      { label: "Sí, con alternativas o redundancia", value: "Con alternativas" },
      { label: "No / operación independiente", value: "No" },
    ],
  },
  {
    id: "bia_staff_coverage",
    section: "bia",
    title: "¿Existe personal de respaldo para roles operativos clave?",
    description:
      "Verifica si hay personas capacitadas para sustituir a quien opera los procesos críticos ante una ausencia o incidente.",
    type: "radio",
    options: [
      { label: "Sí", value: "Sí" },
      { label: "Parcialmente", value: "Parcialmente" },
      { label: "No", value: "No" },
    ],
  },
  {
    id: "bia_communication_plan",
    section: "bia",
    title: "¿Existe un protocolo de comunicación ante crisis?",
    description:
      "Define si hay un plan para notificar a empleados, clientes y directivos durante una interrupción grave.",
    type: "radio",
    options: [
      { label: "Sí", value: "Sí" },
      { label: "Parcialmente", value: "Parcialmente" },
      { label: "No", value: "No" },
    ],
  },
  {
    id: "bia_impact_scenario",
    section: "bia",
    title: "Si sus operaciones se detuvieran 24 horas, ¿qué consecuencias concretas tendría?",
    description:
      "Pérdidas económicas estimadas, clientes afectados, contratos en riesgo, reputación. Entre más específico, mejor el análisis.",
    type: "textarea",
    placeholder:
      "Ej. Perderíamos aprox. $30,000 en ventas, incumpliríamos contratos con 2 clientes clave y el equipo de soporte no podría operar sin el CRM...",
    optional: true,
  },
];

export const dlpQuestions: Question[] = [
  {
    id: "dlp_sensitive_data",
    section: "dlp",
    title: "Tipo de información sensible que maneja",
    description:
      "Selecciona el tipo principal de información que maneja la organización.",
    type: "select",
    options: [
      { label: "Datos personales de clientes", value: "Datos personales" },
      { label: "Datos financieros o bancarios", value: "Datos financieros" },
      { label: "Información médica o clínica", value: "Información médica" },
      { label: "Propiedad intelectual o código fuente", value: "Propiedad intelectual" },
      { label: "Credenciales o contraseñas", value: "Credenciales" },
      { label: "No se ha identificado formalmente", value: "No identificado" },
    ],
  },
  {
    id: "dlp_data_classification",
    section: "dlp",
    title: "¿La información está clasificada por nivel de sensibilidad?",
    description:
      "Por ejemplo: pública, interna, confidencial y crítica. La clasificación permite aplicar controles proporcionales al riesgo.",
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
    title: "¿Existen controles de acceso basados en rol o privilegio mínimo?",
    description:
      "Evalúa si solo los usuarios que necesitan ver o modificar información sensible tienen acceso a ella.",
    type: "radio",
    options: [
      { label: "Sí", value: "Sí" },
      { label: "Parcialmente", value: "Parcialmente" },
      { label: "No", value: "No" },
    ],
  },
  {
    id: "dlp_mfa",
    section: "dlp",
    title: "¿Se usa autenticación multifactor (MFA) en sistemas críticos?",
    description:
      "El MFA reduce drásticamente el riesgo de accesos no autorizados incluso si una contraseña es comprometida.",
    type: "radio",
    options: [
      { label: "Sí, en todos los sistemas críticos", value: "Sí" },
      { label: "Parcialmente (algunos sistemas o solo contraseñas robustas)", value: "Parcialmente" },
      { label: "No", value: "No" },
    ],
  },
  {
    id: "dlp_encryption",
    section: "dlp",
    title: "¿Se usa cifrado para información sensible?",
    description:
      "Incluye cifrado en almacenamiento, respaldos, dispositivos y transmisión de datos.",
    type: "radio",
    options: [
      { label: "Sí", value: "Sí" },
      { label: "Parcialmente", value: "Parcialmente" },
      { label: "No", value: "No" },
    ],
  },
  {
    id: "dlp_third_party_access",
    section: "dlp",
    title: "¿Proveedores o terceros tienen acceso a información sensible?",
    description:
      "El acceso de terceros sin controles es una de las principales vías de fuga. Incluye contratistas, consultores o software de terceros.",
    type: "radio",
    options: [
      { label: "Sí, sin controles ni acuerdos formales", value: "Sin controles" },
      { label: "Sí, con acuerdos de confidencialidad y restricciones", value: "Con controles" },
      { label: "No tienen acceso", value: "No" },
    ],
  },
  {
    id: "dlp_usb_policy",
    section: "dlp",
    title: "¿Existe política de control sobre dispositivos USB o medios externos?",
    description:
      "Evalúa si hay controles para evitar extracción no autorizada de información mediante dispositivos físicos.",
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
    title: "¿Se monitorean transferencias de datos, correos o accesos inusuales?",
    description:
      "Evalúa si existen controles para detectar fuga de datos por correo, almacenamiento en nube o transferencias de archivos.",
    type: "radio",
    options: [
      { label: "Sí", value: "Sí" },
      { label: "Parcialmente", value: "Parcialmente" },
      { label: "No", value: "No" },
    ],
  },
  {
    id: "dlp_data_retention",
    section: "dlp",
    title: "¿Existe política de retención y eliminación segura de datos?",
    description:
      "Evitar acumular datos innecesarios reduce la superficie de exposición ante una brecha.",
    type: "radio",
    options: [
      { label: "Sí", value: "Sí" },
      { label: "Parcialmente", value: "Parcialmente" },
      { label: "No", value: "No" },
    ],
  },
  {
    id: "dlp_data_flow",
    section: "dlp",
    title: "¿Cómo fluye la información sensible dentro y fuera de la organización?",
    description:
      "Describe qué sistemas la almacenan, quién accede, cómo se comparte y si sale hacia terceros o empleados remotos.",
    type: "textarea",
    placeholder:
      "Ej. Los datos de clientes viven en el CRM, el equipo de ventas los exporta a Excel y los envía por correo a agencias externas sin cifrar...",
    optional: true,
  },
];

export const drpQuestions: Question[] = [
  {
    id: "drp_backups",
    section: "drp",
    title: "¿Existen respaldos de datos y sistemas críticos?",
    description:
      "Evalúa si la organización realiza copias de seguridad de sus datos e infraestructura crítica.",
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
    title: "Frecuencia de los respaldos",
    description:
      "Indica cada cuánto se realizan los respaldos de los sistemas más importantes.",
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
    id: "drp_offsite_backup",
    section: "drp",
    title: "¿Los respaldos se almacenan en una ubicación separada o en la nube?",
    description:
      "Respaldos solo locales son vulnerables a los mismos eventos que afectan al sistema original: ransomware, incendio, inundación.",
    type: "radio",
    options: [
      { label: "Sí (ubicación externa, nube o ambas)", value: "Sí" },
      { label: "Parcialmente (algunos externos)", value: "Parcialmente" },
      { label: "No, solo en el mismo lugar que los sistemas", value: "No" },
    ],
  },
  {
    id: "drp_backup_testing",
    section: "drp",
    title: "¿Se prueban y verifican los respaldos periódicamente?",
    description:
      "Tener respaldos no es suficiente si no se valida que puedan restaurarse correctamente cuando se necesiten.",
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
    title: "¿Existe un plan documentado de recuperación ante desastres?",
    description:
      "Un DRP formal define procedimientos, responsables y pasos de acción para actuar después de un incidente grave.",
    type: "radio",
    options: [
      { label: "Sí", value: "Sí" },
      { label: "Parcialmente", value: "Parcialmente" },
      { label: "No", value: "No" },
    ],
  },
  {
    id: "drp_incident_response",
    section: "drp",
    title: "¿Existe un procedimiento formal de respuesta a incidentes?",
    description:
      "Evalúa si hay pasos definidos para detectar, contener, erradicar y recuperarse de una brecha de seguridad o fallo crítico.",
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
    title: "¿Existe un orden de recuperación priorizado de sistemas?",
    description:
      "Define si la organización sabe qué sistemas recuperar primero para restaurar las operaciones críticas.",
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
    title: "¿Se realizan simulacros o pruebas de continuidad?",
    description:
      "Los simulacros validan que el personal conoce el plan y que los procedimientos funcionan bajo condiciones reales.",
    type: "radio",
    options: [
      { label: "Sí", value: "Sí" },
      { label: "Parcialmente", value: "Parcialmente" },
      { label: "No", value: "No" },
    ],
  },
  {
    id: "drp_vendor_sla",
    section: "drp",
    title: "¿Los proveedores críticos tienen SLA de disponibilidad documentado?",
    description:
      "Un SLA garantiza compromisos de tiempo de respuesta y disponibilidad ante fallas del proveedor.",
    type: "radio",
    options: [
      { label: "Sí", value: "Sí" },
      { label: "Parcialmente", value: "Parcialmente" },
      { label: "No", value: "No" },
    ],
  },
  {
    id: "drp_scenario_response",
    section: "drp",
    title: "¿Qué haría su equipo en las primeras horas de un ransomware o caída total?",
    description:
      "Describe el escenario real: quién se entera, qué decisiones se toman, a quién se llama. Sé honesto aunque no haya un plan formal.",
    type: "textarea",
    placeholder:
      "Ej. Llamaríamos a nuestro proveedor de hosting y esperaríamos. No tenemos un protocolo claro ni sabemos quién toma las decisiones en esa situación...",
    optional: true,
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
