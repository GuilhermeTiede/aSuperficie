import { getPayload } from "payload";
import config from "../payload.config";

// Dados iniciais das categorias
const CATEGORIES_SEED = [
  { name: "Marinho", slug: "marinho", order: 1 },
  { name: "Infantil", slug: "infantil", order: 2 },
  { name: "Banheiro", slug: "banheiro", order: 3 },
  { name: "Minimalista", slug: "minimalista", order: 4 },
  { name: "Verão", slug: "verao", order: 5 },
  { name: "Pessoas", slug: "pessoas", order: 6 },
  { name: "Aventura", slug: "aventura", order: 7 },
  { name: "Geométrico", slug: "geometrico", order: 8 },
];

// Dados iniciais das texturas (sem imagens por enquanto)
const TEXTURES_SEED = [
  { name: "Areia", order: 1 },
  { name: "Linho Soft", order: 2 },
  { name: "Linho", order: 3 },
  { name: "Algodão", order: 4 },
];

// Dados iniciais dos produtos (referências serão atualizadas após criar categorias/texturas)
const PRODUCTS_SEED = [
  {
    number: "001",
    name: "Peixinhos",
    categories: ["Marinho", "Banheiro", "Minimalista"],
    textures: ["Areia", "Linho Soft", "Linho", "Algodão"],
    description:
      "Padrão elegante com peixes estilizados em tons de azul. Desenho minimalista perfeito para banheiros sofisticados e ambientes que desejam trazer o oceano com discrição.",
    material: "Vinil adesivo blockout | Papel de parede liso e texturas",
    rollWidth: "120 cm",
    availableHeights: "250 e 300 cm",
    price: 360,
    order: 1,
  },
  {
    number: "002",
    name: "Praia",
    categories: ["Infantil", "Verão", "Pessoas"],
    textures: ["Areia", "Linho Soft", "Linho", "Algodão"],
    description:
      "Cena animada de praia com pessoas em atividades de verão, em tons pastéis suaves. Uma celebração da diversão e liberdade do litoral, ideal para quartos infantis.",
    material: "Vinil adesivo blockout | Papel de parede liso e texturas",
    rollWidth: "120 cm",
    availableHeights: "250 e 300 cm",
    price: 360,
    order: 2,
  },
  {
    number: "003",
    name: "Oceano",
    categories: ["Marinho", "Infantil", "Aventura"],
    textures: ["Areia", "Linho Soft", "Linho", "Algodão"],
    description:
      "Paisagem marinha tranquila com veleiros navegando em águas calmas. Tonalidades turquesa e branco criam uma atmosfera serena e inspiradora para ambientes infantis.",
    material: "Vinil adesivo blockout | Papel de parede liso e texturas",
    rollWidth: "120 cm",
    availableHeights: "250 e 300 cm",
    price: 360,
    order: 3,
  },
  {
    number: "004",
    name: "Rede",
    categories: ["Banheiro", "Marinho", "Geométrico"],
    textures: ["Areia", "Linho Soft", "Linho", "Algodão"],
    description:
      "Padrão geométrico minimalista com peixes estilizados em uma rede de linhas. Design clean e sofisticado que traz elegância marinha para banheiros e espaços adultos.",
    material: "Vinil adesivo blockout | Papel de parede liso e texturas",
    rollWidth: "120 cm",
    availableHeights: "250 e 300 cm",
    price: 360,
    order: 4,
  },
];

async function seed() {
  console.log("🌱 Iniciando seed do banco de dados...\n");

  const payload = await getPayload({ config });

  // 1. Criar usuário admin
  console.log("👤 Criando usuário admin...");
  try {
    await payload.create({
      collection: "users",
      data: {
        email: "admin@maremansa.com",
        password: "admin123",
        name: "Administrador",
        role: "admin",
      },
    });
    console.log("   ✅ Usuário admin criado: admin@maremansa.com / admin123\n");
  } catch (error: any) {
    if (error.message?.includes("duplicate")) {
      console.log("   ⚠️  Usuário admin já existe\n");
    } else {
      console.error("   ❌ Erro ao criar usuário:", error.message);
    }
  }

  // 2. Criar categorias
  console.log("📂 Criando categorias...");
  const categoryMap: Record<string, string> = {};

  for (const cat of CATEGORIES_SEED) {
    try {
      const created = await payload.create({
        collection: "categories",
        data: cat,
      });
      categoryMap[cat.name] = created.id;
      console.log(`   ✅ ${cat.name}`);
    } catch (error: any) {
      if (
        error.message?.includes("duplicate") ||
        error.message?.includes("unique")
      ) {
        const existing = await payload.find({
          collection: "categories",
          where: { name: { equals: cat.name } },
        });
        if (existing.docs[0]) {
          categoryMap[cat.name] = existing.docs[0].id;
          console.log(`   ⚠️  ${cat.name} já existe`);
        }
      } else {
        console.error(`   ❌ Erro em ${cat.name}:`, error.message);
      }
    }
  }
  console.log("");

  // 3. Criar texturas (sem imagens por enquanto - adicionar pelo admin)
  console.log("🎨 Criando texturas...");
  const textureMap: Record<string, string> = {};

  for (const tex of TEXTURES_SEED) {
    try {
      // Texturas precisam de imagem, então vamos pular por enquanto
      console.log(
        `   ⚠️  ${tex.name} - Adicione pelo painel admin com a imagem`,
      );
    } catch (error: any) {
      console.error(`   ❌ Erro em ${tex.name}:`, error.message);
    }
  }
  console.log("");

  // 4. Info sobre produtos
  console.log("📦 Produtos...");
  console.log("   ℹ️  Produtos precisam de imagens e texturas.");
  console.log(
    "   ℹ️  Adicione-os pelo painel admin em /admin após fazer upload das imagens.\n",
  );

  console.log("✨ Seed básico concluído!\n");
  console.log("Próximos passos:");
  console.log("1. Acesse http://localhost:3000/admin");
  console.log("2. Login: admin@maremansa.com / admin123");
  console.log("3. Faça upload das imagens de texturas em 'Mídias'");
  console.log("4. Complete as texturas com as imagens");
  console.log("5. Faça upload das imagens dos produtos");
  console.log("6. Crie os produtos com as imagens\n");

  process.exit(0);
}

seed().catch((error) => {
  console.error("❌ Erro no seed:", error);
  process.exit(1);
});
