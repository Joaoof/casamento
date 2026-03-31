import Image from "next/image"

export function Cover() {
  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-[#040d18] via-[#071824] to-[#0a2236] overflow-hidden">
      {/* Textura hexagonal */}
      <div 
        className="absolute inset-0 opacity-100"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l25.98 15v30L30 60 4.02 45V15z' fill-opacity='0.04' fill='%231088F5' fill-rule='evenodd'/%3E%3C/svg%3E")`
        }}
      />
      
      {/* Linha animada no topo */}
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#1088f5] via-[#ffb703] to-[#1088f5]" />
      
      {/* Foto de fundo - lado direito */}
      <div className="absolute right-0 top-0 w-[50%] md:w-[42%] h-full">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-03-30%20at%2019.47.44%20%282%29-4lFCvXckaCHJt6otgBqZ463kEpGYHD.jpeg"
          alt="Doutor Digital"
          fill
          className="object-cover object-top"
          priority
        />
        {/* Overlay gradiente sobre a foto */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#040d18] via-transparent to-transparent" />
      </div>
      
      {/* Cantos decorativos */}
      <div className="absolute top-[18px] left-[18px] w-[28px] h-[28px] border-t-[3px] border-l-[3px] border-[#ffb703]" />
      <div className="absolute top-[18px] right-[18px] w-[28px] h-[28px] border-t-[3px] border-r-[3px] border-[#1088f5]" />
      <div className="absolute bottom-[18px] left-[18px] w-[28px] h-[28px] border-b-[3px] border-l-[3px] border-[#1088f5]" />
      <div className="absolute bottom-[18px] right-[18px] w-[28px] h-[28px] border-b-[3px] border-r-[3px] border-[#ffb703]" />
      
      {/* Badge 2025 */}
      <div className="absolute top-[22px] right-[60px] bg-[#1088f5]/[0.12] border border-[#1088f5]/50 text-[#1088f5] py-1 px-3 rounded text-xs font-bold tracking-widest">
        2025
      </div>
      
      {/* Conteúdo esquerdo */}
      <div className="relative z-10 w-full md:w-[58%] min-h-screen flex flex-col justify-center py-[52px] px-6 md:px-[60px]">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-03-30%20at%2019.33.25%20%281%29-xEO3JHwyGWAdUB4Ph7LjpoNKfYL5De.jpeg"
          alt="Doutor Digital Logo"
          width={200}
          height={56}
          className="mb-7 object-contain"
          style={{ width: "auto", height: "56px" }}
          priority
        />
        
        <div className="inline-block text-[10px] text-[#ffb703] border border-[#ffb703] bg-[#ffb703]/[0.08] py-[5px] px-[14px] rounded-full tracking-widest uppercase mb-[22px] font-semibold w-fit">
          Documento Estratégico Confidencial
        </div>
        
        <h1 className="text-5xl md:text-[64px] font-black leading-[0.9] tracking-tighter text-white mb-1">
          DIAGNÓSTICO
        </h1>
        <div className="relative inline-block mb-[22px]">
          <h1 className="text-5xl md:text-[64px] font-black leading-none tracking-tighter text-white">
            ESTRATÉGICO
          </h1>
          <div className="absolute bottom-[6px] left-0 w-full h-1 bg-[#ffb703]" />
        </div>
        
        <div className="text-base text-[#ffb703] uppercase tracking-[4px] font-semibold mb-[22px]">
          Clínica de Alta Performance
        </div>
        
        <div className="w-[70px] h-[3px] bg-gradient-to-r from-[#1088f5] to-[#ffb703] mb-[22px] rounded-sm" />
        
        <p className="text-sm leading-relaxed text-white/75 max-w-[360px] font-light pl-4 border-l-2 border-white/20 mb-auto">
          Uma leitura executiva da operação, da conversão e das oportunidades reais de crescimento.
        </p>
        
        <div className="text-[11px] tracking-widest text-white/35 uppercase mt-5">
          Desenvolvido por Doutor Digital
        </div>
      </div>
    </div>
  )
}
