import { useState } from 'react'
import { ProductImage } from '../../lib/api'

interface ImageGalleryProps {
  images: ProductImage[]
  productName: string
}

export function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const primaryImage = images[selectedIndex] || images[0]

  if (!images.length) {
    return (
      <div className="aspect-[3/4] bg-charcoal border border-charcoal flex items-center justify-center">
        <p className="text-cream text-sm">No image</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Primary image */}
      <div className="aspect-[3/4] overflow-hidden bg-charcoal border border-charcoal cursor-crosshair">
        <img
          src={primaryImage.url}
          alt={primaryImage.alt_text || productName}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`flex-shrink-0 w-16 h-20 border ${
                idx === selectedIndex ? 'border-charcoal' : 'border-charcoal opacity-50'
              } overflow-hidden`}
            >
              <img
                src={img.url}
                alt={img.alt_text || productName}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
