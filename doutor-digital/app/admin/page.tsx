import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"

type Diagnostico = {
  id: string
  created_at: string
  nome_responsavel: string
  email: string
  telefone: string
  nome_clinica: string | null
  unidade_cidade: string | null
  tempo_operacao: string | null
  num_secretarias: number | null
  num_fisioterapeutas: number | null
  valor_consulta: number | null
  valor_tratamento_longo: number | null
  consultas_mensais: number | null
  tratamentos_fechados_mes: number | null
  leads_mensais: number | null
  canais_utilizados: string[] | null
  google_ativo: string | null
  usa_api_whatsapp: string | null
  usa_crm_vendas: string | null
  maior_dificuldade: string | null
  objetivo_crescimento: string | null
  status: "pendente" | "em_analise" | "concluido"
}

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  pendente:   { label: "Pendente",    color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  em_analise: { label: "Em Análise",  color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  concluido:  { label: "Concluído",   color: "bg-green-500/20 text-green-400 border-green-500/30" },
}

function fmt(v: number | null, prefix = "") {
  if (v === null || v === undefined) return "—"
  return `${prefix}${v.toLocaleString("pt-BR")}`
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  })
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ key?: string }>
}) {
  const params = await searchParams
  const secret = process.env.ADMIN_SECRET

  if (!params.key || params.key !== secret) {
    notFound()
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from("diagnosticos")
    .select("*")
    .order("created_at", { ascending: false })

  const rows: Diagnostico[] = (data as Diagnostico[]) ?? []

  const total     = rows.length
  const pendentes = rows.filter((r) => r.status === "pendente").length
  const analise   = rows.filter((r) => r.status === "em_analise").length
  const concluidos = rows.filter((r) => r.status === "concluido").length

  return (
    <main className="min-h-screen bg-[#040d18] text-white p-6 font-sans">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-wide uppercase">
            Painel Admin — Diagnósticos
          </h1>
          <p className="text-white/40 text-sm mt-1">Doutor Digital</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Total",        value: total,     color: "text-white" },
            { label: "Pendentes",    value: pendentes, color: "text-yellow-400" },
            { label: "Em Análise",   value: analise,   color: "text-blue-400" },
            { label: "Concluídos",   value: concluidos, color: "text-green-400" },
          ].map((s) => (
            <div key={s.label} className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-5">
              <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-white/40 uppercase tracking-wider mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg p-4 mb-6">
            Erro ao buscar dados: {error.message}
          </div>
        )}

        {rows.length === 0 ? (
          <div className="text-center text-white/40 py-20">
            Nenhum diagnóstico cadastrado ainda.
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {rows.map((d) => {
              const st = STATUS_LABEL[d.status] ?? STATUS_LABEL.pendente
              return (
                <div
                  key={d.id}
                  className="bg-white/[0.03] border border-white/[0.07] rounded-2xl overflow-hidden"
                >
                  {/* Card header */}
                  <div className="flex flex-wrap items-start justify-between gap-4 px-6 py-5 border-b border-white/[0.07]">
                    <div>
                      <div className="text-lg font-bold">{d.nome_responsavel}</div>
                      <div className="text-[#1088f5] text-sm font-medium mt-0.5">
                        {d.nome_clinica ?? "—"}
                      </div>
                      <div className="flex flex-wrap gap-4 mt-2 text-white/50 text-xs">
                        <span>{d.email}</span>
                        <span>{d.telefone}</span>
                        <span>{fmtDate(d.created_at)}</span>
                      </div>
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${st.color}`}>
                      {st.label}
                    </span>
                  </div>

                  {/* Sections grid */}
                  <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-px bg-white/[0.05]">

                    {/* Raio-X */}
                    <Section title="Raio-X da Clínica">
                      <Field label="Unidade / Cidade"       value={d.unidade_cidade} />
                      <Field label="Tempo de Operação"      value={d.tempo_operacao} />
                      <Field label="Nº de Secretárias"      value={fmt(d.num_secretarias)} />
                      <Field label="Nº de Fisioterapeutas"  value={fmt(d.num_fisioterapeutas)} />
                    </Section>

                    {/* Financeiro */}
                    <Section title="Modelo Financeiro">
                      <Field label="Valor da Consulta"          value={fmt(d.valor_consulta, "R$ ")} />
                      <Field label="Valor Tratamento Longo"      value={fmt(d.valor_tratamento_longo, "R$ ")} />
                      <Field label="Consultas Mensais"          value={fmt(d.consultas_mensais)} />
                      <Field label="Tratamentos Fechados/Mês"   value={fmt(d.tratamentos_fechados_mes)} />
                      <Field label="Leads Mensais"              value={fmt(d.leads_mensais)} />
                    </Section>

                    {/* Marketing */}
                    <Section title="Marketing & Posicionamento">
                      <Field
                        label="Canais Utilizados"
                        value={d.canais_utilizados?.length ? d.canais_utilizados.join(", ") : null}
                      />
                      <Field label="Google Ativo?" value={d.google_ativo} />
                    </Section>

                    {/* Operação */}
                    <Section title="Operação Comercial">
                      <Field label="API Oficial WhatsApp?" value={d.usa_api_whatsapp} />
                      <Field label="Usa CRM de Vendas?"    value={d.usa_crm_vendas} />
                    </Section>

                    {/* Gargalos */}
                    <Section title="Gargalos & Oportunidades" wide>
                      <Field label="Maior Dificuldade"         value={d.maior_dificuldade} multiline />
                      <Field label="Objetivo (12 meses)"       value={d.objetivo_crescimento} multiline />
                    </Section>

                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}

function Section({
  title,
  children,
  wide,
}: {
  title: string
  children: React.ReactNode
  wide?: boolean
}) {
  return (
    <div className={`bg-[#040d18] p-5 ${wide ? "md:col-span-2" : ""}`}>
      <div className="text-[10px] uppercase tracking-widest text-[#1088f5] font-semibold mb-3">
        {title}
      </div>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  )
}

function Field({
  label,
  value,
  multiline,
}: {
  label: string
  value: string | number | null | undefined
  multiline?: boolean
}) {
  const display = value !== null && value !== undefined && value !== "" ? String(value) : "—"
  return (
    <div>
      <div className="text-[10px] text-white/35 uppercase tracking-wider mb-0.5">{label}</div>
      {multiline ? (
        <p className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap">{display}</p>
      ) : (
        <div className="text-sm text-white/80 font-medium">{display}</div>
      )}
    </div>
  )
}
