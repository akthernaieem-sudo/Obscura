'use client'

import { useEffect } from 'react'

type ImageModalProps = {
  imageUrl: string
  onClose: () => void
  onNext: () => void
  onPrev: () => void
}

export default function ImageModal({
  imageUrl,
  onClose,
  onNext,
  onPrev,
}: ImageModalProps) {
  useEffect(() => {
    const handleKeyDown = (
      e: KeyboardEvent
    ) => {
      if (e.key === 'Escape') {
        onClose()
      }

      if (e.key === 'ArrowRight') {
        onNext()
      }

      if (e.key === 'ArrowLeft') {
        onPrev()
      }
    }

    window.addEventListener(
      'keydown',
      handleKeyDown
    )

    return () => {
      window.removeEventListener(
        'keydown',
        handleKeyDown
      )
    }
  }, [onClose, onNext, onPrev])

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 transition duration-300"
      onClick={onClose}
    >
      <button
        onClick={(e) => {
          e.stopPropagation()
          onClose()
        }}
        className="absolute top-6 right-6 text-white/80 hover:text-white text-4xl transition"
      >
        ×
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation()
          onPrev()
        }}
        className="absolute left-6 text-white/60 hover:text-white text-5xl transition"
      >
        ‹
      </button>

      <img
        src={imageUrl}
        alt="Preview"
        className="max-h-[90vh] max-w-[90vw] rounded-2xl shadow-2xl hover:scale-[1.02] transition duration-300"
        onClick={(e) =>
          e.stopPropagation()
        }
      />

      <button
        onClick={(e) => {
          e.stopPropagation()
          onNext()
        }}
        className="absolute right-6 text-white/60 hover:text-white text-5xl transition"
      >
        ›
      </button>
    </div>
  )
}