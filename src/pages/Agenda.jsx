import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { urgenciaMeta, todayISO } from '../lib/constants'
import DayDemandasModal from '../components/DayDemandasModal'

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

function toISO(y, m, d) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

export default function Agenda({ demandas, onOpenDemanda }) {
  const [cursor, setCursor] = useState(() => {
    const now = new Date()
    return { year: now.getFullYear(), month: now.getMonth() }
  })
  const [selectedDate, setSelectedDate] = useState(null)

  const byDate = useMemo(() => {
    const map = {}
    for (const d of demandas) {
      if (!d.data_vencimento) continue
      if (!map[d.data_vencimento]) map[d.data_vencimento] = []
      map[d.data_vencimento].push(d)
    }
    return map
  }, [demandas])

  const { year, month } = cursor
  const firstOfMonth = new Date(year, month, 1)
  const startWeekday = firstOfMonth.getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrevMonth = new Date(year, month, 0).getDate()

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

  function goMonth(delta) {
    setCursor((c) => {
      let m = c.month + delta
      let y = c.year
      if (m < 0) { m = 11; y -= 1 }
      if (m > 11) { m = 0; y += 1 }
      return { year: y, month: m }
    })
  }

  function goToday() {
    const now = new Date()
    setCursor({ year: now.getFullYear(), month: now.getMonth() })
  }

  const today = todayISO()
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
        <div className="flex items-center justify-between px-5 py-4 border-b border-segue-stone/30">
          <h2 className="text-base font-semibold text-segue-black">
            {MONTHS[month]} {year}
          </h2>
          <div className="flex items-center gap-1.5">
            <button
              onClick={goToday}
              className="focus-ring rounded-lg px-3 py-1.5 text-xs font-semibold text-segue-terracotta hover:bg-segue-terracotta/10"
            >
              Hoje
            </button>
            <button
              onClick={() => goMonth(-1)}
              className="focus-ring rounded-lg p-1.5 text-segue-black/55 hover:bg-segue-stone-pale"
              aria-label="Mês anterior"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => goMonth(1)}
              className="focus-ring rounded-lg p-1.5 text-segue-black/55 hover:bg-segue-stone-pale"
              aria-label="Próximo mês"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

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
            const iso = cell.current
              ? toISO(year, month, cell.day)
              : null
            const items = iso ? byDate[iso] || [] : []
            const isToday = iso === today
            return (
              <button
                key={idx}
                disabled={!cell.current}
                onClick={() => cell.current && setSelectedDate(iso)}
                className={`focus-ring relative min-h-[92px] border-b border-r border-segue-stone/30 p-2 text-left align-top transition-colors ${
                  cell.current ? 'hover:bg-segue-terracotta/10 cursor-pointer' : 'bg-segue-stone-pale/40'
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

                {items.length > 0 && (
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {items.slice(0, 3).map((d) => (
                      <span
                        key={d.id}
                        title={d.titulo}
                        className={`h-1.5 w-1.5 rounded-full ${urgenciaMeta(d.urgencia).dot}`}
                      />
                    ))}
                  </div>
                )}
                {items.length > 0 && (
                  <p className="mt-1 text-[10px] font-semibold text-segue-black/55">
                    {items.length} {items.length === 1 ? 'demanda' : 'demandas'}
                  </p>
                )}
              </button>
            )
          })}
        </div>
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
          onOpenDemanda(d)
        }}
      />
    </div>
  )
}
