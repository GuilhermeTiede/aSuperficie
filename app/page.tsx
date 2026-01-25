import CatalogClient from "@/components/catalog-client";
import type { Product, Texture } from "@/components/catalog-client";

// Dados fallback (hardcoded) para quando o CMS não estiver disponível
const FALLBACK_TEXTURES: Texture[] = [
  { name: "Areia", image: "/images/textura-areia.png" },
  { name: "Linho Soft", image: "/images/textura-linho-soft.png" },
  { name: "Linho", image: "/images/textura-linho.png" },
  { name: "Algodão", image: "/images/textura-algodao.png" },
];

const FALLBACK_PRODUCTS: Product[] = [
  {
    id: "001",
    number: "001",
    name: "Peixinhos",
    category: ["Marinho", "Banheiro", "Minimalista"],
    textures: ["Areia", "Linho Soft", "Linho", "Algodão"],
    imageRoom: "/images/colecao-peixinhos-1.png",
    imageSheet: "/images/colecao-peixinhos-2.png",
    imageDetail: "/images/colecao-peixinhos-3.png",
    description:
      "Padrão elegante com peixes estilizados em tons de azul. Desenho minimalista perfeito para banheiros sofisticados e ambientes que desejam trazer o oceano com discrição.",
    material: "Vinil adesivo blockout | Papel de parede liso e texturas",
    rollWidth: "120 cm",
    availableHeights: "250 e 300 cm",
    price: 360,
  },
  {
    id: "002",
    number: "002",
    name: "Praia",
    category: ["Infantil", "Verão", "Pessoas"],
    textures: ["Areia", "Linho Soft", "Linho", "Algodão"],
    imageRoom: "/images/colecao-praia-1.png",
    imageSheet: "/images/colecao-praia-2.png",
    imageDetail: "/images/colecao-praia-3.png",
    description:
      "Cena animada de praia com pessoas em atividades de verão, em tons pastéis suaves. Uma celebração da diversão e liberdade do litoral, ideal para quartos infantis.",
    material: "Vinil adesivo blockout | Papel de parede liso e texturas",
    rollWidth: "120 cm",
    availableHeights: "250 e 300 cm",
    price: 360,
  },
  {
    id: "003",
    number: "003",
    name: "Oceano",
    category: ["Marinho", "Infantil", "Aventura"],
    textures: ["Areia", "Linho Soft", "Linho", "Algodão"],
    imageRoom: "/images/colecao-oceano-1.png",
    imageSheet: "/images/colecao-oceano-2.png",
    imageDetail: "/images/colecao-oceano-3.png",
    description:
      "Paisagem marinha tranquila com veleiros navegando em águas calmas. Tonalidades turquesa e branco criam uma atmosfera serena e inspiradora para ambientes infantis.",
    material: "Vinil adesivo blockout | Papel de parede liso e texturas",
    rollWidth: "120 cm",
    availableHeights: "250 e 300 cm",
    price: 360,
  },
  {
    id: "004",
    number: "004",
    name: "Rede",
    category: ["Banheiro", "Marinho", "Geométrico"],
    textures: ["Areia", "Linho Soft", "Linho", "Algodão"],
    imageRoom: "/images/colecao-rede-1.png",
    imageSheet: "/images/colecao-rede-2.png",
    imageDetail: "/images/colecao-rede-3.png",
    description:
      "Padrão geométrico minimalista com peixes estilizados em uma rede de linhas. Design clean e sofisticado que traz elegância marinha para banheiros e espaços adultos.",
    material: "Vinil adesivo blockout | Papel de parede liso e texturas",
    rollWidth: "120 cm",
    availableHeights: "250 e 300 cm",
    price: 360,
  },
];

const FALLBACK_CATEGORIES = [
  "Todos",
  "Marinho",
  "Infantil",
  "Banheiro",
  "Minimalista",
];

// Helper para extrair URL da imagem do Payload
function getImageUrl(media: any): string {
  if (!media) return "/placeholder.svg";
  if (typeof media === "string") return media;
  // Se for objeto do Payload, pegar a URL
  return media.url || `/media/${media.filename}` || "/placeholder.svg";
}

// Busca dados do CMS ou usa fallback
async function getData(): Promise<{
  products: Product[];
  categories: string[];
  textures: Texture[];
}> {
  try {
    // Importação dinâmica do Payload para evitar erros no build
    const { getPayload } = await import("payload");
    const config = (await import("@payload-config")).default;

    const payload = await getPayload({ config });

    // Buscar produtos
    const { docs: productsData } = await payload.find({
      collection: "products",
      where: { isActive: { equals: true } },
      sort: "order",
      depth: 2,
    });

    // Buscar categorias
    const { docs: categoriesData } = await payload.find({
      collection: "categories",
      sort: "order",
      limit: 100,
    });

    // Buscar texturas
    const { docs: texturesData } = await payload.find({
      collection: "textures",
      sort: "order",
      depth: 1,
      limit: 100,
    });

    // Se não há dados no CMS, usar fallback
    if (productsData.length === 0) {
      console.log("📦 Usando dados fallback (CMS vazio)");
      return {
        products: FALLBACK_PRODUCTS,
        categories: FALLBACK_CATEGORIES,
        textures: FALLBACK_TEXTURES,
      };
    }

    // Mapear produtos do CMS para o formato esperado
    const products: Product[] = productsData.map((p: any) => ({
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

    const categories: string[] = [
      "Todos",
      ...categoriesData.map((c: any) => c.name),
    ];

    const textures: Texture[] = texturesData.map((t: any) => ({
      name: t.name,
      image: getImageUrl(t.image),
    }));

    console.log(`📦 Carregados ${products.length} produtos do CMS`);

    return { products, categories, textures };
  } catch (error) {
    // Se o Payload não estiver configurado ou der erro, usar fallback
    console.log("📦 Usando dados fallback (Payload não disponível)");
    return {
      products: FALLBACK_PRODUCTS,
      categories: FALLBACK_CATEGORIES,
      textures: FALLBACK_TEXTURES,
    };
  }
}

export default async function HomePage() {
  const { products, categories, textures } = await getData();

  return (
    <CatalogClient
      initialProducts={products}
      initialCategories={categories}
      initialTextures={textures}
    />
  );
}
