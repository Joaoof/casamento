"use server"

import { createClient } from "@/lib/supabase/server"

export type DiagnosticoFormData = {
  // Etapa 1 - Contato
  nome: string
  email: string
  telefone: string
  nome_clinica: string
  unidade_cidade: string
  // Etapa 2 - Clínica
  especialidade: string
  tempo_operacao: string
  num_secretarias: number | ""
  num_fisioterapeutas: number | ""
  // Etapa 3 - Resultados
  consultas_mensais: number | ""
  tratamentos_fechados_mes: number | ""
  valor_consulta: number | ""
  valor_tratamento_longo: number | ""
  faturamento_mensal: string
  // Etapa 4 - Marketing
  leads_mensais: number | ""
  canais_utilizados: string[]
  google_ativo: string
  usa_api_whatsapp: string
  usa_crm_vendas: string
  // Etapa 5 - Desafios
  principal_desafio: string
  maior_dificuldade: string
  objetivo_crescimento: string
  // Etapa 6 - Agendamento
  data_reuniao: string
}

export type DiagnosticoResult = {
  success: boolean
  message: string
  error?: string
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, "")
  return cleaned.length >= 10 && cleaned.length <= 11
}

function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, "")
}

function normalizeEmail(email: string): string {
  return email.toLowerCase().trim()
}

function toIntOrNull(value: number | ""): number | null {
  return value !== "" && !isNaN(Number(value)) ? Number(value) : null
}

function toNumericOrNull(value: number | ""): number | null {
  return value !== "" && !isNaN(Number(value)) ? Number(value) : null
}

export async function getHorariosOcupados(date: string): Promise<string[]> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from("diagnosticos")
      .select("data_reuniao")
      .like("data_reuniao", `${date}%`)

    if (!data) return []
    return data
      .filter((row) => row.data_reuniao)
      .map((row) => (row.data_reuniao as string).split("T")[1])
  } catch {
    return []
  }
}

export async function submitDiagnostico(
  formData: DiagnosticoFormData
): Promise<DiagnosticoResult> {
  try {
    // Validações obrigatórias
    if (!formData.nome || formData.nome.trim().length < 2) {
      return { success: false, message: "Nome inválido", error: "O nome deve ter pelo menos 2 caracteres." }
    }
    if (!formData.email || !isValidEmail(formData.email)) {
      return { success: false, message: "E-mail inválido", error: "Por favor, insira um e-mail válido." }
    }
    if (!formData.telefone || !isValidPhone(formData.telefone)) {
      return { success: false, message: "Telefone inválido", error: "Por favor, insira um telefone válido com DDD." }
    }
    if (!formData.nome_clinica || formData.nome_clinica.trim().length < 2) {
      return { success: false, message: "Nome da clínica inválido", error: "O nome da clínica deve ter pelo menos 2 caracteres." }
    }

    const supabase = await createClient()
    const normalizedEmail = normalizeEmail(formData.email)
    const normalizedPhone = normalizePhone(formData.telefone)

    // Log do payload para debug
    console.log("[submitDiagnostico] payload:", {
      nome_responsavel: formData.nome.trim(),
      email: normalizedEmail,
      telefone: normalizedPhone,
      nome_clinica: formData.nome_clinica.trim(),
      unidade_cidade: formData.unidade_cidade?.trim() || null,
      especialidade: formData.especialidade?.trim() || null,
      tempo_operacao: formData.tempo_operacao || null,
      num_secretarias: toIntOrNull(formData.num_secretarias),
      num_fisioterapeutas: toIntOrNull(formData.num_fisioterapeutas),
      consultas_mensais: toIntOrNull(formData.consultas_mensais),
      tratamentos_fechados_mes: toIntOrNull(formData.tratamentos_fechados_mes),
      valor_consulta: toNumericOrNull(formData.valor_consulta),
      valor_tratamento_longo: toNumericOrNull(formData.valor_tratamento_longo),
      faturamento_mensal: formData.faturamento_mensal || null,
      leads_mensais: toIntOrNull(formData.leads_mensais),
      canais_utilizados: formData.canais_utilizados?.length ? formData.canais_utilizados : null,
      google_ativo: formData.google_ativo || null,
      usa_api_whatsapp: formData.usa_api_whatsapp || null,
      usa_crm_vendas: formData.usa_crm_vendas || null,
      principal_desafio: formData.principal_desafio || null,
      maior_dificuldade: formData.maior_dificuldade || null,
      objetivo_crescimento: formData.objetivo_crescimento || null,
      data_reuniao: formData.data_reuniao || null,
    })

    // Verifica duplicidade de email
    const { data: existingEmail } = await supabase
      .from("diagnosticos")
      .select("id")
      .eq("email", normalizedEmail)
      .maybeSingle()

    if (existingEmail) {
      return {
        success: false,
        message: "E-mail já cadastrado",
        error: "Este e-mail já está cadastrado. Entraremos em contato em breve.",
      }
    }

    // Verifica duplicidade de telefone
    const { data: existingPhone } = await supabase
      .from("diagnosticos")
      .select("id")
      .eq("telefone", normalizedPhone)
      .maybeSingle()

    if (existingPhone) {
      return {
        success: false,
        message: "Telefone já cadastrado",
        error: "Este telefone já está cadastrado. Entraremos em contato em breve.",
      }
    }

    // Verifica se o horário já está ocupado
    if (formData.data_reuniao) {
      const { data: existingSlot } = await supabase
        .from("diagnosticos")
        .select("id")
        .eq("data_reuniao", formData.data_reuniao)
        .maybeSingle()

      if (existingSlot) {
        return {
          success: false,
          message: "Horário indisponível",
          error: "Este horário já foi reservado por outra empresa. Por favor, escolha outro horário disponível.",
        }
      }
    }

    const { error: insertError } = await supabase.from("diagnosticos").insert({
      nome_responsavel: formData.nome.trim(),
      email: normalizedEmail,
      telefone: normalizedPhone,
      nome_clinica: formData.nome_clinica.trim(),
      unidade_cidade: formData.unidade_cidade?.trim() || null,
      especialidade: formData.especialidade?.trim() || null,
      tempo_operacao: formData.tempo_operacao || null,
      num_secretarias: toIntOrNull(formData.num_secretarias),
      num_fisioterapeutas: toIntOrNull(formData.num_fisioterapeutas),
      consultas_mensais: toIntOrNull(formData.consultas_mensais),
      tratamentos_fechados_mes: toIntOrNull(formData.tratamentos_fechados_mes),
      valor_consulta: toNumericOrNull(formData.valor_consulta),
      valor_tratamento_longo: toNumericOrNull(formData.valor_tratamento_longo),
      faturamento_mensal: formData.faturamento_mensal || null,
      leads_mensais: toIntOrNull(formData.leads_mensais),
      canais_utilizados: formData.canais_utilizados?.length ? formData.canais_utilizados : null,
      google_ativo: formData.google_ativo || null,
      usa_api_whatsapp: formData.usa_api_whatsapp || null,
      usa_crm_vendas: formData.usa_crm_vendas || null,
      principal_desafio: formData.principal_desafio || null,
      maior_dificuldade: formData.maior_dificuldade || null,
      objetivo_crescimento: formData.objetivo_crescimento || null,
      data_reuniao: formData.data_reuniao || null,
      status: "pendente",
    })

    if (insertError) {
      console.error("[submitDiagnostico] Erro ao inserir:", insertError)
      if (insertError.code === "23505") {
        return { success: false, message: "Cadastro duplicado", error: "Este e-mail ou telefone já está cadastrado." }
      }
      return { success: false, message: "Erro ao salvar", error: "Ocorreu um erro ao salvar seus dados. Tente novamente." }
    }

    return { success: true, message: "Diagnóstico solicitado com sucesso!" }
  } catch (error) {
    console.error("[submitDiagnostico] Erro inesperado:", error)
    return { success: false, message: "Erro inesperado", error: "Ocorreu um erro inesperado. Tente novamente." }
  }
}
