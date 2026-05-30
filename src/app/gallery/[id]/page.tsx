'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import GalleryViewer from '@/components/GalleryViewer'

type ImageItem = {
  name: string
  url: string
}

export default function GalleryPage() {
  const [images, setImages] = useState<
    ImageItem[]
  >([])

  const [
    downloadsEnabled,
    setDownloadsEnabled,
  ] = useState(false)

  const [galleryName, setGalleryName] =
    useState('Gallery')

  const params = useParams()

  const galleryId = params.id as string

  const getGalleryImages = async () => {
    const { data, error } =
      await supabase
        .from('media_files')
        .select(`
          *,
          galleries (
            name,
            downloads_enabled
          )
        `)
        .eq('gallery_id', galleryId)

    console.log(data)
    console.log(error)

    if (!data) return

    if (data.length > 0) {
      setDownloadsEnabled(
        data[0].galleries
          ?.downloads_enabled || false
      )

      setGalleryName(
        data[0].galleries?.name ||
          'Gallery'
      )
    }

    const imageUrls = data.map((item) => {
      const { data: publicUrlData } =
        supabase.storage
          .from('media')
          .getPublicUrl(
            item.preview_path
          )

      return {
        name: item.original_path,
        url: publicUrlData.publicUrl,
      }
    })

    setImages(imageUrls)
  }

  const downloadOriginal = async (
    fileName: string
  ) => {
    const { data, error } =
      await supabase.storage
        .from('originals')
        .createSignedUrl(
          fileName,
          60
        )

    console.log(data)
    console.log(error)

    if (error || !data) {
      alert('Download failed')
      return
    }

    window.open(
      data.signedUrl,
      '_blank'
    )
  }

  useEffect(() => {
    if (galleryId) {
      getGalleryImages()
    }
  }, [galleryId])

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <div className="mb-16 pb-10 border-b border-white/10">
        <p className="uppercase tracking-[0.3em] text-sm opacity-60 mb-3">
          Client Gallery
        </p>

        <h1 className="text-6xl md:text-7xl font-semibold tracking-tight mb-6">
          {galleryName}
        </h1>

        <p className="text-white/50 text-lg max-w-2xl leading-relaxed">
          Curated previews delivered in a
          private gallery experience.
          Originals remain protected until
          download access is granted.
        </p>
      </div>

      <GalleryViewer
        images={images}
        downloadsEnabled={
          downloadsEnabled
        }
        onDownload={downloadOriginal}
      />
    </main>
  )
}