import { useMemo } from 'react'
import { ClipboardList, Clock3, CheckCircle2, AlertTriangle } from 'lucide-react'
import { ORIGENS, TIPOS, ORIGEM_ICON_COLOR } from '../lib/constants'

const TIPO_COLORS = {
  Financeiro: 'bg-segue-600',
  Manutenção: 'bg-orange-500',
  Rescisão: 'bg-rose-500',
  Dúvidas: 'bg-violet-500',
  Outros: 'bg-slate-400',
}

const ORIGEM_COLORS = {
  Inquilino: 'bg-violet-500',
  Proprietário: 'bg-segue-600',
  Interna: 'bg-slate-400',
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
        <h1 className="text-xl font-bold text-segue-950 tracking-tight">Relatórios</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Indicadores gerais de desempenho das demandas.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={ClipboardList}
          iconClass="text-segue-700 bg-segue-50"
          label="Total de demandas"
          value={stats.total}
        />
        <StatCard
          icon={Clock3}
          iconClass="text-blue-600 bg-blue-50"
          label="Em andamento"
          value={stats.emAndamento}
        />
        <StatCard
          icon={CheckCircle2}
          iconClass="text-emerald-600 bg-emerald-50"
          label="Concluídas"
          value={stats.concluidas}
        />
        <StatCard
          icon={AlertTriangle}
          iconClass="text-rose-600 bg-rose-50"
          label="Taxa de urgência crítica"
          value={`${stats.taxaCritica}%`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl bg-white shadow-card ring-1 ring-slate-100 p-5">
          <h2 className="text-sm font-semibold text-segue-950 mb-1">Demandas por origem</h2>
          <p className="text-xs text-slate-400 mb-5">Inquilino vs. Proprietário vs. Interna</p>
          <div className="space-y-4">
            {stats.porOrigem.map((o) => (
              <div key={o.label}>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-medium text-slate-600">{o.label}</span>
                  <span className="font-semibold text-slate-800">{o.count}</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${ORIGEM_COLORS[o.label]} transition-all`}
                    style={{ width: `${(o.count / maxOrigem) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-white shadow-card ring-1 ring-slate-100 p-5">
          <h2 className="text-sm font-semibold text-segue-950 mb-1">Demandas por tipo</h2>
          <p className="text-xs text-slate-400 mb-5">
            Financeiro, Manutenção, Rescisão, Dúvidas e Outros
          </p>
          <div className="space-y-4">
            {stats.porTipo.map((t) => (
              <div key={t.label}>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-medium text-slate-600">{t.label}</span>
                  <span className="font-semibold text-slate-800">{t.count}</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
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
    <div className="rounded-xl bg-white shadow-card ring-1 ring-slate-100 p-5">
      <div className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${iconClass}`}>
        <Icon size={19} />
      </div>
      <p className="mt-3 text-2xl font-bold text-segue-950 tracking-tight">{value}</p>
      <p className="text-xs text-slate-500 mt-0.5">{label}</p>
    </div>
  )
}
