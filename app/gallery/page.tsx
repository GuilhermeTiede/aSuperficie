"use client";

import { GalleryShowcase } from "@/components/gallery-showcase";

const GALLERY_IMAGES = [
  {
    id: "cover",
    url: "/images/1.png",
    alt: "Capa - Clarice Jabarra Aprire Arquitetura",
    title: "Capa da Coleção",
    description: "Coleção de estampas exclusivas Maré Mansa",
  },
  {
    id: "concept",
    url: "/images/3.png",
    alt: "Conceito da coleção",
    title: "Conceito",
    description:
      "Estampas exclusivas que transportam a delicadeza da aquarela para sua parede",
  },
  {
    id: "exclusive",
    url: "/images/2.png",
    alt: "Materiais e exclusividade",
    title: "Materiais",
    description: "Papéis especiais desenhados com exclusividade",
  },
  {
    id: "distribution",
    url: "/images/16.png",
    alt: "Distribuição exclusiva",
    title: "Exclusividade",
    description: "Vendidas exclusivamente na @aSuperficie",
  },
];

export default function GalleryPage() {
  return (
    <main className="min-h-screen bg-white">
      <GalleryShowcase images={GALLERY_IMAGES} title="Catálogo Completo" />
    </main>
  );
}
