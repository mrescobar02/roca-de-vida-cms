import type { CollectionConfig } from "payload";

const GRANTABLE_COLLECTIONS = [
  { label: "Solicitudes de Consejería",   value: "counseling-requests"  },
  { label: "Peticiones de Oración",       value: "prayer-requests"      },
  { label: "Donaciones",                  value: "donations"            },
  { label: "Contactos",                   value: "contact-submissions"  },
  { label: "Solicitudes de Bautismo",     value: "baptism-requests"     },
  { label: "Solicitudes de Grupo",        value: "cell-group-requests"  },
  { label: "Intereses en Ministerio",     value: "ministry-interests"   },
  { label: "Testimonios",                 value: "testimonials"         },
  { label: "Galerías",                    value: "galleries"            },
  { label: "Medios",                      value: "media"                },
];

export const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  admin: {
    useAsTitle: "email",
    group: "Administración",
  },
  access: {
    read:   ({ req }) => !!req.user,
    create: ({ req }) => req.user?.role === "super-admin",
    // Users can update their own profile; role changes are field-gated below
    update: ({ req }) => !!req.user,
    delete: ({ req }) => req.user?.role === "super-admin",
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      label: "Nombre completo",
    },
    {
      name: "role",
      type: "select",
      required: true,
      defaultValue: "editor",
      label: "Rol",
      options: [
        { label: "Super Administrador", value: "super-admin"      },
        { label: "Editor",              value: "editor"           },
        { label: "Líder de Ministerio", value: "ministry-leader"  },
      ],
      // Prevent privilege escalation — only super-admin can change roles
      access: {
        update: ({ req }) => req.user?.role === "super-admin",
      },
    },
    {
      name: "ministry",
      type: "relationship",
      relationTo: "ministries",
      label: "Ministerio asignado",
      admin: {
        condition: (data) => data.role === "ministry-leader",
        description: "Solo para líderes de ministerio",
      },
    },

    // ── Permisos granulares ──────────────────────────────────────────────────
    {
      name: "extraPermissions",
      type: "array",
      label: "Permisos adicionales",
      admin: {
        description:
          "Otorga accesos específicos por colección más allá del rol base del usuario.",
        condition: (data) => data.role !== "super-admin",
        initCollapsed: false,
      },
      // Only super-admin can see or modify this field
      access: {
        read:   ({ req }) => req.user?.role === "super-admin",
        update: ({ req }) => req.user?.role === "super-admin",
      },
      fields: [
        {
          name: "collection",
          type: "select",
          required: true,
          label: "Colección",
          options: GRANTABLE_COLLECTIONS,
          admin: { width: "40%" },
        },
        {
          type: "row",
          fields: [
            {
              name: "canRead",
              type: "checkbox",
              label: "Leer",
              defaultValue: false,
              admin: { width: "15%" },
            },
            {
              name: "canCreate",
              type: "checkbox",
              label: "Crear",
              defaultValue: false,
              admin: { width: "15%" },
            },
            {
              name: "canUpdate",
              type: "checkbox",
              label: "Editar",
              defaultValue: false,
              admin: { width: "15%" },
            },
            {
              name: "canDelete",
              type: "checkbox",
              label: "Borrar",
              defaultValue: false,
              admin: { width: "15%" },
            },
          ],
        },
      ],
    },
  ],
};
