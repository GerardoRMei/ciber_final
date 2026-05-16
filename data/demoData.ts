import type { AssessmentAnswers } from "@/lib/types";

export const demoAnswers: AssessmentAnswers = {
  organization_name: "Tienda Digital MX",
  sector: "Comercio electrónico",
  responsible: "Equipo de TI y Seguridad",
  employees: "51 - 250",
  main_systems:
    "Plataforma e-commerce, base de datos de clientes, sistema de pagos, correo corporativo y sistema de inventario.",
  general_concerns:
    "Estamos en proceso de migración a AWS y no tenemos un plan de seguridad para esa transición. Tuvimos una caída de 12 horas en noviembre y el equipo no supo cómo reaccionar.",

  bia_critical_processes:
    "Ventas en línea, procesamiento de pagos, gestión de pedidos, atención al cliente e inventario en tiempo real.",
  bia_rto_defined: "Parcialmente",
  bia_rpo_defined: "No",
  bia_responsibles: "Parcialmente",
  bia_dependencies: "Sin alternativas",
  bia_staff_coverage: "No",
  bia_communication_plan: "No",
  bia_impact_scenario:
    "Si caemos 24h en Black Friday perdemos aprox. $80,000 en ventas. Además incumpliríamos SLAs con 2 distribuidores y nuestro equipo de soporte quedaría sin herramientas para atender clientes.",

  dlp_sensitive_data: "Datos personales",
  dlp_data_classification: "No",
  dlp_access_control: "Parcialmente",
  dlp_mfa: "No",
  dlp_encryption: "Parcialmente",
  dlp_third_party_access: "Sin controles",
  dlp_usb_policy: "No",
  dlp_monitoring: "No",
  dlp_data_retention: "No",
  dlp_data_flow:
    "Los datos de clientes están en el CRM y en hojas de cálculo que el equipo de ventas exporta y envía por correo. Tres agencias externas tienen acceso al CRM sin contrato de confidencialidad.",

  drp_backups: "Parcialmente",
  drp_backup_frequency: "Semanal",
  drp_offsite_backup: "No",
  drp_backup_testing: "No",
  drp_documented_plan: "No",
  drp_incident_response: "No",
  drp_recovery_order: "Parcialmente",
  drp_simulations: "No",
  drp_vendor_sla: "No",
  drp_scenario_response:
    "Llamaríamos a nuestro proveedor de hosting y esperaríamos su respuesta. No tenemos un protocolo definido, no sabemos quién toma las decisiones ni tenemos una lista de contactos de emergencia.",
};
