interface ContentSectionProps {
  number: string
  children: React.ReactNode
}

export function ContentSection({ number, children }: ContentSectionProps) {
  return (
    <section className="py-[50px] border-b border-white/5">
      <div className="bg-[#0d2135]/90 border border-[#1088f5]/[0.18] rounded-[14px] p-10 md:px-[50px] relative overflow-hidden">
        {/* Barra lateral azul */}
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#1088f5] to-transparent" />
        
        {/* Número da seção */}
        <div className="absolute top-6 right-9 text-[44px] font-black text-white/[0.04] leading-none">
          {number}
        </div>
        
        {children}
      </div>
    </section>
  )
}
