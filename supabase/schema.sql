-- ============================================================
-- SEGUE Gestão — Schema do banco (executar no SQL Editor do Supabase)
-- ============================================================

create extension if not exists "pgcrypto";

create table if not exists public.demandas (
  id uuid primary key default gen_random_uuid(),
  codigo text unique,
  codigo_imovel text,
  origem text not null check (origem in ('Inquilino', 'Proprietário', 'Interna')),
  urgencia text not null check (urgencia in ('Baixa', 'Média', 'Alta', 'Crítica')),
  -- "tipo" aceita as opções fixas do select OU um texto livre digitado pelo
  -- usuário quando a opção "Outros" é escolhida e especificada no formulário.
  tipo text not null,
  titulo text not null,
  descricao text,
  data_vencimento date not null,
  status text not null default 'Pendente' check (status in ('Pendente', 'Em Andamento', 'Concluído')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Sequência usada para gerar o código legível (ex: DEM-0001)
create sequence if not exists public.demandas_codigo_seq;

create or replace function public.gerar_codigo_demanda()
returns trigger
language plpgsql
as $$
begin
  if new.codigo is null then
    new.codigo := 'DEM-' || lpad(nextval('public.demandas_codigo_seq')::text, 4, '0');
  end if;
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists trg_gerar_codigo_demanda on public.demandas;
create trigger trg_gerar_codigo_demanda
  before insert on public.demandas
  for each row execute function public.gerar_codigo_demanda();

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists trg_set_updated_at on public.demandas;
create trigger trg_set_updated_at
  before update on public.demandas
  for each row execute function public.set_updated_at();

create index if not exists idx_demandas_status on public.demandas (status);
create index if not exists idx_demandas_vencimento on public.demandas (data_vencimento);
create index if not exists idx_demandas_urgencia on public.demandas (urgencia);
create index if not exists idx_demandas_codigo_imovel on public.demandas (codigo_imovel);

-- ============================================================
-- Row Level Security
-- Ajuste as políticas abaixo de acordo com sua estratégia de
-- autenticação. O exemplo libera leitura/escrita para qualquer
-- usuário autenticado no Supabase (auth.role() = 'authenticated').
-- Para um MVP interno sem login, você pode trocar por `using (true)`.
-- ============================================================

alter table public.demandas enable row level security;

drop policy if exists "Permitir leitura autenticada" on public.demandas;
create policy "Permitir leitura autenticada"
  on public.demandas for select
  using (true);

drop policy if exists "Permitir escrita autenticada" on public.demandas;
create policy "Permitir escrita autenticada"
  on public.demandas for insert
  with check (true);

drop policy if exists "Permitir atualização autenticada" on public.demandas;
create policy "Permitir atualização autenticada"
  on public.demandas for update
  using (true);

drop policy if exists "Permitir exclusão autenticada" on public.demandas;
create policy "Permitir exclusão autenticada"
  on public.demandas for delete
  using (true);

-- ============================================================
-- MIGRAÇÃO para bancos que já rodaram uma versão anterior deste
-- schema (tabela "demandas" criada antes do campo codigo_imovel e
-- da liberação do campo "tipo" para texto livre). Rode apenas os
-- comandos abaixo caso a tabela já exista no seu projeto.
-- ============================================================

alter table public.demandas add column if not exists codigo_imovel text;
create index if not exists idx_demandas_codigo_imovel on public.demandas (codigo_imovel);

-- Remove a restrição antiga que limitava "tipo" às 5 opções fixas,
-- permitindo salvar a especificação digitada quando "Outros" é escolhido.
alter table public.demandas drop constraint if exists demandas_tipo_check;
