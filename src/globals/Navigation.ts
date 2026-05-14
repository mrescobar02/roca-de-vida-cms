import type { GlobalConfig } from "payload";

function validateUrl(url: string | null | undefined): true | string {
  if (!url) return true;
  if (url.startsWith("/")) return true;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      return "La URL debe ser relativa (/ruta) o comenzar con http:// o https://";
    }
    return true;
  } catch {
    return "URL inválida";
  }
}

export const Navigation: GlobalConfig = {
  slug: "navigation",
  label: "Navegación",
  admin: { group: "Configuración" },
  access: {
    read: () => true,
    update: ({ req }) => ["super-admin", "editor"].includes(req.user?.role ?? ""),
  },
  fields: [
    {
      name: "headerLinks",
      type: "array",
      label: "Links del header",
      fields: [
        { name: "label", type: "text", required: true, label: "Texto del link" },
        { name: "url", type: "text", required: true, label: "URL", validate: validateUrl },
        {
          name: "children",
          type: "array",
          label: "Sublinks (dropdown)",
          fields: [
            { name: "label", type: "text", required: true },
            { name: "url", type: "text", required: true, validate: validateUrl },
          ],
        },
      ],
    },
    {
      name: "ctaButton",
      type: "group",
      label: "Botón CTA del header",
      fields: [
        { name: "label", type: "text", defaultValue: "Visítanos", label: "Texto" },
        { name: "url", type: "text", label: "URL", validate: validateUrl },
      ],
    },
    {
      name: "footerColumns",
      type: "array",
      label: "Columnas del footer",
      fields: [
        { name: "heading", type: "text", required: true, label: "Encabezado" },
        {
          name: "links",
          type: "array",
          label: "Links",
          fields: [
            { name: "label", type: "text", required: true },
            { name: "url", type: "text", required: true, validate: validateUrl },
          ],
        },
      ],
    },
  ],
};
