import Image from "next/image"
import { Cover } from "@/components/cover"
import { ContentSection } from "@/components/content-section"
import { CTASection } from "@/components/cta-section"

export default function Home() {
  return (
    <main className="min-h-screen bg-[#040d18] text-white">
      <Cover />
      
      <div className="max-w-[900px] mx-auto px-5">
        {/* Seção 02 */}
        <ContentSection number="02">
          <h2 className="text-2xl font-bold text-white uppercase tracking-wide mb-2">
            ANTES DE ESCALAR,<br/>É PRECISO ENXERGAR
          </h2>
          <div className="grid grid-cols-3 gap-4 my-6">
            <div className="bg-white/[0.03] border border-white/[0.06] p-[18px] text-center rounded-lg">
              <div className="text-[22px] mb-2">⚙️</div>
              <div className="text-[11px] uppercase tracking-wider text-white/70">Operação</div>
            </div>
            <div className="bg-white/[0.03] border border-white/[0.06] p-[18px] text-center rounded-lg">
              <div className="text-[22px] mb-2">💬</div>
              <div className="text-[11px] uppercase tracking-wider text-white/70">Atendimento</div>
            </div>
            <div className="bg-white/[0.03] border border-white/[0.06] p-[18px] text-center rounded-lg">
              <div className="text-[22px] mb-2">📈</div>
              <div className="text-[11px] uppercase tracking-wider text-white/70">Marketing</div>
            </div>
          </div>
          <p className="leading-relaxed text-white/80 font-light mb-5 text-sm">
            Toda clínica quer crescer. Mas poucas conseguem identificar com precisão onde estão os gargalos que travam conversão e impedem previsibilidade. Este diagnóstico estratégico foi desenvolvido para mapear os pilares que sustentam uma clínica de alta performance: operação, atendimento, marketing, processo comercial e estrutura de crescimento.
          </p>
          <p className="leading-relaxed text-white/80 font-light mb-5 text-sm">
            Nosso objetivo aqui não é apenas levantar informações. É gerar clareza sobre o que já funciona, sobre o que está limitando resultado e sobre o que precisa ser ajustado para transformar potencial em crescimento real.
          </p>
          <div className="border-l-[3px] border-[#ffb703] py-[14px] px-[18px] italic text-[#ffb703] text-sm mt-5 bg-[#ffb703]/[0.04] rounded-r">
            {'"'}Quem diagnostica com profundidade, cresce com direção.{'"'}
          </div>
        </ContentSection>

        {/* Seção 03 */}
        <ContentSection number="03">
          <h2 className="text-2xl font-bold text-white uppercase tracking-wide mb-2">
            RAIO-X DA CLÍNICA
          </h2>
          <div className="text-xs text-[#1088f5] uppercase tracking-wider mb-7 font-semibold">
            O desempenho de uma clínica começa na estrutura.
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-[11px] uppercase tracking-wider mb-[7px] text-white/55 font-semibold">Unidade / Cidade</label>
              <input type="text" placeholder="Ex: São Paulo - Unidade Jardins" className="w-full bg-[#0d2135] border border-[#1088f5]/30 text-white py-3 px-4 rounded-md text-[13px] outline-none" />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider mb-[7px] text-white/55 font-semibold">Tempo de Operação</label>
              <input type="text" placeholder="Ex: 3 anos" className="w-full bg-[#0d2135] border border-[#1088f5]/30 text-white py-3 px-4 rounded-md text-[13px] outline-none" />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider mb-[7px] text-white/55 font-semibold">Nº de Secretárias</label>
              <input type="number" placeholder="0" className="w-full bg-[#0d2135] border border-[#1088f5]/30 text-white py-3 px-4 rounded-md text-[13px] outline-none" />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider mb-[7px] text-white/55 font-semibold">Nº de Fisioterapeutas</label>
              <input type="number" placeholder="0" className="w-full bg-[#0d2135] border border-[#1088f5]/30 text-white py-3 px-4 rounded-md text-[13px] outline-none" />
            </div>
          </div>
        </ContentSection>

        {/* Seção 04 */}
        <ContentSection number="04">
          <h2 className="text-2xl font-bold text-white uppercase tracking-wide mb-2">
            MODELO FINANCEIRO E CAPACIDADE DE MONETIZAÇÃO
          </h2>
          <div className="text-xs text-[#1088f5] uppercase tracking-wider mb-7 font-semibold">
            Análise de Potencial e Receita
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-[11px] uppercase tracking-wider mb-[7px] text-white/55 font-semibold">Valor da Consulta</label>
              <div className="relative">
                <span className="absolute left-[13px] top-1/2 -translate-y-1/2 text-[#ffb703] font-bold text-[13px]">R$</span>
                <input type="number" placeholder="0,00" className="w-full bg-[#0d2135] border border-[#1088f5]/30 text-white py-3 pl-9 pr-4 rounded-md text-[13px] outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider mb-[7px] text-white/55 font-semibold">Valor do Tratamento Longo</label>
              <div className="relative">
                <span className="absolute left-[13px] top-1/2 -translate-y-1/2 text-[#ffb703] font-bold text-[13px]">R$</span>
                <input type="number" placeholder="0,00" className="w-full bg-[#0d2135] border border-[#1088f5]/30 text-white py-3 pl-9 pr-4 rounded-md text-[13px] outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider mb-[7px] text-white/55 font-semibold">Consultas Mensais (Média)</label>
              <input type="number" placeholder="Ex: 80" className="w-full bg-[#0d2135] border border-[#1088f5]/30 text-white py-3 px-4 rounded-md text-[13px] outline-none" />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider mb-[7px] text-white/55 font-semibold">Tratamentos Fechados/Mês</label>
              <input type="number" placeholder="Ex: 15" className="w-full bg-[#0d2135] border border-[#1088f5]/30 text-white py-3 px-4 rounded-md text-[13px] outline-none" />
            </div>
            <div className="col-span-2">
              <label className="block text-[11px] uppercase tracking-wider mb-[7px] text-white/55 font-semibold">Leads Mensais (Aproximado)</label>
              <input type="number" placeholder="Ex: 300" className="w-full bg-[#0d2135] border border-[#1088f5]/30 text-white py-3 px-4 rounded-md text-[13px] outline-none" />
            </div>
          </div>
          <div className="border-l-[3px] border-[#ffb703] py-[14px] px-[18px] italic text-[#ffb703] text-sm mt-5 bg-[#ffb703]/[0.04] rounded-r">
            {'"'}A pergunta não é apenas quanto entra. A pergunta é quanto está deixando de entrar por falha de estrutura.{'"'}
          </div>
        </ContentSection>

        {/* Seção 05 */}
        <ContentSection number="05">
          <h2 className="text-2xl font-bold text-white uppercase tracking-wide mb-2">
            MARKETING, AQUISIÇÃO E POSICIONAMENTO
          </h2>
          <div className="grid gap-5">
            <div>
              <label className="block text-[11px] uppercase tracking-wider mb-[7px] text-white/55 font-semibold">Investimento Mensal em Tráfego</label>
              <div className="relative">
                <span className="absolute left-[13px] top-1/2 -translate-y-1/2 text-[#ffb703] font-bold text-[13px]">R$</span>
                <input type="number" placeholder="0,00" className="w-full bg-[#0d2135] border border-[#1088f5]/30 text-white py-3 pl-9 pr-4 rounded-md text-[13px] outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider mb-[7px] text-white/55 font-semibold">Canais Utilizados Atualmente</label>
              <div className="flex flex-wrap gap-2 mt-1">
                <div className="bg-white/5 border border-white/[0.12] py-[7px] px-[14px] rounded-full text-[11px] cursor-pointer hover:bg-white/10 transition-colors">Instagram</div>
                <div className="bg-white/5 border border-white/[0.12] py-[7px] px-[14px] rounded-full text-[11px] cursor-pointer hover:bg-white/10 transition-colors">Facebook</div>
                <div className="bg-white/5 border border-white/[0.12] py-[7px] px-[14px] rounded-full text-[11px] cursor-pointer hover:bg-white/10 transition-colors">Google Ads</div>
                <div className="bg-white/5 border border-white/[0.12] py-[7px] px-[14px] rounded-full text-[11px] cursor-pointer hover:bg-white/10 transition-colors">TikTok</div>
                <div className="bg-white/5 border border-white/[0.12] py-[7px] px-[14px] rounded-full text-[11px] cursor-pointer hover:bg-white/10 transition-colors">YouTube</div>
                <div className="bg-white/5 border border-white/[0.12] py-[7px] px-[14px] rounded-full text-[11px] cursor-pointer hover:bg-white/10 transition-colors">WhatsApp Mkt</div>
              </div>
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider mb-[7px] text-white/55 font-semibold">Google Ativo?</label>
              <div className="flex flex-wrap gap-2 mt-1">
                <div className="bg-white/5 border border-white/[0.12] py-[7px] px-[14px] rounded-full text-[11px] cursor-pointer hover:bg-white/10 transition-colors">SIM, ATIVO</div>
                <div className="bg-white/5 border border-white/[0.12] py-[7px] px-[14px] rounded-full text-[11px] cursor-pointer hover:bg-white/10 transition-colors">NÃO / PARADO</div>
              </div>
            </div>
          </div>
          <div className="border-l-[3px] border-[#ffb703] py-[14px] px-[18px] italic text-[#ffb703] text-sm mt-5 bg-[#ffb703]/[0.04] rounded-r">
            {'"'}Marketing sem direção gera esforço. Marketing com estratégia gera escala.{'"'}
          </div>
        </ContentSection>

        {/* Seção 06 */}
        <ContentSection number="06">
          <h2 className="text-2xl font-bold text-white uppercase tracking-wide mb-2">
            OPERAÇÃO COMERCIAL E JORNADA DE CONVERSÃO
          </h2>
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-[11px] uppercase tracking-wider mb-[7px] text-white/55 font-semibold">Usa API oficial do WhatsApp?</label>
              <div className="flex flex-wrap gap-2 mt-1">
                <div className="bg-white/5 border border-white/[0.12] py-[7px] px-[14px] rounded-full text-[11px] cursor-pointer hover:bg-white/10 transition-colors">Sim</div>
                <div className="bg-white/5 border border-white/[0.12] py-[7px] px-[14px] rounded-full text-[11px] cursor-pointer hover:bg-white/10 transition-colors">Não</div>
                <div className="bg-white/5 border border-white/[0.12] py-[7px] px-[14px] rounded-full text-[11px] cursor-pointer hover:bg-white/10 transition-colors">Implantando</div>
              </div>
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider mb-[7px] text-white/55 font-semibold">Usa CRM de Vendas?</label>
              <div className="flex flex-wrap gap-2 mt-1">
                <div className="bg-white/5 border border-white/[0.12] py-[7px] px-[14px] rounded-full text-[11px] cursor-pointer hover:bg-white/10 transition-colors">Sim</div>
                <div className="bg-white/5 border border-white/[0.12] py-[7px] px-[14px] rounded-full text-[11px] cursor-pointer hover:bg-white/10 transition-colors">Não</div>
                <div className="bg-white/5 border border-white/[0.12] py-[7px] px-[14px] rounded-full text-[11px] cursor-pointer hover:bg-white/10 transition-colors">Planilha</div>
              </div>
            </div>
            <div className="col-span-2">
              <label className="block text-[11px] uppercase tracking-wider mb-[7px] text-white/55 font-semibold">Descreva brevemente seu processo de atendimento atual:</label>
              <textarea rows={4} placeholder="Ex: O lead chega, a secretária aborda..." className="w-full bg-[#0d2135] border border-[#1088f5]/30 text-white py-3 px-4 rounded-md text-[13px] outline-none resize-none" />
            </div>
          </div>
          <div className="border-l-[3px] border-[#ffb703] py-[14px] px-[18px] italic text-[#ffb703] text-sm mt-5 bg-[#ffb703]/[0.04] rounded-r">
            {'"'}A diferença entre uma clínica comum e uma clínica de alta performance está em converter, confirmar, fechar e fidelizar com consistência.{'"'}
          </div>
        </ContentSection>

        {/* Seção 07 */}
        <ContentSection number="07">
          <h2 className="text-2xl font-bold text-white uppercase tracking-wide mb-2">
            GARGALOS, RISCOS E OPORTUNIDADES
          </h2>
          <div className="grid gap-5">
            <div>
              <label className="block text-[11px] uppercase tracking-wider mb-[7px] text-white/55 font-semibold">Qual a maior dificuldade da clínica hoje?</label>
              <textarea rows={3} placeholder="Digite aqui..." className="w-full bg-[#0d2135] border border-[#1088f5]/30 text-white py-3 px-4 rounded-md text-[13px] outline-none resize-none" />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-wider mb-[7px] text-white/55 font-semibold">Objetivo de Crescimento (12 meses)</label>
              <textarea rows={3} placeholder="Onde você quer chegar?" className="w-full bg-[#0d2135] border border-[#1088f5]/30 text-white py-3 px-4 rounded-md text-[13px] outline-none resize-none" />
            </div>
          </div>
          <ul className="list-none my-[22px] bg-black/20 p-[22px] rounded-lg">
            <li className="mb-[10px] flex items-center text-[13px] text-white/90">
              <span className="text-[#ffb703] mr-[10px]">➜</span>
              Onde a clínica está perdendo eficiência
            </li>
            <li className="mb-[10px] flex items-center text-[13px] text-white/90">
              <span className="text-[#ffb703] mr-[10px]">➜</span>
              Quais pontos estão travando conversão
            </li>
            <li className="mb-[10px] flex items-center text-[13px] text-white/90">
              <span className="text-[#ffb703] mr-[10px]">➜</span>
              Onde há perda de receita invisível
            </li>
            <li className="mb-[10px] flex items-center text-[13px] text-white/90">
              <span className="text-[#ffb703] mr-[10px]">➜</span>
              Quais alavancas podem acelerar o crescimento
            </li>
            <li className="flex items-center text-[13px] text-white/90">
              <span className="text-[#ffb703] mr-[10px]">➜</span>
              O que precisa ser estruturado para ganhar previsibilidade
            </li>
          </ul>
          <div className="border-l-[3px] border-[#ffb703] py-[14px] px-[18px] italic text-[#ffb703] text-sm mt-5 bg-[#ffb703]/[0.04] rounded-r">
            {'"'}Toda clínica cresce até o limite da sua estrutura. Depois disso, ou profissionaliza… ou estagna.{'"'}
          </div>
        </ContentSection>
      </div>

      <CTASection />
    </main>
  )
}
