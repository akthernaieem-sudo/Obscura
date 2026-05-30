'use client'

import { useState } from 'react'
import ImageModal from './ImageModal'

type ImageItem = {
  name: string
  url: string
}

type GalleryViewerProps = {
  images: ImageItem[]
  downloadsEnabled?: boolean
  onDownload?: (
    fileName: string
  ) => void
}

export default function GalleryViewer({
  images,
  downloadsEnabled,
  onDownload,
}: GalleryViewerProps) {
  const [selectedIndex, setSelectedIndex] =
    useState<number | null>(null)

  const [loadedImages, setLoadedImages] =
    useState<Record<string, boolean>>({})

  const selectedImage =
    selectedIndex !== null
      ? images[selectedIndex]
      : null

  const goNext = () => {
    if (selectedIndex === null) return

    setSelectedIndex(
      (selectedIndex + 1) %
        images.length
    )
  }

  const goPrev = () => {
    if (selectedIndex === null) return

    setSelectedIndex(
      (selectedIndex - 1 +
        images.length) %
        images.length
    )
  }
if (images.length === 0) {
  return (
    <div className="border border-dashed border-white/10 rounded-3xl p-12 md:p-16 text-center bg-white/[0.02]">
      <h2 className="text-2xl font-semibold mb-3">
        No uploads yet
      </h2>

      <p className="text-white/50 max-w-md mx-auto leading-relaxed">
        Upload images to generate
        previews and create your
        protected client gallery
        experience.
      </p>
    </div>
  )
}
return(
    <>
      <div className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6">
        {images.map((img, index) => (
          <div
            key={img.name}
            className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden cursor-pointer hover:scale-[1.02] hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.05] transition duration-300 break-inside-avoid mb-6 backdrop-blur-sm"
          >
            <div className="relative">
              {!loadedImages[img.url] && (
                <div className="absolute inset-0 animate-pulse bg-white/5" />
              )}

              <img
                src={img.url}
                alt={img.name}
                className={`w-full transition duration-700 hover:brightness-110 ${
                  loadedImages[img.url]
                    ? 'opacity-100'
                    : 'opacity-0'
                }`}
                onLoad={() =>
                  setLoadedImages(
                    (prev) => ({
                      ...prev,
                      [img.url]: true,
                    })
                  )
                }
                onClick={() =>
                  setSelectedIndex(index)
                }
              />
            </div>

            <div className="p-4 flex justify-between items-center">
              <p className="text-sm opacity-70">
                Preview
              </p>

              {downloadsEnabled &&
                onDownload && (
                  <button
                    onClick={() =>
                      onDownload(img.name)
                    }
                    className="border border-white/10 hover:border-white/20 px-3 py-1 rounded-lg text-sm transition"
                  >
                    Download
                  </button>
                )}
            </div>
          </div>
        ))}
      </div>

      {selectedImage && (
        <ImageModal
          imageUrl={selectedImage.url}
          onClose={() =>
            setSelectedIndex(null)
          }
          onNext={goNext}
          onPrev={goPrev}
        />
      )}
    </>
  )
}