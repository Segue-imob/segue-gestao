import { useMemo } from 'react'
import { ClipboardList, Clock3, CheckCircle2, AlertTriangle } from 'lucide-react'
import { ORIGENS, TIPOS } from '../lib/constants'

// Paleta dos gráficos: combinação de Terracotta, Warm Brown e Stone Gray
const TIPO_COLORS = {
  Financeiro: 'bg-segue-terracotta',
  Manutenção: 'bg-segue-brown',
  Rescisão: 'bg-segue-terracotta-dark',
  Dúvidas: 'bg-segue-stone',
  Outros: 'bg-segue-black/25',
}

const ORIGEM_COLORS = {
  Inquilino: 'bg-segue-terracotta',
  Proprietário: 'bg-segue-brown',
  Interna: 'bg-segue-stone',
}

export default function Relatorios({ demandas }) {
  const stats = useMemo(() => {
    const total = demandas.length
    const emAndamento = demandas.filter((d) => d.status === 'Em Andamento').length
    const concluidas = demandas.filter((d) => d.status === 'Concluído').length
    const criticas = demandas.filter((d) => d.urgencia === 'Crítica').length
    const taxaCritica = total > 0 ? Math.round((criticas / total) * 100) : 0

    const porOrigem = ORIGENS.map((o) => ({
      label: o,
      count: demandas.filter((d) => d.origem === o).length,
    }))

    const porTipo = TIPOS.map((t) => ({
      label: t,
      count: demandas.filter((d) => d.tipo === t).length,
    }))

    return { total, emAndamento, concluidas, taxaCritica, porOrigem, porTipo }
  }, [demandas])

  const maxOrigem = Math.max(1, ...stats.porOrigem.map((o) => o.count))
  const maxTipo = Math.max(1, ...stats.porTipo.map((t) => t.count))

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-segue-black tracking-tight">Relatórios</h1>
        <p className="text-sm text-segue-black/55 mt-0.5">
          Indicadores gerais de desempenho das demandas.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={ClipboardList}
          iconClass="text-segue-terracotta bg-segue-terracotta/10"
          label="Total de demandas"
          value={stats.total}
        />
        <StatCard
          icon={Clock3}
          iconClass="text-segue-brown bg-segue-brown/10"
          label="Em andamento"
          value={stats.emAndamento}
        />
        <StatCard
          icon={CheckCircle2}
          iconClass="text-emerald-700 bg-emerald-50"
          label="Concluídas"
          value={stats.concluidas}
        />
        <StatCard
          icon={AlertTriangle}
          iconClass="text-orange-600 bg-orange-50"
          label="Taxa de urgência crítica"
          value={`${stats.taxaCritica}%`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl bg-white shadow-card ring-1 ring-segue-stone p-5">
          <h2 className="text-sm font-semibold text-segue-black mb-1">Demandas por origem</h2>
          <p className="text-xs text-segue-black/40 mb-5">Inquilino vs. Proprietário vs. Interna</p>
          <div className="space-y-4">
            {stats.porOrigem.map((o) => (
              <div key={o.label}>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-medium text-segue-black/70">{o.label}</span>
                  <span className="font-semibold text-segue-black">{o.count}</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-segue-stone-pale overflow-hidden">
                  <div
                    className={`h-full rounded-full ${ORIGEM_COLORS[o.label]} transition-all`}
                    style={{ width: `${(o.count / maxOrigem) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-white shadow-card ring-1 ring-segue-stone p-5">
          <h2 className="text-sm font-semibold text-segue-black mb-1">Demandas por tipo</h2>
          <p className="text-xs text-segue-black/40 mb-5">
            Financeiro, Manutenção, Rescisão, Dúvidas e Outros
          </p>
          <div className="space-y-4">
            {stats.porTipo.map((t) => (
              <div key={t.label}>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-medium text-segue-black/70">{t.label}</span>
                  <span className="font-semibold text-segue-black">{t.count}</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-segue-stone-pale overflow-hidden">
                  <div
                    className={`h-full rounded-full ${TIPO_COLORS[t.label]} transition-all`}
                    style={{ width: `${(t.count / maxTipo) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, iconClass, label, value }) {
  return (
    <div className="rounded-xl bg-white shadow-card ring-1 ring-segue-stone p-5">
      <div className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${iconClass}`}>
        <Icon size={19} />
      </div>
      <p className="mt-3 text-2xl font-bold text-segue-black tracking-tight">{value}</p>
      <p className="text-xs text-segue-black/55 mt-0.5">{label}</p>
    </div>
  )
}
