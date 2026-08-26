export const ORIGENS = ['Inquilino', 'Proprietário', 'Interna']

export const TIPOS = ['Financeiro', 'Manutenção', 'Rescisão', 'Dúvidas', 'Outros']

export const STATUS_LIST = ['Pendente', 'Em Andamento', 'Concluído']

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

export const STATUS_META = {
  Pendente: {
    badge: 'bg-segue-stone-pale text-segue-black/70 ring-1 ring-inset ring-segue-stone',
    dot: 'bg-segue-stone',
  },
  'Em Andamento': {
    badge: 'bg-segue-terracotta/10 text-segue-terracotta ring-1 ring-inset ring-segue-terracotta/25',
    dot: 'bg-segue-terracotta',
  },
  Concluído: {
    badge: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200',
    dot: 'bg-emerald-500',
  },
}

export const ORIGEM_ICON_COLOR = {
  Inquilino: 'text-segue-terracotta bg-segue-terracotta/10',
  Proprietário: 'text-segue-brown bg-segue-brown/10',
  Interna: 'text-segue-black/70 bg-segue-stone-pale',
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
