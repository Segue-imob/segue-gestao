import { X, Pencil, CalendarDays, Tag } from 'lucide-react'
import Badge from './Badge'
import StatusDropdown from './StatusDropdown'
import { urgenciaMeta, ORIGEM_ICONS, formatDateBR } from '../lib/constants'

// Modal de detalhes rápidos de uma demanda, aberto ao clicar em qualquer
// etiqueta do calendário. Permite consultar tudo e trocar o status na hora,
// sem sair da Agenda — "Editar demanda completa" leva ao formulário cheio.
export default function DemandaDetailModal({ open, demanda, onClose, onEdit, onStatusChange }) {
  if (!open || !demanda) return null

  const um = urgenciaMeta(demanda.urgencia)
  const OrigemIcon = ORIGEM_ICONS[demanda.origem]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-segue-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md rounded-xl bg-white shadow-panel animate-slide-in max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between px-6 py-4 border-b border-segue-stone/30 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-mono text-segue-black/40">{demanda.codigo}</span>
            <Badge className={um.badge} dotClassName={um.dot}>
              {demanda.urgencia}
            </Badge>
          </div>
          <button
            onClick={onClose}
            className="focus-ring rounded-lg p-1.5 text-segue-black/40 hover:bg-segue-stone-pale hover:text-segue-black/70 shrink-0"
            aria-label="Fechar"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div>
            <h2 className="text-base font-semibold text-segue-black leading-snug">{demanda.titulo}</h2>
            {demanda.codigo_imovel && (
              <span className="mt-2 inline-flex items-center rounded-md bg-segue-terracotta/10 px-2 py-1 text-xs font-semibold text-segue-terracotta">
                {demanda.codigo_imovel}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-segue-black/40 mb-1">Origem</p>
              <p className="inline-flex items-center gap-1.5 text-segue-black/80">
                {OrigemIcon && <OrigemIcon size={14} className="text-segue-black/40" />}
                {demanda.origem}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-segue-black/40 mb-1">Tipo</p>
              <p className="inline-flex items-center gap-1.5 text-segue-black/80">
                <Tag size={14} className="text-segue-black/40" />
                {demanda.tipo}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-segue-black/40 mb-1">Vencimento</p>
              <p className="inline-flex items-center gap-1.5 text-segue-black/80">
                <CalendarDays size={14} className="text-segue-black/40" />
                {formatDateBR(demanda.data_vencimento)}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-segue-black/40 mb-1">Status</p>
              <StatusDropdown value={demanda.status} onChange={(status) => onStatusChange(demanda, status)} />
            </div>
          </div>

          {demanda.descricao && (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-segue-black/40 mb-1">
                Descrição
              </p>
              <p className="text-sm text-segue-black/70 leading-relaxed whitespace-pre-line">
                {demanda.descricao}
              </p>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-segue-stone/30 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="focus-ring rounded-lg px-4 py-2 text-sm font-medium text-segue-black/70 hover:bg-segue-stone-pale"
          >
            Fechar
          </button>
          <button
            onClick={() => onEdit(demanda)}
            className="focus-ring inline-flex items-center gap-2 rounded-lg bg-segue-terracotta px-4 py-2 text-sm font-semibold text-segue-cream hover:bg-segue-terracotta-dark"
          >
            <Pencil size={15} />
            Editar demanda completa
          </button>
        </div>
      </div>
    </div>
  )
}
