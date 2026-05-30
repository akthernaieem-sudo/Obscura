type GalleryCreatorProps = {
  galleryName: string
  onChange: (
    value: string
  ) => void
  onCreate: () => void
}

export default function GalleryCreator({
  galleryName,
  onChange,
  onCreate,
}: GalleryCreatorProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="relative w-full md:max-w-xl">
        <input
          type="text"
          placeholder="Enter gallery name..."
          value={galleryName}
          onChange={(e) =>
            onChange(e.target.value)
          }
          className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-5 text-lg outline-none focus:border-white/30 focus:bg-white/[0.05] transition"
        />

        <div className="absolute inset-0 rounded-2xl pointer-events-none shadow-[0_0_80px_rgba(255,255,255,0.03)]" />
      </div>

      <button
        onClick={onCreate}
        className="bg-white text-black px-8 py-5 rounded-2xl font-medium hover:scale-[1.02] transition duration-300"
      >
        Create Gallery
      </button>
    </div>
  )
}