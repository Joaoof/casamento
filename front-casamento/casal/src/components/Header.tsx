import { CalendarDays, Heart, LogIn, MapPin, Menu, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import LoginModal from './LoginModal'

type HeaderProps = {
  coupleNames?: string;
  weddingDate?: string;
  weddingDateISO?: string;
}

type TimeLeft = {
  dias: number;
  horas: number;
  minutos: number;
  segundos: number;
}

const NAV_ITEMS = [
  { label: 'Nossa História', href: '#nossa-historia' },
  { label: 'Galeria', href: '#galeria' },
  { label: 'Presentes', href: '#presentes' },
]

export default function Header({
  coupleNames = 'Luís & Vitória',
  weddingDate = '25 de Julho de 2026',
  weddingDateISO = '2026-07-25T18:00:00',
}: HeaderProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ dias: 0, horas: 0, minutos: 0, segundos: 0 })

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date().getTime()
      const targetDate = new Date(weddingDateISO).getTime()
      const difference = Math.max(targetDate - now, 0)

      setTimeLeft({
        dias: Math.floor(difference / (1000 * 60 * 60 * 24)),
        horas: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutos: Math.floor((difference / 1000 / 60) % 60),
        segundos: Math.floor((difference / 1000) % 60),
      })
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [weddingDateISO])

  const countdownItems = useMemo(
    () => [
      { label: 'Dias', value: timeLeft.dias },
      { label: 'Horas', value: timeLeft.horas },
      { label: 'Minutos', value: timeLeft.minutos },
      { label: 'Segundos', value: timeLeft.segundos },
    ],
    [timeLeft],
  )

  return (
    <header className="relative overflow-hidden border-b border-[#EAEAEA] bg-gradient-to-b from-[#A2CFFE]/40 via-white to-white">
      <div className="pointer-events-none absolute -top-20 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[#A2CFFE]/45 blur-3xl" />

      <nav className="relative mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 md:px-8">
        <div className="flex items-center gap-2 text-[#D4AF37]">
          <Heart className="h-4 w-4 fill-current" />
          <span className="font-serif text-sm tracking-[0.28em] text-black/80">CASAMENTO</span>
        </div>

        <div className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item) => (
            <a key={item.label} href={item.href} className="text-sm text-black/70 transition hover:text-black">
              {item.label}
            </a>
          ))}
          <button
            onClick={() => setIsLoginModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-full border border-[#A2CFFE] bg-white px-4 py-2 text-sm text-black transition hover:border-[#D4AF37]"
          >
            <LogIn className="h-4 w-4" />
            Área do casal
          </button>
        </div>

        <button onClick={() => setIsMobileOpen((prev) => !prev)} className="rounded-full border border-[#EAEAEA] p-2 md:hidden">
          {isMobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </nav>

      {isMobileOpen && (
        <div className="relative mx-5 mb-4 rounded-2xl border border-[#EAEAEA] bg-white/95 p-4 shadow-sm md:hidden">
          <div className="space-y-3 text-sm">
            {NAV_ITEMS.map((item) => (
              <a key={item.label} href={item.href} className="block text-black/70" onClick={() => setIsMobileOpen(false)}>
                {item.label}
              </a>
            ))}
            <button onClick={() => setIsLoginModalOpen(true)} className="mt-2 w-full rounded-full border border-[#A2CFFE] py-2 text-black">
              Área do casal
            </button>
          </div>
        </div>
      )}

      <section className="relative mx-auto grid w-full max-w-6xl gap-12 px-5 pb-16 pt-4 md:grid-cols-[1.2fr_1fr] md:px-8 md:pb-20">
        <div className="space-y-6 text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#EAEAEA] bg-white px-4 py-2 text-[11px] uppercase tracking-[0.25em] text-black/70">
            <Heart className="h-3 w-3 fill-[#D4AF37] text-[#D4AF37]" />
            Dois caminhos que se tornam um
          </span>

          <h1 className="font-serif text-5xl leading-tight text-black md:text-6xl">{coupleNames}</h1>

          <p className="max-w-xl text-base leading-relaxed text-black/70">
            Com alegria, convidamos você para celebrar conosco este capítulo especial.
            Um dia leve, elegante e cheio de amor.
          </p>

          <div className="flex flex-wrap gap-3 text-sm">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#EAEAEA]/70 px-4 py-2 text-black/80">
              <CalendarDays className="h-4 w-4 text-[#D4AF37]" />
              {weddingDate}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-[#EAEAEA]/70 px-4 py-2 text-black/80">
              <MapPin className="h-4 w-4 text-[#D4AF37]" />
              Araguaína, TO
            </span>
          </div>
        </div>

        <div className="rounded-3xl border border-[#EAEAEA] bg-white/90 p-6 shadow-[0_18px_50px_rgba(162,207,254,0.24)] backdrop-blur-sm">
          <p className="mb-5 text-center font-serif text-lg text-black">Contagem para o grande dia</p>
          <div className="grid grid-cols-2 gap-3">
            {countdownItems.map((item) => (
              <div key={item.label} className="rounded-2xl border border-[#EAEAEA] bg-[#A2CFFE]/10 px-4 py-4 text-center">
                <p className="font-serif text-3xl text-black">{item.value.toString().padStart(2, '0')}</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-black/60">{item.label}</p>
              </div>
            ))}
          </div>
          <a
            href="/rsvp"
            className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-[#D4AF37] px-4 py-3 text-sm font-semibold text-white transition hover:brightness-105"
          >
            Confirmar presença
          </a>
        </div>
      </section>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </header>
  )
}
