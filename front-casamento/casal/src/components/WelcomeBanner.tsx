import React, { useEffect, useState } from 'react'

type WelcomeBannerProps = {
  coupleNames?: string;
  coupleSlug?: string;
}

const WelcomeBanner: React.FC<WelcomeBannerProps> = ({
  coupleNames = 'Luís & Vitória',
  coupleSlug = 'luis-vitoria',
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const welcomeSeenKey = `welcome_seen_${coupleSlug}`

  useEffect(() => {
    if (!sessionStorage.getItem(welcomeSeenKey)) setIsOpen(true)
  }, [welcomeSeenKey])

  const handleClose = () => {
    sessionStorage.setItem(welcomeSeenKey, 'true')
    setIsOpen(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/80 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl border border-[#EAEAEA] bg-white p-8 text-center shadow-[0_20px_50px_rgba(162,207,254,0.22)]">
        <span className="inline-block rounded-full bg-[#A2CFFE]/20 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-black/70">
          Bem-vindo
        </span>
        <h2 className="mt-4 font-serif text-4xl text-black">{coupleNames}</h2>
        <p className="mt-3 text-sm leading-relaxed text-black/65">
          “Dois caminhos que se tornam um.” Obrigado por fazer parte da nossa história.
        </p>
        <button
          onClick={handleClose}
          className="mt-7 w-full rounded-full bg-[#D4AF37] py-3 text-sm font-semibold text-white transition hover:brightness-105"
        >
          Entrar no site
        </button>
      </div>
    </div>
  )
}

export default WelcomeBanner
