import { ChevronRight } from 'lucide-react'
import Badge from './Badge'
import StatusDropdown from './StatusDropdown'
import {
  STATUS_LIST,
  STATUS_META,
  urgenciaMeta,
  ORIGEM_ICONS,
  formatDateBR,
} from '../lib/constants'

export default function KanbanBoard({ demandas, onEditDemanda, onStatusChange }) {
  const porStatus = STATUS_LIST.reduce((acc, status) => {
    acc[status] = demandas.filter((d) => d.status === status)
    return acc
  }, {})

  return (
    <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1">
      {STATUS_LIST.map((status) => {
        const meta = STATUS_META[status]
        const items = porStatus[status]
        return (
          <div
            key={status}
            className="flex w-72 shrink-0 flex-col rounded-xl bg-segue-stone-pale/40 ring-1 ring-segue-stone overflow-hidden"
          >
            <div className={`h-1.5 ${meta.accent}`} />
            <div className="flex items-center justify-between px-3.5 py-3 border-b border-segue-stone/40">
              <h3 className="text-sm font-semibold text-segue-black">{status}</h3>
              <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-segue-black/60 ring-1 ring-segue-stone">
                {items.length}
              </span>
            </div>

            <div className="flex-1 space-y-2.5 p-2.5 min-h-[120px] max-h-[calc(100vh-260px)] overflow-y-auto">
              {items.length === 0 && (
                <p className="py-6 text-center text-xs text-segue-black/35">
                  Nenhuma demanda nesta etapa.
                </p>
              )}

              {items.map((d) => (
                <KanbanCard
                  key={d.id}
                  demanda={d}
                  onEdit={() => onEditDemanda(d)}
                  onStatusChange={(newStatus) => onStatusChange(d, newStatus)}
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function KanbanCard({ demanda: d, onEdit, onStatusChange }) {
  const um = urgenciaMeta(d.urgencia)
  const currentIndex = STATUS_LIST.indexOf(d.status)
  const nextStatus = STATUS_LIST[currentIndex + 1]
  const OrigemIcon = ORIGEM_ICONS[d.origem]

  return (
    <div className="rounded-lg bg-white p-3 ring-1 ring-segue-stone hover:shadow-card transition">
      <div className="flex items-start justify-between gap-2">
        <button
          onClick={onEdit}
          className="focus-ring text-left text-xs font-mono text-segue-black/40 hover:text-segue-terracotta"
        >
          {d.codigo}
        </button>
        <Badge className={um.badge} dotClassName={um.dot}>
          {d.urgencia}
        </Badge>
      </div>

      {d.codigo_imovel && (
        <span className="mt-1.5 inline-flex items-center rounded-md bg-segue-terracotta/10 px-2 py-0.5 text-[11px] font-semibold text-segue-terracotta">
          {d.codigo_imovel}
        </span>
      )}

      <button
        onClick={onEdit}
        className="focus-ring mt-2 block text-left text-sm font-medium text-segue-black hover:text-segue-terracotta line-clamp-2"
      >
        {d.titulo}
      </button>

      <div className="mt-2.5 flex items-center justify-between text-xs text-segue-black/55">
        <span className="inline-flex items-center gap-1.5">
          {OrigemIcon && <OrigemIcon size={12} className="text-segue-black/40" />}
          {d.origem}
        </span>
        <span className="whitespace-nowrap">{formatDateBR(d.data_vencimento)}</span>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2 border-t border-segue-stone/30 pt-2.5">
        <StatusDropdown value={d.status} onChange={onStatusChange} />
        {nextStatus && (
          <button
            onClick={() => onStatusChange(nextStatus)}
            title={`Mover para "${nextStatus}"`}
            className="focus-ring inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-semibold text-segue-terracotta hover:bg-segue-terracotta/10 whitespace-nowrap"
          >
            Avançar
            <ChevronRight size={13} />
          </button>
        )}
      </div>
    </div>
  )
}
