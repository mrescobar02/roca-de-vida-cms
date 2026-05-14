import type { GlobalConfig } from "payload";

export const DonationSettings: GlobalConfig = {
  slug: "donation-settings",
  label: "Configuración de Donaciones",
  admin: { group: "Configuración" },
  access: {
    read: () => true,
    update: ({ req }) => req.user?.role === "super-admin",
  },
  fields: [
    {
      name: "isEnabled",
      type: "checkbox",
      label: "Mostrar sección de donaciones",
      defaultValue: true,
    },
    {
      name: "heading",
      type: "text",
      label: "Título de la sección",
      defaultValue: "Tu ofrenda transforma vidas",
    },
    {
      name: "description",
      type: "richText",
      label: "Descripción / propósito de las donaciones",
    },
    {
      name: "methods",
      type: "array",
      label: "Métodos de donación",
      fields: [
        { name: "name", type: "text", required: true, label: "Nombre (ej: Yappy, Transferencia)" },
        { name: "instructions", type: "textarea", label: "Instrucciones" },
        { name: "qrCode", type: "upload", relationTo: "media", label: "Código QR" },
        { name: "accountNumber", type: "text", label: "Número de cuenta (si aplica)" },
      ],
    },
    {
      name: "yappy",
      type: "group",
      label: "Yappy",
      fields: [
        { name: "handle", type: "text", label: "Usuario Yappy (ej: @rocadevidapanama)" },
        { name: "accountHolder", type: "text", label: "Titular de la cuenta" },
        { name: "qrCode", type: "upload", relationTo: "media", label: "Código QR de Yappy" },
      ],
    },
    {
      name: "bankTransfer",
      type: "group",
      label: "Transferencia bancaria",
      fields: [
        { name: "bankName", type: "text", label: "Banco" },
        { name: "accountNumber", type: "text", label: "Número de cuenta" },
        { name: "accountHolder", type: "text", label: "Titular" },
        { name: "ruc", type: "text", label: "RUC" },
        { name: "email", type: "email", label: "Email para comprobantes" },
      ],
    },
  ],
};
