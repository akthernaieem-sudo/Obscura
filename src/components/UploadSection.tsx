type UploadSectionProps = {
  uploading: boolean
  files: File[]
  onFileChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void
  onUpload: () => void
}

export default function UploadSection({
  uploading,
  files,
  onFileChange,
  onUpload,
}: UploadSectionProps) {
  return (
    <div className="mt-8">
      <div className="flex flex-col md:flex-row gap-4 md:items-center">
        <label className="flex-1 cursor-pointer border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] rounded-2xl px-5 py-4 transition text-white/70">
          <input
            type="file"
            multiple
            onChange={onFileChange}
            className="hidden"
          />

          {files.length > 0
            ? `${files.length} files selected`
            : 'Choose files'}
        </label>

        <button
          onClick={onUpload}
          disabled={uploading}
          className="w-full md:w-auto bg-white text-black px-8 py-4 rounded-2xl font-medium hover:scale-[1.02] transition duration-300 disabled:opacity-50"
        >
          {uploading
            ? 'Uploading...'
            : 'Upload'}
        </button>
      </div>

      {files.length > 0 && (
        <div className="mt-6 border border-white/10 rounded-2xl p-4 bg-white/[0.02]">
          <p className="text-white/50 text-sm mb-3">
            Selected files
          </p>

          <div className="space-y-2 max-h-48 overflow-y-auto">
            {files.map((file, index) => (
              <div
                key={index}
                className="text-sm text-white/70 truncate"
              >
                {file.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}