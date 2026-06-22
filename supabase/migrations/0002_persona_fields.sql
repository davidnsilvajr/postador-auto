-- =============================================
-- POSTADOR AUTO - Migration 0002
-- Campos de Persona do Cliente (estende a tabela `brands`)
-- Rode no SQL editor do Supabase.
-- =============================================

-- "Dados da empresa" e persona do cliente.
-- Reaproveita os campos existentes:
--   name, website, industry, description, tone_of_voice (brands)
--   keywords, do_not_say, must_include, brand_voice_description (brand_guidelines)
-- e adiciona os que faltavam:

alter table brands
  add column if not exists target_audience text default '',  -- publico-alvo da persona
  add column if not exists company_info text default '';      -- dados livres da empresa (contato, localizacao, diferenciais)
