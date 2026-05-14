import type { CollectionConfig } from "payload";
import { NAME_MAX, PHONE_MAX, MESSAGE_MAX, NOTES_MAX } from "../../fields/formValidators";
import { hasPermission } from "../../lib/permissions";

export const PrayerRequests: CollectionConfig = {
  slug: "prayer-requests",
  labels: { singular: "Petición de Oración", plural: "Peticiones de Oración" },
  admin: {
    group: "Formularios",
    useAsTitle: "name",
    defaultColumns: ["name", "category", "status", "createdAt"],
    description: "Acceso restringido — solo equipo pastoral",
  },
  access: {
    read:   ({ req }) => req.user?.role === "super-admin" || req.user?.role === "editor" || hasPermission(req.user, "prayer-requests", "canRead"),
    create: () => true,
    update: ({ req }) => req.user?.role === "super-admin" || hasPermission(req.user, "prayer-requests", "canUpdate"),
    delete: ({ req }) => req.user?.role === "super-admin" || hasPermission(req.user, "prayer-requests", "canDelete"),
  },
  fields: [
    { name: "name",  type: "text",  required: true, label: "Nombre",               maxLength: NAME_MAX },
    { name: "email", type: "email",                 label: "Email (opcional)" },
    { name: "phone", type: "text",                  label: "Teléfono (opcional)",   maxLength: PHONE_MAX },
    {
      name: "category",
      type: "select",
      label: "Categoría",
      options: [
        { label: "Salud",                     value: "health"        },
        { label: "Familia",                   value: "family"        },
        { label: "Trabajo / Finanzas",        value: "work"          },
        { label: "Salvación de un ser querido", value: "salvation"   },
        { label: "Relaciones",                value: "relationships" },
        { label: "Otro",                      value: "other"         },
      ],
    },
    { name: "request",        type: "textarea", required: true, label: "Petición de oración",           maxLength: MESSAGE_MAX },
    { name: "isConfidential", type: "checkbox",                 label: "Petición confidencial",        defaultValue: false },
    {
      name: "status",
      type: "select",
      defaultValue: "new",
      label: "Estado",
      options: [
        { label: "Nueva",       value: "new"      },
        { label: "En oración",  value: "praying"  },
        { label: "Contestada",  value: "answered" },
        { label: "Archivada",   value: "archived" },
      ],
      admin: { position: "sidebar" },
    },
    { name: "notes", type: "textarea", label: "Notas internas del equipo pastoral", maxLength: NOTES_MAX },
  ],
  timestamps: true,
};
