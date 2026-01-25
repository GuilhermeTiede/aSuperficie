import type { CollectionConfig } from "payload";

export const Textures: CollectionConfig = {
  slug: "textures",
  labels: {
    singular: "Textura",
    plural: "Texturas",
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
      name: "image",
      type: "upload",
      label: "Imagem da Textura",
      relationTo: "media",
      required: true,
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
    },
  ],
};
