import { useState } from 'react'
import { ProductImage } from '../../lib/api'
import { BlueprintPlaceholder } from '../ui/BlueprintPlaceholder'

interface ImageGalleryProps {
  images: ProductImage[]
  productName: string
}

export function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const selectedImage = images[selectedIndex]

  return (
    <div className="space-y-4 border border-charcoal p-4 bg-cream">
      {/* Primary image */}
      <div className="relative aspect-[3/4] bg-charcoal border border-charcoal overflow-hidden">
        {selectedImage?.url ? (
          <img
            src={selectedImage.url}
            alt={selectedImage.alt_text || `${productName} - Image ${selectedIndex + 1}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <BlueprintPlaceholder
            title={`${productName} // SHOT_0${selectedIndex + 1}`}
            subtitle={`ASPECT_3:4 // CAMERA_MOCK_${selectedIndex + 1}`}
            aspectRatio="3/4"
          />
        )}
      </div>

      {/* Thumbnails styled as data registers */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pt-2 border-t border-charcoal/20">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`flex-shrink-0 w-16 h-20 border overflow-hidden transition-all ${
                idx === selectedIndex
                  ? 'border-charcoal'
                  : 'border-charcoal/40 opacity-60 hover:opacity-100'
              }`}
            >
              {img.url ? (
                <img
                  src={img.url}
                  alt={`${productName} thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-charcoal/20 flex items-center justify-center text-[9px] font-mono text-charcoal/50">
                  SHOT_0{idx + 1}
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
