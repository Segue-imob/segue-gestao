export const ORIGENS = ['Inquilino', 'Proprietário', 'Interna']

export const TIPOS = ['Financeiro', 'Manutenção', 'Rescisão', 'Dúvidas', 'Outros']

export const STATUS_LIST = ['Pendente', 'Em Andamento', 'Concluído']

export const URGENCIAS = [
  {
    label: 'Baixa',
    dot: 'bg-emerald-500',
    badge: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200',
    solid: 'bg-emerald-500',
  },
  {
    label: 'Média',
    dot: 'bg-amber-400',
    badge: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200',
    solid: 'bg-amber-400',
  },
  {
    label: 'Alta',
    dot: 'bg-orange-500',
    badge: 'bg-orange-50 text-orange-700 ring-1 ring-inset ring-orange-200',
    solid: 'bg-orange-500',
  },
  {
    label: 'Crítica',
    dot: 'bg-rose-600',
    badge: 'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200',
    solid: 'bg-rose-600',
  },
]

export function urgenciaMeta(label) {
  return URGENCIAS.find((u) => u.label === label) || URGENCIAS[0]
}

export const STATUS_META = {
  Pendente: {
    badge: 'bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-300',
    dot: 'bg-slate-400',
  },
  'Em Andamento': {
    badge: 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200',
    dot: 'bg-blue-500',
  },
  Concluído: {
    badge: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200',
    dot: 'bg-emerald-500',
  },
}

export const ORIGEM_ICON_COLOR = {
  Inquilino: 'text-violet-600 bg-violet-50',
  Proprietário: 'text-blue-600 bg-blue-50',
  Interna: 'text-slate-600 bg-slate-100',
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
