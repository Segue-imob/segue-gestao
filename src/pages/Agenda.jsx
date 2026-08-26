import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { urgenciaMeta, todayISO } from '../lib/constants'
import DayDemandasModal from '../components/DayDemandasModal'
import DemandaDetailModal from '../components/DemandaDetailModal'
import AgendaLabel from '../components/AgendaLabel'

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]
const MAX_LABELS_MES = 3
const VIEW_MODES = [
  { id: 'mes', label: 'Mês' },
  { id: 'semana', label: 'Semana' },
  { id: 'dia', label: 'Dia' },
]

function toISO(y, m, d) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

function addDays(iso, delta) {
  const [y, m, d] = iso.split('-').map(Number)
  const dt = new Date(y, m - 1, d)
  dt.setDate(dt.getDate() + delta)
  return toISO(dt.getFullYear(), dt.getMonth(), dt.getDate())
}

function shiftMonth(iso, delta) {
  const [y, m] = iso.split('-').map(Number)
  const dt = new Date(y, m - 1, 1)
  dt.setMonth(dt.getMonth() + delta)
  return toISO(dt.getFullYear(), dt.getMonth(), 1)
}

function startOfWeek(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  const dt = new Date(y, m - 1, d)
  dt.setDate(dt.getDate() - dt.getDay())
  return toISO(dt.getFullYear(), dt.getMonth(), dt.getDate())
}

function formatDayLabel(iso) {
  const d = new Date(iso + 'T00:00:00')
  const s = d.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function formatWeekRangeLabel(startISO, endISO) {
  const [ys, ms, ds] = startISO.split('-')
  const [ye, me, de] = endISO.split('-')
  return ys === ye ? `${ds}/${ms} – ${de}/${me}/${ye}` : `${ds}/${ms}/${ys} – ${de}/${me}/${ye}`
}

// Ordena por severidade de urgência (mais urgente primeiro) para a visão Dia.
const URGENCIA_ORDEM = { Crítica: 0, Alta: 1, Média: 2, Baixa: 3 }

export default function Agenda({ demandas, onOpenDemanda, onStatusChange }) {
  const [viewMode, setViewMode] = useState('mes')
  const [anchorDate, setAnchorDate] = useState(todayISO())
  const [selectedDate, setSelectedDate] = useState(null)
  const [detailDemanda, setDetailDemanda] = useState(null)

  const byDate = useMemo(() => {
    const map = {}
    for (const d of demandas) {
      if (!d.data_vencimento) continue
      if (!map[d.data_vencimento]) map[d.data_vencimento] = []
      map[d.data_vencimento].push(d)
    }
    return map
  }, [demandas])

  const today = todayISO()
  const [anchorYear, anchorMonth] = anchorDate.split('-').map(Number)

  function goPrev() {
    if (viewMode === 'mes') setAnchorDate((d) => shiftMonth(d, -1))
    else if (viewMode === 'semana') setAnchorDate((d) => addDays(d, -7))
    else setAnchorDate((d) => addDays(d, -1))
  }

  function goNext() {
    if (viewMode === 'mes') setAnchorDate((d) => shiftMonth(d, 1))
    else if (viewMode === 'semana') setAnchorDate((d) => addDays(d, 7))
    else setAnchorDate((d) => addDays(d, 1))
  }

  function goToday() {
    setAnchorDate(today)
  }

  function openDetail(demanda) {
    setDetailDemanda(demanda)
  }

  const headerLabel = useMemo(() => {
    if (viewMode === 'mes') return `${MONTHS[anchorMonth - 1]} ${anchorYear}`
    if (viewMode === 'semana') {
      const start = startOfWeek(anchorDate)
      const end = addDays(start, 6)
      return formatWeekRangeLabel(start, end)
    }
    return formatDayLabel(anchorDate)
  }, [viewMode, anchorDate, anchorYear, anchorMonth])

  const selectedDemandas = selectedDate ? byDate[selectedDate] || [] : []

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-segue-black tracking-tight">Agenda de prazos</h1>
        <p className="text-sm text-segue-black/55 mt-0.5">
          Acompanhe as demandas por data de vencimento.
        </p>
      </div>

      <div className="rounded-xl bg-white shadow-card ring-1 ring-segue-stone overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-segue-stone/30">
          <h2 className="text-base font-semibold text-segue-black capitalize">{headerLabel}</h2>

          <div className="flex flex-wrap items-center gap-2">
            <ViewModeTabs viewMode={viewMode} onChange={setViewMode} />

            <div className="flex items-center gap-1.5">
              <button
                onClick={goToday}
                className="focus-ring rounded-lg px-3 py-1.5 text-xs font-semibold text-segue-terracotta hover:bg-segue-terracotta/10"
              >
                Hoje
              </button>
              <button
                onClick={goPrev}
                className="focus-ring rounded-lg p-1.5 text-segue-black/55 hover:bg-segue-stone-pale"
                aria-label="Anterior"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={goNext}
                className="focus-ring rounded-lg p-1.5 text-segue-black/55 hover:bg-segue-stone-pale"
                aria-label="Próximo"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {viewMode === 'mes' && (
          <MesView
            anchorYear={anchorYear}
            anchorMonth={anchorMonth}
            byDate={byDate}
            today={today}
            onSelectDay={setSelectedDate}
            onOpenDetail={openDetail}
          />
        )}

        {viewMode === 'semana' && (
          <SemanaView
            anchorDate={anchorDate}
            byDate={byDate}
            today={today}
            onOpenDetail={openDetail}
          />
        )}

        {viewMode === 'dia' && (
          <DiaView anchorDate={anchorDate} byDate={byDate} onOpenDetail={openDetail} />
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-segue-black/55">
        <span className="font-semibold text-segue-black/70">Legenda de urgência:</span>
        {['Baixa', 'Média', 'Alta', 'Crítica'].map((label) => (
          <span key={label} className="inline-flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full ${urgenciaMeta(label).dot}`} />
            {label}
          </span>
        ))}
      </div>

      <DayDemandasModal
        open={Boolean(selectedDate)}
        date={selectedDate}
        demandas={selectedDemandas}
        onClose={() => setSelectedDate(null)}
        onOpenDemanda={(d) => {
          setSelectedDate(null)
          openDetail(d)
        }}
      />

      <DemandaDetailModal
        open={Boolean(detailDemanda)}
        demanda={detailDemanda}
        onClose={() => setDetailDemanda(null)}
        onEdit={(d) => {
          setDetailDemanda(null)
          onOpenDemanda(d)
        }}
        onStatusChange={onStatusChange}
      />
    </div>
  )
}

function ViewModeTabs({ viewMode, onChange }) {
  return (
    <div className="inline-flex items-center rounded-lg bg-segue-stone-pale p-1 ring-1 ring-segue-stone">
      {VIEW_MODES.map((mode) => (
        <button
          key={mode.id}
          onClick={() => onChange(mode.id)}
          className={`focus-ring rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
            viewMode === mode.id
              ? 'bg-white text-segue-black shadow-sm ring-1 ring-segue-stone'
              : 'text-segue-black/55 hover:text-segue-black'
          }`}
        >
          {mode.label}
        </button>
      ))}
    </div>
  )
}

// ============================================================
// Visão Mês
// ============================================================
function MesView({ anchorYear, anchorMonth, byDate, today, onSelectDay, onOpenDetail }) {
  const month = anchorMonth - 1
  const firstOfMonth = new Date(anchorYear, month, 1)
  const startWeekday = firstOfMonth.getDay()
  const daysInMonth = new Date(anchorYear, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(anchorYear, month, 0).getDate()

  const cells = []
  for (let i = 0; i < startWeekday; i++) {
    cells.push({ day: daysInPrevMonth - startWeekday + 1 + i, current: false })
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, current: true })
  }
  while (cells.length % 7 !== 0) {
    cells.push({ day: cells.length - (startWeekday + daysInMonth) + 1, current: false })
  }

  return (
    <>
      <div className="grid grid-cols-7 border-b border-segue-stone/30 bg-segue-stone-pale">
        {WEEKDAYS.map((w) => (
          <div
            key={w}
            className="py-2.5 text-center text-[11px] font-bold uppercase tracking-wide text-segue-black/55"
          >
            {w}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {cells.map((cell, idx) => {
          const iso = cell.current ? toISO(anchorYear, month, cell.day) : null
          const items = iso ? byDate[iso] || [] : []
          const isToday = iso === today
          const visiveis = items.slice(0, MAX_LABELS_MES)
          const excedente = items.length - visiveis.length

          return (
            <div
              key={idx}
              onClick={() => cell.current && onSelectDay(iso)}
              className={`relative min-h-[110px] border-b border-r border-segue-stone/30 p-1.5 text-left align-top transition-colors ${
                cell.current ? 'hover:bg-segue-terracotta/5 cursor-pointer' : 'bg-segue-stone-pale/40'
              } ${idx % 7 === 6 ? 'border-r-0' : ''}`}
            >
              <span
                className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                  isToday
                    ? 'bg-segue-terracotta text-segue-cream'
                    : cell.current
                      ? 'text-segue-black/80'
                      : 'text-segue-stone'
                }`}
              >
                {cell.day}
              </span>

              {visiveis.length > 0 && (
                <div className="mt-1 space-y-1">
                  {visiveis.map((d) => (
                    <AgendaLabel key={d.id} demanda={d} onClick={onOpenDetail} size="sm" />
                  ))}
                  {excedente > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onSelectDay(iso)
                      }}
                      className="focus-ring block w-full rounded px-1.5 py-0.5 text-left text-[10px] font-semibold text-segue-black/50 hover:text-segue-terracotta"
                    >
                      +{excedente} mais
                    </button>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </>
  )
}

// ============================================================
// Visão Semana
// ============================================================
function SemanaView({ anchorDate, byDate, today, onOpenDetail }) {
  const start = startOfWeek(anchorDate)
  const dias = Array.from({ length: 7 }, (_, i) => addDays(start, i))

  return (
    <div className="grid grid-cols-7 divide-x divide-segue-stone/30">
      {dias.map((iso) => {
        const [, , d] = iso.split('-')
        const items = byDate[iso] || []
        const isToday = iso === today
        return (
          <div key={iso} className="flex flex-col min-h-[420px]">
            <div
              className={`flex items-center justify-between px-2.5 py-2.5 border-b border-segue-stone/30 ${
                isToday ? 'bg-segue-terracotta/10' : 'bg-segue-stone-pale/50'
              }`}
            >
              <span className="text-[11px] font-bold uppercase tracking-wide text-segue-black/55">
                {WEEKDAYS[new Date(iso + 'T00:00:00').getDay()]}
              </span>
              <span
                className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                  isToday ? 'bg-segue-terracotta text-segue-cream' : 'text-segue-black/80'
                }`}
              >
                {d}
              </span>
            </div>
            <div className="flex-1 space-y-1.5 p-2 overflow-y-auto max-h-[420px]">
              {items.length === 0 && (
                <p className="mt-4 text-center text-[11px] text-segue-black/30">Sem demandas</p>
              )}
              {items.map((demanda) => (
                <AgendaLabel key={demanda.id} demanda={demanda} onClick={onOpenDetail} size="md" />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ============================================================
// Visão Dia (linha do tempo)
// ============================================================
function DiaView({ anchorDate, byDate, onOpenDetail }) {
  const items = (byDate[anchorDate] || [])
    .slice()
    .sort((a, b) => (URGENCIA_ORDEM[a.urgencia] ?? 9) - (URGENCIA_ORDEM[b.urgencia] ?? 9))

  if (items.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm text-segue-black/40">Nenhuma demanda vence nesta data.</p>
      </div>
    )
  }

  return (
    <div className="p-5">
      <ol className="relative space-y-4 border-l-2 border-segue-stone/40 pl-5">
        {items.map((demanda) => {
          const um = urgenciaMeta(demanda.urgencia)
          return (
            <li key={demanda.id} className="relative">
              <span
                className={`absolute -left-[27px] top-1.5 h-3 w-3 rounded-full ring-4 ring-white ${um.solid}`}
              />
              <AgendaLabel demanda={demanda} onClick={onOpenDetail} size="lg" />
            </li>
          )
        })}
      </ol>
    </div>
  )
}
