import { User, Building, Building2 } from 'lucide-react'

export const ORIGENS = ['Inquilino', 'Proprietário', 'Interna']

export const TIPOS = ['Financeiro', 'Manutenção', 'Rescisão', 'Dúvidas', 'Outros']

// Pipeline de status usado tanto na tabela quanto nas colunas do Kanban.
// Toda nova demanda nasce em "Recebida" (primeira coluna do quadro).
export const STATUS_LIST = ['Recebida', 'Em Agendamento', 'Visita Agendada', 'Concluído']

export const STATUS_INICIAL = 'Recebida'

// Urgência segue a régua de cores solicitada:
// Baixa -> Verde (#10B981) | Média -> Azul (#3B82F6) | Alta -> Vermelho (#EF4444) | Crítica -> Laranja (#F97316)
// Os tons abaixo usam a escala padrão do Tailwind, que corresponde exatamente
// a esses hex (emerald-500, blue-500, red-500 e orange-500).
export const URGENCIAS = [
  {
    label: 'Baixa',
    dot: 'bg-emerald-500',
    badge: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200',
    solid: 'bg-emerald-500',
  },
  {
    label: 'Média',
    dot: 'bg-blue-500',
    badge: 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200',
    solid: 'bg-blue-500',
  },
  {
    label: 'Alta',
    dot: 'bg-red-500',
    badge: 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-200',
    solid: 'bg-red-500',
  },
  {
    label: 'Crítica',
    dot: 'bg-orange-500',
    badge: 'bg-orange-50 text-orange-700 ring-1 ring-inset ring-orange-200',
    solid: 'bg-orange-500',
  },
]

export function urgenciaMeta(label) {
  return URGENCIAS.find((u) => u.label === label) || URGENCIAS[0]
}

// Cor de destaque de cada coluna do Kanban / badge de status na tabela:
// Recebida -> Stone Gray | Em Agendamento -> Azul | Visita Agendada -> Terracotta | Concluído -> Verde
export const STATUS_META = {
  Recebida: {
    badge: 'bg-segue-stone-pale text-segue-black/70 ring-1 ring-inset ring-segue-stone',
    dot: 'bg-segue-stone',
    accent: 'bg-segue-stone',
  },
  'Em Agendamento': {
    badge: 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200',
    dot: 'bg-blue-500',
    accent: 'bg-blue-500',
  },
  'Visita Agendada': {
    badge: 'bg-segue-terracotta/10 text-segue-terracotta ring-1 ring-inset ring-segue-terracotta/25',
    dot: 'bg-segue-terracotta',
    accent: 'bg-segue-terracotta',
  },
  Concluído: {
    badge: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200',
    dot: 'bg-emerald-500',
    accent: 'bg-emerald-500',
  },
}

export const ORIGEM_ICON_COLOR = {
  Inquilino: 'text-segue-terracotta bg-segue-terracotta/10',
  Proprietário: 'text-segue-brown bg-segue-brown/10',
  Interna: 'text-segue-black/70 bg-segue-stone-pale',
}

// Ícone representativo de cada origem, usado nos badges do Kanban e da tabela.
export const ORIGEM_ICONS = {
  Inquilino: User,
  Proprietário: Building,
  Interna: Building2,
}

export function formatDateBR(dateStr) {
  if (!dateStr) return ''
  const [y, m, d] = dateStr.split('-')
  return `${d}/${m}/${y}`
}

export function todayISO() {
  const d = new Date()
  const offset = d.getTimezoneOffset()
  const local = new Date(d.getTime() - offset * 60 * 1000)
  return local.toISOString().slice(0, 10)
}
