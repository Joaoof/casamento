'use client'
import { Heart, MapPin, Calendar } from "lucide-react"
import StickyReveal from "./Reveal"
import { useNavigate } from "react-router-dom"
import { useState, useRef, useEffect } from 'react'

// ─────────────────────────────────────────
// DADOS
// ─────────────────────────────────────────
const TIMELINE_EVENTS = [
  {
    date: "Março, 2025",
    title: "Primeiro namoro",
    text: "O começo de tudo. Uma rosa, um momento, e uma história que mudaria nossas vidas.",
    img: "/pedido-namoro.jpeg",
  },
  {
    date: "Julho, 2025",
    title: "Primeiro mês juntos",
    text: "Um mês depois, já sabíamos que era pra durar. Cada dia melhor que o anterior.",
    img: "/juntos.jpeg",
  },
  {
    date: "12 Jul",
    title: "Dia 12 de julho",
    text: "Uma data que guardamos no coração — celebrada com carinho todo ano.",
    img: "/juntos-2.jpeg",
  },
  {
    date: "14 Jun",
    title: "Primeiro piquenique",
    text: "Uma mesa simples, dois pratos e muito amor. Esse jantar ficou na memória.",
    img: "/pequinique.jpeg",
  },
  {
    date: "31 Jan",
    title: "Curso de noivos",
    text: "Ajoelhado diante dela, com um buquê e um anel. Ela disse sim.",
    img: "/curso-noivado.jpeg",
  },
]

const TIMELINE_ICONS = [
  <svg key="flower" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
    <path d="M12 22V12M12 12C12 12 8 10 8 6a4 4 0 0 1 8 0c0 4-4 6-4 6z" strokeLinecap="round" />
    <path d="M12 12c0 0-4-2-6 1s0 6 3 5M12 12c0 0 4-2 6 1s0 6-3 5" strokeLinecap="round" />
  </svg>,
  <svg key="heart" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" strokeLinecap="round" />
  </svg>,
  <svg key="cal" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
    <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" />
  </svg>,
  <svg key="food" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v20M21 15V2a5 5 0 0 0-5 5v6h3v7" strokeLinecap="round" />
  </svg>,
  <svg key="ring" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5">
    <circle cx="12" cy="15" r="6" />
    <path d="M9 9l1.5-4h3L15 9" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9 9h6" strokeLinecap="round" />
  </svg>,
]

// ─────────────────────────────────────────
// STORIES — Modal estilo Instagram
// ─────────────────────────────────────────
function StoriesTimeline({
  events,
  icons,
  initialIndex = 0,
}: {
  events: typeof TIMELINE_EVENTS
  icons: React.ReactNode[]
  initialIndex?: number
}) {
  const [current, setCurrent] = useState(initialIndex)
  const [paused, setPaused] = useState(false)
  const [progress, setProgress] = useState(0)
  const [muted, setMuted] = useState(false)
  const touchStartX = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)
  const isSwiping = useRef(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const audioStarted = useRef(false)
  const DURATION = 5000
  const TICK = 50

  // Cria o áudio mas NÃO tenta tocar ainda — mobile bloqueia sem interação
  useEffect(() => {
    const audio = new Audio('/audio/fundo.mp3')
    audio.loop = true
    audio.volume = 0.35
    audioRef.current = audio
    return () => {
      audio.pause()
      audio.src = ''
    }
  }, [])

  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = muted
  }, [muted])

  // Inicia música no primeiro toque do usuário (resolve bloqueio de autoplay)
  const startAudio = () => {
    if (audioStarted.current || !audioRef.current) return
    audioStarted.current = true
    audioRef.current.play().catch(() => { })
  }

  // Fecha e para a música
  const close = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    document.dispatchEvent(new CustomEvent('stories:close'))
  }

  // Progresso automático
  useEffect(() => {
    if (paused) return
    const id = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          setCurrent(c => (c + 1 < events.length ? c + 1 : c))
          return 0
        }
        return p + (TICK / DURATION) * 100
      })
    }, TICK)
    return () => clearInterval(id)
  }, [current, paused, events.length])

  useEffect(() => { setProgress(0) }, [current])

  // touchmove passive:false — só bloqueia scroll se for swipe horizontal
  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    const handleTouchMove = (e: TouchEvent) => {
      if (touchStartX.current === null || touchStartY.current === null) return
      const dx = Math.abs(e.touches[0].clientX - touchStartX.current)
      const dy = Math.abs(e.touches[0].clientY - touchStartY.current)
      if (dx > dy && dx > 8) {
        isSwiping.current = true
        setPaused(true)
        e.preventDefault()
      }
    }
    el.addEventListener('touchmove', handleTouchMove, { passive: false })
    return () => el.removeEventListener('touchmove', handleTouchMove)
  }, [])

  const goTo = (i: number) => {
    if (i >= 0 && i < events.length) { setCurrent(i); setProgress(0) }
  }

  const onTouchStart = (e: React.TouchEvent) => {
    startAudio() // ← inicia música no primeiro toque
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
    isSwiping.current = false
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!isSwiping.current) {
      touchStartX.current = null
      touchStartY.current = null
      return
    }
    setPaused(false)
    if (touchStartX.current !== null) {
      const dx = e.changedTouches[0].clientX - touchStartX.current
      if (Math.abs(dx) > 40) dx < 0 ? goTo(current + 1) : goTo(current - 1)
    }
    touchStartX.current = null
    touchStartY.current = null
    isSwiping.current = false
  }

  const event = events[current]

  return (
    <>
      <style>{`
        @keyframes storyFadeIn {
          from { opacity: 0; transform: scale(1.04); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes storyModalIn {
          from { opacity: 0; transform: scale(0.92); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes backdropIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>

      {/* Backdrop */}
      <div
        onClick={close}
        style={{
          position: 'fixed', inset: 0, zIndex: 9998,
          background: 'rgba(0,0,0,0.88)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          animation: 'backdropIn 0.25s ease both',
          overscrollBehavior: 'contain',
          touchAction: 'none',
        }}
      />

      {/* Wrapper de posicionamento */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(100vw, calc(100dvh * 9 / 16))',
          height: 'min(100dvh, calc(100vw * 16 / 9))',
          maxWidth: '420px',
          maxHeight: '100dvh',
          zIndex: 9999,
        }}
      >
        {/* Card animado */}
        <div
          ref={cardRef}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            borderRadius: 'clamp(0px, 2vw, 20px)',
            overflow: 'hidden',
            background: '#111',
            touchAction: 'pan-y',
            boxShadow: '0 32px 80px rgba(0,0,0,0.9)',
            animation: 'storyModalIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both',
          }}
        >
          {/* Foto */}
          <img
            key={current}
            src={event.img}
            alt={event.title}
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: 'center top',
              animation: 'storyFadeIn 0.35s ease both',
            }}
          />

          {/* Vinheta */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, transparent 28%, transparent 52%, rgba(0,0,0,0.92) 100%)',
          }} />

          {/* Header */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '14px 12px 0', zIndex: 10 }}>
            {/* Barras */}
            <div style={{ display: 'flex', gap: 3, marginBottom: 10 }}>
              {events.map((_, i) => (
                <button key={i} onClick={() => goTo(i)}
                  style={{
                    flex: 1, height: 2.5, borderRadius: 2,
                    background: 'rgba(255,255,255,0.3)',
                    overflow: 'hidden', border: 'none', padding: 0, cursor: 'pointer',
                  }}
                >
                  <div style={{
                    height: '100%', borderRadius: 2, background: 'white',
                    width: i < current ? '100%' : i === current ? `${progress}%` : '0%',
                    transition: 'none',
                  }} />
                </button>
              ))}
            </div>

            {/* Avatar + nome + botões */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <div style={{
                width: 34, height: 34, borderRadius: '50%',
                background: 'linear-gradient(135deg, #1B3A6B, #4A7AB5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', border: '2px solid white', flexShrink: 0,
              }}>
                {icons[current]}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ color: 'white', fontWeight: 700, fontSize: 13, lineHeight: 1.2, margin: 0 }}>
                  Luís &amp; Natiele
                </p>
                <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 10, margin: 0 }}>{event.date}</p>
              </div>

              {/* Mute */}
              <button
                onClick={() => setMuted(m => !m)}
                style={{ color: 'rgba(255,255,255,0.75)', background: 'none', border: 'none', cursor: 'pointer', padding: 8 }}
              >
                {muted ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 5L6 9H2v6h4l5 4V5z" />
                    <line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 5L6 9H2v6h4l5 4V5z" />
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                  </svg>
                )}
              </button>

              {/* Fechar */}
              <button
                onClick={close}
                style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer', padding: 8, lineHeight: 0 }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Zonas toque L/R */}
          <button aria-label="Anterior"
            onMouseDown={() => setPaused(true)} onMouseUp={() => setPaused(false)}
            onClick={() => goTo(current - 1)}
            style={{ position: 'absolute', inset: '80px 60% 30% 0', zIndex: 5, background: 'none', border: 'none', cursor: 'default' }}
          />
          <button aria-label="Próximo"
            onMouseDown={() => setPaused(true)} onMouseUp={() => setPaused(false)}
            onClick={() => goTo(current + 1)}
            style={{ position: 'absolute', inset: '80px 0 30% 60%', zIndex: 5, background: 'none', border: 'none', cursor: 'default' }}
          />

          {/* Conteúdo inferior */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 18px 32px', zIndex: 10 }}>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 9, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 5 }}>
              {current + 1} de {events.length}
            </p>
            <h3 style={{ color: 'white', fontFamily: 'serif', fontSize: 26, fontWeight: 700, fontStyle: 'italic', lineHeight: 1.2, margin: '0 0 8px', textShadow: '0 2px 12px rgba(0,0,0,0.6)' }}>
              {event.title}
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13, lineHeight: 1.7, margin: 0 }}>
              {event.text}
            </p>
            {current === events.length - 1 && (
              <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.2)' }} />
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, fontFamily: 'serif', fontStyle: 'italic' }}>
                  E a história continua...
                </span>
                <Heart size={13} style={{ color: '#F4A7B9', fill: '#F4A7B9' } as React.CSSProperties} />
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  )
}


// ─────────────────────────────────────────
// ENTRY — grid 3 × N linhas
// ─────────────────────────────────────────
function StoriesEntry({
  events,
  icons,
}: {
  events: typeof TIMELINE_EVENTS
  icons: React.ReactNode[]
}) {
  const [open, setOpen] = useState(false)
  const [startIndex, setStartIndex] = useState(0)

  useEffect(() => {
    const close = () => setOpen(false)
    document.addEventListener('stories:close', close)
    return () => document.removeEventListener('stories:close', close)
  }, [])

  const openAt = (i: number) => { setStartIndex(i); setOpen(true) }

  const rows: (typeof events)[] = []
  for (let i = 0; i < events.length; i += 3) rows.push(events.slice(i, i + 3))

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
        <p style={{ color: '#7AAFD4', fontSize: 12, letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600, margin: 0 }}>
          Nossa história em fotos
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%' }}>
          {rows.map((row, rowIdx) => (
            <div key={rowIdx} style={{ display: 'flex', justifyContent: 'center', gap: 20 }}>
              {row.map((event, colIdx) => {
                const idx = rowIdx * 3 + colIdx
                return (
                  <button key={idx} onClick={() => openAt(idx)}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center',
                      gap: 7, background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0, padding: 0,
                    }}
                  >
                    <div style={{ padding: 2.5, borderRadius: '50%', background: 'linear-gradient(45deg, #1B3A6B, #4A7AB5, #7AAFD4)' }}>
                      <div style={{ padding: 2, borderRadius: '50%', background: 'white' }}>
                        <img src={event.img} alt={event.title}
                          style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }}
                        />
                      </div>
                    </div>
                    <span style={{ color: '#1B3A6B', fontSize: 10, fontWeight: 600, maxWidth: 72, textAlign: 'center', lineHeight: 1.3 }}>
                      {event.title}
                    </span>
                  </button>
                )
              })}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', marginTop: 4 }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(74,122,181,0.15)' }} />
          <p style={{ color: 'rgba(74,122,181,0.45)', fontSize: 11, fontStyle: 'italic', margin: 0, whiteSpace: 'nowrap' }}>
            Toque para ver nossa história
          </p>
          <div style={{ flex: 1, height: 1, background: 'rgba(74,122,181,0.15)' }} />
        </div>
      </div>

      {open && <StoriesTimeline events={events} icons={icons} initialIndex={startIndex} />}
    </>
  )
}

// ─────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────
export default function OurStory() {
  const navigate = useNavigate()

  return (
    <div
      className="relative flex flex-col overflow-x-hidden font-sans text-slate-800 dark:text-slate-100"
      style={{ width: '100vw', marginLeft: '50%', transform: 'translateX(-50%)' }}
    >
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .animate-marquee { display: flex; width: max-content; animation: marquee 28s linear infinite; }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
        .animate-float { animation: float 3s ease-in-out infinite; }
      `}</style>

      {/* BANNER */}
      <div
        className="sticky top-0 z-50 w-full overflow-hidden py-2 shadow-md md:py-2.5"
        style={{
          background: "linear-gradient(90deg, #8B4513, #D8B56A, #8B4513)"
        }}
      >
        <div className="animate-marquee flex items-center whitespace-nowrap text-[#F5F5DC]">
          {[...Array(10)].map((_, i) => (
            <span
              key={i}
              className="mx-6 flex items-center gap-3 text-[10px] font-medium uppercase tracking-[0.25em] md:mx-10 md:gap-4 md:text-[11px] md:tracking-[0.3em]"
            >
              <span className="text-[#F5F5DC]/50">✦</span>

              celebrando o amor de

              <span
                className="rounded-full px-3 py-0.5 font-bold tracking-widest md:px-4"
                style={{
                  border: "1px solid rgba(245,245,220,0.4)",
                  background: "rgba(245,245,220,0.15)",
                  color: "#F5F5DC"
                }}
              >
                Luís & Vitória
              </span>

              25 · 07 · 2026

              <span className="text-[#F5F5DC]/50">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* HERO */}
      <StickyReveal index={0}>
        <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden">

          {/* IMAGEM COM MELHOR QUALIDADE */}
          <div
            className="absolute inset-0 scale-105 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: 'url("img3.jpeg")',
              filter: "brightness(0.9) contrast(1.05) saturate(1.05)",
            }}
          />

          {/* OVERLAY CORRETO (quente + leve) */}
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to bottom, rgba(245,245,220,0.2), rgba(139,69,19,0.55))"
            }}
          />

          <div className="relative z-10 flex flex-col items-center px-6 text-center">

            {/* LINHA + ÍCONE */}
            <div className="mb-5 flex items-center gap-3 opacity-80">
              <div className="h-[1px] w-8 md:w-12" style={{ background: "#F5F5DC" }} />
              <Heart className="h-3.5 w-3.5 md:h-4 md:w-4"
                style={{ fill: "#D8B56A", color: "#D8B56A" }}
              />
              <div className="h-[1px] w-8 md:w-12" style={{ background: "#F5F5DC" }} />
            </div>

            {/* SUBTÍTULO */}
            <p
              className="mb-3 text-[9px] font-medium uppercase tracking-[0.4em] md:text-[10px]"
              style={{ color: "#F5F5DC" }}
            >
              A nossa história
            </p>

            {/* NOME */}
            <h1
              className="mb-4 font-serif text-[2.8rem] font-bold leading-tight sm:text-4xl md:text-5xl"
              style={{
                color: "#FFFFFF",
                textShadow: "0 6px 25px rgba(0,0,0,0.4)"
              }}
            >
              Luís & Vitória
            </h1>

            {/* DATA + LOCAL */}
            <div className="mt-3 flex flex-col items-center gap-2 sm:flex-row sm:gap-6">

              <span
                className="flex items-center gap-1.5 text-xs font-light tracking-widest md:text-sm"
                style={{ color: "rgba(245,245,220,0.9)" }}
              >
                <Calendar className="h-3 w-3 md:h-3.5 md:w-3.5"
                  style={{ color: "#D8B56A" }}
                />
                25 de Julho, 2026
              </span>

              <span className="hidden sm:block" style={{ color: "rgba(245,245,220,0.4)" }}>·</span>

              <span
                className="flex items-center gap-1.5 text-xs font-light tracking-widest md:text-sm"
                style={{ color: "rgba(245,245,220,0.9)" }}
              >
                <MapPin className="h-3 w-3 md:h-3.5 md:w-3.5"
                  style={{ color: "#D8B56A" }}
                />
                Araguaína, TO
              </span>

            </div>
          </div>

          {/* SCROLL INDICATOR */}
          <div className="animate-float absolute bottom-8 flex flex-col items-center gap-2">
            <span
              className="text-[8px] uppercase tracking-[0.4em] md:text-[9px]"
              style={{ color: "rgba(245,245,220,0.6)" }}
            >
              Deslize
            </span>

            <div
              className="flex h-8 w-4 items-start justify-center rounded-full p-1 md:h-9 md:w-5"
              style={{ border: "1px solid rgba(245,245,220,0.4)" }}
            >
              <div className="h-1.5 w-1 animate-bounce rounded-full"
                style={{ background: "#F5F5DC" }}
              />
            </div>
          </div>

        </div>
      </StickyReveal>

      {/* CITAÇÃO */}
      <StickyReveal index={1}>
        <section
          className="flex min-h-screen w-full items-center justify-center px-6 py-20"
          style={{
            background: "linear-gradient(to bottom, #F5F5DC, #efe3c2)"
          }}
        >
          <div className="flex max-w-xl flex-col items-center text-center">

            {/* ASPAS DECORATIVA */}
            <span
              className="mb-2 select-none font-serif text-6xl leading-none md:text-7xl"
              style={{ color: "rgba(139,69,19,0.2)" }}
            >
              "
            </span>

            {/* TEXTO */}
            <p
              className="font-serif text-lg leading-[1.9] md:text-2xl"
              style={{ color: "#5a3b1a" }}
            >
              Foi nos detalhes mais simples que construímos o nosso maior amor.
              Cada pequena escolha nos guiou até o altar.
            </p>

            {/* LINHA + ÍCONE */}
            <div className="mt-8 flex items-center gap-4">
              <div className="h-[1px] w-8 md:w-10" style={{ background: "#D8B56A" }} />

              <Heart
                className="h-3.5 w-3.5"
                style={{ fill: "#D8B56A", color: "#D8B56A" }}
              />

              <div className="h-[1px] w-8 md:w-10" style={{ background: "#D8B56A" }} />
            </div>

            {/* NOME DO CASAL */}
            <p
              className="mt-3 text-[10px] font-medium uppercase tracking-[0.3em]"
              style={{ color: "#8B4513" }}
            >
              Luís e Vitória
            </p>

          </div>
        </section>
      </StickyReveal>

      {/* CONVITE */}
      <StickyReveal index={4}>
        <section className="relative flex h-screen w-full overflow-hidden">

          <div className="flex w-full flex-col md:flex-row">

            {/* IMAGEM */}
            <div className="relative h-[40vh] w-full md:h-full md:w-1/2 bg-[#EAF4FF]">
              <img
                src="img2.jpeg"
                alt="Luís e Vitória"
                className="h-full w-full object-contain"
                style={{ filter: "brightness(0.95) contrast(1.05)" }}
              />
              <div
                className="absolute inset-0 hidden md:block"
                style={{
                  background: "linear-gradient(to right, transparent 60%, rgba(162,207,254,0.6))"
                }}
              />
            </div>

            {/* TEXTO */}
            <div
              className="flex w-full flex-col justify-center px-8 py-10 md:w-1/2 md:px-12"
              style={{ background: "linear-gradient(to bottom, #EAF4FF, #FFFFFF)" }}
            >
              <p
                className="mb-4 text-[10px] font-semibold uppercase tracking-[0.35em]"
                style={{ color: "#4A7AB5" }}
              >
                25 · 07 · 2026 · Araguaína, TO
              </p>

              <h2
                className="mb-4 font-serif text-2xl font-bold md:text-4xl lg:text-5xl"
                style={{ color: "#1B2A41" }}
              >
                Só falta{" "}
                <span style={{ color: "#4A7AB5" }}>o seu sim.</span>
              </h2>

              <p
                className="mb-6 max-w-xs text-sm leading-relaxed"
                style={{ color: "rgba(27,42,65,0.7)" }}
              >
                Cada detalhe foi pensado com cuidado. Cada lugar,
                escolhido com amor. O que ainda falta é você — e sua
                presença vai completar este dia de um jeito que nenhum
                enfeite poderia.
              </p>

              <p
                className="mb-2 text-[11px] font-medium uppercase tracking-widest"
                style={{ color: "rgba(27,42,65,0.45)" }}
              >
                Confirme sua presença até
              </p>

              <p
                className="text-sm font-semibold"
                style={{ color: "#4A7AB5" }}
              >
                15 de junho de 2026
              </p>

              <p
                className="mt-8 font-serif text-base italic"
                style={{ color: "#4A7AB5" }}
              >
                Com amor, Luís &amp; Vitória
              </p>
            </div>

          </div>
        </section>
      </StickyReveal>

    </div >
  )
}
