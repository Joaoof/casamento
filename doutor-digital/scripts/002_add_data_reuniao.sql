-- Adiciona coluna para armazenar a data/horário da reunião agendada pelo lead
ALTER TABLE public.diagnosticos
  ADD COLUMN IF NOT EXISTS data_reuniao TEXT;

-- Índice para facilitar consultas por data de reunião
CREATE INDEX IF NOT EXISTS idx_diagnosticos_reuniao ON public.diagnosticos(data_reuniao);
