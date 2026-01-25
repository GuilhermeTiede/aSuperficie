import type { CollectionConfig } from "payload";

export const Products: CollectionConfig = {
  slug: "products",
  labels: {
    singular: "Produto",
    plural: "Produtos",
  },
  admin: {
    useAsTitle: "name",
    group: "Conteúdo",
    defaultColumns: ["number", "name", "categories", "updatedAt"],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "number",
      type: "text",
      label: "Número",
      required: true,
      unique: true,
      admin: {
        description: "Código do produto (ex: 001, 002)",
      },
    },
    {
      name: "name",
      type: "text",
      label: "Nome",
      required: true,
    },
    {
      name: "description",
      type: "textarea",
      label: "Descrição",
      required: true,
    },
    {
      type: "row",
      fields: [
        {
          name: "material",
          type: "text",
          label: "Material",
          defaultValue:
            "Vinil adesivo blockout | Papel de parede liso e texturas",
          admin: {
            width: "50%",
          },
        },
        {
          name: "rollWidth",
          type: "text",
          label: "Largura do Rolo",
          defaultValue: "120 cm",
          admin: {
            width: "25%",
          },
        },
        {
          name: "availableHeights",
          type: "text",
          label: "Alturas Disponíveis",
          defaultValue: "250 e 300 cm",
          admin: {
            width: "25%",
          },
        },
      ],
    },
    {
      name: "price",
      type: "number",
      label: "Preço Base (R$)",
      defaultValue: 360,
      admin: {
        description: "Preço a partir de",
      },
    },
    {
      name: "categories",
      type: "relationship",
      label: "Categorias",
      relationTo: "categories",
      hasMany: true,
      required: true,
      admin: {
        description: "Selecione uma ou mais categorias",
      },
    },
    {
      name: "textures",
      type: "relationship",
      label: "Texturas Disponíveis",
      relationTo: "textures",
      hasMany: true,
      required: true,
    },
    {
      type: "tabs",
      tabs: [
        {
          label: "Imagens",
          fields: [
            {
              name: "imageRoom",
              type: "upload",
              label: "Imagem Ambiente",
              relationTo: "media",
              required: true,
              admin: {
                description: "Foto do papel de parede aplicado em um ambiente",
              },
            },
            {
              name: "imageSheet",
              type: "upload",
              label: "Imagem Folha",
              relationTo: "media",
              required: true,
              admin: {
                description: "Foto da folha/padrão completo",
              },
            },
            {
              name: "imageDetail",
              type: "upload",
              label: "Imagem Detalhe",
              relationTo: "media",
              required: true,
              admin: {
                description: "Foto de detalhe/close-up",
              },
            },
          ],
        },
      ],
    },
    {
      name: "isActive",
      type: "checkbox",
      label: "Ativo",
      defaultValue: true,
      admin: {
        position: "sidebar",
        description: "Produto visível no catálogo",
      },
    },
    {
      name: "order",
      type: "number",
      label: "Ordem de Exibição",
      defaultValue: 0,
      admin: {
        position: "sidebar",
        description: "Menor número aparece primeiro",
      },
    },
  ],
};
