import type { CollectionConfig } from "payload";
import { hasPermission } from "../../lib/permissions";

export const Donations: CollectionConfig = {
  slug: "donations",
  labels: { singular: "Donación", plural: "Donaciones" },
  admin: {
    group: "Finanzas",
    useAsTitle: "email",
    defaultColumns: ["name", "email", "amount", "type", "frequency", "status", "createdAt"],
    description: "Registro de donaciones y suscripciones recurrentes.",
  },
  access: {
    read:   ({ req }) => req.user?.role === "super-admin" || req.user?.role === "editor" || hasPermission(req.user, "donations", "canRead"),
    create: () => true,          // el webhook de Tilopay crea registros sin auth de usuario
    update: ({ req }) => req.user?.role === "super-admin" || req.user?.role === "editor" || hasPermission(req.user, "donations", "canUpdate"),
    delete: ({ req }) => req.user?.role === "super-admin" || hasPermission(req.user, "donations", "canDelete"),
  },
  fields: [
    // ── Datos del donante ──────────────────────────────────────────────────
    {
      type: "row",
      fields: [
        { name: "name",  type: "text",  label: "Nombre", admin: { width: "50%" } },
        { name: "email", type: "email", label: "Email", required: true, admin: { width: "50%" } },
      ],
    },
    {
      type: "row",
      fields: [
        { name: "phone",   type: "text", label: "Teléfono", admin: { width: "50%" } },
        { name: "country", type: "text", label: "País",     admin: { width: "50%" } },
      ],
    },

    // ── Detalle de la donación ─────────────────────────────────────────────
    {
      type: "row",
      fields: [
        { name: "amount",   type: "number", label: "Monto",   required: true, min: 0.01, max: 10000, admin: { width: "40%" } },
        {
          name: "currency",
          type: "select",
          label: "Moneda",
          defaultValue: "USD",
          options: [{ label: "USD", value: "USD" }],
          admin: { width: "20%" },
        },
        {
          name: "type",
          type: "select",
          label: "Tipo",
          required: true,
          defaultValue: "one-time",
          options: [
            { label: "Única vez",  value: "one-time"   },
            { label: "Recurrente", value: "recurring"  },
          ],
          admin: { width: "40%" },
        },
      ],
    },
    {
      name: "frequency",
      type: "select",
      label: "Frecuencia",
      options: [
        { label: "Semanal",  value: "weekly"   },
        { label: "Mensual",  value: "monthly"  },
        { label: "Anual",    value: "yearly"   },
      ],
      admin: {
        condition: (data) => data.type === "recurring",
        description: "Solo aplica para donaciones recurrentes.",
      },
    },

    // ── Estado ────────────────────────────────────────────────────────────
    {
      name: "status",
      type: "select",
      label: "Estado",
      required: true,
      defaultValue: "pending",
      options: [
        { label: "Pendiente",  value: "pending"   },
        { label: "Activa",     value: "active"    },
        { label: "Completada", value: "completed" },
        { label: "Cancelada",  value: "cancelled" },
        { label: "Fallida",    value: "failed"    },
      ],
      admin: { position: "sidebar" },
    },
    {
      name: "cancelledAt",
      type: "date",
      label: "Fecha de cancelación",
      admin: {
        position: "sidebar",
        condition: (data) => data.status === "cancelled",
        readOnly: true,
      },
    },

    // ── Referencia de orden — enlace entre nuestro registro y el webhook ──
    {
      name: "orderNumber",
      type: "text",
      label: "Número de orden",
      unique: true,
      index: true,
      admin: {
        description: "Generado antes de redirigir a Tilopay (ej. RDV-1717612345678).",
        readOnly: true,
      },
    },

    // ── IDs de Tilopay (solo super-admin) ─────────────────────────────────
    {
      name: "tilopayTransactionId",
      type: "text",
      label: "ID de transacción (Tilopay)",
      admin: {
        description: "Generado por Tilopay al procesar el pago.",
        condition: (_, siblingData) => siblingData?.["_status"] !== undefined
          ? true
          : true,
      },
      access: {
        read: ({ req }) => req.user?.role === "super-admin",
      },
    },
    {
      name: "tilopaySubscriptionId",
      type: "text",
      label: "ID de suscripción (Tilopay)",
      admin: {
        description: "Solo presente en donaciones recurrentes.",
        condition: (data) => data.type === "recurring",
      },
      access: {
        read: ({ req }) => req.user?.role === "super-admin",
      },
    },

    // ── Token de cancelación (no visible en admin) ─────────────────────────
    {
      name: "cancellationToken",
      type: "text",
      label: "Token de cancelación",
      unique: true,
      index: true,
      admin: {
        description: "UUID enviado al donor para gestionar/cancelar su suscripción.",
        readOnly: true,
      },
      access: {
        read: ({ req }) => req.user?.role === "super-admin",
      },
    },

    // ── Notas internas ────────────────────────────────────────────────────
    {
      name: "notes",
      type: "textarea",
      label: "Notas internas",
      admin: { description: "Visible solo para el equipo." },
    },
  ],
  timestamps: true,
};
