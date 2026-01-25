import type { CollectionConfig } from "payload";

export const Categories: CollectionConfig = {
  slug: "categories",
  labels: {
    singular: "Categoria",
    plural: "Categorias",
  },
  admin: {
    useAsTitle: "name",
    group: "Configurações",
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "name",
      type: "text",
      label: "Nome",
      required: true,
      unique: true,
    },
    {
      name: "slug",
      type: "text",
      label: "Slug",
      required: true,
      unique: true,
      admin: {
        description: "Identificador único (ex: marinho, infantil)",
      },
    },
    {
      name: "description",
      type: "textarea",
      label: "Descrição",
    },
    {
      name: "order",
      type: "number",
      label: "Ordem de Exibição",
      defaultValue: 0,
      admin: {
        description: "Menor número aparece primeiro",
      },
    },
  ],
};
