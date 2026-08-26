import { useMemo, useState } from 'react'
import { Search, Plus, Trash2, Pencil, ChevronDown, List, LayoutGrid } from 'lucide-react'
import Badge from '../components/Badge'
import StatusDropdown from '../components/StatusDropdown'
import KanbanBoard from '../components/KanbanBoard'
import { ORIGENS, URGENCIAS, STATUS_LIST, urgenciaMeta, formatDateBR } from '../lib/constants'

export default function Demandas({ demandas, loading, onNovaDemanda, onEditDemanda, onDeleteDemanda, onStatusChange }) {
  const [view, setView] = useState('lista') // 'lista' | 'kanban'
  const [search, setSearch] = useState('')
  const [filtroOrigem, setFiltroOrigem] = useState('Todas')
  const [filtroUrgencia, setFiltroUrgencia] = useState('Todas')
  const [filtroStatus, setFiltroStatus] = useState('Todos')
  const [confirmDelete, setConfirmDelete] = useState(null)

  const filtradas = useMemo(() => {
    const term = search.trim().toLowerCase()
    return demandas
      .filter((d) => (filtroOrigem === 'Todas' ? true : d.origem === filtroOrigem))
      .filter((d) => (filtroUrgencia === 'Todas' ? true : d.urgencia === filtroUrgencia))
      .filter((d) => (view === 'lista' && filtroStatus !== 'Todos' ? d.status === filtroStatus : true))
      .filter((d) => {
        if (!term) return true
        return (
          d.titulo.toLowerCase().includes(term) ||
          d.codigo?.toLowerCase().includes(term) ||
          d.codigo_imovel?.toLowerCase().includes(term) ||
          (d.descricao || '').toLowerCase().includes(term)
        )
      })
      .sort((a, b) => new Date(a.data_vencimento) - new Date(b.data_vencimento))
  }, [demandas, search, filtroOrigem, filtroUrgencia, filtroStatus, view])

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-segue-black tracking-tight">Demandas</h1>
          <p className="text-sm text-segue-black/55 mt-0.5">
            {demandas.length} demanda{demandas.length !== 1 ? 's' : ''} cadastrada
            {demandas.length !== 1 ? 's' : ''} no total.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ViewToggle view={view} onChange={setView} />
          <button
            onClick={() => onNovaDemanda()}
            className="focus-ring inline-flex items-center gap-2 rounded-lg bg-segue-terracotta px-4 py-2.5 text-sm font-semibold text-segue-cream hover:bg-segue-terracotta-dark shadow-card"
          >
            <Plus size={16} />
            Nova demanda
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-segue-black/40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por código, imóvel, título ou descrição..."
            className="focus-ring w-full rounded-lg border border-segue-stone bg-white py-2 pl-9 pr-3 text-sm text-segue-black/80 placeholder:text-segue-black/40"
          />
        </div>

        <FilterSelect label="Origem" value={filtroOrigem} onChange={setFiltroOrigem} options={['Todas', ...ORIGENS]} />
        <FilterSelect
          label="Urgência"
          value={filtroUrgencia}
          onChange={setFiltroUrgencia}
          options={['Todas', ...URGENCIAS.map((u) => u.label)]}
        />
        {view === 'lista' && (
          <FilterSelect label="Status" value={filtroStatus} onChange={setFiltroStatus} options={['Todos', ...STATUS_LIST]} />
        )}
      </div>

      {view === 'lista' ? (
        <div className="rounded-xl bg-white shadow-card ring-1 ring-segue-stone overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-segue-stone/30 bg-segue-stone-pale/60 text-left text-[11px] uppercase tracking-wide text-segue-black/55">
                  <th className="px-4 py-3 font-semibold">Código</th>
                  <th className="px-4 py-3 font-semibold">Título</th>
                  <th className="px-4 py-3 font-semibold">Código Interno / Imóvel</th>
                  <th className="px-4 py-3 font-semibold">Origem</th>
                  <th className="px-4 py-3 font-semibold">Tipo</th>
                  <th className="px-4 py-3 font-semibold">Urgência</th>
                  <th className="px-4 py-3 font-semibold">Vencimento</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={9} className="px-4 py-10 text-center text-segue-black/40 text-sm">
                      Carregando demandas...
                    </td>
                  </tr>
                )}

                {!loading && filtradas.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-4 py-10 text-center text-segue-black/40 text-sm">
                      Nenhuma demanda encontrada com os filtros atuais.
                    </td>
                  </tr>
                )}

                {!loading &&
                  filtradas.map((d, idx) => (
                    <tr
                      key={d.id}
                      className={`border-b border-segue-stone/20 hover:bg-segue-terracotta/5 transition-colors ${
                        idx % 2 === 0 ? 'bg-white' : 'bg-segue-stone-pale/50'
                      }`}
                    >
                      <td className="px-4 py-3 font-mono text-xs text-segue-black/55">{d.codigo}</td>
                      <td className="px-4 py-3 max-w-[240px]">
                        <button
                          onClick={() => onEditDemanda(d)}
                          className="focus-ring text-left font-medium text-segue-black hover:text-segue-terracotta line-clamp-1"
                          title={d.titulo}
                        >
                          {d.titulo}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        {d.codigo_imovel ? (
                          <span className="inline-flex items-center rounded-md bg-segue-terracotta/10 px-2 py-1 text-xs font-semibold text-segue-terracotta whitespace-nowrap">
                            {d.codigo_imovel}
                          </span>
                        ) : (
                          <span className="text-xs text-segue-black/30">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-segue-black/70">{d.origem}</td>
                      <td className="px-4 py-3 text-segue-black/70">{d.tipo}</td>
                      <td className="px-4 py-3">
                        <Badge className={urgenciaMeta(d.urgencia).badge} dotClassName={urgenciaMeta(d.urgencia).dot}>
                          {d.urgencia}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-segue-black/70 whitespace-nowrap">
                        {formatDateBR(d.data_vencimento)}
                      </td>
                      <td className="px-4 py-3">
                        <StatusDropdown value={d.status} onChange={(status) => onStatusChange(d, status)} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onEditDemanda(d)}
                            className="focus-ring rounded-lg p-1.5 text-segue-black/40 hover:bg-segue-terracotta/10 hover:text-segue-terracotta"
                            aria-label="Editar"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => setConfirmDelete(d)}
                            className="focus-ring rounded-lg p-1.5 text-segue-black/40 hover:bg-rose-50 hover:text-rose-600"
                            aria-label="Excluir"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <KanbanBoard demandas={filtradas} onEditDemanda={onEditDemanda} onStatusChange={onStatusChange} />
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-segue-black/50 backdrop-blur-sm" onClick={() => setConfirmDelete(null)} />
          <div className="relative w-full max-w-sm rounded-xl bg-white p-6 shadow-panel">
            <h3 className="text-base font-semibold text-segue-black">Excluir demanda?</h3>
            <p className="mt-2 text-sm text-segue-black/55">
              Tem certeza que deseja excluir <span className="font-medium text-segue-black/80">{confirmDelete.titulo}</span>?
              Essa ação não pode ser desfeita.
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="focus-ring rounded-lg px-4 py-2 text-sm font-medium text-segue-black/70 hover:bg-segue-stone-pale"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  onDeleteDemanda(confirmDelete)
                  setConfirmDelete(null)
                }}
                className="focus-ring rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-segue-cream hover:bg-rose-700"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ViewToggle({ view, onChange }) {
  return (
    <div className="inline-flex items-center rounded-lg bg-segue-stone-pale p-1 ring-1 ring-segue-stone">
      <button
        onClick={() => onChange('lista')}
        className={`focus-ring inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
          view === 'lista'
            ? 'bg-white text-segue-black shadow-sm ring-1 ring-segue-stone'
            : 'text-segue-black/55 hover:text-segue-black'
        }`}
      >
        <List size={14} />
        Lista
      </button>
      <button
        onClick={() => onChange('kanban')}
        className={`focus-ring inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
          view === 'kanban'
            ? 'bg-white text-segue-black shadow-sm ring-1 ring-segue-stone'
            : 'text-segue-black/55 hover:text-segue-black'
        }`}
      >
        <LayoutGrid size={14} />
        Kanban
      </button>
    </div>
  )
}

function FilterSelect({ label, value, onChange, options }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
        className="focus-ring appearance-none rounded-lg border border-segue-stone bg-white py-2 pl-3 pr-8 text-sm text-segue-black/80 hover:border-segue-stone"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o === 'Todas' || o === 'Todos' ? `${label}: Todas` : o}
          </option>
        ))}
      </select>
      <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-segue-black/40" />
    </div>
  )
}
