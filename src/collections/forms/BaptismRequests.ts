import type { CollectionConfig } from "payload";
import { NAME_MAX, PHONE_MAX, LONG_MAX, NOTES_MAX, AGE_MAX } from "../../fields/formValidators";
import { hasPermission } from "../../lib/permissions";

export const BaptismRequests: CollectionConfig = {
  slug: "baptism-requests",
  labels: { singular: "Solicitud de Bautismo", plural: "Solicitudes de Bautismo" },
  admin: {
    group: "Formularios",
    useAsTitle: "name",
    defaultColumns: ["name", "age", "status", "createdAt"],
  },
  access: {
    read:   ({ req }) => ["super-admin", "editor"].includes(req.user?.role ?? "") || hasPermission(req.user, "baptism-requests", "canRead"),
    create: () => true,
    update: ({ req }) => ["super-admin", "editor"].includes(req.user?.role ?? "") || hasPermission(req.user, "baptism-requests", "canUpdate"),
    delete: ({ req }) => req.user?.role === "super-admin" || hasPermission(req.user, "baptism-requests", "canDelete"),
  },
  fields: [
    { name: "name",  type: "text",  required: true, label: "Nombre completo", maxLength: NAME_MAX },
    { name: "email", type: "email", required: true, label: "Email" },
    { name: "phone", type: "text",  required: true, label: "Teléfono",        maxLength: PHONE_MAX },
    { name: "age",   type: "number",                label: "Edad",            min: 1, max: AGE_MAX },
    {
      name: "hasAcceptedChrist",
      type: "checkbox",
      label: "¿Ha aceptado a Cristo como Salvador?",
      required: true,
    },
    { name: "testimony", type: "textarea", label: "Testimonio corto (opcional)", maxLength: LONG_MAX },
    { name: "message",   type: "textarea", label: "Mensaje adicional",           maxLength: NOTES_MAX },
    {
      name: "status",
      type: "select",
      defaultValue: "new",
      label: "Estado",
      options: [
        { label: "Nueva",       value: "new"       },
        { label: "Contactado",  value: "contacted" },
        { label: "Programado",  value: "scheduled" },
        { label: "Completado",  value: "completed" },
        { label: "Archivado",   value: "archived"  },
      ],
      admin: { position: "sidebar" },
    },
  ],
  timestamps: true,
};
