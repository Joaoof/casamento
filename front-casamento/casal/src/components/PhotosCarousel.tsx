import React from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react'
import PhotoGallery from './PhotoGallery'

const photos = [
  { url: '/img1.jpeg', caption: 'O começo de tudo' },
  { url: '/img3.jpeg', caption: 'Cada detalhe importa' },
  { url: '/img4.jpeg', caption: 'Momentos eternos' },
  { url: '/img2.jpeg', caption: 'Nossa história' },
  { url: '/img5.jpeg', caption: 'Nossa história' },
  { url: '/img6.jpeg', caption: 'Nossa história' },
  { url: '/img7.jpeg', caption: 'Nossa história' },
  { url: '/img8.jpeg', caption: 'Nossa história' },
].filter(p => p.url)

export default function PhotoCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 35, align: 'center' })
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const [isHovering, setIsHovering] = React.useState(false)
  const [showGallery, setShowGallery] = React.useState(false)

  const scrollPrev = React.useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = React.useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  const onSelect = React.useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  React.useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    return () => {
      emblaApi.off('select', onSelect)
    }
  }, [emblaApi, onSelect])

  React.useEffect(() => {
    if (!emblaApi || isHovering) return
    const timer = setInterval(() => emblaApi.scrollNext(), 5000)
    return () => clearInterval(timer)
  }, [emblaApi, isHovering])

  return (
    <>
      <section
        id="o-evento"
        className="relative w-full overflow-hidden py-24"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >

        {/* FUNDO */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full blur-3xl"
          />
          <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full blur-3xl"
          />
        </div>

        {/* HEADER */}
        <div className="relative mb-14 px-4 text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <div className="h-[1px] w-10" style={{ background: '#D8B56A' }} />
            <Heart className="h-3.5 w-3.5" style={{ fill: '#8B4513', color: '#8B4513' }} />
            <div className="h-[1px] w-10" style={{ background: '#D8B56A' }} />
          </div>

          <span
            className="mb-3 inline-flex items-center gap-2 rounded-full border px-4 py-1 text-[10px] font-semibold uppercase tracking-[0.35em]"
            style={{
              borderColor: '#D8B56A',
              color: '#8B4513',
              background: 'rgba(216,181,106,0.2)'
            }}
          >
            <Heart className="h-2.5 w-2.5" style={{ fill: '#8B4513' }} />
            Galeria
          </span>

          <h2
            className="mt-2 font-serif text-3xl font-bold md:text-4xl"
            style={{ color: '#2b1a0d' }}
          >
            Nossos Momentos
          </h2>

          <div className="mx-auto mt-4 flex items-center justify-center gap-3">
            <div className="h-[1px] w-12" style={{ background: '#D8B56A' }} />
            <div className="h-1.5 w-1.5 rounded-full" style={{ background: '#8B4513' }} />
            <div className="h-[1px] w-12" style={{ background: '#D8B56A' }} />
          </div>
        </div>

        {/* CARROSSEL */}
        <div className="relative mx-auto max-w-7xl">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex touch-pan-y items-center">
              {photos.map((photo, index) => {
                const isActive = index === selectedIndex
                return (
                  <div
                    key={index}
                    className="relative flex-[0_0_88%] min-w-0 px-2 transition-all duration-700 ease-out sm:flex-[0_0_70%] md:flex-[0_0_55%] lg:flex-[0_0_45%] md:px-4"
                    style={{
                      opacity: isActive ? 1 : 0.35,
                      transform: isActive ? 'scale(1)' : 'scale(0.88)'
                    }}
                  >
                    <div className={`relative overflow-hidden rounded-2xl transition-shadow duration-700 ${isActive
                      ? 'shadow-[0_30px_80px_rgba(43,26,13,0.25)]'
                      : 'shadow-md'
                      }`}>

                      {isActive && (
                        <div
                          className="absolute top-0 left-0 right-0 h-1 z-10 rounded-t-2xl"
                          style={{ background: 'linear-gradient(to right, #8B4513, #D8B56A)' }}
                        />
                      )}

                      <div className="aspect-[4/5] md:aspect-[16/10]">
                        <img
                          src={photo.url}
                          alt={photo.caption}
                          className="h-full w-full object-cover transition-transform duration-[2500ms] ease-out hover:scale-105"
                        />
                      </div>

                      <div
                        className={`absolute inset-0 flex flex-col justify-end p-6 transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0'
                          }`}
                        style={{
                          background: 'linear-gradient(to top, rgba(43,26,13,0.8), transparent)'
                        }}
                      >
                        <p className="font-serif text-base italic text-white/90">
                          {photo.caption}
                        </p>
                        <span className="text-[10px] uppercase tracking-[0.3em] text-white/50">
                          {String(index + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}
                        </span>
                      </div>

                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* BOTÕES */}
          <button
            onClick={scrollPrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-[#F5F5DC]"
            style={{ border: '1px solid #D8B56A', color: '#8B4513' }}
          >
            <ChevronLeft />
          </button>

          <button
            onClick={scrollNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-[#F5F5DC]"
            style={{ border: '1px solid #D8B56A', color: '#8B4513' }}
          >
            <ChevronRight />
          </button>
        </div>

        {/* PROGRESS */}
        <div className="mt-10 flex flex-col items-center gap-4">
          <div className="h-[2px] w-32 rounded-full" style={{ background: '#e8d7a5' }}>
            <div
              className="h-full"
              style={{
                width: `${((selectedIndex + 1) / photos.length) * 100}%`,
                background: 'linear-gradient(to right, #8B4513, #D8B56A)'
              }}
            />
          </div>

          <button
            onClick={() => setShowGallery(true)}
            className="rounded-full px-6 py-2 text-xs uppercase tracking-[0.2em]"
            style={{
              border: '1px solid #D8B56A',
              color: '#8B4513',
              background: '#F5F5DC'
            }}
          >
            Ver todas as fotos
          </button>
        </div>

      </section>

      {showGallery && <PhotoGallery onClose={() => setShowGallery(false)} />}
    </>
  )
}