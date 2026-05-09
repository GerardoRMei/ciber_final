import type { AssessmentAnswers } from "@/lib/types";

export const demoAnswers: AssessmentAnswers = {
  organization_name: "Tienda Digital MX",
  sector: "Comercio electrónico",
  responsible: "Equipo de TI y Seguridad",
  employees: "51 - 250",
  main_systems:
    "Plataforma e-commerce, base de datos de clientes, sistema de pagos, correo corporativo y sistema de inventario.",

  bia_critical_processes:
    "Ventas en línea, procesamiento de pagos, gestión de pedidos, atención al cliente e inventario.",
  bia_impact: "Crítico",
  bia_rto_defined: "Parcialmente",
  bia_rpo_defined: "No",
  bia_responsibles: "Parcialmente",

  dlp_sensitive_data: "Datos personales",
  dlp_data_classification: "No",
  dlp_access_control: "Parcialmente",
  dlp_encryption: "Parcialmente",
  dlp_usb_policy: "No",
  dlp_monitoring: "No",

  drp_backups: "Parcialmente",
  drp_backup_frequency: "Semanal",
  drp_backup_testing: "No",
  drp_documented_plan: "No",
  drp_recovery_order: "Parcialmente",
  drp_simulations: "No",
};