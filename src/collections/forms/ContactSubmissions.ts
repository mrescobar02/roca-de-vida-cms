import type { CollectionConfig } from "payload";
import { NAME_MAX, PHONE_MAX, SHORT_MAX, MESSAGE_MAX } from "../../fields/formValidators";
import { hasPermission } from "../../lib/permissions";

export const ContactSubmissions: CollectionConfig = {
  slug: "contact-submissions",
  labels: { singular: "Contacto", plural: "Contactos" },
  admin: {
    group: "Formularios",
    useAsTitle: "name",
    defaultColumns: ["name", "email", "subject", "status", "createdAt"],
  },
  access: {
    read:   ({ req }) => ["super-admin", "editor"].includes(req.user?.role ?? "") || hasPermission(req.user, "contact-submissions", "canRead"),
    create: () => true,
    update: ({ req }) => ["super-admin", "editor"].includes(req.user?.role ?? "") || hasPermission(req.user, "contact-submissions", "canUpdate"),
    delete: ({ req }) => req.user?.role === "super-admin" || hasPermission(req.user, "contact-submissions", "canDelete"),
  },
  fields: [
    { name: "name",    type: "text",     required: true, label: "Nombre",  maxLength: NAME_MAX },
    { name: "email",   type: "email",    required: true, label: "Email" },
    { name: "phone",   type: "text",                     label: "Teléfono", maxLength: PHONE_MAX },
    { name: "subject", type: "text",     required: true, label: "Asunto",  maxLength: SHORT_MAX },
    { name: "message", type: "textarea", required: true, label: "Mensaje", maxLength: MESSAGE_MAX },
    {
      name: "status",
      type: "select",
      defaultValue: "new",
      label: "Estado",
      options: [
        { label: "Nuevo",      value: "new"       },
        { label: "Leído",      value: "read"      },
        { label: "Respondido", value: "responded" },
        { label: "Archivado",  value: "archived"  },
      ],
      admin: { position: "sidebar" },
    },
  ],
  timestamps: true,
};
