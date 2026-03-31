"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import {
  submitDiagnostico,
  type DiagnosticoFormData,
} from "@/app/actions/diagnostico"
import { CheckCircle2, AlertCircle, ChevronRight, ChevronLeft } from "lucide-react"

// ─── Opções ──────────────────────────────────────────────────────────────────

const tempoOperacaoOptions = [
  { value: "menos_1_ano", label: "Menos de 1 ano" },
  { value: "1_3_anos", label: "1 a 3 anos" },
  { value: "3_5_anos", label: "3 a 5 anos" },
  { value: "5_10_anos", label: "5 a 10 anos" },
  { value: "mais_10_anos", label: "Mais de 10 anos" },
]

const faturamentoOptions = [
  { value: "ate_50k", label: "Até R$ 50.000" },
  { value: "50k_100k", label: "R$ 50.000 – R$ 100.000" },
  { value: "100k_200k", label: "R$ 100.000 – R$ 200.000" },
  { value: "200k_500k", label: "R$ 200.000 – R$ 500.000" },
  { value: "acima_500k", label: "Acima de R$ 500.000" },
]

const canaisOptions = [
  { value: "instagram", label: "Instagram" },
  { value: "google_ads", label: "Google Ads" },
  { value: "facebook", label: "Facebook" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "indicacao", label: "Indicação" },
  { value: "site_organico", label: "Site / SEO" },
  { value: "outro", label: "Outro" },
]

const simNaoOptions = [
  { value: "sim", label: "Sim" },
  { value: "nao", label: "Não" },
]

const desafioOptions = [
  { value: "captacao_pacientes", label: "Captação de novos pacientes" },
  { value: "conversao_leads", label: "Conversão de leads em consultas" },
  { value: "retencao_pacientes", label: "Retenção de pacientes" },
  { value: "gestao_financeira", label: "Gestão financeira" },
  { value: "escalar_operacao", label: "Escalar a operação" },
  { value: "marketing_digital", label: "Marketing digital" },
  { value: "outro", label: "Outro" },
]

const dificuldadeOptions = [
  { value: "falta_pacientes", label: "Falta de pacientes novos" },
  { value: "alta_desistencia", label: "Alta taxa de desistência" },
  { value: "precificacao", label: "Precificação dos serviços" },
  { value: "gestao_equipe", label: "Gestão da equipe" },
  { value: "processos_internos", label: "Processos internos desorganizados" },
  { value: "tecnologia", label: "Falta de tecnologia / automação" },
  { value: "outro", label: "Outro" },
]

const objetivoOptions = [
  { value: "dobrar_faturamento", label: "Dobrar o faturamento" },
  { value: "aumentar_pacientes", label: "Aumentar número de pacientes" },
  { value: "abrir_unidade", label: "Abrir nova unidade" },
  { value: "reduzir_custos", label: "Reduzir custos operacionais" },
  { value: "automatizar_processos", label: "Automatizar processos" },
  { value: "melhorar_retencao", label: "Melhorar retenção de pacientes" },
  { value: "outro", label: "Outro" },
]

// ─── Estilos compartilhados ───────────────────────────────────────────────────

const cx = {
  input: "bg-[#071824] border-[#1088f5]/30 text-white placeholder:text-white/50 focus:border-[#1088f5] focus:ring-[#1088f5]",
  selectTrigger: "bg-[#071824] border-[#1088f5]/30 text-white focus:border-[#1088f5] focus:ring-[#1088f5] [&>span]:text-white/50 [&[data-state=open]>span]:text-white [&>span[data-placeholder]]:text-white/50",
  selectContent: "bg-[#0d2135] border-[#1088f5]/30",
  selectItem: "text-white focus:bg-[#1088f5]/20 focus:text-white",
  label: "text-white/70 text-sm mb-1 block",
}

// ─── Estado inicial ───────────────────────────────────────────────────────────

const initialFormData: DiagnosticoFormData = {
  nome: "",
  email: "",
  telefone: "",
  nome_clinica: "",
  unidade_cidade: "",
  especialidade: "",
  tempo_operacao: "",
  num_secretarias: "",
  num_fisioterapeutas: "",
  consultas_mensais: "",
  tratamentos_fechados_mes: "",
  valor_consulta: "",
  valor_tratamento_longo: "",
  faturamento_mensal: "",
  leads_mensais: "",
  canais_utilizados: [],
  google_ativo: "",
  usa_api_whatsapp: "",
  usa_crm_vendas: "",
  principal_desafio: "",
  maior_dificuldade: "",
  objetivo_crescimento: "",
}

function formatPhone(value: string): string {
  const n = value.replace(/\D/g, "")
  if (n.length <= 2) return n
  if (n.length <= 7) return `(${n.slice(0, 2)}) ${n.slice(2)}`
  if (n.length <= 11) return `(${n.slice(0, 2)}) ${n.slice(2, 7)}-${n.slice(7)}`
  return `(${n.slice(0, 2)}) ${n.slice(2, 7)}-${n.slice(7, 11)}`
}

const STEPS = [
  "Contato",
  "Clínica",
  "Resultados",
  "Marketing",
  "Desafios",
]

// ─── Componente principal ─────────────────────────────────────────────────────

export function DiagnosticoForm() {
  const [step, setStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState<{
    success: boolean
    message: string
    error?: string
  } | null>(null)
  const [stepError, setStepError] = useState<string | null>(null)
  const [formData, setFormData] = useState<DiagnosticoFormData>(initialFormData)

  const set = (field: keyof DiagnosticoFormData, value: DiagnosticoFormData[keyof DiagnosticoFormData]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setStepError(null)
  }

  const toggleCanal = (value: string) => {
    setFormData((prev) => {
      const current = prev.canais_utilizados
      return {
        ...prev,
        canais_utilizados: current.includes(value)
          ? current.filter((c) => c !== value)
          : [...current, value],
      }
    })
    setStepError(null)
  }

  // Validação por etapa (obrigatórios apenas no passo 1)
  const validateStep = (): boolean => {
    if (step === 0) {
      if (!formData.nome.trim() || formData.nome.trim().length < 2) {
        setStepError("Por favor, informe seu nome completo.")
        return false
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        setStepError("Por favor, informe um e-mail válido.")
        return false
      }
      const phone = formData.telefone.replace(/\D/g, "")
      if (phone.length < 10 || phone.length > 11) {
        setStepError("Por favor, informe um telefone com DDD.")
        return false
      }
      if (!formData.nome_clinica.trim() || formData.nome_clinica.trim().length < 2) {
        setStepError("Por favor, informe o nome da clínica.")
        return false
      }
    }
    return true
  }

  const handleNext = () => {
    if (!validateStep()) return
    setStep((s) => s + 1)
    setStepError(null)
  }

  const handleBack = () => {
    setStep((s) => s - 1)
    setStepError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStep()) return
    setIsSubmitting(true)
    setSubmitResult(null)
    const response = await submitDiagnostico(formData)
    setSubmitResult(response)
    setIsSubmitting(false)
    if (response.success) {
      setFormData(initialFormData)
      setStep(0)
    }
  }

  if (submitResult?.success) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <CheckCircle2 className="h-16 w-16 text-[#ffb703] mb-4" />
        <h3 className="text-2xl font-bold text-white mb-2">Solicitação Enviada!</h3>
        <p className="text-white/70 max-w-md">
          Obrigado pelo seu interesse! Nossa equipe entrará em contato em breve para
          agendar seu diagnóstico estratégico gratuito.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Indicador de etapas */}
      <div className="flex items-center gap-1.5">
        {STEPS.map((label, i) => (
          <div key={i} className="flex items-center gap-1.5 flex-1">
            <div className="flex flex-col items-center gap-1 flex-1">
              <div
                className={`h-1.5 w-full rounded-full transition-colors duration-300 ${
                  i <= step ? "bg-[#ffb703]" : "bg-white/20"
                }`}
              />
              <span className={`text-[10px] hidden sm:block transition-colors ${i === step ? "text-[#ffb703] font-semibold" : "text-white/30"}`}>
                {label}
              </span>
            </div>
          </div>
        ))}
      </div>

      <p className="text-white/50 text-xs text-right -mt-2">
        Etapa {step + 1} de {STEPS.length}
      </p>

      {/* Erro de etapa */}
      {stepError && (
        <div className="flex items-start gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
          <AlertCircle className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
          <p className="text-red-400 text-sm">{stepError}</p>
        </div>
      )}

      {/* Erro de submit */}
      {submitResult && !submitResult.success && (
        <div className="flex items-start gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/30">
          <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-red-400 font-medium">{submitResult.message}</p>
            {submitResult.error && (
              <p className="text-red-400/70 text-sm mt-1">{submitResult.error}</p>
            )}
          </div>
        </div>
      )}

      {/* ── Etapa 1: Contato ── */}
      {step === 0 && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className={cx.label}>Nome completo *</Label>
              <Input
                type="text"
                placeholder="Seu nome completo"
                value={formData.nome}
                onChange={(e) => set("nome", e.target.value)}
                disabled={isSubmitting}
                className={cx.input}
              />
            </div>
            <div>
              <Label className={cx.label}>E-mail *</Label>
              <Input
                type="email"
                placeholder="Seu melhor e-mail"
                value={formData.email}
                onChange={(e) => set("email", e.target.value)}
                disabled={isSubmitting}
                className={cx.input}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className={cx.label}>WhatsApp *</Label>
              <Input
                type="tel"
                placeholder="(00) 00000-0000"
                value={formData.telefone}
                onChange={(e) => set("telefone", formatPhone(e.target.value))}
                disabled={isSubmitting}
                maxLength={15}
                className={cx.input}
              />
            </div>
            <div>
              <Label className={cx.label}>Nome da clínica *</Label>
              <Input
                type="text"
                placeholder="Nome da clínica"
                value={formData.nome_clinica}
                onChange={(e) => set("nome_clinica", e.target.value)}
                disabled={isSubmitting}
                className={cx.input}
              />
            </div>
          </div>
          <div>
            <Label className={cx.label}>Cidade / Estado</Label>
            <Input
              type="text"
              placeholder="Ex: São Paulo – SP"
              value={formData.unidade_cidade}
              onChange={(e) => set("unidade_cidade", e.target.value)}
              disabled={isSubmitting}
              className={cx.input}
            />
          </div>
        </div>
      )}

      {/* ── Etapa 2: Clínica ── */}
      {step === 1 && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className={cx.label}>Especialidade</Label>
              <Input
                type="text"
                placeholder="Ex: Odontologia, Fisioterapia"
                value={formData.especialidade}
                onChange={(e) => set("especialidade", e.target.value)}
                disabled={isSubmitting}
                className={cx.input}
              />
            </div>
            <div>
              <Label className={cx.label}>Tempo de operação</Label>
              <Select
                value={formData.tempo_operacao}
                onValueChange={(v) => set("tempo_operacao", v)}
                disabled={isSubmitting}
              >
                <SelectTrigger className={cx.selectTrigger}>
                  <SelectValue placeholder="Há quanto tempo a clínica existe?" />
                </SelectTrigger>
                <SelectContent className={cx.selectContent}>
                  {tempoOperacaoOptions.map((o) => (
                    <SelectItem key={o.value} value={o.value} className={cx.selectItem}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className={cx.label}>Número de secretárias</Label>
              <Input
                type="number"
                min={0}
                placeholder="Ex: 2"
                value={formData.num_secretarias}
                onChange={(e) => set("num_secretarias", e.target.value === "" ? "" : Number(e.target.value))}
                disabled={isSubmitting}
                className={cx.input}
              />
            </div>
            <div>
              <Label className={cx.label}>Número de profissionais de saúde</Label>
              <Input
                type="number"
                min={0}
                placeholder="Ex: 5"
                value={formData.num_fisioterapeutas}
                onChange={(e) => set("num_fisioterapeutas", e.target.value === "" ? "" : Number(e.target.value))}
                disabled={isSubmitting}
                className={cx.input}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Etapa 3: Resultados ── */}
      {step === 2 && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className={cx.label}>Consultas por mês</Label>
              <Input
                type="number"
                min={0}
                placeholder="Ex: 120"
                value={formData.consultas_mensais}
                onChange={(e) => set("consultas_mensais", e.target.value === "" ? "" : Number(e.target.value))}
                disabled={isSubmitting}
                className={cx.input}
              />
            </div>
            <div>
              <Label className={cx.label}>Tratamentos fechados por mês</Label>
              <Input
                type="number"
                min={0}
                placeholder="Ex: 30"
                value={formData.tratamentos_fechados_mes}
                onChange={(e) => set("tratamentos_fechados_mes", e.target.value === "" ? "" : Number(e.target.value))}
                disabled={isSubmitting}
                className={cx.input}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className={cx.label}>Valor médio da consulta (R$)</Label>
              <Input
                type="number"
                min={0}
                step={0.01}
                placeholder="Ex: 250.00"
                value={formData.valor_consulta}
                onChange={(e) => set("valor_consulta", e.target.value === "" ? "" : Number(e.target.value))}
                disabled={isSubmitting}
                className={cx.input}
              />
            </div>
            <div>
              <Label className={cx.label}>Valor médio do tratamento longo (R$)</Label>
              <Input
                type="number"
                min={0}
                step={0.01}
                placeholder="Ex: 3500.00"
                value={formData.valor_tratamento_longo}
                onChange={(e) => set("valor_tratamento_longo", e.target.value === "" ? "" : Number(e.target.value))}
                disabled={isSubmitting}
                className={cx.input}
              />
            </div>
          </div>
          <div>
            <Label className={cx.label}>Faturamento mensal</Label>
            <Select
              value={formData.faturamento_mensal}
              onValueChange={(v) => set("faturamento_mensal", v)}
              disabled={isSubmitting}
            >
              <SelectTrigger className={cx.selectTrigger}>
                <SelectValue placeholder="Selecione a faixa de faturamento" />
              </SelectTrigger>
              <SelectContent className={cx.selectContent}>
                {faturamentoOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value} className={cx.selectItem}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* ── Etapa 4: Marketing ── */}
      {step === 3 && (
        <div className="flex flex-col gap-4">
          <div>
            <Label className={cx.label}>Leads por mês</Label>
            <Input
              type="number"
              min={0}
              placeholder="Ex: 80"
              value={formData.leads_mensais}
              onChange={(e) => set("leads_mensais", e.target.value === "" ? "" : Number(e.target.value))}
              disabled={isSubmitting}
              className={cx.input}
            />
          </div>
          <div>
            <Label className={cx.label}>Canais de captação utilizados</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {canaisOptions.map((canal) => (
                <div key={canal.value} className="flex items-center gap-2">
                  <Checkbox
                    id={`canal-${canal.value}`}
                    checked={formData.canais_utilizados.includes(canal.value)}
                    onCheckedChange={() => toggleCanal(canal.value)}
                    disabled={isSubmitting}
                    className="border-[#1088f5]/50 data-[state=checked]:bg-[#1088f5] data-[state=checked]:border-[#1088f5]"
                  />
                  <label
                    htmlFor={`canal-${canal.value}`}
                    className="text-white/70 text-sm cursor-pointer"
                  >
                    {canal.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className={cx.label}>Usa Google Ads?</Label>
              <Select value={formData.google_ativo} onValueChange={(v) => set("google_ativo", v)} disabled={isSubmitting}>
                <SelectTrigger className={cx.selectTrigger}>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent className={cx.selectContent}>
                  {simNaoOptions.map((o) => (
                    <SelectItem key={o.value} value={o.value} className={cx.selectItem}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className={cx.label}>Usa API do WhatsApp?</Label>
              <Select value={formData.usa_api_whatsapp} onValueChange={(v) => set("usa_api_whatsapp", v)} disabled={isSubmitting}>
                <SelectTrigger className={cx.selectTrigger}>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent className={cx.selectContent}>
                  {simNaoOptions.map((o) => (
                    <SelectItem key={o.value} value={o.value} className={cx.selectItem}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className={cx.label}>Usa CRM de vendas?</Label>
              <Select value={formData.usa_crm_vendas} onValueChange={(v) => set("usa_crm_vendas", v)} disabled={isSubmitting}>
                <SelectTrigger className={cx.selectTrigger}>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent className={cx.selectContent}>
                  {simNaoOptions.map((o) => (
                    <SelectItem key={o.value} value={o.value} className={cx.selectItem}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {/* ── Etapa 5: Desafios ── */}
      {step === 4 && (
        <div className="flex flex-col gap-4">
          <div>
            <Label className={cx.label}>Principal desafio hoje</Label>
            <Select value={formData.principal_desafio} onValueChange={(v) => set("principal_desafio", v)} disabled={isSubmitting}>
              <SelectTrigger className={cx.selectTrigger}>
                <SelectValue placeholder="Selecione o principal desafio" />
              </SelectTrigger>
              <SelectContent className={cx.selectContent}>
                {desafioOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value} className={cx.selectItem}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className={cx.label}>Maior dificuldade operacional</Label>
            <Select value={formData.maior_dificuldade} onValueChange={(v) => set("maior_dificuldade", v)} disabled={isSubmitting}>
              <SelectTrigger className={cx.selectTrigger}>
                <SelectValue placeholder="Selecione a maior dificuldade" />
              </SelectTrigger>
              <SelectContent className={cx.selectContent}>
                {dificuldadeOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value} className={cx.selectItem}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className={cx.label}>Objetivo de crescimento</Label>
            <Select value={formData.objetivo_crescimento} onValueChange={(v) => set("objetivo_crescimento", v)} disabled={isSubmitting}>
              <SelectTrigger className={cx.selectTrigger}>
                <SelectValue placeholder="Selecione o objetivo" />
              </SelectTrigger>
              <SelectContent className={cx.selectContent}>
                {objetivoOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value} className={cx.selectItem}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* ── Navegação ── */}
      <div className={`flex gap-3 mt-2 ${step > 0 ? "justify-between" : "justify-end"}`}>
        {step > 0 && (
          <Button
            type="button"
            onClick={handleBack}
            disabled={isSubmitting}
            variant="outline"
            className="border-[#1088f5]/30 text-white/70 hover:bg-[#1088f5]/10 hover:text-white"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Voltar
          </Button>
        )}

        {step < STEPS.length - 1 ? (
          <Button
            type="button"
            onClick={handleNext}
            disabled={isSubmitting}
            className="bg-[#1088f5] hover:bg-[#1088f5]/90 text-white font-semibold px-6"
          >
            Próximo
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        ) : (
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-[#ffb703] hover:bg-[#ffb703]/90 text-[#040d18] font-bold py-6 text-lg transition-all duration-300"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Spinner className="h-5 w-5" />
                Enviando...
              </span>
            ) : (
              "QUERO MEU DIAGNÓSTICO GRATUITO"
            )}
          </Button>
        )}
      </div>

      <p className="text-center text-white/50 text-sm">
        Seus dados estão seguros e não serão compartilhados.
      </p>
    </form>
  )
}
