import type { Recommendation, RiskLevel } from "@/lib/types";

export interface RecommendationRule {
  id: string;
  answerId: string;
  triggers: string[];
  recommendation: Recommendation;
}

export const recommendationRules: RecommendationRule[] = [
  {
    id: "bia-rto",
    answerId: "bia_rto_defined",
    triggers: ["No", "Parcialmente"],
    recommendation: {
      id: "rec-bia-rto",
      area: "BIA",
      title: "Definir tiempos máximos de recuperación",
      description:
        "Se recomienda establecer un RTO para cada proceso crítico, indicando cuánto tiempo puede permanecer detenido antes de afectar gravemente la operación.",
      priority: "Alto",
    },
  },
  {
    id: "bia-rpo",
    answerId: "bia_rpo_defined",
    triggers: ["No", "Parcialmente"],
    recommendation: {
      id: "rec-bia-rpo",
      area: "BIA",
      title: "Definir pérdida máxima aceptable de datos",
      description:
        "Se recomienda definir un RPO para determinar cuánta información puede perderse sin comprometer la continuidad del negocio.",
      priority: "Alto",
    },
  },
  {
    id: "bia-responsibles",
    answerId: "bia_responsibles",
    triggers: ["No", "Parcialmente"],
    recommendation: {
      id: "rec-bia-responsibles",
      area: "BIA",
      title: "Asignar responsables de procesos críticos",
      description:
        "Cada proceso crítico debe tener un responsable definido para coordinar decisiones, recuperación y comunicación durante incidentes.",
      priority: "Medio",
    },
  },
  {
    id: "dlp-classification",
    answerId: "dlp_data_classification",
    triggers: ["No", "Parcialmente"],
    recommendation: {
      id: "rec-dlp-classification",
      area: "DLP",
      title: "Clasificar la información sensible",
      description:
        "Se recomienda clasificar los datos como públicos, internos, confidenciales o críticos para aplicar controles adecuados según su nivel de sensibilidad.",
      priority: "Crítico",
    },
  },
  {
    id: "dlp-access",
    answerId: "dlp_access_control",
    triggers: ["No", "Parcialmente"],
    recommendation: {
      id: "rec-dlp-access",
      area: "DLP",
      title: "Fortalecer controles de acceso",
      description:
        "La información sensible debe estar disponible únicamente para usuarios autorizados, aplicando el principio de mínimo privilegio.",
      priority: "Alto",
    },
  },
  {
    id: "dlp-encryption",
    answerId: "dlp_encryption",
    triggers: ["No", "Parcialmente"],
    recommendation: {
      id: "rec-dlp-encryption",
      area: "DLP",
      title: "Aplicar cifrado a datos sensibles",
      description:
        "Se recomienda cifrar información crítica en almacenamiento, transmisión y respaldos para reducir el impacto de accesos no autorizados.",
      priority: "Alto",
    },
  },
  {
    id: "dlp-usb",
    answerId: "dlp_usb_policy",
    triggers: ["No", "Parcialmente"],
    recommendation: {
      id: "rec-dlp-usb",
      area: "DLP",
      title: "Controlar dispositivos USB y medios externos",
      description:
        "Se recomienda establecer políticas para restringir o monitorear el uso de dispositivos USB, evitando extracción no autorizada de información.",
      priority: "Medio",
    },
  },
  {
    id: "dlp-monitoring",
    answerId: "dlp_monitoring",
    triggers: ["No", "Parcialmente"],
    recommendation: {
      id: "rec-dlp-monitoring",
      area: "DLP",
      title: "Monitorear canales de salida de información",
      description:
        "Se recomienda monitorear correos, almacenamiento en nube y transferencias de archivos para detectar posibles fugas de datos.",
      priority: "Alto",
    },
  },
  {
    id: "drp-backups",
    answerId: "drp_backups",
    triggers: ["No", "Parcialmente"],
    recommendation: {
      id: "rec-drp-backups",
      area: "DRP",
      title: "Implementar una política formal de respaldos",
      description:
        "Se recomienda realizar respaldos periódicos de sistemas y datos críticos, almacenándolos en una ubicación segura y separada.",
      priority: "Crítico",
    },
  },
  {
    id: "drp-testing",
    answerId: "drp_backup_testing",
    triggers: ["No", "Parcialmente"],
    recommendation: {
      id: "rec-drp-testing",
      area: "DRP",
      title: "Probar restauraciones de respaldo",
      description:
        "Los respaldos deben probarse de forma periódica para confirmar que pueden restaurarse correctamente durante una contingencia.",
      priority: "Alto",
    },
  },
  {
    id: "drp-plan",
    answerId: "drp_documented_plan",
    triggers: ["No", "Parcialmente"],
    recommendation: {
      id: "rec-drp-plan",
      area: "DRP",
      title: "Documentar el plan de recuperación ante desastres",
      description:
        "Se recomienda crear un documento formal con procedimientos, responsables, prioridades y pasos de recuperación ante incidentes graves.",
      priority: "Crítico",
    },
  },
  {
    id: "drp-order",
    answerId: "drp_recovery_order",
    triggers: ["No", "Parcialmente"],
    recommendation: {
      id: "rec-drp-order",
      area: "DRP",
      title: "Definir orden de recuperación de sistemas",
      description:
        "La organización debe establecer qué sistemas deben recuperarse primero para restaurar las operaciones críticas del negocio.",
      priority: "Medio",
    },
  },
  {
    id: "drp-simulations",
    answerId: "drp_simulations",
    triggers: ["No", "Parcialmente"],
    recommendation: {
      id: "rec-drp-simulations",
      area: "DRP",
      title: "Realizar simulacros de recuperación",
      description:
        "Se recomienda ejecutar simulacros para validar que el personal conoce el plan y que los procedimientos funcionan correctamente.",
      priority: "Medio",
    },
  },

  // ── Nuevas reglas BIA ────────────────────────────────────────────────────
  {
    id: "bia-dependencies",
    answerId: "bia_dependencies",
    triggers: ["Sin alternativas"],
    recommendation: {
      id: "rec-bia-dependencies",
      area: "BIA",
      title: "Reducir dependencias externas críticas sin alternativa",
      description:
        "La organización depende de proveedores sin plan de contingencia. Se recomienda identificar alternativas, negociar SLAs contractuales y documentar procedimientos manuales ante fallas del proveedor.",
      priority: "Alto",
    },
  },
  {
    id: "bia-staff-coverage",
    answerId: "bia_staff_coverage",
    triggers: ["No", "Parcialmente"],
    recommendation: {
      id: "rec-bia-staff-coverage",
      area: "BIA",
      title: "Establecer personal de respaldo para roles críticos",
      description:
        "La ausencia de personal de respaldo crea puntos únicos de falla humana. Se recomienda capacitar a al menos una persona adicional por cada rol operativo crítico.",
      priority: "Medio",
    },
  },
  {
    id: "bia-communication-plan",
    answerId: "bia_communication_plan",
    triggers: ["No", "Parcialmente"],
    recommendation: {
      id: "rec-bia-communication-plan",
      area: "BIA",
      title: "Definir protocolo de comunicación de crisis",
      description:
        "Se recomienda crear un árbol de comunicación que defina a quién notificar, en qué orden y por qué canal ante una interrupción grave: directivos, empleados, clientes y autoridades.",
      priority: "Medio",
    },
  },

  // ── Nuevas reglas DLP ────────────────────────────────────────────────────
  {
    id: "dlp-mfa",
    answerId: "dlp_mfa",
    triggers: ["No", "Parcialmente"],
    recommendation: {
      id: "rec-dlp-mfa",
      area: "DLP",
      title: "Implementar autenticación multifactor (MFA)",
      description:
        "El MFA es uno de los controles con mayor impacto en la reducción de brechas. Se recomienda activarlo en correo corporativo, VPN, sistemas críticos y administración en la nube como primer paso.",
      priority: "Crítico",
    },
  },
  {
    id: "dlp-third-party",
    answerId: "dlp_third_party_access",
    triggers: ["Sin controles"],
    recommendation: {
      id: "rec-dlp-third-party",
      area: "DLP",
      title: "Controlar y auditar el acceso de terceros a datos sensibles",
      description:
        "Los proveedores con acceso sin restricciones son un vector frecuente de fuga. Se recomienda firmar NDAs, aplicar acceso mínimo necesario, registrar actividad y revisar accesos periódicamente.",
      priority: "Alto",
    },
  },
  {
    id: "dlp-data-retention",
    answerId: "dlp_data_retention",
    triggers: ["No", "Parcialmente"],
    recommendation: {
      id: "rec-dlp-data-retention",
      area: "DLP",
      title: "Establecer política de retención y eliminación segura de datos",
      description:
        "Se recomienda definir por cuánto tiempo se conserva cada tipo de dato, cómo se elimina de forma segura y qué regulaciones aplican (LFPDPPP, RGPD, etc.).",
      priority: "Medio",
    },
  },

  // ── Nuevas reglas DRP ────────────────────────────────────────────────────
  {
    id: "drp-offsite-backup",
    answerId: "drp_offsite_backup",
    triggers: ["No", "Parcialmente"],
    recommendation: {
      id: "rec-drp-offsite-backup",
      area: "DRP",
      title: "Almacenar respaldos en ubicación separada o en la nube",
      description:
        "Los respaldos guardados solo localmente son destruidos por el mismo ransomware o desastre físico. Se recomienda seguir la regla 3-2-1: 3 copias, 2 medios distintos, 1 fuera de las instalaciones.",
      priority: "Crítico",
    },
  },
  {
    id: "drp-incident-response",
    answerId: "drp_incident_response",
    triggers: ["No", "Parcialmente"],
    recommendation: {
      id: "rec-drp-incident-response",
      area: "DRP",
      title: "Crear procedimiento formal de respuesta a incidentes",
      description:
        "Se recomienda documentar las fases de respuesta: detección, contención, erradicación, recuperación y lecciones aprendidas. Incluir roles responsables y tiempos de acción esperados.",
      priority: "Alto",
    },
  },
  {
    id: "drp-vendor-sla",
    answerId: "drp_vendor_sla",
    triggers: ["No", "Parcialmente"],
    recommendation: {
      id: "rec-drp-vendor-sla",
      area: "DRP",
      title: "Negociar y documentar SLAs con proveedores críticos",
      description:
        "Sin SLA contractual, la organización no tiene garantías de tiempo de respuesta ni compensaciones. Se recomienda exigir SLAs que incluyan disponibilidad, tiempo de resolución y penalizaciones.",
      priority: "Medio",
    },
  },
];

export const priorityWeight: Record<RiskLevel, number> = {
  Bajo: 1,
  Medio: 2,
  Alto: 3,
  Crítico: 4,
};