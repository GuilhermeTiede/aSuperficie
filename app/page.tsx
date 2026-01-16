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

// --- Dados dos Produtos (Coleção Maré Mansa) ---

type Texture = {
  name: string;
  image: string;
};

const TEXTURES: Texture[] = [
  { name: "Areia", image: "/images/textura-areia.png" },
  { name: "Linho Soft", image: "/images/textura-linho-soft.png" },
  { name: "Linho", image: "/images/textura-linho.png" },
  { name: "Algodão", image: "/images/textura-algodao.png" },
];

type Product = {
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
};

const PRODUCTS: Product[] = [
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
  },
];

// --- Configurações de Filtros ---

const CATEGORIES = ["Todos", "Marinho", "Infantil", "Banheiro", "Minimalista"];

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
          Preço à partir de R$ 360,00
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
  walls: Wall[]
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
  const [selectedTexture, setSelectedTexture] = useState<string>(
    product.textures[0] || ""
  );

  const addWall = () => {
    setWalls((prev) => [
      ...prev,
      { id: String(Date.now()), height: 0, width: 0 },
    ]);
  };

  const removeWall = (id: string) => {
    if (walls.length > 1) {
      setWalls((prev) => prev.filter((w) => w.id !== id));
    }
  };

  const updateWall = (id: string, field: "height" | "width", value: number) => {
    setWalls((prev) =>
      prev.map((w) => (w.id === id ? { ...w, [field]: value } : w))
    );
  };

  const rollCalculations = calculateRolls(walls);
  const totalRolls = rollCalculations.reduce(
    (sum, calc) => sum + calc.rolls,
    0
  );
  const validWalls = walls.filter((w) => w.height > 0 && w.width > 0);

  const generateWhatsAppMessage = () => {
    const wallDetails = walls
      .map((wall, index) => {
        const calc = rollCalculations.find((c) => c.wallId === wall.id);
        if (wall.height <= 0 || wall.width <= 0) return null;
        return `Parede ${index + 1}: ${wall.width}cm (L) x ${
          wall.height
        }cm (A) = ${calc?.rolls || 0} rolo(s)`;
      })
      .filter(Boolean)
      .join("%0A");

    const message =
      `Olá! Gostaria de solicitar um orçamento:%0A%0A` +
      `*Produto:* ${product.name} (N.º ${product.number})%0A` +
      `*Coleção:* Maré Mansa%0A` +
      `*Textura:* ${selectedTexture}%0A%0A` +
      `*Medidas das Paredes*%0A${wallDetails}%0A%0A` +
      `*Total estimado:* ${totalRolls} rolo(s)%0A%0A` +
      `Aguardo retorno. Obrigado!`;

    return message;
  };

  const handleSubmit = () => {
    if (validWalls.length === 0) {
      alert("Por favor, preencha as medidas de pelo menos uma parede.");
      return;
    }
    if (!selectedTexture) {
      alert("Por favor, selecione uma textura.");
      return;
    }

    const message = generateWhatsAppMessage();
    const phoneNumber = "5521994408290"; // Substitua pelo número real
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, "_blank");
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] bg-white p-0 overflow-hidden gap-0 border-none rounded-2xl max-h-[90vh] overflow-y-auto">
        <DialogTitle className="sr-only">Comprar</DialogTitle>
        <div className="p-6 md:p-8">
          <div className="mb-6">
            <h2 className="font-medium text-2xl text-stone-900 tracking-tight">
              Comprar
            </h2>
            <p className="text-sm text-stone-500 font-light mt-1">
              Informe as medidas das suas paredes e escolha a textura
            </p>
          </div>

          {/* Seleção de Textura */}
          <div className="mb-8">
            <Label className="text-sm font-medium text-stone-900 mb-3 block">
              Textura Desejada
            </Label>
            <div className="grid grid-cols-4 gap-3">
              {product.textures.map((textureName) => {
                const texture = TEXTURES.find((t) => t.name === textureName);
                if (!texture) return null;

                return (
                  <button
                    key={textureName}
                    onClick={() => setSelectedTexture(textureName)}
                    className={cn(
                      "flex flex-col items-center gap-2 p-2 rounded-xl transition-all duration-200 focus:outline-none",
                      selectedTexture === textureName
                        ? "bg-stone-100 ring-2 ring-stone-900"
                        : "hover:bg-stone-50"
                    )}
                  >
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-stone-200">
                      <Image
                        src={texture.image}
                        alt={textureName}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="text-[10px] text-stone-600 font-medium text-center leading-tight">
                      {textureName}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Paredes */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-stone-900">
                Medidas das Paredes
              </Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={addWall}
                className="text-stone-600 hover:text-stone-900 text-xs gap-1"
              >
                <Plus className="w-4 h-4" />
                Adicionar Parede
              </Button>
            </div>

            <div className="space-y-3">
              {walls.map((wall, index) => {
                const calc = rollCalculations.find((c) => c.wallId === wall.id);
                return (
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
                          className="text-stone-400 hover:text-red-500 transition-colors p-1"
                          aria-label="Remover parede"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs text-stone-600 mb-1 block font-medium">
                          Largura (cm)
                        </Label>
                        <Input
                          type="number"
                          placeholder="ex: 300"
                          value={wall.width || ""}
                          onChange={(e) =>
                            updateWall(wall.id, "width", Number(e.target.value))
                          }
                          className="bg-white border-stone-300 text-stone-900 placeholder:text-stone-400"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-stone-600 mb-1 block font-medium">
                          Altura (cm)
                        </Label>
                        <Input
                          type="number"
                          placeholder="ex: 280"
                          value={wall.height || ""}
                          onChange={(e) =>
                            updateWall(
                              wall.id,
                              "height",
                              Number(e.target.value)
                            )
                          }
                          className="bg-white border-stone-300 text-stone-900 placeholder:text-stone-400"
                        />
                      </div>
                    </div>

                    {/* Preview de Rolos */}
                    {wall.width > 0 && wall.height > 0 && calc && (
                      <div className="pt-3 border-t border-stone-200">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-stone-500">
                            {calc.widthRolls}{" "}
                            {calc.widthRolls === 1 ? "faixa" : "faixas"} de{" "}
                            {ROLL_WIDTH}cm
                          </span>
                          <span className="font-semibold text-stone-900 bg-stone-200 px-2 py-1 rounded-full">
                            {calc.rolls} rolo{calc.rolls !== 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Resumo */}
          {validWalls.length > 0 && (
            <div className="mt-6 p-4 bg-stone-900 text-white rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-stone-400 uppercase tracking-wider">
                    Total Estimado
                  </p>
                  <p className="text-2xl font-semibold">
                    {totalRolls} rolo{totalRolls !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="text-right text-xs text-stone-400">
                  <p>
                    {validWalls.length} parede
                    {validWalls.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              {/* Detalhes dos rolos por parede */}
              <div className="pt-3 border-t border-stone-700 space-y-1.5">
                {walls.map((wall, index) => {
                  if (wall.height <= 0 || wall.width <= 0) return null;
                  const rollHeight = wall.height + 10; // altura da parede + 10cm de sobra
                  const calc = rollCalculations.find(
                    (c) => c.wallId === wall.id
                  );
                  return (
                    <div key={wall.id} className="flex justify-between text-xs">
                      <span className="text-stone-400">
                        Rolo Parede {index + 1}: {ROLL_WIDTH}cm × {rollHeight}cm
                      </span>
                      <span className="text-white font-medium">
                        {calc?.rolls || 0} rolo
                        {(calc?.rolls || 0) !== 1 ? "s" : ""}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Botão Enviar */}
          <Button
            onClick={handleSubmit}
            className="w-full mt-6 h-12 bg-green-600 hover:bg-green-700 text-white rounded-full transition-transform hover:scale-[1.02] active:scale-[0.98] gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            Solicitar por WhatsApp
          </Button>

          <p className="text-[10px] text-stone-400 text-center mt-4 leading-relaxed">
            Ao clicar, você será redirecionado para o WhatsApp com uma mensagem
            pré-preenchida. A quantidade de rolos é uma estimativa e pode
            variar.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// --- Componente Detalhes do Produto (Modal) ---

const ProductDetails = ({ product }: { product: Product }) => {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const images = [product.imageRoom, product.imageSheet, product.imageDetail];
  const labels = ["Ambiente", "Ficha Técnica", "Detalhe"];

  const nextImage = () =>
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  const prevImage = () =>
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);

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
    if (isLeftSwipe) nextImage();
    if (isRightSwipe) prevImage();
  };

  return (
    <div className="flex flex-col md:flex-row h-full w-full overflow-hidden bg-white">
      {/* Esquerda: Galeria Imersiva - Desktop */}
      <div className="hidden md:flex w-1/2 h-full relative bg-stone-100 group">
        <div className="absolute inset-0">
          <Image
            src={images[currentImageIndex] || "/placeholder.svg"}
            alt={`${product.name} - ${labels[currentImageIndex]}`}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Overlay Gradiente Sutil */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

        {/* Botões de Navegação */}
        <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <button
            onClick={prevImage}
            className="p-3 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md transition-all border border-white/20 pointer-events-auto"
            aria-label="Imagem anterior"
          >
            <ChevronLeft className="w-6 h-6 shadow-sm" />
          </button>
          <button
            onClick={nextImage}
            className="p-3 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md transition-all border border-white/20 pointer-events-auto"
            aria-label="Próxima imagem"
          >
            <ChevronRight className="w-6 h-6 shadow-sm" />
          </button>
        </div>

        {/* Label da Imagem Atual */}
        <div className="absolute top-6 left-6">
          <Badge
            variant="secondary"
            className="bg-white/90 text-stone-900 border-none shadow-sm backdrop-blur-sm px-3 py-1 text-xs font-medium tracking-wide"
          >
            {labels[currentImageIndex]}
          </Badge>
        </div>

        {/* Indicadores */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentImageIndex(idx)}
              className={`w-2 h-2 rounded-full transition-all duration-300 shadow-sm ${
                idx === currentImageIndex
                  ? "bg-white scale-110"
                  : "bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`Ir para imagem ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Mobile: Conteúdo scrollável com imagem no topo */}
      <div className="flex md:hidden flex-col h-full overflow-y-auto">
        {/* Imagem Mobile - altura maior para destaque */}
        <div
          className="relative w-full h-[55vh] shrink-0 bg-stone-100 cursor-pointer"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onClick={() => setIsFullscreen(true)}
        >
          <Image
            src={images[currentImageIndex] || "/placeholder.svg"}
            alt={`${product.name} - ${labels[currentImageIndex]}`}
            fill
            className="object-cover"
            priority
          />

          {/* Overlay Gradiente */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />

          {/* Botões de Navegação Mobile - mais visíveis */}
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

            <div className="pt-4 border-t border-stone-100">
              <h4 className="font-medium text-stone-900 mb-2 text-sm">
                Texturas Disponíveis
              </h4>
              <div className="grid grid-cols-4 gap-2">
                {product.textures.map((textureName) => {
                  const texture = TEXTURES.find((t) => t.name === textureName);
                  if (!texture) return null;

                  return (
                    <Dialog key={textureName}>
                      <DialogTrigger asChild>
                        <button className="group flex flex-col items-center gap-1 focus:outline-none">
                          <div className="relative w-full aspect-square rounded-lg border border-stone-200 overflow-hidden">
                            <Image
                              src={texture.image}
                              alt={textureName}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <span className="text-[10px] text-stone-600 font-medium text-center">
                            {textureName}
                          </span>
                        </button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[350px] bg-white p-0 overflow-hidden gap-0 border-none rounded-2xl">
                        <DialogTitle className="sr-only">
                          Visualização da textura {textureName}
                        </DialogTitle>
                        <div className="relative aspect-square w-full">
                          <Image
                            src={texture.image}
                            alt={`Textura ${textureName} ampliada`}
                            fill
                            className="object-cover"
                            priority
                          />
                        </div>
                        <div className="p-4 bg-white">
                          <h4 className="font-medium text-lg text-stone-900 mb-1">
                            {textureName}
                          </h4>
                          <p className="text-xs text-stone-500 font-light">
                            Textura de alta qualidade com acabamento premium.
                          </p>
                        </div>
                      </DialogContent>
                    </Dialog>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-stone-100 flex justify-end">
            <Button
              variant="outline"
              className="h-10 w-10 rounded-full border-stone-200 text-stone-600 hover:bg-stone-50 p-0 flex items-center justify-center"
              title="Compartilhar"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
                <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
              </svg>
            </Button>
          </div>

          <QuoteModal
            product={product}
            isOpen={isQuoteModalOpen}
            onClose={() => setIsQuoteModalOpen(false)}
          />
        </div>
      </div>

      {/* Desktop: Informações */}
      <div className="hidden md:flex w-1/2 flex-col h-full overflow-y-auto bg-white">
        <div className="p-8 lg:p-10 flex flex-col min-h-full">
          <div className="mb-auto">
            <div className="flex items-center gap-2 mb-4">
              {product.category.map((cat) => (
                <Badge
                  key={cat}
                  variant="outline"
                  className="text-xs text-stone-500 border-stone-200 font-normal px-2.5 py-0.5 rounded-full"
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

            {/* Botão Comprar em destaque */}
            <Button
              onClick={() => setIsQuoteModalOpen(true)}
              className="w-full h-16 bg-stone-900 hover:bg-stone-800 text-white rounded-full text-xl font-semibold mb-8 shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Comprar
            </Button>

            <div className="space-y-8 text-sm">
              <div>
                <h4 className="font-medium text-stone-900 mb-2">Descrição</h4>
                <p className="text-stone-600 leading-relaxed font-light">
                  {product.description}
                </p>
              </div>

              <div>
                <h4 className="font-medium text-stone-900 mb-3">
                  Texturas Disponíveis
                </h4>
                <p className="text-xs text-stone-400 mb-4 font-light">
                  Clique para ampliar e ver detalhes
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {product.textures.map((textureName) => {
                    const texture = TEXTURES.find(
                      (t) => t.name === textureName
                    );
                    if (!texture) return null;

                    return (
                      <Dialog key={textureName}>
                        <DialogTrigger asChild>
                          <button className="group flex flex-col items-start gap-2 focus:outline-none">
                            <div className="relative w-full aspect-square rounded-xl border border-stone-200 shadow-sm overflow-hidden transition-all duration-300 group-hover:shadow-md group-hover:ring-1 group-hover:ring-stone-400">
                              <Image
                                src={texture.image}
                                alt={textureName}
                                fill
                                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                            </div>
                            <span className="text-xs text-stone-600 font-medium group-hover:text-stone-900 transition-colors pl-1">
                              {textureName}
                            </span>
                          </button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px] bg-white p-0 overflow-hidden gap-0 border-none rounded-2xl">
                          <DialogTitle className="sr-only">
                            Visualização da textura {textureName}
                          </DialogTitle>
                          <div className="relative aspect-square w-full">
                            <Image
                              src={texture.image}
                              alt={`Textura ${textureName} ampliada`}
                              fill
                              className="object-cover"
                              priority
                            />
                          </div>
                          <div className="p-6 bg-white">
                            <h4 className="font-medium text-xl text-stone-900 mb-1">
                              {textureName}
                            </h4>
                            <p className="text-sm text-stone-500 font-light leading-relaxed">
                              Textura de alta qualidade com acabamento premium.
                              Ideal para trazer sofisticação e conforto ao
                              ambiente.
                            </p>
                          </div>
                        </DialogContent>
                      </Dialog>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-stone-100 flex justify-end">
            <Button
              variant="outline"
              className="h-10 w-10 rounded-full border-stone-200 text-stone-600 hover:bg-stone-50 p-0 flex items-center justify-center"
              title="Compartilhar"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
                <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
              </svg>
            </Button>
          </div>

          {/* Modal de Orçamento */}
          <QuoteModal
            product={product}
            isOpen={isQuoteModalOpen}
            onClose={() => setIsQuoteModalOpen(false)}
          />
        </div>
      </div>

      {/* Fullscreen Image Viewer */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
          onClick={() => setIsFullscreen(false)}
        >
          {/* Botão Fechar */}
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md transition-all z-10"
            aria-label="Fechar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>

          {/* Imagem Fullscreen */}
          <div className="relative w-full h-full">
            <Image
              src={images[currentImageIndex] || "/placeholder.svg"}
              alt={`${product.name} - ${labels[currentImageIndex]}`}
              fill
              className="object-contain"
              priority
            />
          </div>

          {/* Botões de Navegação Fullscreen */}
          <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none">
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="p-3 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md transition-all pointer-events-auto"
              aria-label="Imagem anterior"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="p-3 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md transition-all pointer-events-auto"
              aria-label="Próxima imagem"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          </div>

          {/* Label e Indicadores */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
            <Badge
              variant="secondary"
              className="bg-white/90 text-stone-900 border-none shadow-sm backdrop-blur-sm px-3 py-1 text-sm font-medium"
            >
              {labels[currentImageIndex]}
            </Badge>
            <div className="flex gap-2">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(idx);
                  }}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    idx === currentImageIndex
                      ? "bg-white scale-110"
                      : "bg-white/50 hover:bg-white/80"
                  }`}
                  aria-label={`Ir para imagem ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function CatalogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [selectedTextures, setSelectedTextures] = useState<string[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- Lógica de Filtragem ---

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "Todos" ||
        product.category.includes(selectedCategory);

      const matchesTexture =
        selectedTextures.length === 0 ||
        product.textures.some((texture) => selectedTextures.includes(texture));

      return matchesSearch && matchesCategory && matchesTexture;
    });
  }, [searchQuery, selectedCategory, selectedTextures]);

  const toggleTexture = (texture: string) => {
    setSelectedTextures((prev) =>
      prev.includes(texture)
        ? prev.filter((t) => t !== texture)
        : [...prev, texture]
    );
  };

  const FilterSidebar = ({ className }: { className?: string }) => (
    <div className={cn("py-6", className)}>
      <div className="mb-10 px-2 lg:px-0">
        <h3 className="font-serif text-2xl text-stone-900 tracking-tight">
          Filtros
        </h3>
      </div>

      <div className="space-y-12">
        {/* Categorias */}
        <div>
          <h4 className="text-[11px] font-medium text-stone-400 uppercase tracking-[0.2em] mb-6 px-2 lg:px-0">
            Categorias
          </h4>
          <div className="space-y-2">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  "w-full text-left px-3 py-1.5 rounded-none text-base transition-all duration-300 flex items-center gap-3 group border-l-2",
                  selectedCategory === category
                    ? "text-stone-900 font-normal border-stone-900 pl-4"
                    : "text-stone-400 font-light border-transparent hover:text-stone-600 pl-3"
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Texturas (Removido temporariamente conforme solicitação) */}
        {/*
        <div>
          <h4 className="text-[11px] font-medium text-stone-400 uppercase tracking-[0.2em] mb-6 px-2 lg:px-0">
            Texturas
          </h4>
          <div className="grid grid-cols-4 gap-4 px-2 lg:px-0">
            {TEXTURES.map((texture) => (
              <button
                key={texture.name}
                onClick={() => toggleTexture(texture.name)}
                className={cn(
                  "w-12 h-12 rounded-full transition-all duration-500 focus:outline-none overflow-hidden relative group",
                  selectedTextures.includes(texture.name)
                    ? "ring-1 ring-stone-900 ring-offset-4 opacity-100"
                    : "opacity-60 hover:opacity-100 hover:scale-105"
                )}
                title={texture.name}
                aria-label={`Filtrar por textura ${texture.name}`}
              >
                <Image
                  src={texture.image}
                  alt={texture.name}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
          <div
            className={`transition-all duration-500 overflow-hidden ${
              selectedTextures.length > 0
                ? "max-h-10 mt-8 opacity-100"
                : "max-h-0 opacity-0"
            }`}
          >
            <button
              onClick={() => setSelectedTextures([])}
              className="px-2 lg:px-0 text-[10px] text-stone-400 hover:text-stone-900 transition-colors uppercase tracking-widest border-b border-transparent hover:border-stone-900 pb-0.5"
            >
              Limpar Seleção
            </button>
          </div>
        </div>
        */}
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
