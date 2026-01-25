import { getPayloadClient } from "./payload";

// Tipo do produto para o frontend (compatível com o formato atual)
export type Product = {
  id: string;
  number: string;
  name: string;
  category: string[];
  textures: string[];
  imageRoom: string;
  imageSheet: string;
  imageDetail: string;
  description: string;
  material: string;
  rollWidth: string;
  availableHeights: string;
  price?: number;
};

export type Texture = {
  name: string;
  image: string;
};

// Helper para extrair URL da imagem do Payload
function getImageUrl(media: any): string {
  if (!media) return "/placeholder.svg";
  if (typeof media === "string") return media;
  // Se for objeto do Payload, pegar a URL
  return media.url || media.filename || "/placeholder.svg";
}

// Buscar todos os produtos do CMS
export async function getProducts(): Promise<Product[]> {
  try {
    const payload = await getPayloadClient();

    const { docs: products } = await payload.find({
      collection: "products",
      where: {
        isActive: { equals: true },
      },
      sort: "order",
      depth: 2, // Para trazer dados relacionados (categories, textures, media)
    });

    return products.map((p: any) => ({
      id: p.id,
      number: p.number,
      name: p.name,
      category: Array.isArray(p.categories)
        ? p.categories.map((c: any) => (typeof c === "string" ? c : c.name))
        : [],
      textures: Array.isArray(p.textures)
        ? p.textures.map((t: any) => (typeof t === "string" ? t : t.name))
        : [],
      imageRoom: getImageUrl(p.imageRoom),
      imageSheet: getImageUrl(p.imageSheet),
      imageDetail: getImageUrl(p.imageDetail),
      description: p.description || "",
      material:
        p.material ||
        "Vinil adesivo blockout | Papel de parede liso e texturas",
      rollWidth: p.rollWidth || "120 cm",
      availableHeights: p.availableHeights || "250 e 300 cm",
      price: p.price || 360,
    }));
  } catch (error) {
    console.error("Erro ao buscar produtos do CMS:", error);
    return [];
  }
}

// Buscar todas as categorias do CMS
export async function getCategories(): Promise<string[]> {
  try {
    const payload = await getPayloadClient();

    const { docs: categories } = await payload.find({
      collection: "categories",
      sort: "order",
      limit: 100,
    });

    return ["Todos", ...categories.map((c: any) => c.name)];
  } catch (error) {
    console.error("Erro ao buscar categorias do CMS:", error);
    return ["Todos"];
  }
}

// Buscar todas as texturas do CMS
export async function getTextures(): Promise<Texture[]> {
  try {
    const payload = await getPayloadClient();

    const { docs: textures } = await payload.find({
      collection: "textures",
      sort: "order",
      depth: 1,
      limit: 100,
    });

    return textures.map((t: any) => ({
      name: t.name,
      image: getImageUrl(t.image),
    }));
  } catch (error) {
    console.error("Erro ao buscar texturas do CMS:", error);
    return [];
  }
}
