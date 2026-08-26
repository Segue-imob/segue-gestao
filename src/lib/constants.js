export const ORIGENS = ['Inquilino', 'Proprietário', 'Interna']

export const TIPOS = ['Financeiro', 'Manutenção', 'Rescisão', 'Dúvidas', 'Outros']

export const STATUS_LIST = ['Pendente', 'Em Andamento', 'Concluído']

// Urgência segue a paleta corporativa:
// Baixa -> Stone Gray | Média -> Warm Brown | Alta -> Terracotta | Crítica -> vermelho padrão de erro
export const URGENCIAS = [
  {
    label: 'Baixa',
    dot: 'bg-segue-stone',
    badge: 'bg-segue-stone-pale text-segue-black/70 ring-1 ring-inset ring-segue-stone',
    solid: 'bg-segue-stone',
  },
  {
    label: 'Média',
    dot: 'bg-segue-brown',
    badge: 'bg-segue-brown/10 text-segue-brown ring-1 ring-inset ring-segue-brown/25',
    solid: 'bg-segue-brown',
  },
  {
    label: 'Alta',
    dot: 'bg-segue-terracotta',
    badge: 'bg-segue-terracotta/10 text-segue-terracotta ring-1 ring-inset ring-segue-terracotta/25',
    solid: 'bg-segue-terracotta',
  },
  {
    label: 'Crítica',
    dot: 'bg-red-600',
    badge: 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-200',
    solid: 'bg-red-600',
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
