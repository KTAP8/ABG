import { useState } from 'react'
import { ProductImage } from '../../lib/api'
import { BlueprintPlaceholder } from '../ui/BlueprintPlaceholder'

interface ImageGalleryProps {
  images: ProductImage[]
  productName: string
}

export function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  return (
    <div className="space-y-4 border border-charcoal p-4 bg-cream">
      {/* Primary image blueprint */}
      <div className="relative">
        <BlueprintPlaceholder
          title={`${productName} // SHOT_0${selectedIndex + 1}`}
          subtitle={`ASPECT_3:4 // CAMERA_MOCK_${selectedIndex + 1}`}
          aspectRatio="3/4"
        />
      </div>

      {/* Thumbnails styled as data registers */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pt-2 border-t border-charcoal/20">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`flex-shrink-0 w-16 py-2 border text-center font-mono text-[9px] cursor-pointer tracking-wider transition-all ${
                idx === selectedIndex
                  ? 'border-charcoal bg-charcoal text-cream font-bold'
                  : 'border-charcoal/40 opacity-60 text-charcoal hover:opacity-100'
              }`}
            >
              SHOT_0{idx + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
