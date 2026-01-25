"use client"

import Image from "next/image"
import { useState } from "react"

type GalleryImage = {
  id: string
  url: string
  alt: string
  title?: string
  description?: string
}

interface GalleryShowcaseProps {
  images: GalleryImage[]
  title?: string
}

export function GalleryShowcase({ images, title }: GalleryShowcaseProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  return (
    <div className="w-full bg-white">
      {title && (
        <div className="px-4 py-8 text-center md:px-8 md:py-12">
          <h2 className="text-3xl font-semibold text-gray-900 md:text-4xl">{title}</h2>
        </div>
      )}

      <div className="relative w-full">
        <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
          <Image
            src={images[selectedIndex].url || "/placeholder.svg"}
            alt={images[selectedIndex].alt}
            fill
            className="object-cover"
            priority
          />
        </div>

        {images[selectedIndex].description && (
          <div className="bg-gray-50 px-6 py-4 text-center md:px-8 md:py-6">
            <p className="text-gray-700">{images[selectedIndex].description}</p>
          </div>
        )}
      </div>

      {/* Thumbnail Navigation */}
      <div className="flex gap-2 overflow-x-auto bg-white px-4 py-4 md:px-8 md:py-6">
        {images.map((image, index) => (
          <button
            key={image.id}
            onClick={() => setSelectedIndex(index)}
            className={`relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all md:h-20 md:w-28 ${
              selectedIndex === index ? "border-blue-500 ring-2 ring-blue-400" : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <Image src={image.url || "/placeholder.svg"} alt={image.alt} fill className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  )
}
