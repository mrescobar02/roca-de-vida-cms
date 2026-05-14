import type { CollectionConfig } from "payload";
import { NAME_MAX, PHONE_MAX, NOTES_MAX } from "../../fields/formValidators";
import { hasPermission } from "../../lib/permissions";

export const MinistryInterests: CollectionConfig = {
  slug: "ministry-interests",
  labels: { singular: "Interés en Ministerio", plural: "Intereses en Ministerio" },
  admin: {
    group: "Formularios",
    useAsTitle: "name",
    defaultColumns: ["name", "ministry", "status", "createdAt"],
  },
  access: {
    read:   ({ req }) => ["super-admin", "editor"].includes(req.user?.role ?? "") || hasPermission(req.user, "ministry-interests", "canRead"),
    create: () => true,
    update: ({ req }) => ["super-admin", "editor"].includes(req.user?.role ?? "") || hasPermission(req.user, "ministry-interests", "canUpdate"),
    delete: ({ req }) => req.user?.role === "super-admin" || hasPermission(req.user, "ministry-interests", "canDelete"),
  },
  fields: [
    { name: "name",  type: "text",  required: true, label: "Nombre completo", maxLength: NAME_MAX },
    { name: "email", type: "email", required: true, label: "Email" },
    { name: "phone", type: "text",                  label: "Teléfono",        maxLength: PHONE_MAX },
    {
      name: "ministry",
      type: "relationship",
      relationTo: "ministries",
      required: true,
      label: "Ministerio de interés",
    },
    { name: "message", type: "textarea", label: "¿Por qué te interesa este ministerio?", maxLength: NOTES_MAX },
    {
      name: "status",
      type: "select",
      defaultValue: "new",
      label: "Estado",
      options: [
        { label: "Nuevo",      value: "new"         },
        { label: "Contactado", value: "contacted"   },
        { label: "Integrado",  value: "integrated"  },
        { label: "Archivado",  value: "archived"    },
      ],
      admin: { position: "sidebar" },
    },
  ],
  timestamps: true,
};
