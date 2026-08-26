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
      <div className="absolute inset-0 bg-segue-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative h-full w-full max-w-sm bg-segue-cream shadow-panel flex flex-col animate-slide-in">
        <div className="px-5 py-4 border-b border-segue-stone/30 flex items-start justify-between bg-segue-black">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-segue-stone font-semibold">
              Demandas do dia
            </p>
            <p className="text-segue-cream font-semibold capitalize mt-0.5 leading-snug">{label}</p>
          </div>
          <button
            onClick={onClose}
            className="focus-ring rounded-lg p-1.5 text-segue-stone hover:bg-segue-cream/10 hover:text-segue-cream"
            aria-label="Fechar"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {demandas.length === 0 && (
            <div className="text-center py-14">
              <CalendarClock className="mx-auto text-segue-stone" size={32} />
              <p className="mt-3 text-sm text-segue-black/40">
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
                className="focus-ring w-full text-left rounded-lg border border-segue-stone p-3.5 hover:border-segue-terracotta hover:shadow-card transition"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono text-segue-black/40">{d.codigo}</span>
                  <Badge className={um.badge} dotClassName={um.dot}>
                    {d.urgencia}
                  </Badge>
                </div>
                <p className="mt-1.5 text-sm font-medium text-segue-black line-clamp-2">
                  {d.titulo}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <Badge className={sm.badge} dotClassName={sm.dot}>
                    {d.status}
                  </Badge>
                  <span className="text-xs text-segue-black/40">{d.origem}</span>
                </div>
              </button>
            )
          })}
        </div>

        <div className="px-5 py-4 border-t border-segue-stone/30">
          <button
            onClick={onNovaDemanda}
            className="focus-ring w-full inline-flex items-center justify-center gap-2 rounded-lg bg-segue-terracotta px-4 py-2.5 text-sm font-semibold text-segue-cream hover:bg-segue-terracotta-dark"
          >
            <Plus size={16} />
            Nova demanda nesta data
          </button>
        </div>
      </div>
    </div>
  )
}
