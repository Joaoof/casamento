import Image from "next/image"
import { DiagnosticoForm } from "./diagnostico-form"

export function CTASection() {
  return (
    <section id="diagnostico" className="text-center py-20 px-5 bg-gradient-to-t from-[#040d18] to-[#071824]">
      <div className="max-w-[900px] mx-auto">
        <h2 className="text-3xl md:text-4xl font-black text-white mb-4 uppercase tracking-tight">
          CRESCIMENTO PREVISÍVEL<br/>NÃO ACONTECE POR ACASO
        </h2>
        
        <div className="flex flex-wrap justify-center gap-3 my-[30px]">
          <div className="bg-white/[0.03] border border-white/[0.08] py-[10px] px-[18px] rounded text-[11px] uppercase tracking-wider text-white/70">
            Estrutura Comercial
          </div>
          <div className="bg-white/[0.03] border border-white/[0.08] py-[10px] px-[18px] rounded text-[11px] uppercase tracking-wider text-white/70">
            Estrutura de Atendimento
          </div>
          <div className="bg-white/[0.03] border border-white/[0.08] py-[10px] px-[18px] rounded text-[11px] uppercase tracking-wider text-white/70">
            Estrutura de Gestão
          </div>
          <div className="bg-white/[0.03] border border-white/[0.08] py-[10px] px-[18px] rounded text-[11px] uppercase tracking-wider text-white/70">
            Estrutura de Crescimento
          </div>
        </div>
        
        <p className="text-base leading-relaxed text-white/75 font-light mx-auto max-w-[600px] mb-[30px]">
          Se a sua clínica já tem potencial, o próximo passo não é trabalhar mais.<br/>
          É enxergar com precisão o que precisa ser ajustado para crescer melhor.
        </p>
        
        {/* Formulário de Diagnóstico */}
        <div className="bg-[#0d2135] border border-[#1088f5]/20 rounded-xl p-6 md:p-8 mt-8 mb-8 text-left">
          <h3 className="text-xl md:text-2xl font-bold text-white text-center mb-6">
            Solicite seu <span className="text-[#ffb703]">Diagnóstico Gratuito</span>
          </h3>
          <DiagnosticoForm />
        </div>
        
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-03-30%20at%2019.33.25%20%281%29-xEO3JHwyGWAdUB4Ph7LjpoNKfYL5De.jpeg"
          alt="Doutor Digital Logo"
          width={150}
          height={36}
          className="mt-[60px] opacity-65 mx-auto"
          style={{ width: "auto", height: "36px" }}
        />
        
        <div className="mt-4 text-[11px] text-white/30">
          © 2025 Doutor Digital. Todos os direitos reservados.
        </div>
      </div>
    </section>
  )
}
