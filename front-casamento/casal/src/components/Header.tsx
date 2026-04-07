import { Heart, Menu, X, Clock, MapPin, GlassWater, Music, LogIn, CheckCircle, Settings } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import LoginModal from "./LoginModal";

type HeaderProps = {
  coupleNames?: string;
  weddingDate?: string;
  weddingDateISO?: string;
};

type TimeLeft = {
  dias: number;
  horas: number;
  minutos: number;
  segundos: number;
};

const NAV_ITEMS = [
  { label: "Início", href: "#inicio" },
  { label: "Nossa História", href: "#nossa-historia" },
  { label: "O Evento", href: "#o-evento" },
  { label: "Lista de Presentes", href: "#lista-presentes" },
];

function CircleProgress({ percentage, color, value, label }: {
  percentage: number; color: string; value: number; label: string;
}) {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const clampedPercentage = Math.min(Math.max(percentage, 0), 1);
  const strokeDashoffset = circumference - clampedPercentage * circumference;
  const rotation = clampedPercentage * 360;

  return (
    <div className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-40 md:h-40 flex flex-col items-center justify-center bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-blue-100">
      <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={radius} stroke="#dbeafe" strokeWidth="4" fill="none" />
        <circle cx="60" cy="60" r={radius} stroke={color} strokeWidth="4" fill="none"
          strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round"
          className="transition-all duration-1000 ease-linear"
        />
        <g style={{ transform: `rotate(${rotation}deg)`, transformOrigin: '60px 60px' }}
          className="transition-all duration-1000 ease-linear">
          <circle cx="110" cy="60" r="4" fill={color} />
          <circle cx="110" cy="60" r="8" fill={color} opacity="0.25" />
        </g>
      </svg>
      <div className="relative z-10 flex flex-col items-center">
        <span className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#1B3A6B] tracking-wider tabular-nums font-['Poppins',_sans-serif]">
          {value.toString().padStart(2, "0")}
        </span>
        <span className="text-[8px] sm:text-[9px] md:text-[10px] tracking-[0.2em] text-[#4A7AB5] mt-0.5 sm:mt-1 uppercase font-bold font-['Lato',_sans-serif]">
          {label}
        </span>
      </div>
    </div>
  );
}

export default function Header({
  coupleNames = "Luis & Vitória",
  weddingDate = "05/09/2026",
  weddingDateISO = "2026-09-05T16:30:00-03:00", 
}: HeaderProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ dias: 0, horas: 0, minutos: 0, segundos: 0 });
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isAccessModalOpen, setIsAccessModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [confirmState, setConfirmState] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleMobileNavClick = (href: string) => {
    setIsMobileOpen(false);
    const id = href.replace('#', '');
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.replaceState(null, '', href);
      return;
    }
    window.location.hash = href;
  };

  function handleConfirmarPresenca() {
    setIsAccessModalOpen(false);
    setConfirmState('loading');
    setTimeout(() => setConfirmState('success'), 2500);
    setTimeout(() => {
      setConfirmState('idle');
      // TODO: redirecionar para o formulário
    }, 4000);
  }

  useEffect(() => {
    const targetDate = new Date(weddingDateISO).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          dias: Math.floor(difference / (1000 * 60 * 60 * 24)),
          horas: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutos: Math.floor((difference / 1000 / 60) % 60),
          segundos: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ dias: 0, horas: 0, minutos: 0, segundos: 0 });
        clearInterval(interval);
      }
    };

    updateTimer(); 
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [weddingDateISO]);

  useEffect(() => {
    const anyOpen = isScheduleModalOpen || isAccessModalOpen || isLoginModalOpen;
    document.body.style.overflow = anyOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isScheduleModalOpen, isAccessModalOpen, isLoginModalOpen]);

  const cronogramaEventos = useMemo(() => [
    { time: "16:30", title: "Cerimônia Religiosa", desc: "A troca de alianças e votos na igreja.", icon: Heart },
    { time: "18:00", title: "Recepção", desc: "Brindes de boas-vindas aos convidados.", icon: GlassWater },
    { time: "19:30", title: "Jantar Principal", desc: "Momento para compartilhar uma deliciosa refeição.", icon: MapPin },
    { time: "21:00", title: "Festa", desc: "Abertura da pista de dança para celebrarmos juntos.", icon: Music },
  ], []);

  return (
    <div id="inicio" className="min-h-screen bg-[#4A7AB5] text-slate-800 flex flex-col font-['Open_Sans',_sans-serif]">
      <style>{`
        /* Importando Lato, Open Sans, Poppins e Teko */
        @import url('https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700;900&family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Poppins:wght@300;400;500;600;700&family=Teko:wght@300..700&display=swap');
        
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to   { transform: rotate(0deg); }
        }
        @keyframes progress-fill {
          from { width: 0%; }
          to   { width: 100%; }
        }
        @keyframes draw-check {
          from { stroke-dashoffset: 40; opacity: 0; }
          to   { stroke-dashoffset: 0; opacity: 1; }
        }
      `}</style>

      {/* BOTÃO FLUTUANTE */}
      <button
        onClick={() => setIsLoginModalOpen(true)}
        title="Área do Casal"
        className="fixed bottom-5 right-5 z-40 w-11 h-11 rounded-full flex items-center justify-center group"
      >
        <span className="absolute inline-flex w-full h-full rounded-full bg-[#4A7AB5] opacity-30 animate-ping" />
        <span className="absolute inline-flex w-9 h-9 rounded-full bg-[#4A7AB5] opacity-20 animate-pulse" />
        <span className="relative z-10 w-10 h-10 rounded-full bg-gradient-to-br from-[#1B3A6B] to-[#4A7AB5] flex items-center justify-center shadow-[0_0_12px_3px_rgba(74,122,181,0.6)] border border-[#7AAFD4]/50 group-hover:shadow-[0_0_20px_6px_rgba(74,122,181,0.8)] group-hover:scale-110 transition-all duration-300">
          <Settings className="w-4 h-4 text-white group-hover:rotate-90 transition-transform duration-500" />
        </span>
      </button>

      {/* OVERLAY DE CONFIRMAÇÃO */}
      {(confirmState === 'loading' || confirmState === 'success') && (
        <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#1B3A6B]/80 backdrop-blur-md">
          <div className={`flex flex-col items-center justify-center gap-6 p-10 rounded-3xl bg-white shadow-2xl w-[280px] transition-all duration-500 ${confirmState === 'success' ? 'scale-105' : 'scale-100'}`}>

            {confirmState === 'loading' && (
              <>
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <img src="https://cdn-icons-png.flaticon.com/512/8296/8296621.png" alt="" />
                </div>
                <div className="text-center">
                  <p className="text-[#1B3A6B] font-semibold text-xl leading-snug font-['Poppins',_sans-serif]">
                    Espera só um momento
                  </p>
                  <p className="text-[#4A7AB5] text-xs mt-1 animate-pulse font-['Open_Sans',_sans-serif]">
                    Preparando sua confirmação...
                  </p>
                </div>
                <div className="w-full h-1.5 bg-blue-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#4A7AB5] to-[#1B3A6B] rounded-full"
                    style={{ animation: 'progress-fill 2.5s ease-in-out forwards' }} />
                </div>
              </>
            )}

            {confirmState === 'success' && (
              <>
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <span className="absolute inline-flex w-full h-full rounded-full bg-green-400 opacity-20 animate-ping" />
                  <div className="w-24 h-24 rounded-full bg-green-50 border-4 border-green-400 flex items-center justify-center shadow-lg">
                    <svg className="w-12 h-12 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="4,13 9,18 20,7" strokeLinecap="round" strokeLinejoin="round"
                        style={{ strokeDasharray: 40, strokeDashoffset: 40, animation: 'draw-check 0.5s ease-out forwards' }} />
                    </svg>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-green-600 font-bold text-2xl font-['Poppins',_sans-serif]">
                    Presença Confirmada!
                  </p>
                  <p className="text-slate-400 text-xs mt-1 font-['Open_Sans',_sans-serif]">Que alegria! Te esperamos lá!</p>
                </div>
              </>
            )}

          </div>
        </div>
      )}

      {/* MODAL: CRONOGRAMA */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-[#1B3A6B]/60 backdrop-blur-sm" onClick={() => setIsScheduleModalOpen(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-blue-50 border-b border-blue-100 px-6 py-5 flex items-center justify-between sticky top-0 z-10">
              <h3 className="text-xl text-[#1B3A6B] flex items-center gap-2 font-semibold font-['Poppins',_sans-serif]">
                <Clock className="w-5 h-5 text-[#4A7AB5]" />
                Cronograma do Dia
              </h3>
              <button onClick={() => setIsScheduleModalOpen(false)}
                className="text-slate-400 hover:text-[#1B3A6B] transition p-1 rounded-full hover:bg-blue-50">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 md:p-8 overflow-y-auto">
              <div className="relative border-l-2 border-blue-100 ml-4 space-y-8">
                {cronogramaEventos.map((evento, index) => {
                  const Icon = evento.icon;
                  return (
                    <div key={index} className="relative pl-8 md:pl-10">
                      <div className="absolute -left-[15px] top-0 bg-white border-2 border-[#4A7AB5] w-8 h-8 rounded-full flex items-center justify-center shadow-sm">
                        <Icon className="w-4 h-4 text-[#4A7AB5]" />
                      </div>
                      <div className="flex flex-col gap-1 items-start pt-1">
                        <span className="text-[#4A7AB5] font-bold text-sm tracking-widest leading-none font-['Lato',_sans-serif]">{evento.time}</span>
                        <h4 className="text-lg font-semibold text-[#1B3A6B] leading-tight mt-1 font-['Poppins',_sans-serif]">{evento.title}</h4>
                        <p className="text-slate-500 text-sm leading-relaxed font-['Open_Sans',_sans-serif]">{evento.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="bg-blue-50 border-t border-blue-100 px-6 py-4 flex justify-end">
              <button onClick={() => setIsScheduleModalOpen(false)}
                className="bg-[#1B3A6B] text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-[#14305a] transition font-['Poppins',_sans-serif]">
                Entendi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ACESSO */}
      {isAccessModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-[#1B3A6B]/60 backdrop-blur-sm"
            onClick={() => setIsAccessModalOpen(false)} />
          <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-br from-[#1B3A6B] to-[#4A7AB5] px-6 pt-8 pb-10 text-center relative">
              <button onClick={() => setIsAccessModalOpen(false)}
                className="absolute top-4 right-4 text-white/70 hover:text-white transition p-1 rounded-full hover:bg-white/10">
                <X className="w-5 h-5" />
              </button>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 border-2 border-white/30">
                <Heart className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-serif text-white mb-1">{coupleNames}</h3>
              <p className="text-white/70 text-xs tracking-widest uppercase font-['Lato',_sans-serif]">{weddingDate}</p>
            </div>
            <div className="h-4 bg-white relative -mt-4 rounded-t-[2rem]" />
            <div className="px-6 pb-8 -mt-1 flex flex-col gap-4">
              <p className="text-center text-slate-500 text-sm mb-2 font-['Open_Sans',_sans-serif]">O que você deseja fazer?</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-blue-100" />
                <span className="text-xs text-slate-400 uppercase tracking-widest font-['Lato',_sans-serif]">ou</span>
                <div className="flex-1 h-px bg-blue-100" />
              </div>

              <button
                onClick={() => { setIsAccessModalOpen(false); setIsLoginModalOpen(true); }}
                className="group w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-[#C8DCF0] hover:border-[#1B3A6B] hover:bg-[#f0f6ff] transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-[#f0f6ff] group-hover:bg-[#1B3A6B] flex items-center justify-center transition-colors shrink-0">
                  <LogIn className="w-6 h-6 text-[#1B3A6B] group-hover:text-white transition-colors" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-[#1B3A6B] text-sm font-['Poppins',_sans-serif]">Área do Casal</p>
                  <p className="text-slate-400 text-xs mt-0.5 font-['Open_Sans',_sans-serif]">Acesso exclusivo para {coupleNames}</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />

      {/* CONTAINER HERO */}
      <div className="w-full flex flex-col min-h-screen relative">
        <div className="absolute inset-0 z-0 overflow-hidden bg-[#1B3A6B]">
          <picture>
            {/* 1. Imagem para Mobile (Telas até 767px). Use uma foto VERTICAL (ex: 1080x1920) */}
            <source media="(max-width: 767px)" srcSet="/img2.jpeg" />
            
            {/* 2. Imagem para Desktop (Telas maiores). Use a foto HORIZONTAL (ex: 1920x1080) */}
            <source media="(min-width: 768px)" srcSet="/img2.jpeg" />
            
            {/* 3. Fallback */}
            <img 
              src="/img2.jpeg" 
              alt="Fotografia de Luis e Vitória"
              className="w-full h-full object-cover object-center"
              fetchPriority="high" 
              decoding="sync"
            />
          </picture>
          <div className="absolute inset-0 bg-black/20 bg-gradient-to-b from-transparent to-black/50 backdrop-blur-[1px]" />
        </div>

        {/* NAVBAR */}
        <header className="relative md:sticky md:top-0 z-50 w-full bg-transparent">
          <div className="mx-auto max-w-[1100px] flex items-center justify-between px-6 py-4">
            <img src="https://cdn-icons-png.flaticon.com/512/185/185482.png" alt="Logo" width={40} className="brightness-0 invert" />

            <nav className="hidden lg:flex items-center gap-8 text-sm text-white font-medium drop-shadow-md">
              {NAV_ITEMS.map((item) => (
                <a key={item.label} href={item.href} className="hover:text-blue-200 transition font-['Poppins',_sans-serif]">
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="hidden lg:flex items-center gap-2 px-6 py-2.5 rounded-full transition shadow-sm backdrop-blur-md"
                style={{
                  background: "rgba(162, 207, 254, 0.25)",
                  border: "1px solid rgba(162, 207, 254, 0.4)",
                  color: "#1B2A41"
                }}
              >
                <CheckCircle className="w-4 h-4 shrink-0 opacity-80" />
                <span className="text-lg tracking-wide leading-none font-['Poppins',_sans-serif] font-medium text-white">
                  Área do Casal
                </span>
              </button>

              <button className="lg:hidden text-white" onClick={() => setIsMobileOpen(!isMobileOpen)}>
                {isMobileOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>

          {isMobileOpen && (
            <div className="lg:hidden bg-white/95 backdrop-blur absolute w-full left-0 top-full">
              <div className="flex flex-col gap-3 px-6 py-6 text-sm text-[#1B3A6B]">
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => handleMobileNavClick(item.href)}
                    className="text-left font-medium hover:text-[#4A7AB5] transition font-['Poppins',_sans-serif]"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </header>

        {/* HERO */}
        <section className="relative z-10 flex-grow flex flex-col justify-center items-center md:px-6 md:py-16">
          <div className="mx-auto max-w-[1100px] w-full">
            <div className="w-full flex flex-col items-center justify-center text-center text-white px-6 py-16">
              <span className="text-xs tracking-[0.3em] uppercase text-blue-200 mb-4 drop-shadow-md font-['Lato',_sans-serif] font-bold">
                Reserve a data
              </span>
              
              {/* TÍTULO PRINCIPAL (Mantido como font-serif) */}
              <h1 className="text-3xl md:text-6xl font-serif mb-6 drop-shadow-lg text-white">
                {coupleNames}
              </h1>
              
              <p className="text-xs md:text-xl text-white mb-8 drop-shadow-lg font-medium tracking-wide font-['Poppins',_sans-serif]">
                {weddingDate}
              </p>
              
              <button
                onClick={() => setIsScheduleModalOpen(true)}
                className="bg-[#1B3A6B] backdrop-blur-sm border border-white/40 text-white px-8 py-4 md:py-3 rounded-full text-sm hover:bg-[#14305a] transition shadow-lg w-full max-w-xs md:w-auto flex items-center justify-center gap-2 mx-auto font-['Poppins',_sans-serif] font-medium"
              >
                <Clock className="w-4 h-4" />
                Ver cronograma do casamento
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* COUNTDOWN */}
      <section className="py-20 md:py-24 bg-[#F5F5DC] border-t border-[#D8B56A]">
        <div className="mx-auto max-w-[900px] text-center px-6 relative">
          
          {/* TÍTULO PRINCIPAL SECUNDÁRIO (Mantido como font-serif) */}
          <h2 className="text-3xl md:text-4xl font-serif mb-4 text-[#8B4513]">
            O grande dia está chegando
          </h2>
          
          <p className="text-[#8B4513]/70 mb-12 md:mb-16 text-xs md:text-sm font-bold uppercase tracking-[0.1em] md:tracking-[0.2em] font-['Lato',_sans-serif]">
            Cada segundo nos aproxima desse momento especial
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center relative z-10 max-w-sm lg:max-w-none mx-auto">
            {[
              { label: "Dias", value: timeLeft.dias, percentage: timeLeft.dias / 365, color: "#8B4513" },
              { label: "Horas", value: timeLeft.horas, percentage: timeLeft.horas / 24, color: "#A0522D" },
              { label: "Minutos", value: timeLeft.minutos, percentage: timeLeft.minutos / 60, color: "#D8B56A" },
              { label: "Segundos", value: timeLeft.segundos, percentage: timeLeft.segundos / 60, color: "#000000" },
            ].map((item) => (
              <CircleProgress key={item.label} {...item} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}