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
];

export const priorityWeight: Record<RiskLevel, number> = {
  Bajo: 1,
  Medio: 2,
  Alto: 3,
  Crítico: 4,
};