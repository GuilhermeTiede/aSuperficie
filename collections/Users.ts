import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  labels: {
    singular: "Usuário",
    plural: "Usuários",
  },
  admin: {
    useAsTitle: "email",
    group: "Administração",
  },
  auth: true,
  fields: [
    {
      name: "name",
      type: "text",
      label: "Nome",
    },
    {
      name: "role",
      type: "select",
      label: "Função",
      options: [
        { label: "Administrador", value: "admin" },
        { label: "Editor", value: "editor" },
      ],
      defaultValue: "editor",
      required: true,
    },
  ],
};
