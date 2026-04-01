import React from 'react'
import { X, ChevronLeft, ChevronRight, ZoomIn, Heart } from 'lucide-react'

const allPhotos = [
  { url: '/img2.jpeg', caption: 'O começo de tudo' },
  { url: '/img1.jpeg', caption: 'Cada detalhe importa' },
  { url: '/img3.jpeg', caption: 'Momentos eternos' },
  { url: '/im4.png', caption: 'Nossa história' },
]

type Props = { onClose: () => void }

export default function PhotoGallery({ onClose }: Props) {
  const [lightbox, setLightbox] = React.useState<number | null>(null)

  React.useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (lightbox !== null) setLightbox(null)
        else onClose()
      }
      if (lightbox === null) return
      if (e.key === 'ArrowRight') setLightbox(i => (i! + 1) % allPhotos.length)
      if (e.key === 'ArrowLeft') setLightbox(i => (i! - 1 + allPhotos.length) % allPhotos.length)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [lightbox, onClose])

  React.useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <>
      {/* MODAL */}
      <div
        className="fixed inset-0 z-[100] flex flex-col"
        style={{
          background: 'linear-gradient(180deg, #F5F5DC 0%, #efe3c2 100%)'
        }}
      >

        {/* HEADER */}
        <div
          className="flex items-center justify-between px-6 py-5"
          style={{ borderBottom: '1px solid rgba(139,69,19,0.2)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="h-8 w-1 rounded-full"
              style={{ background: 'linear-gradient(to bottom, #8B4513, #D8B56A)' }}
            />
            <p className="text-[10px] uppercase tracking-[0.4em]"
              style={{ color: '#8B4513' }}>
              Galeria
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span
              className="rounded-full px-3 py-1 text-xs font-semibold"
              style={{
                background: 'rgba(216,181,106,0.3)',
                color: '#8B4513'
              }}
            >
              {allPhotos.length} fotos
            </span>

            <button
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full transition hover:scale-105"
              style={{
                border: '1px solid #D8B56A',
                background: '#F5F5DC',
                color: '#8B4513'
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* GRID */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {allPhotos.map((photo, i) => (
              <button
                key={i}
                onClick={() => setLightbox(i)}
                className="group relative aspect-square overflow-hidden rounded-xl transition hover:-translate-y-1"
                style={{
                  background: '#F5F5DC',
                  border: '1px solid rgba(216,181,106,0.4)'
                }}
              >
                <img
                  src={photo.url}
                  className="h-full w-full object-cover transition group-hover:scale-105"
                />

                {/* TOP BAR */}
                <div
                  className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100"
                  style={{
                    background: 'linear-gradient(to right, #8B4513, #D8B56A)'
                  }}
                />

                {/* OVERLAY */}
                <div className="absolute inset-0 flex items-center justify-center bg-[#8B4513]/0 group-hover:bg-[#8B4513]/40 transition">
                  <ZoomIn className="text-white opacity-0 group-hover:opacity-100" />
                </div>

                {/* CAPTION */}
                <div
                  className="absolute bottom-0 left-0 right-0 translate-y-full p-3 group-hover:translate-y-0 transition"
                  style={{
                    background: 'linear-gradient(to top, rgba(43,26,13,0.9), transparent)'
                  }}
                >
                  <p className="text-xs italic text-white">{photo.caption}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* FOOTER */}
        <div className="py-4 text-center">
          <div className="flex items-center justify-center gap-3">
            <div className="h-[1px] w-8" style={{ background: '#D8B56A' }} />
            <p className="text-xs italic" style={{ color: '#8B4513' }}>
              Clique em qualquer foto para ampliar
            </p>
            <div className="h-[1px] w-8" style={{ background: '#D8B56A' }} />
          </div>
        </div>
      </div>

      {/* LIGHTBOX */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center"
          style={{ background: 'rgba(20,10,5,0.95)' }}
          onClick={() => setLightbox(null)}
        >

          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 rounded-full p-2 text-white"
            style={{
              background: 'rgba(216,181,106,0.2)',
              border: '1px solid rgba(216,181,106,0.4)'
            }}
          >
            <X />
          </button>

          <img
            src={allPhotos[lightbox].url}
            className="max-h-[80vh] rounded-xl"
            onClick={e => e.stopPropagation()}
          />

          {/* NAV */}
          <button
            onClick={e => {
              e.stopPropagation()
              setLightbox(i => (i! - 1 + allPhotos.length) % allPhotos.length)
            }}
            className="absolute left-4 text-white"
          >
            <ChevronLeft />
          </button>

          <button
            onClick={e => {
              e.stopPropagation()
              setLightbox(i => (i! + 1) % allPhotos.length)
            }}
            className="absolute right-4 text-white"
          >
            <ChevronRight />
          </button>

        </div>
      )}
    </>
  )
}