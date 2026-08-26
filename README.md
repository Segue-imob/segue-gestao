# SEGUE Gestão

Aplicativo interno da **Segue Imobiliária** para controle de agenda de prazos, demandas (inquilinos, proprietários e uso interno) e relatórios gerenciais.

Stack: **React + Vite**, **Tailwind CSS**, **Supabase** (Postgres + Realtime).

## 1. Configurar o Supabase

1. Crie um projeto em [supabase.com](https://supabase.com).
2. Vá em **SQL Editor** e rode o conteúdo do arquivo [`supabase/schema.sql`](./supabase/schema.sql). Isso cria:
   - a tabela `demandas`;
   - a geração automática do código (`DEM-0001`, `DEM-0002`, ...);
   - índices e políticas de Row Level Security.
3. Em **Project Settings → API**, copie a **Project URL** e a **anon public key**.

> As políticas de RLS do schema liberam leitura/escrita geral (`using (true)`), pensadas para uso interno da equipe. Se o app tiver login, troque por `auth.role() = 'authenticated'` ou regras por usuário.

## 2. Configurar o projeto localmente

```bash
npm install
cp .env.example .env
```

Edite o `.env` com os dados do seu projeto Supabase:

```
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=SUA_CHAVE_ANONIMA_PUBLICA
```

Rodar em desenvolvimento:

```bash
npm run dev
```

Build de produção:

```bash
npm run build
npm run preview
```

## 3. Deploy na Vercel

1. Suba este projeto para um repositório Git (GitHub/GitLab/Bitbucket).
2. Na Vercel, clique em **Add New → Project** e importe o repositório.
3. Framework preset: **Vite** (detectado automaticamente).
4. Em **Environment Variables**, adicione:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Clique em **Deploy**.

O arquivo `vercel.json` já está configurado com rewrite para SPA, então a navegação funciona corretamente após o build.

## Estrutura do projeto

```
src/
  components/       Sidebar, navegação mobile, modais, badges, toasts
  pages/
    Agenda.jsx       Calendário mensal com marcadores de urgência
    Demandas.jsx     Tabela com busca, filtros e troca de status
    Relatorios.jsx   Cards de indicadores e gráficos de barras
  lib/
    supabaseClient.js
    constants.js      Opções de origem/urgência/tipo/status e helpers
  App.jsx             Estado global e integração com Supabase (CRUD + Realtime)
supabase/
  schema.sql          Schema completo para rodar no SQL Editor do Supabase
```

## Funcionalidades

- **Agenda**: calendário do mês atual, com marcadores coloridos por urgência em cada dia. Clicar em um dia abre um painel lateral com as demandas daquela data.
- **Demandas**: cadastro via modal (código automático, origem, urgência, tipo, título, descrição, vencimento), tabela com busca por palavra-chave, filtros por origem/urgência/status e troca rápida de status inline.
- **Relatórios**: cards com total de demandas, em andamento, concluídas e taxa de urgência crítica, além de gráficos de barras por origem e por tipo.
- Atualização em tempo real via Supabase Realtime — mudanças feitas por outro usuário aparecem automaticamente.
