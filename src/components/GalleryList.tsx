type Gallery = {
  id: string
  name: string
  thumbnail?: string
}

type GalleryListProps = {
  galleries: Gallery[]
  onSelect: (
    gallery: Gallery
  ) => void
}

export default function GalleryList({
  galleries,
  onSelect,
}: GalleryListProps) {
  if (galleries.length === 0) {
  return (
    
  
    <div className="border border-dashed border-white/10 rounded-3xl p-12 md:p-16s text-center bg-white/[0.02]">
      <h2 className="text-2xl font-semibold mb-3">
        No galleries yet
      </h2>

      <p className="text-white/50 max-w-md mx-auto leading-relaxed">
        Create your first private
        gallery to begin uploading
        previews and delivering
        protected client downloads.
      </p>
    </div>
  )
}
return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
      {galleries.map((gallery) => (
        <div
          key={gallery.id}
          onClick={() =>
            onSelect(gallery)
          }
          className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden cursor-pointer hover:bg-white/[0.05] hover:border-white/20 hover:-translate-y-1 transition duration-300"
        >
          {gallery.thumbnail ? (
            <img
              src={gallery.thumbnail}
              alt={gallery.name}
              className="w-full h-44 md:h-52 object-cover"
            />
          ) : (
            <div className="w-full h-52 bg-white/[0.03] flex items-center justify-center text-white/20 text-sm">
              No Preview
            </div>
          )}

          <div className="p-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-white/40 text-sm uppercase tracking-widest mb-2">
                  Gallery
                </p>

                <h2 className="text-2xl font-semibold">
                  {gallery.name}
                </h2>
              </div>

              <div className="text-white/30 text-3xl">
                →
              </div>
            </div>

            <div className="border-t border-white/10 pt-4">
              <p className="text-white/50 text-sm">
                Open client gallery and manage uploads
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}