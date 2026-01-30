import type { CollectionConfig } from "payload";
import { supabaseStorageAdapter } from "@/lib/supabaseStorageAdapter";

export const Media: CollectionConfig = {
  slug: "media",
  labels: {
    singular: "Mídia",
    plural: "Mídias",
  },
  admin: {
    group: "Conteúdo",
  },
  access: {
    read: () => true, // Public access for images
  },
  upload: {
    adapter: supabaseStorageAdapter,
    mimeTypes: ["image/*"],
    imageSizes: [
      {
        name: "thumbnail",
        width: 400,
        height: 300,
        position: "centre",
      },
      {
        name: "card",
        width: 768,
        height: 1024,
        position: "centre",
      },
      {
        name: "full",
        width: 1920,
        height: undefined,
        position: "centre",
      },
    ],
    adminThumbnail: "thumbnail",
  },
  fields: [
    {
      name: "alt",
      type: "text",
      label: "Texto Alternativo",
      required: true,
    },
    {
      name: "caption",
      type: "text",
      label: "Legenda",
    },
  ],
};
