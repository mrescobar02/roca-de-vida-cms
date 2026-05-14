import type { CollectionConfig } from "payload";
import { NAME_MAX, PHONE_MAX, SHORT_MAX, NOTES_MAX } from "../../fields/formValidators";
import { hasPermission } from "../../lib/permissions";

export const CellGroupRequests: CollectionConfig = {
  slug: "cell-group-requests",
  labels: { singular: "Solicitud de Grupo", plural: "Solicitudes de Grupo" },
  admin: {
    group: "Formularios",
    useAsTitle: "name",
    defaultColumns: ["name", "cellGroup", "district", "status", "createdAt"],
  },
  access: {
    read:   ({ req }) => ["super-admin", "editor"].includes(req.user?.role ?? "") || hasPermission(req.user, "cell-group-requests", "canRead"),
    create: () => true,
    update: ({ req }) => ["super-admin", "editor"].includes(req.user?.role ?? "") || hasPermission(req.user, "cell-group-requests", "canUpdate"),
    delete: ({ req }) => req.user?.role === "super-admin" || hasPermission(req.user, "cell-group-requests", "canDelete"),
  },
  fields: [
    { name: "name",  type: "text",  required: true, label: "Nombre completo", maxLength: NAME_MAX },
    { name: "email", type: "email", required: true, label: "Email" },
    { name: "phone", type: "text",  required: true, label: "Teléfono",        maxLength: PHONE_MAX },
    {
      name: "cellGroup",
      type: "relationship",
      relationTo: "cell-groups",
      label: "Grupo de interés (opcional)",
    },
    {
      name: "district",
      type: "text",
      label: "Tu sector/barrio",
      maxLength: SHORT_MAX,
      admin: { description: "Si no conoces un grupo, cuéntanos dónde vives" },
    },
    { name: "message", type: "textarea", label: "Mensaje adicional", maxLength: NOTES_MAX },
    {
      name: "status",
      type: "select",
      defaultValue: "new",
      label: "Estado",
      options: [
        { label: "Nuevo",              value: "new"       },
        { label: "Contactado",         value: "contacted" },
        { label: "Asignado a grupo",   value: "assigned"  },
        { label: "Archivado",          value: "archived"  },
      ],
      admin: { position: "sidebar" },
    },
  ],
  timestamps: true,
};
