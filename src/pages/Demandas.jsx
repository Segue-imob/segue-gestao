import { useMemo, useState } from 'react'
import { Search, Plus, Trash2, Pencil, ChevronDown } from 'lucide-react'
import Badge from '../components/Badge'
import { ORIGENS, URGENCIAS, STATUS_LIST, STATUS_META, urgenciaMeta, formatDateBR } from '../lib/constants'

export default function Demandas({ demandas, loading, onNovaDemanda, onEditDemanda, onDeleteDemanda, onStatusChange }) {
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
      .filter((d) => (filtroStatus === 'Todos' ? true : d.status === filtroStatus))
      .filter((d) => {
        if (!term) return true
        return (
          d.titulo.toLowerCase().includes(term) ||
          d.codigo?.toLowerCase().includes(term) ||
          (d.descricao || '').toLowerCase().includes(term)
        )
      })
      .sort((a, b) => new Date(a.data_vencimento) - new Date(b.data_vencimento))
  }, [demandas, search, filtroOrigem, filtroUrgencia, filtroStatus])

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-bold text-segue-950 tracking-tight">Demandas</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {demandas.length} demanda{demandas.length !== 1 ? 's' : ''} cadastrada
            {demandas.length !== 1 ? 's' : ''} no total.
          </p>
        </div>
        <button
          onClick={() => onNovaDemanda()}
          className="focus-ring inline-flex items-center gap-2 rounded-lg bg-segue-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-segue-800 shadow-card"
        >
          <Plus size={16} />
          Nova demanda
        </button>
      </div>

      <div className="rounded-xl bg-white shadow-card ring-1 ring-slate-100 overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 p-4 border-b border-slate-100">
          <div className="relative flex-1 min-w-[220px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por código, título ou descrição..."
              className="focus-ring w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400"
            />
          </div>

          <FilterSelect label="Origem" value={filtroOrigem} onChange={setFiltroOrigem} options={['Todas', ...ORIGENS]} />
          <FilterSelect
            label="Urgência"
            value={filtroUrgencia}
            onChange={setFiltroUrgencia}
            options={['Todas', ...URGENCIAS.map((u) => u.label)]}
          />
          <FilterSelect label="Status" value={filtroStatus} onChange={setFiltroStatus} options={['Todos', ...STATUS_LIST]} />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60 text-left text-[11px] uppercase tracking-wide text-slate-500">
                <th className="px-4 py-3 font-semibold">Código</th>
                <th className="px-4 py-3 font-semibold">Título</th>
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
                  <td colSpan={8} className="px-4 py-10 text-center text-slate-400 text-sm">
                    Carregando demandas...
                  </td>
                </tr>
              )}

              {!loading && filtradas.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-slate-400 text-sm">
                    Nenhuma demanda encontrada com os filtros atuais.
                  </td>
                </tr>
              )}

              {!loading &&
                filtradas.map((d) => (
                  <tr key={d.id} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-slate-500">{d.codigo}</td>
                    <td className="px-4 py-3 max-w-[240px]">
                      <button
                        onClick={() => onEditDemanda(d)}
                        className="focus-ring text-left font-medium text-slate-800 hover:text-segue-700 line-clamp-1"
                        title={d.titulo}
                      >
                        {d.titulo}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{d.origem}</td>
                    <td className="px-4 py-3 text-slate-600">{d.tipo}</td>
                    <td className="px-4 py-3">
                      <Badge className={urgenciaMeta(d.urgencia).badge} dotClassName={urgenciaMeta(d.urgencia).dot}>
                        {d.urgencia}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                      {formatDateBR(d.data_vencimento)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusDropdown value={d.status} onChange={(status) => onStatusChange(d, status)} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onEditDemanda(d)}
                          className="focus-ring rounded-lg p-1.5 text-slate-400 hover:bg-segue-50 hover:text-segue-700"
                          aria-label="Editar"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => setConfirmDelete(d)}
                          className="focus-ring rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
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

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="absolute inset-0 bg-segue-950/50 backdrop-blur-sm" onClick={() => setConfirmDelete(null)} />
          <div className="relative w-full max-w-sm rounded-xl bg-white p-6 shadow-panel">
            <h3 className="text-base font-semibold text-segue-950">Excluir demanda?</h3>
            <p className="mt-2 text-sm text-slate-500">
              Tem certeza que deseja excluir <span className="font-medium text-slate-700">{confirmDelete.titulo}</span>?
              Essa ação não pode ser desfeita.
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="focus-ring rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  onDeleteDemanda(confirmDelete)
                  setConfirmDelete(null)
                }}
                className="focus-ring rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
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

function FilterSelect({ label, value, onChange, options }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
        className="focus-ring appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-3 pr-8 text-sm text-slate-700 hover:border-slate-300"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o === 'Todas' || o === 'Todos' ? `${label}: Todas` : o}
          </option>
        ))}
      </select>
      <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
    </div>
  )
}

function StatusDropdown({ value, onChange }) {
  const meta = STATUS_META[value]
  return (
    <div className="relative inline-block">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`focus-ring appearance-none rounded-full py-1 pl-2.5 pr-7 text-xs font-medium cursor-pointer ${meta.badge}`}
      >
        {STATUS_LIST.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      <ChevronDown size={12} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2" />
    </div>
  )
}
