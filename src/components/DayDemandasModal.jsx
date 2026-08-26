import { X, Plus, CalendarClock } from 'lucide-react'
import Badge from './Badge'
import { urgenciaMeta, STATUS_META, formatDateBR } from '../lib/constants'

export default function DayDemandasModal({ open, date, demandas, onClose, onOpenDemanda, onNovaDemanda }) {
  if (!open) return null

  const label = date
    ? new Date(date + 'T00:00:00').toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : ''

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-fade-in">
      <div className="absolute inset-0 bg-segue-950/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative h-full w-full max-w-sm bg-white shadow-panel flex flex-col animate-slide-in">
        <div className="px-5 py-4 border-b border-slate-100 flex items-start justify-between bg-segue-900">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-segue-400 font-semibold">
              Demandas do dia
            </p>
            <p className="text-white font-semibold capitalize mt-0.5 leading-snug">{label}</p>
          </div>
          <button
            onClick={onClose}
            className="focus-ring rounded-lg p-1.5 text-slate-300 hover:bg-white/10 hover:text-white"
            aria-label="Fechar"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {demandas.length === 0 && (
            <div className="text-center py-14">
              <CalendarClock className="mx-auto text-slate-300" size={32} />
              <p className="mt-3 text-sm text-slate-400">
                Nenhuma demanda vence nesta data.
              </p>
            </div>
          )}

          {demandas.map((d) => {
            const um = urgenciaMeta(d.urgencia)
            const sm = STATUS_META[d.status]
            return (
              <button
                key={d.id}
                onClick={() => onOpenDemanda(d)}
                className="focus-ring w-full text-left rounded-lg border border-slate-200 p-3.5 hover:border-segue-400 hover:shadow-card transition"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono text-slate-400">{d.codigo}</span>
                  <Badge className={um.badge} dotClassName={um.dot}>
                    {d.urgencia}
                  </Badge>
                </div>
                <p className="mt-1.5 text-sm font-medium text-slate-800 line-clamp-2">
                  {d.titulo}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <Badge className={sm.badge} dotClassName={sm.dot}>
                    {d.status}
                  </Badge>
                  <span className="text-xs text-slate-400">{d.origem}</span>
                </div>
              </button>
            )
          })}
        </div>

        <div className="px-5 py-4 border-t border-slate-100">
          <button
            onClick={onNovaDemanda}
            className="focus-ring w-full inline-flex items-center justify-center gap-2 rounded-lg bg-segue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-segue-800"
          >
            <Plus size={16} />
            Nova demanda nesta data
          </button>
        </div>
      </div>
    </div>
  )
}
