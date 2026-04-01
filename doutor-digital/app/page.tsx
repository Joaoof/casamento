import Image from "next/image"
import { Cover } from "@/components/cover"
import { ContentSection } from "@/components/content-section"
import { CTASection } from "@/components/cta-section"

export default function Home() {
  return (
    <main className="min-h-screen bg-[#040d18] text-white selection:bg-[#1088f5]/30">
      <Cover />

      <div className="max-w-[900px] mx-auto px-5 py-10 flex flex-col gap-12">

        {/* Seção 02: A Base */}
        <ContentSection number="02">
          <h2 className="text-3xl font-bold text-white uppercase tracking-tight mb-4">
            Antes de Escalar,<br /> <span className="text-[#1088f5]">É Preciso Enxergar</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
            {[
              { icon: "⚙️", title: "Operação", desc: "Estrutura e eficiência interna" },
              { icon: "💬", title: "Atendimento", desc: "Retenção e experiência do paciente" },
              { icon: "📈", title: "Marketing", desc: "Aquisição e posicionamento" }
            ].map((item, i) => (
              <div key={i} className="bg-white/5 border border-white/10 hover:bg-white/10 transition-colors p-6 text-center rounded-xl backdrop-blur-sm">
                <div className="text-3xl mb-3">{item.icon}</div>
                <div className="text-sm uppercase tracking-widest text-white/90 font-semibold mb-1">{item.title}</div>
                <div className="text-xs text-white/50">{item.desc}</div>
              </div>
            ))}
          </div>

          <div className="space-y-4 text-white/70 font-light text-[15px] leading-relaxed">
            <p>
              Toda clínica quer crescer. Mas poucas conseguem identificar com precisão onde estão os gargalos que travam a conversão e impedem a previsibilidade. Nosso diagnóstico estratégico mapeia os pilares que sustentam uma clínica de alta performance.
            </p>
            <p>
              Nosso objetivo não é apenas gerar relatórios. É criar clareza absoluta sobre o que já funciona, o que limita seus resultados e o que exige ajuste imediato para transformar potencial bruto em receita líquida.
            </p>
          </div>

          <blockquote className="mt-8 border-l-4 border-[#ffb703] bg-gradient-to-r from-[#ffb703]/10 to-transparent py-4 px-6 rounded-r-lg">
            <p className="italic text-[#ffb703] text-[15px] font-medium">
              "Quem diagnostica com profundidade, cresce com direção."
            </p>
          </blockquote>
        </ContentSection>

        {/* Seção 03: Raio-X */}
        <ContentSection number="03">
          <h2 className="text-3xl font-bold text-white uppercase tracking-tight mb-2">
            Raio-X da Estrutura
          </h2>
          <div className="text-sm text-[#1088f5] uppercase tracking-wider mb-8 font-semibold">
            O desempenho começa na fundação
          </div>

          <p className="text-white/70 font-light leading-relaxed mb-6">
            Analisamos a maturidade da sua operação atual. O tamanho da sua equipe, o tempo de mercado e a capacidade de atendimento da sua unidade determinam o teto do seu faturamento atual. Sem entender sua capacidade instalada, qualquer investimento em marketing vira custo, não lucro.
          </p>
        </ContentSection>

        {/* Seção 04: Financeiro */}
        <ContentSection number="04">
          <h2 className="text-3xl font-bold text-white uppercase tracking-tight mb-2">
            Engrenagem Financeira
          </h2>
          <div className="text-sm text-[#1088f5] uppercase tracking-wider mb-8 font-semibold">
            Capacidade de Monetização
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-[#0d2135]/50 border border-[#1088f5]/20 p-6 rounded-xl">
              <h3 className="text-[#1088f5] font-semibold text-sm uppercase tracking-wider mb-2">Ticket Médio</h3>
              <p className="text-white/60 text-sm">Avaliamos o valor das suas consultas e tratamentos de longo prazo para entender sua margem de lucro real e potencial de LTV (Lifetime Value).</p>
            </div>
            <div className="bg-[#0d2135]/50 border border-[#1088f5]/20 p-6 rounded-xl">
              <h3 className="text-[#1088f5] font-semibold text-sm uppercase tracking-wider mb-2">Volume de Conversão</h3>
              <p className="text-white/60 text-sm">Cruzamos o número de leads mensais com a quantidade de tratamentos fechados para encontrar o seu exato índice de desperdício comercial.</p>
            </div>
          </div>

          <blockquote className="mt-6 border-l-4 border-[#ffb703] bg-gradient-to-r from-[#ffb703]/10 to-transparent py-4 px-6 rounded-r-lg">
            <p className="italic text-[#ffb703] text-[15px] font-medium">
              "A pergunta não é apenas quanto entra. A pergunta é quanto você está deixando na mesa por falha de estrutura."
            </p>
          </blockquote>
        </ContentSection>

        {/* Seção 05 & 06: Marketing e Vendas unificados para fluidez de leitura */}
        <ContentSection number="05">
          <h2 className="text-3xl font-bold text-white uppercase tracking-tight mb-2">
            Máquina de Aquisição e Vendas
          </h2>
          <div className="text-sm text-[#1088f5] uppercase tracking-wider mb-8 font-semibold">
            Marketing Atraente, Operação Que Converte
          </div>

          <div className="space-y-6 text-white/70 font-light text-[15px] leading-relaxed">
            <p>
              Ter presença no Instagram ou campanhas no Google Ads não é diferencial, é obrigação. O que separa clínicas comuns de negócios de alta performance é a capacidade de unificar os canais de tráfego com uma operação comercial implacável.
            </p>
            <ul className="grid gap-3 mt-4">
              <li className="flex items-start gap-3 bg-white/5 p-4 rounded-lg border border-white/5">
                <span className="text-[#1088f5] mt-0.5">✔</span>
                <span><strong>CRM e Processos:</strong> Avaliamos como o lead é tratado desde o primeiro "Olá" no WhatsApp até o comparecimento na clínica.</span>
              </li>
              <li className="flex items-start gap-3 bg-white/5 p-4 rounded-lg border border-white/5">
                <span className="text-[#1088f5] mt-0.5">✔</span>
                <span><strong>Omnichannel Estratégico:</strong> Identificamos se seus canais (Google, Meta, TikTok) estão competindo entre si ou criando um ecossistema de autoridade.</span>
              </li>
            </ul>
          </div>
        </ContentSection>

        {/* Seção 07: Gargalos */}
        <ContentSection number="06">
          <h2 className="text-3xl font-bold text-white uppercase tracking-tight mb-2">
            Mapeamento de Riscos e Oportunidades
          </h2>
          <div className="text-sm text-red-400 uppercase tracking-wider mb-8 font-semibold">
            Identificando os ralos invisíveis de receita
          </div>

          <div className="bg-black/30 border border-white/5 p-8 rounded-xl backdrop-blur-sm">
            <ul className="space-y-4">
              {[
                "Onde a clínica está perdendo eficiência operacional",
                "Quais pontos de atrito estão travando a conversão de pacientes",
                "Onde há perda de receita invisível no dia a dia",
                "Quais alavancas podem acelerar o crescimento nos próximos 12 meses",
                "O que precisa ser estruturado hoje para garantir previsibilidade amanhã"
              ].map((text, i) => (
                <li key={i} className="flex items-center text-[15px] text-white/90 font-light">
                  <span className="text-[#ffb703] mr-4 text-xl">➜</span>
                  {text}
                </li>
              ))}
            </ul>
          </div>

          <blockquote className="mt-8 border-l-4 border-[#ffb703] bg-gradient-to-r from-[#ffb703]/10 to-transparent py-4 px-6 rounded-r-lg">
            <p className="italic text-[#ffb703] text-[15px] font-medium">
              "Toda clínica cresce até o limite da sua estrutura. Depois disso, ou você profissionaliza… ou estagna."
            </p>
          </blockquote>
        </ContentSection>

      </div>

      <CTASection />
    </main>
  )
}