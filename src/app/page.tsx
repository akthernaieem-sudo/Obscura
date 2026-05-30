'use client'

import GalleryCreator from '@/components/GalleryCreator'
import UploadSection from '@/components/UploadSection'
import GalleryViewer from '@/components/GalleryViewer'
import GalleryList from '@/components/GalleryList'
import Navbar from '@/components/Navbar'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import imageCompression from 'browser-image-compression'

import { supabase } from '@/lib/supabase'

type ImageItem = {
  name: string
  url: string
}

type Gallery = {
  id: string
  name: string
}

export default function Home() {
  const router = useRouter()

  const [loading, setLoading] =
    useState(true)

  const [files, setFiles] = useState<
    File[]
  >([])

  const [images, setImages] = useState<
    ImageItem[]
  >([])

  const [galleryName, setGalleryName] =
    useState('')

  const [gallery, setGallery] =
    useState<Gallery | null>(null)

  const [galleries, setGalleries] =
    useState<Gallery[]>([])

  const [uploading, setUploading] =
    useState(false)

  const checkAuth = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push('/login')
      return
    }

    setLoading(false)
  }

  const loadUserGalleries =
  async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    const { data } =
      await supabase
        .from('galleries')
        .select('*')
        .eq('user_id', user.id)

    if (!data) return

    const galleriesWithThumbs =
      await Promise.all(
        data.map(async (gallery) => {
          const { data: media } =
            await supabase
              .from('media_files')
              .select('*')
              .eq(
                'gallery_id',
                gallery.id
              )
              .limit(1)

          if (
            media &&
            media.length > 0
          ) {
            const {
              data: publicUrlData,
            } = supabase.storage
              .from('media')
              .getPublicUrl(
                media[0]
                  .preview_path
              )

            return {
              ...gallery,
              thumbnail:
                publicUrlData.publicUrl,
            }
          }

          return gallery
        })
      )

    setGalleries(
      galleriesWithThumbs
    )
  }

  const createGallery = async () => {
    if (!galleryName) return

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      alert('Login required')
      return
    }

    const { data, error } =
      await supabase
        .from('galleries')
        .insert({
          name: galleryName,
          user_id: user.id,
        })
        .select()
        .single()

    if (error) {
      alert('Gallery creation failed')
      return
    }

    setGallery(data)

    loadUserGalleries()

    alert('Gallery created')
  }

  const getImages = async () => {
    if (!gallery) return

    const { data } =
      await supabase
        .from('media_files')
        .select('*')
        .eq('gallery_id', gallery.id)

    if (!data) return

    const imageUrls = data.map((item) => {
      const { data: publicUrlData } =
        supabase.storage
          .from('media')
          .getPublicUrl(
            item.preview_path
          )

      return {
        name: item.preview_path,
        url: publicUrlData.publicUrl,
      }
    })

    setImages(imageUrls)
  }

  const uploadImages = async () => {
    if (!gallery) {
      alert('Create gallery first')
      return
    }

    if (files.length === 0) return

    setUploading(true)

    for (const file of files) {
  const compressedFile =
    await imageCompression(file, {
      maxSizeMB: 0.15,
      maxWidthOrHeight: 1200,
    })

  const cleanName = file.name
    .replace(/\s+/g, '-')
    .replace(/[^\w.-]/g, '')

  const fileName =
    `${Date.now()}-${cleanName}`

  // CREATE WATERMARKED PREVIEW
  const imageBitmap =
    await createImageBitmap(
      compressedFile
    )

  const canvas =
    document.createElement('canvas')

  canvas.width = imageBitmap.width
  canvas.height =
    imageBitmap.height

  const ctx =
    canvas.getContext('2d')

  if (!ctx) continue

  ctx.drawImage(
    imageBitmap,
    0,
    0
  )

  // WATERMARK TEXT
  ctx.font =
    `${canvas.width / 18}px sans-serif`

  ctx.fillStyle =
    'rgba(255,255,255,0.25)'

  ctx.textAlign = 'center'

  ctx.fillText(
    'PREVIEW',
    canvas.width / 2,
    canvas.height / 2
  )

  const watermarkedBlob =
    await new Promise<Blob | null>(
      (resolve) =>
        canvas.toBlob(
          resolve,
          'image/jpeg',
          0.9
        )
    )

  if (!watermarkedBlob) continue

  const previewFile = new File(
    [watermarkedBlob],
    fileName,
    {
      type: 'image/jpeg',
    }
  )

  // UPLOAD WATERMARKED PREVIEW
  await supabase.storage
    .from('media')
    .upload(
      fileName,
      previewFile
    )

  // UPLOAD CLEAN ORIGINAL
  await supabase.storage
    .from('originals')
    .upload(fileName, file)

  await supabase
    .from('media_files')
    .insert({
      gallery_id: gallery.id,
      preview_path: fileName,
      original_path: fileName,
    })
}

    alert('Uploads complete')

    setFiles([])

    getImages()

    setUploading(false)
  }

  useEffect(() => {
    checkAuth()
    loadUserGalleries()
  }, [])

  useEffect(() => {
    getImages()
  }, [gallery])

  if (loading) {
    return (
      <main className="p-10 text-white bg-black min-h-screen">
        Loading...
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white px-4 md:px-8 py-6 md:py-10">
      <Navbar
        onLogout={async () => {
          await supabase.auth.signOut()
          router.push('/login')
        }}
      />

      <div className="mb-14">
        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">
          Provider Dashboard
        </h1>

        <p className="text-white/50 mt-3 text-lg">
          Manage private galleries,
          uploads, and protected
          client deliveries.
        </p>
      </div>

      <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 mb-12">
        <div className="mb-10">
          <p className="uppercase tracking-[0.25em] text-sm text-white/40 mb-4">
            Create Gallery
          </p>

          <GalleryCreator
            galleryName={galleryName}
            onChange={setGalleryName}
            onCreate={createGallery}
          />
        </div>

        <div>
          <p className="uppercase tracking-[0.25em] text-sm text-white/40 mb-6">
            Your Galleries
          </p>

          <GalleryList
            galleries={galleries}
            onSelect={setGallery}
          />
        </div>
      </div>

      {gallery && (
        <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 mb-10">
          <p className="uppercase tracking-[0.25em] text-sm text-white/40 mb-3">
            Current Gallery
          </p>

          <div className="mb-4">
  <h2 className="text-2xl md:text-3xl font-semibold">
    {gallery.name}
  </h2>

  <p className="text-white/50 mt-2">
    {images.length} files uploaded
  </p>
</div>
<p className="text-white/50 mb-3">
  Share this private gallery link
  with your client
</p>
          <div className="flex flex-col md:flex-row gap-4 md:items-center">
  <a
    href={`/gallery/${gallery.id}`}
    target="_blank"
    className="text-blue-400 hover:text-blue-300 transition underline break-all"
  >
    {window.location.origin}/gallery/
    {gallery.id}
  </a>

  <button
    onClick={() => {
      navigator.clipboard.writeText(
        `${window.location.origin}/gallery/${gallery.id}`
      )

      alert('Link copied')
    }}
    className="w-full md:w-auto border border-white/10 hover:border-white/20 px-5 py-3 rounded-2xl transition bg-white/[0.03] hover:bg-white/[0.05]"
  >
    Copy Link
  </button>
</div>

          <div className="mt-10">
            <UploadSection
              uploading={uploading}
              files={files}
              onFileChange={(e) =>
                setFiles(
                  Array.from(
                    e.target.files || []
                  )
                )
              }
              onUpload={uploadImages}
            />
          </div>
        </div>
      )}

      <GalleryViewer images={images} />
    </main>
  )
}