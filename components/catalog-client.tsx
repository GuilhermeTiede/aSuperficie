"use client";

import type React from "react";

import { useState, useMemo } from "react";
import Image from "next/image";
import {
  Search,
  Filter,
  ShoppingBag,
  Menu,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  MessageCircle,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

// --- Tipos ---

export type Texture = {
  name: string;
  image: string;
};

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

// --- Props do Componente ---

interface CatalogClientProps {
  initialProducts: Product[];
  initialCategories: string[];
  initialTextures: Texture[];
}

// --- Componentes Internos ---

const ProductCard = ({ product }: { product: Product }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const images = [product.imageRoom, product.imageSheet, product.imageDetail];

  const nextImage = (e?: React.MouseEvent | React.TouchEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e?: React.MouseEvent | React.TouchEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextImage();
    }
    if (isRightSwipe) {
      prevImage();
    }
  };

  return (
    <div
      className="group cursor-pointer flex flex-col gap-4"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Card Image Carousel */}
      <div className="relative aspect-[3/4] overflow-hidden bg-stone-50">
        <Image
          src={images[currentImageIndex] || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* CTA Button - Ver Detalhes */}
        <div className="absolute inset-0 flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <button
            className="pointer-events-auto px-6 py-3 bg-white/95 hover:bg-white text-stone-900 font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 backdrop-blur-sm border border-stone-200"
            onClick={(e) => e.stopPropagation()}
          >
            <Eye className="w-4 h-4" />
            Ver Detalhes
          </button>
        </div>

        {/* Navigation Arrows */}
        <div className="absolute inset-0 flex items-center justify-between px-4 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={prevImage}
            className="p-2 rounded-full bg-black/10 hover:bg-black/20 text-white backdrop-blur-md transition-all border border-white/10"
            aria-label="Imagem anterior"
          >
            <ChevronLeft className="w-5 h-5 shadow-sm" />
          </button>
          <button
            onClick={nextImage}
            className="p-2 rounded-full bg-black/10 hover:bg-black/20 text-white backdrop-blur-md transition-all border border-white/10"
            aria-label="Próxima imagem"
          >
            <ChevronRight className="w-5 h-5 shadow-sm" />
          </button>
        </div>

        {/* Dots Indicator - Minimalist */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, idx) => (
            <div
              key={idx}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 shadow-sm ${
                idx === currentImageIndex
                  ? "bg-white scale-110"
                  : "bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Card Info - Clean Typography */}
      <div className="space-y-1 text-center">
        <h3 className="text-lg font-medium text-stone-900 group-hover:text-stone-600 transition-colors tracking-tight">
          {product.name}
        </h3>
        <p className="text-sm text-stone-500 font-light">
          {product.category[0]}
        </p>
        <p className="text-xs text-stone-600 font-medium pt-1">
          Preço à partir de R${" "}
          {product.price?.toFixed(2).replace(".", ",") || "360,00"}
        </p>
      </div>
    </div>
  );
};

// --- Tipos para Orçamento ---

type Wall = {
  id: string;
  height: number;
  width: number;
};

// --- Função para calcular rolos necessários ---

const ROLL_WIDTH = 120; // cm
const ROLL_HEIGHT = 300; // cm

const calculateRolls = (
  walls: Wall[],
): {
  wallId: string;
  rolls: number;
  widthRolls: number;
  heightRolls: number;
}[] => {
  return walls.map((wall) => {
    if (wall.width <= 0 || wall.height <= 0) {
      return { wallId: wall.id, rolls: 0, widthRolls: 0, heightRolls: 0 };
    }
    const widthRolls = Math.ceil(wall.width / ROLL_WIDTH);
    const heightRolls = Math.ceil(wall.height / ROLL_HEIGHT);
    return {
      wallId: wall.id,
      rolls: widthRolls * heightRolls,
      widthRolls,
      heightRolls,
    };
  });
};

// --- Componente Modal de Orçamento ---

const QuoteModal = ({
  product,
  isOpen,
  onClose,
}: {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [walls, setWalls] = useState<Wall[]>([
    { id: "1", height: 0, width: 0 },
  ]);

  const addWall = () => {
    setWalls([...walls, { id: Date.now().toString(), height: 0, width: 0 }]);
  };

  const removeWall = (id: string) => {
    if (walls.length > 1) {
      setWalls(walls.filter((wall) => wall.id !== id));
    }
  };

  const updateWall = (id: string, field: "height" | "width", value: number) => {
    setWalls(
      walls.map((wall) =>
        wall.id === id ? { ...wall, [field]: value } : wall,
      ),
    );
  };

  const rollsData = calculateRolls(walls);
  const totalRolls = rollsData.reduce((sum, data) => sum + data.rolls, 0);
  const estimatedPrice = totalRolls * (product.price || 360);

  const generateWhatsAppMessage = () => {
    const wallsInfo = walls
      .map(
        (wall, index) =>
          `Parede ${index + 1}: ${wall.height}cm (altura) x ${wall.width}cm (largura)`,
      )
      .join("\n");

    const message = `Olá! Gostaria de um orçamento para o papel de parede "${product.name}" (Coleção Maré Mansa).

📐 *Medidas das paredes:*
${wallsInfo}

📦 *Estimativa:*
- Total de rolos necessários: ${totalRolls}
- Valor estimado: R$ ${estimatedPrice.toFixed(2).replace(".", ",")}

Poderia me ajudar com mais informações?`;

    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/5511999999999?text=${encodedMessage}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-medium text-stone-900">
              Calcular Orçamento
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-stone-100 rounded-full transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <p className="text-sm text-stone-500 mb-6">
            Informe as medidas das paredes para calcular a quantidade de rolos
            necessários.
          </p>

          <div className="space-y-4">
            {walls.map((wall, index) => (
              <div
                key={wall.id}
                className="p-4 bg-stone-50 rounded-xl space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-stone-700">
                    Parede {index + 1}
                  </span>
                  {walls.length > 1 && (
                    <button
                      onClick={() => removeWall(wall.id)}
                      className="p-1.5 hover:bg-stone-200 rounded-full transition-colors text-stone-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-stone-500">
                      Altura (cm)
                    </Label>
                    <Input
                      type="number"
                      placeholder="250"
                      value={wall.height || ""}
                      onChange={(e) =>
                        updateWall(
                          wall.id,
                          "height",
                          Number.parseInt(e.target.value) || 0,
                        )
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-stone-500">
                      Largura (cm)
                    </Label>
                    <Input
                      type="number"
                      placeholder="300"
                      value={wall.width || ""}
                      onChange={(e) =>
                        updateWall(
                          wall.id,
                          "width",
                          Number.parseInt(e.target.value) || 0,
                        )
                      }
                      className="mt-1"
                    />
                  </div>
                </div>
                {rollsData.find((r) => r.wallId === wall.id)?.rolls! > 0 && (
                  <p className="text-xs text-stone-500">
                    Esta parede precisa de{" "}
                    {rollsData.find((r) => r.wallId === wall.id)?.rolls} rolo(s)
                  </p>
                )}
              </div>
            ))}

            <button
              onClick={addWall}
              className="w-full py-3 border-2 border-dashed border-stone-200 rounded-xl text-stone-500 hover:border-stone-300 hover:text-stone-600 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Adicionar outra parede
            </button>
          </div>

          {totalRolls > 0 && (
            <div className="mt-6 p-4 bg-stone-900 text-white rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-stone-300">Total de rolos</span>
                <span className="text-lg font-medium">{totalRolls}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-stone-300">Valor estimado</span>
                <span className="text-xl font-semibold">
                  R$ {estimatedPrice.toFixed(2).replace(".", ",")}
                </span>
              </div>
            </div>
          )}

          <a
            href={generateWhatsAppMessage()}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "mt-6 w-full py-4 rounded-full font-medium flex items-center justify-center gap-2 transition-all",
              totalRolls > 0
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-stone-200 text-stone-400 cursor-not-allowed pointer-events-none",
            )}
          >
            <MessageCircle className="w-5 h-5" />
            Solicitar Orçamento via WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};

// --- Componente de Detalhes do Produto ---

const ProductDetails = ({ product }: { product: Product }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const images = [product.imageRoom, product.imageSheet, product.imageDetail];
  const labels = ["Ambiente", "Padrão", "Detalhe"];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextImage();
    }
    if (isRightSwipe) {
      prevImage();
    }
  };

  return (
    <>
      <DialogTitle className="sr-only">{product.name}</DialogTitle>

      {/* Mobile Layout */}
      <div
        className="flex flex-col h-full md:hidden overflow-y-auto"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Imagem Mobile com proporção 1:1 */}
        <div className="relative w-full aspect-square bg-stone-100 flex-shrink-0">
          <Image
            src={images[currentImageIndex] || "/placeholder.svg"}
            alt={`${product.name} - ${labels[currentImageIndex]}`}
            fill
            className="object-cover"
            priority
          />

          {/* Overlay Gradiente */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />

          {/* Botões de Navegação Mobile */}
          <div className="absolute inset-0 flex items-center justify-between px-3 pointer-events-none">
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="p-3 rounded-full bg-black/40 hover:bg-black/60 text-white shadow-lg transition-all pointer-events-auto"
              aria-label="Imagem anterior"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="p-3 rounded-full bg-black/40 hover:bg-black/60 text-white shadow-lg transition-all pointer-events-auto"
              aria-label="Próxima imagem"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Label da Imagem */}
          <div className="absolute top-4 left-4">
            <Badge
              variant="secondary"
              className="bg-white/90 text-stone-900 border-none shadow-sm backdrop-blur-sm px-2.5 py-0.5 text-xs font-medium"
            >
              {labels[currentImageIndex]}
            </Badge>
          </div>

          {/* Indicadores */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentImageIndex
                    ? "bg-white scale-125"
                    : "bg-white/50"
                }`}
                aria-label={`Ir para imagem ${idx + 1}`}
              />
            ))}
          </div>

          {/* Dica de swipe */}
          <div className="absolute bottom-4 right-4 text-white/60 text-[10px] font-light">
            Deslize para ver mais
          </div>
        </div>

        {/* Conteúdo Mobile */}
        <div className="flex-1 p-5 pb-8">
          <div className="flex items-center gap-1.5 mb-3 flex-wrap">
            {product.category.map((cat) => (
              <Badge
                key={cat}
                variant="outline"
                className="text-[10px] text-stone-500 border-stone-200 font-normal px-2 py-0.5 rounded-full"
              >
                {cat}
              </Badge>
            ))}
          </div>

          <h2 className="font-medium text-2xl text-stone-900 mb-0.5 tracking-tight">
            {product.name}
          </h2>
          <p className="text-xs text-stone-400 font-light mb-4">
            Coleção Maré Mansa • N.º {product.number}
          </p>

          {/* Botão Comprar em destaque */}
          <Button
            onClick={() => setIsQuoteModalOpen(true)}
            className="w-full h-14 bg-stone-900 hover:bg-stone-800 text-white rounded-full text-lg font-semibold mb-5 shadow-lg"
          >
            Comprar
          </Button>

          <div className="space-y-5 text-sm">
            <div>
              <h4 className="font-medium text-stone-900 mb-1.5 text-sm">
                Descrição
              </h4>
              <p className="text-stone-600 leading-relaxed font-light text-sm">
                {product.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-stone-100">
              <div>
                <h4 className="font-medium text-stone-900 mb-1 text-xs uppercase tracking-wider">
                  Largura
                </h4>
                <p className="text-stone-600 font-light">{product.rollWidth}</p>
              </div>
              <div>
                <h4 className="font-medium text-stone-900 mb-1 text-xs uppercase tracking-wider">
                  Alturas
                </h4>
                <p className="text-stone-600 font-light">
                  {product.availableHeights}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100">
              <h4 className="font-medium text-stone-900 mb-1 text-xs uppercase tracking-wider">
                Material
              </h4>
              <p className="text-stone-600 font-light text-sm">
                {product.material}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex h-full">
        {/* Image Section */}
        <div className="w-1/2 h-full relative bg-stone-100">
          <Image
            src={images[currentImageIndex] || "/placeholder.svg"}
            alt={`${product.name} - ${labels[currentImageIndex]}`}
            fill
            className="object-cover"
            priority
          />

          {/* Navegação Desktop */}
          <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 hover:opacity-100 transition-opacity">
            <button
              onClick={prevImage}
              className="p-2.5 rounded-full bg-white/90 hover:bg-white text-stone-700 shadow-lg transition-all"
              aria-label="Imagem anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextImage}
              className="p-2.5 rounded-full bg-white/90 hover:bg-white text-stone-700 shadow-lg transition-all"
              aria-label="Próxima imagem"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Miniaturas Desktop */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 p-1.5 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={cn(
                  "w-14 h-14 relative rounded-md overflow-hidden transition-all",
                  idx === currentImageIndex
                    ? "ring-2 ring-stone-900 ring-offset-1"
                    : "opacity-60 hover:opacity-100",
                )}
              >
                <Image
                  src={img || "/placeholder.svg"}
                  alt={labels[idx]}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>

          {/* Label */}
          <Badge
            variant="secondary"
            className="absolute top-4 left-4 bg-white/90 text-stone-900 border-none shadow-sm backdrop-blur-sm"
          >
            {labels[currentImageIndex]}
          </Badge>
        </div>

        {/* Info Section Desktop */}
        <div className="w-1/2 h-full overflow-y-auto">
          <div className="p-8 lg:p-10">
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              {product.category.map((cat) => (
                <Badge
                  key={cat}
                  variant="outline"
                  className="text-xs text-stone-500 border-stone-200 font-normal"
                >
                  {cat}
                </Badge>
              ))}
            </div>

            <h2 className="font-medium text-3xl text-stone-900 mb-1 tracking-tight">
              {product.name}
            </h2>
            <p className="text-sm text-stone-400 font-light mb-6">
              Coleção Maré Mansa • N.º {product.number}
            </p>

            <p className="text-stone-600 leading-relaxed mb-8 font-light">
              {product.description}
            </p>

            <div className="space-y-5 mb-8">
              <div className="flex gap-12">
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-stone-400 mb-1">
                    Largura do Rolo
                  </h4>
                  <p className="text-stone-900 font-medium">
                    {product.rollWidth}
                  </p>
                </div>
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-stone-400 mb-1">
                    Alturas Disponíveis
                  </h4>
                  <p className="text-stone-900 font-medium">
                    {product.availableHeights}
                  </p>
                </div>
              </div>
              <div>
                <h4 className="text-xs uppercase tracking-wider text-stone-400 mb-1">
                  Material
                </h4>
                <p className="text-stone-900 font-medium">{product.material}</p>
              </div>
            </div>

            <Button
              onClick={() => setIsQuoteModalOpen(true)}
              className="w-full h-14 bg-stone-900 hover:bg-stone-800 text-white rounded-full text-lg font-semibold shadow-lg"
            >
              Calcular Orçamento
            </Button>
          </div>
        </div>
      </div>

      <QuoteModal
        product={product}
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
      />
    </>
  );
};

// --- Componente Principal do Catálogo (Client) ---

export default function CatalogClient({
  initialProducts,
  initialCategories,
  initialTextures,
}: CatalogClientProps) {
  // Estados
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [selectedTextures, setSelectedTextures] = useState<string[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Usar dados recebidos como props
  const products = initialProducts;
  const categories = initialCategories;
  const textures = initialTextures;

  // Lógica de filtros
  const filteredByCategory = useMemo(() => {
    if (selectedCategory === "Todos") return products;
    return products.filter((product) =>
      product.category.includes(selectedCategory),
    );
  }, [products, selectedCategory]);

  const filteredByTexture = useMemo(() => {
    if (selectedTextures.length === 0) return filteredByCategory;
    return filteredByCategory.filter((product) =>
      selectedTextures.every((tex) => product.textures.includes(tex)),
    );
  }, [filteredByCategory, selectedTextures]);

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return filteredByTexture;
    const query = searchQuery.toLowerCase();
    return filteredByTexture.filter(
      (product) =>
        product.name.toLowerCase().includes(query) ||
        product.category.some((c) => c.toLowerCase().includes(query)) ||
        product.description.toLowerCase().includes(query),
    );
  }, [filteredByTexture, searchQuery]);

  const toggleTexture = (texture: string) => {
    setSelectedTextures((prev) =>
      prev.includes(texture)
        ? prev.filter((t) => t !== texture)
        : [...prev, texture],
    );
  };

  // --- Sidebar de Filtros ---

  const FilterSidebar = () => (
    <div className="space-y-8">
      <div>
        <h3 className="flex items-center gap-2 text-xs uppercase tracking-widest text-stone-400 mb-6 px-2 lg:px-0">
          <Filter className="w-4 h-4" />
          Categorias
        </h3>
        <div className="flex flex-wrap gap-2 px-2 lg:px-0">
          {categories.map((cat) => (
            <Badge
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              variant={selectedCategory === cat ? "default" : "outline"}
              className={cn(
                "cursor-pointer transition-all duration-300 rounded-full px-4 py-2 text-xs",
                selectedCategory === cat
                  ? "bg-stone-900 text-white hover:bg-stone-800 border-stone-900"
                  : "text-stone-600 border-stone-200 hover:border-stone-400 hover:bg-stone-50",
              )}
            >
              {cat}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans text-gray-900">
      {/* --- Header --- */}
      <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-4">
          {/* Mobile Menu Trigger */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-6 w-6 text-gray-600" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px]">
              <SheetHeader>
                <SheetTitle className="sr-only">Filtros</SheetTitle>
              </SheetHeader>
              <div className="mt-8">
                <FilterSidebar />
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <div className="flex-shrink-0">
            <div className="relative h-12 w-12 md:h-14 md:w-14 rounded-full overflow-hidden border border-gray-100 shadow-sm">
              <Image
                src="/images/logo-asuperficie.jpg"
                alt="aSuperficie Logo"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl relative group">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-stone-600 transition-colors" />
              <Input
                type="text"
                placeholder="Buscar papel de parede (ex: peixinhos, praia)..."
                className="pl-10 bg-gray-50 border-gray-200 focus:bg-white focus:border-stone-300 transition-all rounded-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Cart / Actions (Placeholder) */}
          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-gray-600">
              <ShoppingBag className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* --- Main Content --- */}
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar (Desktop) */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24">
              <FilterSidebar />
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <h1 className="font-serif text-2xl md:text-3xl text-gray-900">
                {selectedCategory === "Todos"
                  ? "Coleção Maré Mansa"
                  : selectedCategory}
              </h1>
              <span className="text-sm text-gray-500">
                {filteredProducts.length}{" "}
                {filteredProducts.length === 1 ? "produto" : "produtos"}
              </span>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-32">
                <p className="text-stone-500 font-light text-lg">
                  Nenhum produto encontrado com estes filtros.
                </p>
                <Button
                  variant="link"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("Todos");
                    setSelectedTextures([]);
                  }}
                  className="mt-4 text-stone-900 underline-offset-4"
                >
                  Limpar todos os filtros
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
                {filteredProducts.map((product) => (
                  <Dialog key={product.id}>
                    <DialogTrigger asChild>
                      <div>
                        <ProductCard product={product} />
                      </div>
                    </DialogTrigger>

                    {/* Product Modal Details */}
                    <DialogContent className="max-w-5xl w-full md:w-[90vw] h-[100dvh] md:h-[80vh] md:max-h-[700px] p-0 overflow-hidden bg-white md:rounded-2xl rounded-none border-none shadow-2xl top-0 left-0 translate-x-0 translate-y-0 md:top-[50%] md:left-[50%] md:translate-x-[-50%] md:translate-y-[-50%] max-w-none md:max-w-5xl [&>[data-slot=dialog-close]]:text-stone-600 [&>[data-slot=dialog-close]]:bg-white/80 [&>[data-slot=dialog-close]]:hover:bg-white [&>[data-slot=dialog-close]]:z-50 [&>[data-slot=dialog-close]]:backdrop-blur-sm [&>[data-slot=dialog-close]]:rounded-full [&>[data-slot=dialog-close]]:p-1.5 md:[&>[data-slot=dialog-close]]:top-4 md:[&>[data-slot=dialog-close]]:right-4 [&>[data-slot=dialog-close]]:top-3 [&>[data-slot=dialog-close]]:right-3">
                      <ProductDetails product={product} />
                    </DialogContent>
                  </Dialog>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
