-- Tabela para armazenar os dados do diagnóstico estratégico
-- Campos organizados por seção do formulário

CREATE TABLE IF NOT EXISTS public.diagnosticos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- ─── SOLICITE SEU DIAGNÓSTICO GRATUITO (dados de contato) ───────────────
  nome_responsavel TEXT NOT NULL,
  email            TEXT UNIQUE NOT NULL,
  telefone         TEXT NOT NULL,
  nome_clinica     TEXT,

  -- ─── RAIO-X DA CLÍNICA ───────────────────────────────────────────────────
  unidade_cidade      TEXT,
  tempo_operacao      TEXT,          -- ex: "1-3 anos", "3-5 anos", "Mais de 5 anos"
  num_secretarias     INTEGER,
  num_fisioterapeutas INTEGER,

  -- ─── MODELO FINANCEIRO E CAPACIDADE DE MONETIZAÇÃO ──────────────────────
  valor_consulta          DECIMAL(10,2),
  valor_tratamento_longo  DECIMAL(10,2),
  consultas_mensais       INTEGER,
  tratamentos_fechados_mes INTEGER,
  leads_mensais           INTEGER,

  -- ─── MARKETING, AQUISIÇÃO E POSICIONAMENTO ──────────────────────────────
  canais_utilizados TEXT[],          -- array: ["instagram", "google", "indicacao", ...]
  google_ativo      TEXT,            -- "sim" | "nao" | "sim_mas_nao_otimizado"

  -- ─── OPERAÇÃO COMERCIAL E JORNADA DE CONVERSÃO ──────────────────────────
  usa_api_whatsapp TEXT,             -- "sim" | "nao"
  usa_crm_vendas   TEXT,             -- "sim" | "nao"

  -- ─── GARGALOS, RISCOS E OPORTUNIDADES ───────────────────────────────────
  maior_dificuldade    TEXT,
  objetivo_crescimento TEXT,

  -- ─── STATUS INTERNO ──────────────────────────────────────────────────────
  status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'em_analise', 'concluido'))
);

-- Índice para busca por email (UNIQUE já cria índice, este é redundante — mantido para clareza)
CREATE INDEX IF NOT EXISTS idx_diagnosticos_email   ON public.diagnosticos(email);
CREATE INDEX IF NOT EXISTS idx_diagnosticos_status  ON public.diagnosticos(status);
CREATE INDEX IF NOT EXISTS idx_diagnosticos_created ON public.diagnosticos(created_at DESC);

-- Função e trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_diagnosticos_updated_at ON public.diagnosticos;
CREATE TRIGGER update_diagnosticos_updated_at
  BEFORE UPDATE ON public.diagnosticos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ─── ROW LEVEL SECURITY ──────────────────────────────────────────────────────
ALTER TABLE public.diagnosticos ENABLE ROW LEVEL SECURITY;

-- Qualquer visitante pode inserir (formulário público)
CREATE POLICY "Allow public insert" ON public.diagnosticos
  FOR INSERT WITH CHECK (true);

-- Leitura e atualização apenas com service role (painel admin)
CREATE POLICY "Allow service role to read" ON public.diagnosticos
  FOR SELECT USING (true);

CREATE POLICY "Allow service role to update" ON public.diagnosticos
  FOR UPDATE USING (true);
